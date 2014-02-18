<?php

	require_once 'server/drawing/cocinaDrawing.php';
	require_once 'server/model/cocinaModel.php';

	class CocinaController extends ControllerAJAX
	{
		public function __construct()
		{
			if( $this->evaluateUpdate( 'POST' ) )
			{
				$obj =  new CocinaDrawing();
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
				$obj = new Cocina();
				$obj->closePedido( json_decode( $_POST[ 'data' ], true ) );
			}
			else
			{
				$page = new CocinaDrawing();
				$page->drawPage( 'Cocina - Honolulu', array( 'Pedidos()' ) );
			}
		}
	}

	$obj = new CocinaController();