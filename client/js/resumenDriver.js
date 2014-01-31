var total = 0; //almacena el monto total del pedido


//***********************************************************************************
//Añade el pedido al carro de compras
function addCart( food, price, id, type )
{
	if( writePedido( id, food, price, type ) )
	{
		total = total + parseInt( price );
		writeMontoTotal( total );
	}

	scrollResumen();
}

//**********************************************************************************

function getPedidos(mesa)
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
					data.pedidos[i].precio, data.pedidos[i].tipo, true );
			}
			writeMontoTotal( data.monto );

			if( data.monto != null )
				total = parseInt( data.monto );
		},
		ifModified: false,
		processData: true,
		type: 'POST',
		timeout: 3000

	});//end ajax
}//end getPedidos

//***********************************************************************************


function saveCart(mesa)
{
	var oPedidos = getCart();

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
			$('#resumen .food-order, #resumen .food-order-price' ).removeClass('pendiente');
			$('#resumen .food-order, #resumen .food-order-price' ).removeClass('enviado');
		},
		ifModified: false,
		processData: true,
		type: 'POST',
		timeout: 3000

	});//end ajax
}//end saveCart


//*************************************************************************


function changeMesa(mesa)
{
	mesaActual = $('#popup').text();
	//Si se cambio la mesa
	if( mesaActual != mesa )
	{
		$('#popup').text(mesa);
		var idMesa = mesa.replace( 'Mesa ', '' );
		total = 0;
		getPedidos(idMesa);
	}//end if

	return false;
}

//*************************************************************************

function getCart()
{
	var oPedidos = {};//almacena todos los idMenu
	var cantidad = $('#resumen .food-order.pendiente').length;//Cantidad de pedidos pendientes

	for( i = 0; i < cantidad; i++ )
	{
		var id = $('#resumen .food-order.pendiente:eq(' + i + ')' ).attr('id-add');//Obtiene el id de los pedidos pendientes
		var type = $('#resumen .food-order.pendiente:eq(' + i + ')' ).attr('type');//Obtiene el id de los pedidos pendientes
		oPedidos[i] = { 'id':id, 'type': type };
	}
		
	monto = $("#monto").text();
	monto = monto.replace( ' ', '' );
	
	return oPedidos;
}//end getPedidos

//**************************************************************************

function writePedido( id, food, precio, type, got )
{
	//Si fue obtenido desde la base de datos (es decir, ya se habia enviado)
	if( got )
		$('#resumen').append(
			'<span class="food-order enviado" id-add=\"' + id + '\" type=\"' + type + '\">' + food + '</span>' +
			'<span class="food-order-price enviado">' + precio + '</span>'
		);
	else {
		//Si aun no se agrego el elemento seleccionado
		if( id != $('.food-order[id-add=' + id + '][type=' + type + ']').attr('id-add') ||
			type != $('.food-order[id-add=' + id + '][type=' + type + ']').attr('type' ) )	
		{			
			$('#resumen').append(
				'<span class="food-order pendiente" id-add=\"' + id + '\" type=\"' + type + '\">' + food + '</span>' +
				'<span class="food-order-price pendiente">' + precio + '</span>'
			);

			return true;
		}
		else
			alert( 'Este alimento ya esta entre los pedidos' );
	}//end else externo

	return false;

}//end writePedido

//*****************************************************************************

function writeMontoTotal( monto ) {
	//Borra el contenido del monto total
	$("#monto-total").text('');

	//Si hay un monto, entonces lo muestra
	if( monto != null )
		$('#monto-total').html(
			'<span>Total: </span>' +
			'<span id="monto">' + monto + '</span>'
		);
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

