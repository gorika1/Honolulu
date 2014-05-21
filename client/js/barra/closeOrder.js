function closeOrderInDB( forElement, mesa, amount )
{	
	idFood = forElement.replace( mesa, '' );

	data = JSON.stringify({
		mesa: mesa,
		id: idFood,
		amount: amount,
	});

	$.ajax({

		url: '',
		data: {'ajax':'true','delete':'true', 'data':data },
		contentType: 'application/x-www-form-urlencoded',
		error: function() {
			alert( 'Ha ocurrido un error' );
		},
		ifModified: false,
		processData: true,
		type: 'POST',
		timeout: 3000,
	});
} // end closeOrderInDB

//******************************************************************************************

function removeOrderDOM( forElement, attribute )
{	
	attribute || ( attribute = false );

	if( !attribute )
	{
		$( 'div[for="' + forElement + '"]:not([extra])' ).hide(300, function(){
			//Use native javascript because with jquery the div doen't go out of DOM
			element = document.querySelector( 'div[for="' + forElement + '"]:not([extra])' );
			if( element )
				element.remove();
		});
	}
	else
	{
		$( 'div[for="' + forElement + '"][extra="' + attribute + '"]' ).hide(300, function(){
			//Use native javascript because with jquery the div doesn't go out of DOM
			element = document.querySelector( 'div[for="' + forElement + '"][extra="' + attribute + '"]' );
			if( element )
				element.remove();
		});
	}
}

//*******************************************************************************************

function closeOrderJSON( forElement, amount )
{
	amount || ( amount = false );

	if( !amount )
	{
		removeOrderJSON( forElement );
	}
	else
	{
		for( i in currentOrders )
		{
			identificator = currentOrders[ i ].Identificator; // get the identificator of the current order evaluated
			if( forElement == identificator ) // if it's equal to the parameter forElement
			{
				currentOrders[ i ].Amount = currentOrders[ i ].Amount - amount;
				break;
			} // end if
		} // end for
	} // end if...else
} // end closeOrderJSON


//*******************************************************************************************

function removeOrderJSON( forElement )
{
	var found = false;

	for( i in currentOrders ) // loop the currentOrders
	{
		if( !found )//if the order removed still haven't been to found yet
		{
			identificator = currentOrders[i].Identificator; // get the identificator of the current order evaluated
			if( forElement == identificator ) // if it's equal to the parameter forElement
			{
				delete currentOrders[i]; // delete the index of that idetificator
				found = true;// switch found to true
			}
		}
		else // if it was already found
		{
			currentOrders[ i - 1 ] = currentOrders[ i ]; //then, each loop decrements a position of all elements
		}//end if...else
	}//end for

	delete currentOrders[ currentOrders.length - 1 ]; // deletes the last position
	currentOrders.length = currentOrders.length - 1; // and edits the attribute length

	if( currentOrders.length == 0 )
		showMessage();

}//end removeOrderJSON