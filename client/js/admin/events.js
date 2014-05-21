$( document ).on('ready', function(){
	$('#buttons button:first').addClass('stand-out-button');

	//Controla la presion de uno de los botones y le da el estilo
	$('#buttons button').on('click', function(){
		if ( ! $(this).hasClass('stand-out-button') ) 
		{
			$('#buttons button.stand-out-button').removeClass('stand-out-button');
			$(this).addClass('stand-out-button');
			showInfo( $(this).attr('id') );
		} // end if
	});
});