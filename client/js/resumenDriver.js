var total = 0; //almacena el monto total del pedido
var beforeMesa = 1;// numero de mesa por el que se va a cambiar

//Controla el popup para la eleccion de la mesa
$('#popup').on( 'click', function(){
	$('#myModal').reveal({
	     animation: 'fade',                   //fade, fadeAndPop, none
	     animationspeed: 300,                       //how fast animtions are
	     closeonbackgroundclick: true,              //if you click background will modal close?
	     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
	});
});

//La clase exception es una clase añadida a los botones con clase close-reveal-modal
//para que al pulsar sobre uno de ellos el popup se cierre, pero la clase exception
//hace que los botones no varien su estilo corriespondiente a la clase boton de bootstrap
$('.exception').on('click', function() {
	var mesa = $(this).attr('id');
	mesa = mesa.replace( '-', ' ' );
	saveCart(mesa);//pasa la mesa que se eligio para que se determine si se cambio y asi poder o no guardar los pedidos hechos
	$('#popup').text(mesa);
});


//***********************************************************************************
//Añade el pedido al carro de compras
function addCart( element, idMenu )
{
	precio = $(element).siblings();//obtiene al hermano del elemento en cuestion (es decir el precio)
	precio = $( precio ).text().replace( 'Precio: ', '' );//extrae solamente el monto

	food = $(element).attr('food');//Obtiene el nombre del menu

	total = total + parseInt( precio );

	writePedido( idMenu, food, precio );

	writeMontoTotal( total );

	scrollResumen();
}


//***********************************************************************************


function saveCart(mesa)
{
	if( pedidos = getIdMenus(mesa) )
	{
		//Pasa de array a un objeto JSON
		var oPedidos = {};
		for( i in pedidos )
			oPedidos[i] = pedidos[i];

		oPedidos = encodeURI( JSON.stringify( oPedidos ) );
		//Obtiene el id de la mesa seleccionada
		idCurrent = mesa.replace( 'Mesa ', '' );

		$.ajax({

			url: '',
			data: {'ajax':'true','add':'true','data':oPedidos,'before':beforeMesa, 'current':idCurrent },
			contentType: 'application/x-www-form-urlencoded',
			dataType: 'json',
			error: function() {
				alert( 'Ha ocurrido un error' );
			},
			success:function(data){
				//Borra todo lo que hay en el contenedor resumen
				content = document.getElementById( 'resumen' );
				while( content.hasChildNodes() )
					content.removeChild( content.firstChild );
				//Y vuelve a escribir ya con los pedidos de la mesa seleccionada
				showCartSelect(data);
			},
			ifModified: false,
			processData: true,
			type: 'GET',
			timeout: 3000

		});//end ajax
	}//end if
}//end saveCart


//**************************************************************************

function showCartSelect(data)
{
	for( i in data.pedidos )
		writePedido( data.pedidos[i].idMenu, data.pedidos[i].nombreMenu, data.pedidos[i].precio );
	writeMontoTotal( data.monto );
}//end showCartSelect


//*************************************************************************


function getIdMenus(mesa)
{
	mesaActual = $('#popup').text();
	beforeMesa = mesaActual.replace( 'Mesa ', '' );//Obtiene solo el nroMesa del elemento actual (por si se cambia)
	//Si se cambio la mesa
	if( mesaActual != mesa )
	{
		var idPedidos = new Array();//almacena todos los idMenu
		var cantidad = $('#resumen .food-order').length;//Cantidad de pedidos
		for( i = 0; i < cantidad; i++ )
		{
			var id = $('#resumen .food-order:eq(' + i + ')' ).attr('id');//Obtiene el id de los pedidos
			idPedidos.push( id );
		}
		
		monto = $("#monto").text();
		monto = monto.replace( ' ', '' );
		
		return idPedidos;
	}//end if

	return false;
}

//**************************************************************************

function writePedido( idMenu, food, precio )
{
	$('#resumen').append(
		'<span class="food-order" id=' + idMenu + '>' + food + '</span>' +
		'<span class="food-order-price">' + precio + '</span>'
	);
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

