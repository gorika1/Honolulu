$(document).on( 'ready', function(){
	//Llama a scrollBar en la primera carga de la pagina
	scrollFoods();

	getPedidos( 1 );//En la primera carga de pagina que obtenga los pedidos de la mesa 1

	$('.bg-rect').on( 'click', function(){
		id = $(this).attr('option-value');
		$( '.active' ).removeClass('active');//borra la clase active del elemento anterior
		$(':first-child', this ).addClass( 'active' );//asigna la clase al elemento actual
		getLista( id );//llama a la funcion getLista y pasa el id del tipo del menu
	});

	//Toma a navigation como referencia ya que el resto es creado automaticamente
	//y cuando se actualiza ya no funciona
	$('#navigation').on('click', '.food-add' ,function(){
		food = $(this).attr('food');//Obtiene el nombre del menu

		precio = $(this).siblings();//obtiene al hermano del elemento en cuestion (es decir el precio)
		precio = $(precio).text().replace( 'Precio: ', '' );//extrae solamente el monto
		
		id = $(this).attr('id-add');

		addCart( food, precio, id );
	});

	//Controla el popup para la eleccion de la mesa
	$('#popup').on( 'click', function(){
		$('#myModal').reveal({
		     animation: 'fade',                   //fade, fadeAndPop, none
		     animationspeed: 150,                       //how fast animtions are
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
		changeMesa(mesa);//pasa la mesa que se eligio para que se determine si se cambio
	});


	//Controla la presion del boton para enviar el pedido
	$( '#enviar img' ).on( 'click', function() {
		if( confirm( 'Quieres enviar el pedido?' ) ) 
		{
			var mesa = $('#popup').text();
			saveCart( mesa );
		}		
	});

});