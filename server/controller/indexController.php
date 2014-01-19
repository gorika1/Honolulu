<?php
	
	require_once 'server/model/listarModel.php';
	require_once 'server/drawing/indexDrawing.php';
 
	class IndexController extends ControllerAJAX
	{
		public function __construct( $idTipoMenu = null )
		{
			$page = new IndexDrawing();			

			//Si la peticion se hace por AJAX
			if( parent::evaluate( 'GET' ) )
			{
				parent::callDraw( $page, array( $idTipoMenu, true ) );
			}
			else
			{
				$page->drawPage( 'Honolulu', array( "Lista( 1 )" ) );//Traduce la pagina
			}
			
		}
		
	}
	
	if( isset( $_GET[ 'idTipoMenu' ] ) )
		$obj = new IndexController( $_GET[ 'idTipoMenu' ] );
	else
		$obj = new IndexController();

?>