function showInfo( id )
{
	index = parseInt( $('#' + id ).attr('slide') );
	$.deck('go', index);

	switch( id )
	{
		case 'info-general':
			showGeneralInfo();
			break;
		case 'info-cocina':
			showCocinaInfo();
			break;
		case 'info-barra':
			showBarraInfo();
			break;
		case 'admin-food':
			adminFoods();
			break;
	} // end switch
} // end showInfo

//***********************************************************************************

function showGeneralInfo()
{
	var generalInfo = generalInfoDom;

	$.ajax({
		url: '',
		dataType: 'json',
		data: {'ajax':'true','update':'GeneralInfo'},
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success: function( data ) {
			generalInfo = generalInfo.replace( '{Amount Mesas}', data.AmountMesas + ( data.AmountMesas == 1 ? ' mesa abierta' : ' mesas abiertas' ) );
			generalInfo = generalInfo.replace( '{Amount Cocina}', data.AmountCocina + ( data.AmountCocina == 1 ? ' pedido' : ' pedidos' ) );
			generalInfo = generalInfo.replace( '{Amount Barra}', data.AmountBarra + ( data.AmountBarra == 1 ? ' pedido' : ' pedidos' ) );
			$('div.content').html(generalInfo);
		},
		ifModified: false,
		processData: true,
		type: 'POST',
	});

	
}

//***********************************************************************************

function showCocinaInfo()
{
	$.ajax({
		url: 'cocina',
		dataType: 'json',
		data: {'ajax':'true','update':'Pedidos'},
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success: function( data ) {			
			if( data.length != 0 ) // Si existe nuevos pedidos
			{		
				compareOrders( data );
				updateDOM();
			}
			else if( lastCocinaOrders != '' )
				updateDOM();
			else
			{
				showMessage( true );
			}
		},
		ifModified: false,
		processData: true,
		type: 'POST',
	});
} // end showCocinaInfo

//***********************************************************************************

function showBarraInfo()
{
	$.ajax({
		url: 'barra',
		dataType: 'json',
		data: {'ajax':'true','update':'Pedidos'},
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success: function( data ) {		
			if( data.length != 0 ) // Si existe nuevos pedidos
			{		
				compareOrdersBarra( data );
				updateDOMBarra();
			}
			else if( lastBarraOrders != '' )
				updateDOMBarra();
			else
			{
				showMessage();
			}
		},
		ifModified: false,
		processData: true,
		type: 'POST',
	});
} // end showCocinaInfo


//**********************************************************************

function showMessage( place )
{
	if( place == true )
	{
		$( '#cocina-orders .container' ).text('No hay pedidos pendientes');
		$( '#cocina-orders .container' ).addClass('message');
	}
	else
	{
		$( '#barra-orders .container' ).text('No hay pedidos pendientes en la barra');
		$( '#barra-orders .container' ).addClass('message');
	}
	
}