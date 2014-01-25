<?php
	
	require_once 'server/model/listarModel.php';
	require_once 'server/drawing/indexDrawing.php';
 
	class IndexController extends ControllerAJAX
	{
		public function __construct( $idTipoMenu = null, $addData = null )
		{
			$page = new IndexDrawing();
			//Si la peticion se hace por AJAX (la actulizacion de la lista)
			if( parent::evaluateUpdate( 'GET' ) )
				parent::callDraw( $page, array( $idTipoMenu, true ) );

			else if( parent::evaluateAdd( 'GET' ) )//Si se desea hacer un ingreso de datos			
			{
				$obj = new Listar();
				//Guarda los pedidos de la mesa cambiada y obtiene los pedidos ya hechos por la mesa elegida
				$pedidos = $obj->setPedido( $_GET );
				echo json_encode($pedidos);
			}
			else
				$page->drawPage( 'Honolulu', array( "Lista( 1 )" ) );//Traduce la pagina
			
		}
		
	}
	
	if( isset( $_GET[ 'idTipoMenu' ] ) )//Si la peticion se hizo por AJAX y se quiere obtener los menus
		$obj = new IndexController( $_GET[ 'idTipoMenu' ] );
	else if( isset( $_GET['data']))//Si hay una peticion ajax para ingresar datos
		$obj = new IndexController( null, $_GET['data'] );
	else
		$obj = new IndexController();//Si es para el dibujado inicial de la pagina

?>