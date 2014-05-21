var total = 0; //almacena el monto total del pedido


//***********************************************************************************
//Añade el pedido al carro de compras
function addCart( food, price, id, amount, type )
{
	price = parseInt( price ) * parseInt( amount );
	if( writePedido( id, food, price, amount, type ) )
	{
		total = total + parseInt( price );
		writeMontoTotal( total );
	}

	assignAttrExtra( id, type );

	scrollResumen();
}

//**********************************************************************************

function getPedidos( mesa )
{
	$.ajax({

		url: '',
		data: {'ajax':'true','get':'true', 'mesa':mesa },
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success:function( data ){
			for( i in data.pedidos ){
				writePedido( data.pedidos[i].idMenu || data.pedidos[i].idPizza || data.pedidos[i].idBebida, 
					data.pedidos[i].nombreMenu || data.pedidos[i].nombrePizza || data.pedidos[i].nombreBebida, 
					data.pedidos[i].precio, data.pedidos[i].cantidad, data.pedidos[i].tipo, true );
			}
			writeMontoTotal( data.monto );

			if( data.monto != null )
				total = parseInt( data.monto );

			scrollResumen();
		},
		ifModified: false,
		processData: true,
		type: 'POST',
		timeout: 3000

	});//end ajax
}//end getPedidos

//***********************************************************************************

var oPedidos = {};//almacena todos los idMenu;
function saveCart(mesa)
{
	getCart();

	oPedidos = encodeURI( JSON.stringify( oPedidos ) );
	
	//Obtiene el id de la mesa seleccionada
	idMesa = mesa.replace( 'Mesa ', '' );

	$.ajax({

		url: '',
		data: {'ajax':'true','add':'true','data':oPedidos, 'mesa':idMesa },
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success:function(data){
			$('#resumen .food-order, #resumen .food-order-amount' ).removeClass('pendiente');
			$('.food-order-option-container').remove();
			$('.food-order:not(.enviado)').after(
				'<div class="img-duplicate">' +
					'<img src="client/images/icons/add12.png" /> ' +
				'</div>'
			);
			$('#resumen .food-order').addClass('enviado');
			$('.img-duplicate').addClass('enviado');
			oPedidos = {};
		},
		ifModified: false,
		processData: true,
		type: 'POST',
		timeout: 3000

	});//end ajax
}//end saveCart

//*************************************************************************
var lastPos = -1;

function getCart()
{
	var cantidad = $('#resumen .food-order.pendiente').length;//Cantidad de pedidos pendientes
	
	for( i = 0; i < cantidad; i++ )
	{
		var id = $('#resumen .food-order.pendiente:eq(' + i + ')' ).attr('id-add');//Obtiene el id de los pedidos pendientes
		var type = $('#resumen .food-order.pendiente:eq(' + i + ')' ).attr('type');//Obtiene el type de los pedidos pendientes
		var amount = $('#resumen .food-order.pendiente:eq(' + i + ')' ).attr('amount');

		oPedidos[ lastPos += 1 ] = { 'id':id, 'type': type, 'amount': amount };
	}
}//end getPedidos

//*************************************************************************


function changeMesa(mesa)
{
	mesaActual = $('.btn#popup1').text();
	//Si se cambio la mesa
	if( mesaActual != mesa )
	{
		//Borra todos los pedidos para luego cargar los pedidos de la mesa respectiva
		content = document.getElementById( 'resumen' );
		while( content.hasChildNodes() )
			content.removeChild( content.firstChild );

		$('#popup1').text(mesa);
		var idMesa = mesa.replace( 'Mesa ', '' );
		total = 0;
		getPedidos(idMesa);
	}//end if

	return false;
}

//****************************************************************************

function duplicateOrder( container )
{
	var forElement = $( container ).attr('for');
	var type = forElement.substr( forElement.length - 1, 1 );
	var id = forElement.substring( 0, forElement.length - 1 );

	var food = $( container ).children('.food-order');
	food = food.text().replace( food.attr('amount'), '' ).trim();
	var amount = $(container).children('.food-order').attr('amount');
	var price = $( container ).children('.food-order-price').text() / amount;
	
	
	writePedido( id, food, price, 1, type );
	assignAttrExtra( id, type );

	total = total + parseInt( price );
	writeMontoTotal( total );
}

//*************************************************************************

function assignAttrExtra( id, type )
{
	var elements = $('.food-order-container[for="' + id + type + '"]' );
	if( elements.length > 1 )
	{
		if( elements.length > 2 )
		{
			var lastAttribute = $( elements ).eq( elements.length - 2 ).attr( 'extra' ); //obtiene el valor de extra del penultimo
			$( elements ).last().attr( 'extra', lastAttribute + 'm' ); // concatena con una m para agregarlo al ultimo elemento
		}
		else
			$( elements ).last().attr( 'extra', 'm' );			
	}
}

//**************************************************************************

function writePedido( id, food, precio, cantidad, type, got )
{
	//Si fue obtenido desde la base de datos (es decir, ya se habia enviado)
	if( got ) 
	{
		$('#resumen').append(
			'<div class="food-order-container metro-tile double vertical-half enviado" for="' + id + type + '">' +
				'<div class="food-order enviado" id-add="' + id + '" type="' + type + '" amount="' + cantidad + '" >' + 
				cantidad + '&nbsp;&nbsp;&nbsp' + food + '</div>' +
			'</div>'
		);

		writeAdd( id, type, true );

		$('.food-order-container[for="' + id + type + '"]:last').append(
			'<span class="food-order-price pendiente">' + precio + '</span>'
		);

		return false;
	}
	else 
	{
		var container; // contenedor en donde se hara el append

		//Si existe el scrolling
		if ( $('.mCSB_container:not(.mCS_no_scrollbar)').length == 1 )
			container = '#resumen .mCSB_container:not(.mCS_no_scrollbar)';
		else
			container = '#resumen .mCSB_container.mCS_no_scrollbar';

		$(container).append(
			'<div class="food-order-container metro-tile double vertical-half" for="' + id + type + '">' +
				'<div class="food-order pendiente" id-add="' + id + '" type="' + type + '" amount="' + cantidad + '" >' + 
				cantidad + '&nbsp;&nbsp;&nbsp' + food + '</div>' +
			'</div>'
		);

		writeOptions( id, type );

		$('.food-order-container[for="' + id + type + '"]:last').append(
			'<span class="food-order-price pendiente">' + precio + '</span>'
		);

		$("#resumen").mCustomScrollbar("update"); // actualiza el scroll dragger

		return true; // retorna pedido para que el if en addCart pueda escribir el monto total
	}//end if...else externo

}//end writePedido

//*******************************************************************************************


function writeOptions( id, type )
{
	$('.food-order-container[for="' + id + type + '"]:last').append(
		'<div class="food-order-option-container" for="' + id + type + '">' +
			'<div class="row">' +
				'<div class="col-md-4 food-order-option edit">' +
					'<span class=" glyphicon glyphicon-edit" for="' + id + type + '"></span>' +
				'</div>' +
				'<div class="col-md-4 img-duplicate">' +
					'<img src="client/images/icons/add12.png" /> ' +
				'</div>' +
				'<div class="col-md-4 food-order-option remove">' +
					'<span class="glyphicon glyphicon-remove" for="' + id + type + '"></span>' +
				'</div>' +
			'</div>'
	);	
}


function writeAdd( id, type, got )
{
	var c = got ? ' enviado' : ''
	$('#resumen .food-order-container[for="' + id + type + '"]:last').append(
		'<div class="img-duplicate' + c + '">' +
			'<img src="client/images/icons/add12.png" /> ' +
		'</div>'
	);
}


//*******************************************************************************************

function writeMontoTotal( monto ) {
	//Borra el contenido del monto total
	$("#monto-total").text('');

	//Si hay un monto, entonces lo muestra
	if( monto != null && monto > 0 )
		$('#monto-total').html(
			'<span>Total: </span>' +
			'<span id="monto">' + monto + '</span>'
		);
}//end writeMontoTotal

//**********************************************************************************

function removeOrder( elementFor, extraAttr ) {
	var precio;
	if( extraAttr === undefined )
	{
		precio = $('.food-order-container[for="' + elementFor + '"]:not([extra]) .food-order-price').text();//get the price for discount of total
		//Remove retated to option remove clicked
		$('.food-order-container[for="' + elementFor + '"]:not([extra])').remove();	
	}
	else
	{
		precio = $('.food-order-container[for="' + elementFor + '"][extra="' + extraAttr + '"] .food-order-price').text();
		//Remove retated to option remove clicked
		$('.food-order-container[for="' + elementFor + '"][extra="' + extraAttr + '"]').remove();
	}
	total = total - precio;
	writeMontoTotal( total );
	
}


//************************************************************************************

function scrollResumen(){
	$('#resumen').mCustomScrollbar("destroy");	
	$("#resumen").mCustomScrollbar({
		theme: 'dark',
		scrollButtons: {
			enable: true				
		},			
	});
}//end scrollResumen

//***************************************************************
function confirmCustom( message, deleteOrder ) {
	if( deleteOrder )// if it is for delete an order
	{
    	$('#confirm-delete').bPopup({
    		opacity: .9,
    	});

    	$( '#confirm-delete strong' ).text(message);
    }
    else // if it is for send the order
    {
    	$('#confirm-send').bPopup({
    		opacity: .9,
    	});

    	$( '#confirm-send strong' ).text(message);
    }    
}
