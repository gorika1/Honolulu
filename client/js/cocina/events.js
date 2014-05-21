$(document).on('ready', function(){

	getOrders( true );

	$('#pedidos').on('click', '.close-order', function(){
		var forElement = $(this).parents('.col-md-3').attr('for');
		var mesa = $(this).siblings('.table-number').text().replace( 'Mesa ', '' );
		var amount = $(this).parent().siblings('.panel-body').children(':first').text();


		var extraAttribute = $(this).parents('.col-md-3').attr( 'extra' );


		removeOrderInDB( forElement, mesa, amount );
		
		
		if( extraAttribute === undefined )
		{
			removeOrderDOM( forElement );			
		}			
		else
		{
			removeOrderDOM( forElement, extraAttribute );			
		}

		// If already there's just an element with the same for attribute
		if( $('div[for="' + forElement + '"]').length == 1 )
		{
			closeOrderJSON( forElement );
		}
		else
		{
			closeOrderJSON( forElement, amount )
		}
	});


	setInterval( 'getOrders()', 10000 );


});