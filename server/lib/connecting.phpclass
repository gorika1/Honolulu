<?php
	//Creado por Valentin Sánchez
	//21/07/2013
	//22:03 Geany 1.22
	
	class Connecting
	{	
		static $host = 'localhost'/*'sql102.byethost13.com'*/;
		static $user = 'root'/*'b13_13268400'*/;
		static $password = '';
		static $db = 'honolulu-db'/*'b13_13268400_honolulu'*/;
			
		static function startConnection()
		{
			$connection = new mysqli( Connecting::$host, Connecting::$user, Connecting::$password, Connecting::$db );
			
			$connection->set_charset( 'utf8' );
			
			if( mysqli_connect_error() )
				echo 'Error in the connection';
			else
				return $connection;
				
		}//end startConnection
		
	}//end Connecting
	
?>
