var dom;

function getLista( idTipoMenu )
{
	$.ajax({
		beforeSend: function() {
			feedback();
		},
		complete: function() {
			$.unblockUI();
			//cantidad();
		},
		cache: true,
		url: '',
		data: {'ajax':'true','update':'Lista', 'idTipoMenu':idTipoMenu },
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		ifModified: false,
		processData: true,
		success: function( data ) {
			updateLista( data );
		},
		type: 'POST',
		timeout: 3000

	});
}//end getLista


//**********************************************************************************

//Loading feedback
function feedback() {
  	$.blockUI({ 
  		css: { 
	        border: 'none', 
	        padding: '15px', 
	        backgroundColor: '#000', 
	        '-webkit-border-radius': '10px', 
	        '-moz-border-radius': '10px', 
	        opacity: .5, 
	        color: '#fff' 
   	 	},
   	 	message:  '<h3>Cargando...</h3>',
    }); 
}


//***********************************************************************************

function updateLista( data ) 
{
	//Borra todo lo que hay en el contenedor navigation
	content = document.getElementById( 'navigation' );
	while( content.hasChildNodes() )
	{
		content.removeChild( content.firstChild );
	}//end while
	
	var html = '';
	//Por cada menu con datos
	for( i in data )
	{
		resetDOM();
		dom = dom.replace( '{idMenu}', data[i].idMenu );
		dom = dom.replace( "{Nombre}", data[i].Nombre );
		dom = dom.replace( "{Nombre}", data[i].Nombre );
		dom = dom.replace( "{Ingredientes}", data[i].Ingredientes );
		dom = dom.replace( "{Precio}", data[i].Precio );
		dom = dom.replace( "{Type}", data[i].Type )
		html = html + dom;
	}

	$( "#navigation" ).html( html );
	scrollFoods();//no se porque pero solo si pongo aca funciona :)
}//end updateLista


//**********************************************************************************


function scrollFoods(){			
	$("#navigation").mCustomScrollbar({
		theme: 'dark',
		scrollButtons: {
			enable: true				
		},			
	});
}


//Controla los eventos del input para la cantidad
/*function cantidad() {
	$(".amount").TouchSpin({
	    min: 1,
	});

	$(".amount").on( 'touchspin.on.startupspin', function() {
		value = parseInt( $(this).attr( 'value' ) );
		$(this).attr( 'value', value + 1  );
	});

	$(".amount").on( 'touchspin.on.startdownspin', function() {
		value = parseInt( $(this).attr( 'value' ) );
		if( value > 1 )
			$(this).attr( 'value', value - 1  );
	});
	
	$('.amount').blur(function(){
		$(this).attr( 'value', $(this).val());
		if( $(this).attr( 'value' ) == '' ) {
			$(this).attr( 'value', 1 );
			$(this).val( 1 );
		}
	});

	$(".amount").keydown( function(event) {
		// Allow: backspace, delete
	    if ( $.inArray( event.keyCode, [8] ) !== -1 ){
	    	return; 
	    }
	       	   	
	    else {
	        // Ensure that it is a number and stop the keypress
	        if ( ( event.shiftKey || ( event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) ) ){
	        	event.preventDefault();
	        }
	    }    
	});
}*/

//*****************************************************************************
function resetDOM()
{
	dom = '<div class="panel panel-primary" id="food-container">' +
		'<div class="panel-heading">' +
			'<h3 class="panel-title">{Nombre}</h3>' +
		'</div>' +
		'<div class="panel-body">' +
			'<img class="food-img" src="http://www.placehold.it/80x80" alt="">' +
			'<div class="food-description">' +
				'<span class="food-ingredientes">{Ingredientes}</span>' +
			'</div>' +
		'</div>' +
		'<div class="price-add row">' +
			'<div class="col-md-8 food-price">' +
				'<strong><span class="food-price">Precio: {Precio}</span></strong>' +
			'</div>' +
			'<div class="col-md-3">' +
				'<div class="glyphicon glyphicon-plus food-add" id-add="{idMenu}" type="{Type}" food="{Nombre}"></div>' +
			'</div>' +
		'</div>' +
	'</div>'
}