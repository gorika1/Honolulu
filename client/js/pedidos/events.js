$(document).on( 'ready', function(){

	//Llama a scrollBar en la primera carga de la pagina
	scrollFoods();

	getPedidos( 1 );//En la primera carga de la pagina obtiene los pedidos de la mesa 1


	//******************** CAMBIO DE TIPO DE MENU *********************************

	$('.bg-rect').on( 'click', function(){
		id = $(this).attr('option-value');
		$( '.active' ).removeClass('active');//borra la clase active del elemento anterior
		$(':first-child', this ).addClass( 'active' );//asigna la clase al elemento actual
		getLista( id );//llama a la funcion getLista y pasa el id del tipo del menu
	});


	//*********************** CARRITO DE PEDIDOS ***********************************

	//Toma a navigation como referencia ya que el resto es creado automaticamente
	//y cuando se actualiza ya no funciona
	$('#navigation').on('click', '.food-add' ,function(){
		food = $(this).attr('food');//Obtiene el nombre del menu

		precio = $(this).parent().siblings('.col-md-8').find('.food-price').text();//obtiene al hermano del elemento en cuestion (es decir el precio)
		precio = precio.replace( 'Precio: ', '' );//extrae solamente el monto
		
		id = $(this).attr('id-add');

		type = $(this).attr('type');

		amount = 1;		

		addCart( food, precio, id, amount, type );
	});



	//Controla la presion del boton para duplicar un pedido
	$( '#resumen' ).on( 'click', '.img-duplicate img', function() {
		var container = $(this).parent().parent();
		duplicateOrder( container );
	});



	//Controla el borrado de uno de los pedidos
	var action; // if will be for delete an order or send the orders
	var elementFor; // declare out because it will be necessary for the confirm
	var extraAttr;
	$( '#resumen' ).on( 'click', '.food-order-option .glyphicon-remove', function(){
		action = 'remove';
		confirmCustom( '¿Está seguro de que quiere eliminar este pedido?', true );
		elementFor = $(this).parent().parent().parent().attr('for');//get the attribute "for" for remove divs that have this attribute
		extraAttr = $(this).parent().parent().parent().parent().attr('extra');
	});	


	//Controla la presion del boton para enviar el pedido
	$( '#enviar img' ).on( 'click', function() {
		action = 'send'
		confirmCustom('¿Quieres realizar este pedido?', false );
	});


	//************************** POPUP REMOVE ORDER AND SEND ORDERS *****************************


	$( '.close-bpopup' ).on('click', function(){
		answer = $(this).attr('response'); // answer of confirmation
		if( action == 'remove' ) 
		{
			
			$('#confirm-delete').bPopup().close();
			if( answer == "true" )
			{
				removeOrder( elementFor, extraAttr );
			}	
		}
		else if( action == 'send' )
		{
			$('#confirm-send').bPopup().close();
			if( answer == 'true' ) 
			{
				var mesa = $('#popup').text();
				saveCart( mesa );				
			}
		}		

		
	});

	//********************************** POPUP SELECT TABLE ***************************************

	//Controla el popup para la eleccion de la mesa
	$('#popup').on( 'click', function(){
		$('#myModal').reveal({
		     animation: 'fade',                   //fade, fadeAndPop, none
		     animationspeed: 150,                       //how fast animtions are
		     closeonbackgroundclick: true,              //if you click background will modal close?
		     dismissmodalclass: 'close-reveal-modal',   //the class of a button or element that will close an open modal
		});

		$( '.reveal-modal' ).css( 'top', '5px' );
	});

	//La clase exception es una clase añadida a los botones con clase close-reveal-modal
	//para que al pulsar sobre uno de ellos el popup se cierre, pero la clase exception
	//hace que los botones no varien su estilo corriespondiente a la clase boton de bootstrap
	$('.exception').on('click', function() {
		var mesa = $(this).attr('id');
		mesa = mesa.replace( '-', ' ' );
		//Borra todos los pedidos para luego cargar los pedidos de la mesa respectiva
		content = document.getElementById( 'resumen' );
		while( content.hasChildNodes() )
			content.removeChild( content.firstChild );

		changeMesa(mesa);//pasa la mesa que se eligio para que se determine si se cambio
	});


	//*********************** CANTIDAD DE UN MISMO PEDIDO ********************************
	//cantidad();
	
});