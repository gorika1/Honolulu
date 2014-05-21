//compare current json of pedidos and the new obtained
function compareOrders( newOrders )
{
	var lastPos = 0;
	temporary = {};

	for( i in newOrders ) // loop newOrders
	{
		// Si no habia ningun pedido
		// agrega los nuevos recibidos de manera directa
		if( currentOrders[ 0 ] === undefined )
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
	var html = lastCocinaOrders;
	
	for( i in temporary )
	{
		var dom = cocinaOrdersDom;
		dom = dom.replace( '{Identificator}', temporary[i].Identificator );
		dom = dom.replace( "{Table}", temporary[i].Table );
		dom = dom.replace( "{Amount}", temporary[i].Amount );
		dom = dom.replace( "{Food}", temporary[i].Food );
		dom = dom.replace( "{Description}", temporary[i].Description );
		dom = dom.replace( "{Hour}", temporary[i].Hour );
		html = html + dom;
	} // end for

	$( '#cocina-orders .container' ).append( html );

	lastCocinaOrders = html;
}