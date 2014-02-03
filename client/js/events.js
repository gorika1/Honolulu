$(document).on( 'ready', function(){

	//Llama a scrollBar en la primera carga de la pagina
	scrollFoods();

	getPedidos( 1 );//En la primera carga de pagina que obtenga los pedidos de la mesa 1


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

		precio = $(this).parent().siblings('.price').find('.food-price').text();//obtiene al hermano del elemento en cuestion (es decir el precio)
		precio = precio.replace( 'Precio: ', '' );//extrae solamente el monto
		
		id = $(this).attr('id-add');

		type = $(this).attr('type');

		amount = $(this).parent().siblings('.food-amount').find('.amount').attr('value');		

		addCart( food, precio, id, amount, type );
	});


	//Controla el borrado de uno de los pedidos
	var action; // if will be for delete an order or send the orders
	var elementFor; // declare out because it will be necessary for the confirm
	$( '#resumen' ).on( 'click', '.food-order-option .glyphicon-remove', function(){
		if( ! $(this).parent().hasClass('enviado') )
		{
			action = 'remove';
			confirmCustom( '¿Está seguro de que quiere eliminar este pedido?', true );
			elementFor = $(this).parent().parent().parent().attr('for');//get the attribute "for" for remove divs that have this attribute
		}//end if
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
			console.log(elementFor);
			$('#confirm-delete').bPopup().close();
			if( answer == "true" )
				removeOrder( elementFor );	
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
		     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
		});
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
	cantidad();
	
});