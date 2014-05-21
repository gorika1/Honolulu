//compare current json of pedidos and the new obtained
function compareOrdersBarra( newOrders )
{
	var lastPos = 0;
	temporary = {};

	for( i in newOrders ) // loop newOrders
	{
		// Si no habia ningun pedido
		// agrega los nuevos recibidos de manera directa
		if( currentOrdersBarra[ 0 ] === undefined )
		{
			if( temporary[ 0 ] === undefined )
			{
				temporary[ 0 ] = newOrders[ i ];
				currentOrdersBarra = {};
				currentOrdersBarra[ 0 ] = newOrders[ i ];
				currentOrdersBarra.length = 1;
			}
			else
			{
				temporary[ lastPos += 1 ] = newOrders[ i ];
				currentOrdersBarra[ currentOrdersBarra.length ] = newOrders[ i ];
				currentOrdersBarra.length = currentOrdersBarra.length + 1;
			}// end if...else interno				
		}
		//Si ya habia pedidos anteriormente
		else
		{
			newOrderId = newOrders[ i ].Identificator;
			for( j in currentOrdersBarra ) // loop currentOrdersBarra
			{
				// Si el identificador de newOrder coincide
				// con el de currentOrder
				if( newOrderId == currentOrdersBarra[ j ].Identificator )
				{	
					// Compara si la cantidad de la nueva orden es superior
					// a la que existia
					if( newOrders[ i ].Amount > currentOrdersBarra[ j ].Amount )
					{
						if( temporary[ 0 ] === undefined )
						{
							amount = newOrders[ i ].Amount;
							temporary[ 0 ] = newOrders[ i ];							
							temporary[ 0 ].Amount = newOrders[ i ].Amount - currentOrdersBarra[ j ].Amount;
							temporary[ 0 ].Exist = 1;
							currentOrdersBarra[ j ].Amount = amount;
						}
						else
						{
							temporary[ lastPos += 1 ] = newOrders[ i ];
							temporary[ lastPos ].Amount = newOrders[ i ].Amount - currentOrdersBarra[ j ].Amount;
							temporary[ lastPos ].Exist = 1;//bandera para saber que se debe incluir el atributo extra
							currentOrdersBarra[ j ].Amount = newOrders[ i ].Amount;
						}// end if...else
					}//end if
					break;
				}// end if
				else
				{
					// Si aun no existe el id en currentOrdersBarra
					// es un nuevo pedido
					if( JSON.stringify( currentOrdersBarra ).search( newOrderId ) === -1 )
					{
						if( temporary[ 0 ] === undefined )
						{
							temporary[ 0 ] = newOrders[ i ];
							currentOrdersBarra[ currentOrdersBarra.length ] = newOrders[ i ];
							currentOrdersBarra.length = 1;
						}							
						else
						{
							temporary[ lastPos += 1 ] = newOrders[ i ];
							currentOrdersBarra[ currentOrdersBarra.length ] = newOrders[ i ];
							currentOrdersBarra.length = currentOrdersBarra.length + 1;
						}							
						break;
					}// end if					
				} // end if...else
			} // end for interno
		}// end if...else	
	}//end for
} // end compareOrders


//********************************************************************************************

function updateDOMBarra()
{
	var html = lastBarraOrders;
	
	for( i in temporary )
	{
		var dom = cocinaOrdersDom;
		dom = dom.replace( '{Identificator}', temporary[i].Identificator );
		dom = dom.replace( "{Table}", temporary[i].Table );
		dom = dom.replace( "{Amount}", temporary[i].Amount );
		dom = dom.replace( "{Food}", temporary[i].Drink );
		dom = dom.replace( "{Description}", temporary[i].Description );
		dom = dom.replace( "{Hour}", temporary[i].Hour );
		html = html + dom;
	} // end for

	$( '#barra-orders .container' ).append( html );

	lastBarraOrders = html;
}