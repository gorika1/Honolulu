<?php
	
	require_once 'server/drawing/AdminDrawing.php';

	use Gear\Controller\ControllerAJAX;

	class AdminController extends ControllerAJAX
	{
		public function __construct()
		{
			$obj = new AdminDrawing();
			$obj->drawPage( 'Administrar - Honolulu' );
		} // end __construct

	} // end AdminController


	$obj = new AdminController();

?>