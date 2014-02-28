var currentOrders = {}; // save datas about the actual information in the list of order
var temporary = {};
var dom;

function resetDom()
{
	dom = '<div class="col-md-3" for="{Identificator}">' +
		'<div class="panel panel-primary">' +
			'<div class="panel-heading">' +
				'<h3 class="panel-title table-number">Mesa {Table}</h3>' +
				'<span class="close-order glyphicon glyphicon-remove"></span>' +
			'</div>' +
			'<div class="panel-body">' + 
				'<span class="food-amount-cocina">{Amount}</span>' +
				'{Drink}' +
				'{Description}' +
			'</div>' +
			'<div class="panel-footer">' +
				'{Hour}' +
			'</div>' +
		'</div>' +
	'</div>';
}


//***************************************************************************************

function getOrders( load )
{
	load || ( load = false );
	$.ajax({
		url: '/GearProjects/Honolulu/barra',
		dataType: 'json',
		data: {'ajax':'true','update':'Pedidos', 'load':load },
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		success: function( data ) {
			if( load ) // Si fue en la carga de la pagina
			{
				currentOrders = data;
			}				
			else // Si fue una comprobacion de si existe nuevos pedidos
			{
				console.log( data.length );
				if( data.length != 0 ) // Si existe nuevos pedidos
				{
					if( $('#pedidos').text() == 'No hay pedidos pendientes' )
					{
						$('#pedidos').text('');
						$('#pedidos').removeClass('message');
					}						
					compareOrders( data );
					updateDOM();
				}
			}				

			if( currentOrders === null )
			{
				showMessage();
			}			
		},
		ifModified: false,
		processData: true,
		type: 'POST',
		timeout: 3000,
	});
}

//compare current json of pedidos and the new obtained
function compareOrders( newOrders )
{
	var lastPos = 0;
	temporary = {};

	for( i in newOrders ) // loop newOrders
	{
		// Si no habia ningun pedido
		// agrega los nuevos recibidos de manera directa
		if( currentOrders === null )
		{
			if( temporary[ 0 ] === undefined )
			{
				temporary[ 0 ] = newOrders[ i ];
				currentOrders = {};
				currentOrders[ 0 ] = newOrders[ i ];
				currentOrders.length = 1;
			}
			else
			{
				temporary[ lastPos += 1 ] = newOrders[ i ];
				currentOrders[ currentOrders.length ] = newOrders[ i ];
				currentOrders.length = currentOrders.length + 1;
			}// end if...else interno				
		}
		//Si ya habia pedidos anteriormente
		else
		{
			newOrderId = newOrders[ i ].Identificator;
			for( j in currentOrders ) // loop currentOrders
			{
				// Si el identificador de newOrder coincide
				// con el de currentOrder
				if( newOrderId == currentOrders[ j ].Identificator )
				{	
					// Compara si la cantidad de la nueva orden es superior
					// a la que existia
					if( newOrders[ i ].Amount > currentOrders[ j ].Amount )
					{
						if( temporary[ 0 ] === undefined )
						{
							amount = newOrders[ i ].Amount;
							temporary[ 0 ] = newOrders[ i ];							
							temporary[ 0 ].Amount = newOrders[ i ].Amount - currentOrders[ j ].Amount;
							temporary[ 0 ].Exist = 1;
							currentOrders[ j ].Amount = amount;
						}
						else
						{
							temporary[ lastPos += 1 ] = newOrders[ i ];
							temporary[ lastPos ].Amount = newOrders[ i ].Amount - currentOrders[ j ].Amount;
							temporary[ lastPos ].Exist = 1;//bandera para saber que se debe incluir el atributo extra
							currentOrders[ j ].Amount = newOrders[ i ].Amount;
						}// end if...else
					}//end if
					break;
				}// end if
				else
				{
					// Si aun no existe el id en currentOrders
					// es un nuevo pedido
					if( JSON.stringify( currentOrders ).search( newOrderId ) === -1 )
					{
						if( temporary[ 0 ] === undefined )
						{
							temporary[ 0 ] = newOrders[ i ];
							currentOrders[ currentOrders.length ] = newOrders[ i ];
							currentOrders.length = 1;
						}							
						else
						{
							temporary[ lastPos += 1 ] = newOrders[ i ];
							currentOrders[ currentOrders.length ] = newOrders[ i ];
							currentOrders.length = currentOrders.length + 1;
						}							
						break;
					}// end if					
				} // end if...else
			} // end for interno
		}// end if...else		
	}//end for	
} // end compareOrders


//********************************************************************************************

function updateDOM()
{
	var html = '';

	for( i in temporary )
	{
		resetDom(); // reestablece el valor del DOM a modificar
		dom = dom.replace( '{Identificator}', temporary[i].Identificator );
		dom = dom.replace( "{Table}", temporary[i].Table );
		dom = dom.replace( "{Amount}", temporary[i].Amount );
		dom = dom.replace( "{Drink}", temporary[i].Drink );
		dom = dom.replace( "{Description}", temporary[i].Description );
		dom = dom.replace( "{Hour}", temporary[i].Hour );
		html = html + dom;
	}

	$( '#pedidos' ).append( html );

	addAttribute();
}

//********************************************************************************************

function addAttribute()
{
	for( i in temporary )
	{
		// Si tiene la bandera que indica que
		// es un pedido de algo que ya estaba
		// anteriormente
		if( temporary[i].Exist )
		{
			// obtiene la cantidad de elementos que tienen el atributo for con el mismo valor
			totalElements = $( 'div[for="' + temporary[i].Identificator + '"]' ).length; 
			//Usando eso obtiene el penultimo, es decir el que tiene el atributo extra bien establecido
			element = $( 'div[for="' + temporary[i].Identificator + '"]' ).eq( totalElements - 2 );

			attribute = $(element).attr( 'extra' );
			//Si aun no existia ese pedido con el atributo extra
			if( attribute === undefined )
			{
				$( 'div[for="' + temporary[i].Identificator + '"]:last' ).attr('extra', 'm');
			}
			else // Si el elemento anterior ya tenia el atributo extra
			{
				$( 'div[for="' + temporary[i].Identificator + '"]:last' ).attr('extra', attribute + 'm' );
			}
		} // end for
	} // end for
} // end addAttribute

//**************************************************************************************

function showMessage()
{
	$( '#pedidos' ).text('No hay pedidos pendientes');

	$( '#pedidos' ).addClass('message');
}