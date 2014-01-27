var total = 0; //almacena el monto total del pedido


//***********************************************************************************
//Añade el pedido al carro de compras
function addCart( food, price, id )
{
	total = total + parseInt( price );
	writePedido( id, food, price );

	writeMontoTotal( total );

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
				writePedido( data.pedidos[i].idMenu, data.pedidos[i].nombreMenu, data.pedidos[i].precio, true );
			}
			writeMontoTotal( data.monto );
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
	var pedidos = getCart();
	//Pasa de array a un objeto JSON
	var oPedidos = {};
	for( i in pedidos )
		oPedidos[i] = pedidos[i];

	oPedidos = encodeURI( JSON.stringify( oPedidos ) );
	//Obtiene el id de la mesa seleccionada
	idMesa = mesa.replace( 'Mesa ', '' );

	$.ajax({

		url: '',
		data: {'ajax':'true','add':'true','data':oPedidos,/*'before':beforeMesa,*/ 'mesa':idMesa },
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success:function(data){
			console.log('hecho');
			$('#resumen .food-order, #resumen .food-order-price' ).removeClass('pendiente');
			$('#resumen .food-order, #resumen .food-order-price' ).removeClass('enviado');
			//Borra todo lo que hay en el contenedor resumen
			/*content = document.getElementById( 'resumen' );
			while( content.hasChildNodes() )
				content.removeChild( content.firstChild );*/
			//Y vuelve a escribir ya con los pedidos de la mesa seleccionada
			//showCartSelect(data);
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
		getPedidos(idMesa);
	}//end if

	return false;
}

//*************************************************************************

function getCart()
{
	var idPedidos = new Array();//almacena todos los idMenu
	var cantidad = $('#resumen .pendiente').length;//Cantidad de pedidos pendientes
	for( i = 0; i < cantidad; i++ )
	{
		var id = $('#resumen .pendiente:eq(' + i + ')' ).attr('id-add');//Obtiene el id de los pedidos pendientes
		idPedidos.push( id );
	}
		
	monto = $("#monto").text();
	monto = monto.replace( ' ', '' );
	
	return idPedidos;
}//end getPedidos

//**************************************************************************

function writePedido( id, food, precio, got )
{
	//Si fue obtenido desde la base de datos (es decir, ya se habia enviado)
	if( got )
		$('#resumen').append(
			'<span class="food-order enviado" id-add=' + id + '>' + food + '</span>' +
			'<span class="food-order-price enviado">' + precio + '</span>'
		);
	else {
		//Si aun no se agrego el elemento seleccionado
		if( id != $('.food-order[id-add=' + id + ']').attr('id-add') )		
			$('#resumen').append(
				'<span class="food-order pendiente" id-add=' + id + '>' + food + '</span>' +
				'<span class="food-order-price pendiente">' + precio + '</span>'
			);
		else
			alert( 'Este alimento ya esta entre los pedidos' );
	}//end else externo

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

