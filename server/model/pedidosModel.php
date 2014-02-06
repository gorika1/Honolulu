<?php

	class Pedidos
	{
		private $datos; // almacena los pedidos que ya se hicieron en la mesa que se selecciono
		private $monto; // total de los pedidos hechos por una mesa
		private $mesa;

		//Guarda el pedido
		public function setPedido( &$datos = array() )
		{
			if( isset( $datos[ 'mesa' ] ) && isset( $datos[ 'data' ] ) )
			{
				$this->mesa = $datos[ 'mesa' ];

				//Decode the ids and types
				$idFoods = json_decode( urldecode( $datos['data'] ), true );

				$monto = 0;//monto de la compra
				print_r($idFoods);
				foreach ( $idFoods as $food ) 
				{
					if( $food[ 'type' ] == 1 ) 
					{
						$this->setPedidoMenu( $food );
					}
					else if( $food[ 'type' ] == 2 )
					{
						$this->setPedidoPizza( $food );
					}//end if
					else if( $food[ 'type' ] == 3 )
					{
						$this->setPedidoBebida( $food );
					}
				}//end foreach
				
				$this->setMontoPedido();

			}//end if externo
		}//end setPedido

		//**********************************************************************************************


		private function setPedidoMenu( &$food )
		{
			$precio = Work::getRegister( 'Menus', 'precio', 'idMenu = '. $food[ 'id' ] );
			$precio = $precio[ 'precio' ];

			if( Work::existRegister( 'PedidosMenus', 'Pedidos_nroMesa = ' . $this->mesa . ' AND Menus_idMenu= ' . $food['id'] ) )
			{
				$currentAmount = Work::getRegister( 'PedidosMenus' , 'cantidad', 
					'Pedidos_nroMesa=' . $this->mesa . ' AND Menus_idMenu = ' . $food['id'] );

				$currentAmount = $currentAmount[ 'cantidad' ];
				$added = $food[ 'amount' ] - $currentAmount;

				Work::updateRegister( 'PedidosMenus', 'cantidad = ' . $food[ 'amount' ], 
					'Pedidos_nroMesa = '. $this->mesa . ' AND Menus_idMenu = ' . $food['id'] );

				$this->monto = $this->monto + ( $precio * $added );
			}				
			else
			{
				Work::setRegister( 'PedidosMenus', 
					'Pedidos_nroMesa, Menus_idMenu, cantidad', 
					$this->mesa . ', ' . $food[ 'id' ] . ', ' . $food[ 'amount'] );

				$this->monto = $this->monto + ( $precio * $food[ 'amount' ] );
			}

			
		}


		//***********************************************************************************************

		private function setPedidoPizza( &$food )
		{
			$precio = Work::getRegister( 'Pizzas', 'precio', 'idPizza = '. $food [ 'id' ]  );
			$precio = $precio[ 'precio' ];

			if( Work::existRegister( 'PedidosPizzas', 'Pedidos_nroMesa = ' . $this->mesa .  ' AND Pizzas_idPizza= ' . $food['id'] ) )
			{
				$currentAmount = Work::getRegister( 'PedidosPizzas' , 'cantidad', 
					'Pedidos_nroMesa=' . $this->mesa . ' AND Pizzas_idPizza = ' . $food['id'] );

				$currentAmount = $currentAmount[ 'cantidad' ];
				$added = $food[ 'amount' ] - $currentAmount;

				Work::updateRegister( 'PedidosPizzas', 'cantidad = ' . $food[ 'amount' ], 
					'Pedidos_nroMesa = '. $this->mesa . ' AND Pizzas_idPizza = ' . $food['id'] );

				$this->monto = $this->monto + ( $precio * $added );
			}
				
			else
			{
				Work::setRegister( 'PedidosPizzas',
					'Pedidos_nroMesa, Pizzas_idPizza, cantidad', 
					$this->mesa . ', ' . $food[ 'id' ] . ', ' . $food[ 'amount'] );

				$this->monto = $this->monto + ( $precio * $food[ 'amount' ] );
			}
		}


		//***********************************************************************************************


		private function setPedidoBebida( &$food )
		{
			$precio = Work::getRegister( 'Bebidas', 'precio', 'idBebida = '. $food [ 'id' ]  );
			$precio = $precio[ 'precio' ];

			if( Work::existRegister( 'PedidosBebidas', 'Pedidos_nroMesa = ' . $this->mesa .  ' AND Bebidas_idBebida= ' . $food['id'] ) )
			{
				$currentAmount = Work::getRegister( 'PedidosBebidas' , 'cantidad', 
					'Pedidos_nroMesa=' . $this->mesa . ' AND Bebidas_idBebida = ' . $food['id'] );

				$currentAmount = $currentAmount[ 'cantidad' ];
				$added = $food[ 'amount' ] - $currentAmount;

				Work::updateRegister( 'PedidosBebidas', 'cantidad = ' . $food[ 'amount' ], 
					'Pedidos_nroMesa = '. $this->mesa . ' AND Bebidas_idBebida = ' . $food['id'] );

				$this->monto = $this->monto + ( $precio * $added );
			}
				
			else
			{
				Work::setRegister( 'PedidosBebidas', 
					'Pedidos_nroMesa, Bebidas_idBebida, cantidad', 
					$this->mesa . ', ' . $food[ 'id' ] . ', ' . $food[ 'amount'] );

				$this->monto = $this->monto + ( $precio * $food[ 'amount' ] );
			}
		}


		//***********************************************************************************************

		private function setMontoPedido()
		{
			if( Work::existRegister( "Pedidos", "nroMesa = " . $this->mesa ) ) 
			{
				$montoExis = Work::getRegister( 'Pedidos', 'monto', 'nroMesa = ' . $this->mesa );
				$montoExis = $montoExis[ 'monto' ];
				$this->monto = $this->monto + $montoExis;
				Work::updateRegister( "Pedidos", "monto = " . $this->monto, "nroMesa = " . $this->mesa );
			}
			else
				Work::setRegister( 'Pedidos', 'nroMesa, monto', $this->mesa .', '. $this->monto );
		}

		
		//**********************************************************************************************


		//Obtiene los pedidos actuales de la mesa elegida
		public function getCartSelect( &$mesaElegida ) 
		{
			$this->getPedidosMenus( $mesaElegida );
			$this->getPedidosPizzas( $mesaElegida );
			$this->getPedidosBebidas( $mesaElegida );

			//Obtiene el monto total del pedido
			$this->datos[ 'monto' ] = Work::getRegister( 'Pedidos', 'monto', 'nroMesa = ' . $mesaElegida );
			$this->datos[ 'monto' ] = $this->datos[ 'monto' ][ 'monto' ];

			return $this->datos;
		}//end getCartSelect


		//***********************************************************************************

		private function getPedidosMenus( &$mesaElegida ) 
		{
			//Obtiene los pedidos, el precio y la cantidad
			$this->datos['pedidos'] = Work::execQuery(
				"SELECT m.nombreMenu, m.precio, m.idMenu, pm.cantidad
				FROM Menus as m
				INNER JOIN PedidosMenus as pm
				ON m.idMenu = pm.Menus_idMenu
				AND pm.Pedidos_nroMesa = $mesaElegida", true );

			for( $i = 0; $i < sizeof( $this->datos['pedidos'] ); $i++ )
			{
				if( $this->datos['pedidos'][ $i ][ 'cantidad' ] > 1 )
					$this->datos['pedidos'][$i]['precio'] = $this->datos['pedidos'][ $i ][ 'precio' ] * $this->datos['pedidos'][ $i ][ 'cantidad' ];
				$this->datos['pedidos'][ $i ][ 'tipo' ] = 1;
			}
		}//end getPedidosMenus

		//************************************************************************************

		private function getPedidosPizzas( &$mesaElegida )
		{
			$datos['pedidos'] = Work::execQuery(
				"SELECT p.nombrePizza, p.precio, p.idPizza, pp.cantidad
				FROM Pizzas as p
				INNER JOIN PedidosPizzas as pp
				ON p.idPizza = pp.Pizzas_idPizza
				AND pp.Pedidos_nroMesa = $mesaElegida", true );

			for( $i = 0; $i < sizeof( $datos['pedidos'] ); $i++ )
			{
				if( $datos['pedidos'][ $i ][ 'cantidad' ] > 1 )
					$datos['pedidos'][$i]['precio'] = $datos['pedidos'][ $i ][ 'precio' ] * $datos['pedidos'][ $i ][ 'cantidad' ];
				$datos['pedidos'][ $i ][ 'tipo' ] = 2;
			}
				

			$array = array_merge( $this->datos[ 'pedidos' ], $datos['pedidos'] );

			$this->datos[ 'pedidos' ] = $array;
		}//end getPeddidosPizzas

		//*************************************************************************************

		private function getPedidosBebidas( &$mesaElegida )
		{
			$datos['pedidos'] = Work::execQuery(
				"SELECT b.nombreBebida, b.precio, b.idBebida, pb.cantidad
				FROM Bebidas as b
				INNER JOIN PedidosBebidas as pb
				ON b.idBebida = pb.Bebidas_idBebida
				AND pb.Pedidos_nroMesa = $mesaElegida", true );

			for( $i = 0; $i < sizeof( $datos['pedidos'] ); $i++ )
			{
				if( $datos['pedidos'][ $i ][ 'cantidad' ] > 1 )
					$datos['pedidos'][$i]['precio'] = $datos['pedidos'][ $i ][ 'precio' ] * $datos['pedidos'][ $i ][ 'cantidad' ];
				$datos['pedidos'][ $i ][ 'tipo' ] = 3;
			}

			$array = array_merge( $this->datos[ 'pedidos' ], $datos['pedidos'] );

			$this->datos[ 'pedidos' ] = $array;
		}//end getPedidosBebidas
	}//end Pedidos