<?php


	class ControllerAJAX
	{
		private $method; //metodo que actualizara los datos pedidos

		public function evaluate( $requestType )
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
			
		}//end evaluate


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
		}

	}//end ControllerAJAX