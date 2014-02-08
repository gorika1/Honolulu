<?php

	require_once 'server/drawing/cocinaDrawing.php';
	require_once 'server/model/cocinaModel.php';

	class CocinaController extends ControllerAJAX
	{
		public function __construct()
		{
			$page = new CocinaDrawing();
			$page->drawPage( 'Cocina - Honolulu', array( 'Pedidos()' ) );
		}
	}

	$obj = new CocinaController();