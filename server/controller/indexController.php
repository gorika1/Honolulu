<?php
	
	require_once 'server/model/listarModel.php';
	require_once 'server/model/pedidosModel.php';
	require_once 'server/drawing/indexDrawing.php';
 
	class IndexController extends ControllerAJAX
	{
		public function __construct( $idTipoMenu = null )
		{
			//Si la peticion se hace por AJAX (la actualizacion de la lista)
			if( parent::evaluateUpdate( 'POST' ) )
			{
				$page = new IndexDrawing();
				parent::callDraw( $page, array( $idTipoMenu, true ) );
			} 
			else if( parent::evaluateAdd( 'POST' ) )//Si se desea hacer un ingreso de datos			
			{
				$obj = new Pedidos();
				//Guarda los pedidos de la mesa
				$obj->setPedido( $_POST );
			}
			//Si se quiere obtener los pedidos ya hechos por una mesa
			else if( parent::evaluateGet( 'POST' ) )
			{
				$obj = new Pedidos();
				//Obtiene los pedidos de la mesa
				$pedidos = $obj->getCartSelect( $_POST[ 'mesa' ] );
				echo json_encode($pedidos);
			}
			else
			{			
				$page = new IndexDrawing();
				$page->drawPage( 'Honolulu', array( "Lista( 1 )" ) );//Dibuja la pagina
			}
				
			
		}
		
	}
	
	if( isset( $_POST[ 'ajax' ] ) )
	{
		if( isset( $_POST[ 'idTipoMenu' ] ) )//Si la peticion se hizo por AJAX y se quiere obtener los menus
			$obj = new IndexController( $_POST[ 'idTipoMenu' ] );
		else
			$obj = new IndexController();
	}
	else
		$obj = new IndexController();//Si es para el dibujado inicial de la pagina

?>