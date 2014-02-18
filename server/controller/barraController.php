<?php

	require_once 'server/drawing/barraDrawing.php';
	require_once 'server/model/barraModel.php';

	class BarraController extends ControllerAJAX
	{
		public function __construct()
		{
			if( $this->evaluateUpdate( 'POST' ) )
			{
				$obj =  new BarraDrawing();
				//Si el update es solo para obtener los datos (en la primera carga) para luego comparar
				if( $_POST[ 'load' ] === 'true' ){
					parent::callDraw( $obj, array( true ) );}
				else // Si se hace para ver si existen nuevos pedidos
					if( is_file( 'server/exist.dat' ) )
					{
						parent::callDraw( $obj, array( true ) );
						unlink( 'server/exist.dat' );
					}						
					else
						echo json_encode( array() ); //return a void json
			}
			else if( $this->evaluateDelete( 'POST' ) )
			{
				$obj = new Barra();
				$obj->closePedido( json_decode( $_POST[ 'data' ], true ) );
			}
			else
			{
				$page = new BarraDrawing();
				$page->drawPage( 'Barra - Honolulu', array( 'Pedidos()' ) );
			}
		}
	}

	$obj = new BarraController();