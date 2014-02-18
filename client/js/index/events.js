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
	$( '#resumen' ).on( 'click', '.food-order-option .glyphicon-remove:not(.missing)', function(){
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


	//Controls the pressure of food-option-remove for missing orders
	$( '#resumen' ).on( 'click', '.food-order-option .glyphicon-remove.missing', function(){
		var elementFor = $(this).attr('for');
		var currentMissing = $('.food-order-container[for="' + elementFor + '"] .food-order .missing' ).text().substring( 1 );
		var amountContainer = $('.food-order-container[for="' + elementFor + '"] .food-order-amount');
		var priceContainer = $('.food-order-container[for="' + elementFor + '"] .food-order-price'); // container of the total for a order
		var currentPrice = priceContainer.text();
		var currentAmount = amountContainer.text();
		var priceForUnity = currentPrice / currentAmount;
		var newAmount = parseInt( currentAmount ) - parseInt( currentMissing );
		amountContainer.text( newAmount ); // update the amount
		priceContainer.text( newAmount * priceForUnity );
		total = total - ( parseInt( currentMissing  ) * priceForUnity );
		writeMontoTotal( total );

		$('.food-order-container[for="' + elementFor + '"] .food-order .missing' ).text( '' );
		$(this).removeClass('missing');
		$(this).parent().addClass('enviado');
		$(this).parent().attr('style', '');

	});


	$('#resumen').on( 'click', '.food-order-option .glyphicon-plus', function(){
		var elementFor = $(this).attr('for');
		var amountContainer = $('.food-order-container[for="' + elementFor + '"').children(':first');// get the container of the amount
		var priceContainer = $('.food-order-container[for="' + elementFor + '"] .food-order-price'); // container of the total for a order
		var currentAmount = amountContainer.text();// get the amount of that order
		var currentPrice = priceContainer.text();
		var priceForUnity = currentPrice / currentAmount; // get the price of the menu
		var newAmount = parseInt( currentAmount ) + 1; // increment the amount
		amountContainer.text( newAmount ); // put the new value of the amount
		priceContainer.text( priceForUnity * newAmount ); // put the new value for the price
		total = total + priceForUnity; // increment total of the orders
		writeMontoTotal( total ); // and rewrites it
		var missing = amountContainer.siblings('.food-order').find('.missing'); // access to the container of missing orders
		var aMissing = missing.text(); // get the text of the container
		if( aMissing == '' )
			currentMissing = 0;
		else
			currentMissing = aMissing.substring( 1 );

		var newMissing = parseInt( currentMissing ) + 1;
		missing.text('(' + newMissing + ')' );
		missing.parent().attr('amount', newAmount );

		if( $(this).parent().siblings('.remove').hasClass('enviado') ) 
		{
			$(this).parent().siblings('.remove').removeClass('enviado'); // access to the remove icon container and delete the class enviado
			$(this).parent().siblings('.remove').children(':first').addClass('missing');// add the class missing to the remove icon
			$(this).parent().siblings('.remove').css('color', '#000' ); // assigns the color for the icon remove container
			$('.food-order-container[for="' + elementFor + '"] .food-order').addClass('missing');
		}
	});


	//************************** POPUP REMOVE ORDER AND SEND ORDERS *****************************


	$( '.close-bpopup' ).on('click', function(){
		answer = $(this).attr('response'); // answer of confirmation
		if( action == 'remove' ) 
		{
			
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
	cantidad();
	
});