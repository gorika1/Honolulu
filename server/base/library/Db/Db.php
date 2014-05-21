<?php
namespace Gear\Db;

use Gear\Db\Connecting;

class GMySqli
{
	static $registers;
	static $mysqli = null;
	static $query = null;
	
			
	static function checkMysqli()
	{
		//si no hay una conexion mysqli, lo crea
		if ( !isset( self::$mysqli ) ) 
		{
			self::$mysqli = Connecting::startConnection();
		}		
	}//end checkMysqli



	static function freeResult( $result )
	{
		if( is_object( $result ) )
			$result->free();
		else
			return;
	}//end freeResult

	


	static function viewQuery()
	{
		echo self::$query;
	}


//****************************************************************


	static function execQuery( $query, $returnRegisters = false )
	{
		self::checkMysqli();

		//Si hay que retornar registros
		if( $returnRegisters )	{

			//Si se realiza la consulta correctamente
			if( $result = self::$mysqli->query( $query ) ) {
				
				self::$registers = array();//$registers pasa a ser un array

				while( $register = $result->fetch_assoc() ) {
					self::$registers[] = $register;//En cada iteracion guarda una fila de datos en el array

				}//end while

			} else { //Si hay una consulta fallida
				self::$registers = false;

			}//end if..else

			self::freeResult( $result );//Libera memoria

		} else { //Si no hay que retornar registros

			if( $result = self::$mysqli->query( self::$query ) )//Si se realiza la consulta correctamente
				self::$registers = true;//register se convierte en una variable booleana que indica el exito de la operacion
			else
				self::$registers = false;//o false en caso de haber algun error

		}//end if..else externo


		//Se retorna los registros o true, en caso de una buena ejecucion
		//Y false en caso de un error
		return self::$registers;

	}//end execQuery


//*****************************************************************

	
	static function getRegister( $from, $campos = '*', $where = null )
	{
		self::checkMysqli();//comprueba si existe el objeto mysqli
		
		//Crea el query
		self::$query = 'SELECT '.$campos.' FROM '.$from;

		if( isset( $where ) )
			self::$query = self::$query.' WHERE '.$where;


		//Si la consulta se realizo correctamente
		if( $result = self::$mysqli->query( self::$query ) )
			self::$registers = $result->fetch_assoc();//Se guarda un array asociativo del resultado			
		else
			self::$registers = false;


		self::freeResult( $result );

		return self::$registers;

	}//end getRegister



//*****************************************************************

	
	static function getRegisters( $from, $campos = '*', $where = null, $order = null, $limit = null )
	{
		self::checkMysqli();

		self::$query= 'SELECT '.$campos.' FROM '.$from;
		
		if( isset( $where ) )
			self::$query = self::$query.' WHERE '.$where;
			
		if( isset( $order ) ) 
			self::$query = self::$query.' ORDER BY '.$order;
			
		if( isset( $limit ) )
			self::$query = self::$query.' LIMIT '.$limit;

		
		self::execQuery( self::$query, true );

		return self::$registers;
		
		
	}//end getRegisters


//*****************************************************************

//Recibe dos arrays con dos datos: 0 => nombreTabla, 1=> columnaAComparar, retorna los registros de $table1 despues del resultado de la comparacion

/*			

SELECT * FROM 
comentarios as c
JOIN
articulos as a
WHERE
c.id_articulo = a.id_articulo
AND
a.id_articulo = 1

*/

	static function getRegisterByJoin( $table1, $table2, $value = null, $campos = '*' )
	{
		if( sizeof( $table1 ) == 2  and sizeof( $table2 ) == 2 )//si los dos array possen dos datos
		{
			self::checkMysqli();

			
			$where = ' WHERE a.'.$table1[ 1 ].' = b.'.$table2[ 1 ];

			if( isset( $value ) )
				$where = $where.' AND b.'.$table2[ 1 ].' = '.$value;

			self::$query = 'SELECT '.$campos.' FROM '.$table1[ 0 ].
					' AS a JOIN '.$table2[ 0 ].' AS b '.$where;


			if( $result = self::$mysqli->query( self::$query ) )
				self::$registers = $result->fetch_array();
			else
				self::$registers = false;
		}
		else
			self::$registers= false;

		self::freeResult( $result );

		return self::$registers;

	}//end getRegisterByJoin


//*****************************************************************

//Recibe dos arrays con dos datos: 0 => nombreTabla, 1=> cloumnaAComparar, retorna los registros de $table1 despues del resultado de la comparacion

/*			

SELECT * FROM 
comentarios as c
JOIN
articulos as a
WHERE
c.id_articulo = a.id_articulo
AND
a.id_articulo = 1

*/

	static function getRegistersByJoin( $table1, $table2, $value = null, $campos = '*', $order = null, $limit = null )
	{
		if( sizeof( $table1 ) == 2  and sizeof( $table2 ) == 2 )//si los dos array poseen dos datos
		{				
			$where = ' WHERE a.'.$table1[ 1 ].' = b.'.$table2[ 1 ];

			if( isset( $value ) )
				$where = $where.' AND b.'.$table2[ 1 ].' = '.$value;

			self::$query = 'SELECT '.$campos.' FROM '.$table1[ 0 ].
					' AS a JOIN '.$table2[ 0 ].' AS b '.$where;

			
			if( isset( $order ) ) 
				self::$query = self::$query.' ORDER BY '.$order;
				
			if( isset( $limit ) )
				self::$query = self::$query.' LIMIT '.$limit;

			
			self::execQuery( self::$query, true );

		}
		else
			self::$registers = false;		

		
		return $self::$registers;
		
	}//end getRegistersByJoin

	
//*****************************************************************
	
	
	static function setRegister( $table, $campos, $values )
	{
		self::$query = "INSERT INTO ".$table;
		
		if( $campos != '*' )
			self::$query = self::$query."( ".$campos." )";
			
		self::$query = self::$query." values( ".$values." ) ";
		
		self::$query = strip_tags( self::$query );
		
		$bool = self::execQuery( self::$query );
			
		return $bool;
	}//end setRegister
	
	
//*****************************************************************


	static function updateRegister( $table, $set, $where = null )
	{
		if( !isset( $where ) )
		{
			echo "<script>
				alert( 'Si no pasa un sentencia where, no se podra ejecutar el update' );
			</script>";
			
			$bool = false;
		}//end if
		else
		{				
			self::$query = "UPDATE ".$table.
			" SET ".$set." WHERE ".$where;
			
			$bool = self::execQuery( self::$query );
		}//end else
		
		return $bool;
		
	}//end updateRegister
	
	
//*****************************************************************


	static function deleteRegister( $table, $where = null ) 
	{
		if( !isset( $where ) )
		{
			echo "<script>
				alert( 'Si no pasa un sentencia where, no se puedo realizar la accion' );
			</script>";
			
			$bool = false;
		}//end if
		else
		{
			self::$query = "DELETE FROM ".$table.
			" WHERE ".$where;
			
			$bool = self::execQuery( self::$query );
		}//end else
		
		return $bool;
	}//end deleteRegister
	
	
//*******************************************************


	static function getCountRegisters( $from, $campos = '*', $where = null )
	{
		self::checkMysqli();
		
		self::$query = "SELECT COUNT( ".$campos." ) FROM ".$from;
		
		if( isset( $where ) )
			self::$query = self::$query." WHERE ".$where;
		
		if( $result = self::$mysqli->query( self::$query ) )
		{
			$count = $result->fetch_array();				
			$count = $count[ 0 ];
		}//end if
		else
			$count = false;
		
		self::freeResult( $result );

		return $count;
		
	}//end getCountRegisters

//*******************************************************************************


	static function existRegister( $from, $where )
	{
		self::checkMysqli();
		self::$query = "SELECT * FROM ". $from . " WHERE ". $where;
		
		$result = self::$mysqli->query( self::$query );

		if( $result->num_rows > 0 )
			return true;
		else
			return false;
	}

//*******************************************************************************

	static function getPaginacion( $inicio, $categoria ) 
	{
		self::checkMysqli();
					
		self::$query = "SELECT count( * ) FROM noticias
					WHERE
					id_categoria = $categoria
					ORDER BY id_noticia ASC";
					
		$result = self::$mysqli->query( self::$query );			
					
		self::$query = "SELECT * FROM noticias
					WHERE
					id_categoria = $categoria
					ORDER BY id_noticia ASC
					LIMIT $inicio , 10";

		if( $result = self::$mysqli->query( self::$query ) )
		{
			self::$registers = array();
			while( $register = $result->fetch_assoc() )
			{
				self::$registers[] = $register;
			}
			
			return self::$registers;	
		}
	}//end getPaginacion
	

//*****************************************************************


	static function uploadFile()
	{
		copy( $_FILES[ 'photo' ][ 'tmp_name' ], 'photos/'.$_FILES[ 'photo' ][ 'name' ] );

		$img = new SimpleImage();
		$img->load( 'photos/'.$_FILES[ 'photo' ][ 'name' ] );
		$img->resize( 100, 200 );
		$img->save( 'photos/imagen.jpg' );
		unlink( 'photos/'.$_FILES[ 'photo' ][ 'name' ] );
	}


//*****************************************************************


	static function shortenText( $text, $count ) 
	{
		$subText = substr( $text, 0, $count );
		return $subText;
	}//end shortenText


//***************************************************************


	static function textFormat( $text, $separate, $cod = true )
	{
		$text = trim( $text );//quita los espacios de los costados

		if( $cod ) {				
			$text = strtolower( str_replace( ' ', $separate, $text ) );
			$text = self::removeAccents( $text );
		} else {
			$text = str_replace( $separate, ' ' , $text );
		}//end if

		return $text;
	}//end textFormat



//***********************************************************************

	static function removeAccents( $text ) {
		$text = str_replace( 'á', 'a', $text );
		$text = str_replace( 'é', 'e', $text );
		$text = str_replace( 'í', 'i', $text );
		$text = str_replace( 'ó', 'o', $text );
		$text = str_replace( 'ú', 'u', $text );

		return $text;
	}


//***************************************************************


	static function numberEncripting( $pass )
	{
		echo "<script src='js/md5.js'></script>
		<script src='js/utf8_encode.js'></script>
		<script>
			var pass = md5(".$pass.");
		</script>";
		
		$pass = "<script> document.write(pass) </script>";
			
		$passE = md5( $pass );
		
		return $passE;
		
	}//end encripting


//*****************************************************************


	static function dateReverse( $date, $separate )
	{
		$day = substr( $date, 8, 2 );
		$month = substr( $date, 5, 2 );
		$year = substr( $date, 0, 4 );

		$date = $day.$separate.$month.$separate.$year;

		return $date;
	}//end dateReverse

}//end GMySqli


//*****************************************************************

?>
