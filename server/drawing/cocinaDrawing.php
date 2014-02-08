<?php

	class CocinaDrawing extends Drawing
	{
		private $myCocina;

		public function __construct()
		{
			parent::__construct();
			$this->myCocina = new Cocina();
		}

		public function drawPedidos()
		{
			$this->setList( 'pedidos' );

			$orders = $this->myCocina->getPedidos();

			foreach ( $orders as $key => $value ) 
				$aux[ $key ] = $value[ 'hora' ];

			array_multisort( $aux, SORT_ASC, $orders );
			
			foreach( $orders as $order )
			{
				$this->list[] = array(
					'Table' => 'Mesa ' . $order[ 'Pedidos_nroMesa' ],
					'Food' => $order[ 'foodName' ],
					'Description' => '',
					'Hour' => $order[ 'hora' ],
				);
			}

			$this->draw( 'Pedidos' );
		}
	}