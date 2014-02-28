<?php

namespace Gear\Controller;

class ControllerAJAX
{
	private $method; //metodo que actualizara los datos pedidos

	//Evalua si existe el minimo requisito de parametros para realizar un update de datos
	public function evaluateUpdate( $requestType )
	{
		if( $requestType == 'GET' )
		{
			if( ( isset( $_GET[ 'ajax' ] ) && $_GET[ 'ajax' ] == true ) && isset( $_GET[ 'update' ] ) ) 
			{
				$this->method = $_GET[ 'update' ];
				return true;
			}

		}
		else if( $requestType == 'POST')
		{
			if( ( isset( $_POST[ 'ajax' ] ) && $_POST[ 'ajax' ] == true ) && isset( $_POST[ 'update' ] ) ) 
			{
				$this->method = $_POST[ 'update' ];
				return true;
			}//end if mas interno
		}///end if interno

		return false;
		
	}//end evaluateUpdate


	//**************************************************************************************************



	//Evalua si existe el minimo requisito de parametros para realizar un add de datos
	public function evaluateAdd( $requestType )
	{
		if( $requestType == 'GET' )
		{
			if( ( isset( $_GET[ 'ajax' ] ) && $_GET[ 'ajax' ] == true ) && ( isset( $_GET[ 'add' ] ) && $_GET[ 'add'] == true ) ) 
			{
				return true;
			}

		}
		else if( $requestType == 'POST')
		{
			if( ( isset( $_POST[ 'ajax' ] ) && $_POST[ 'ajax' ] == true ) && ( isset( $_POST[ 'add' ] ) && $_POST[ 'add'] == true ) ) 
			{
				return true;
			}//end if mas interno
		}///end if interno

		return false;
		
	}//end evaluateUpdate

	//************************************************************************************************

	//Evalua si existe el minimo requisito de parametros para realizar la obtencion de datos
	public function evaluateGet( $requestType )
	{
		if( $requestType == 'GET' )
		{
			if( ( isset( $_GET[ 'ajax' ] ) && $_GET[ 'ajax' ] == true ) && isset( $_GET[ 'get' ] ) ) 
			{
				return true;
			}

		}
		else if( $requestType == 'POST')
		{
			if( ( isset( $_POST[ 'ajax' ] ) && $_POST[ 'ajax' ] == true ) && isset( $_POST[ 'get' ] ) ) 
			{
				return true;
			}//end if mas interno
		}///end if interno

		return false;
	}

	//*************************************************************************************************

	//Evalua si existe el minimo requisito de parametros para realizar la eliminacion de datos
	public function evaluateDelete( $requestType )
	{
		if( $requestType == 'GET' )
		{
			if( ( isset( $_GET[ 'ajax' ] ) && $_GET[ 'ajax' ] == true ) && isset( $_GET[ 'delete' ] ) &&  $_GET[ 'delete' ] == true ) 
			{
				return true;
			}

		}
		else if( $requestType == 'POST')
		{
			if( ( isset( $_POST[ 'ajax' ] ) && $_POST[ 'ajax' ] == true ) && isset( $_POST[ 'delete' ] ) && $_POST[ 'delete' ] == true ) 
			{
				return true;
			}//end if mas interno
		}///end if interno

		return false;
	}

	//**************************************************************************************************


	//Recibe un arreglo en donde se pasan los argumentos de la funcion que retorna los datos actualizados
	//El orden de los valores debe ser igual al orden de los argumentos
	public function callDraw( &$objDrawing, $values = array() )
	{
		//Elimina los punto y coma (;) para evitar ataques
		$this->method = str_replace( ';', '', $this->method );

		$returns = array();//almacena los valores devueltos en el update de datos

		if( isset( $values ) )
		{
			$argumentos = '';
			//Itera a traves de values para generar el string para pasar los parametros
			for( $i = 0; $i < sizeof( $values ); $i++ )
			{
				if( $i + 1 < sizeof( $values ) ) //Si el indice actual no es el ultimo
					$argumentos = $argumentos . $values[ $i ] . ', '; //genera el string de los valores a pasar
				else
					$argumentos = $argumentos . $values[ $i ];
			}
			eval( "\$returns = \$objDrawing->draw". $this->method . "( $argumentos );" );
		}
		else
			$value = eval( "\$returns = \$objDrawing->draw".$this->method.'();' );

		
		echo json_encode( $returns );
	}//end callDraw

}//end ControllerAJAX