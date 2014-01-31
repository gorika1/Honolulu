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
			if( Work::existRegister( 'PedidosMenus', 'Pedidos_nroMesa = ' . $this->mesa . ' AND Menus_idMenu = ' . $food[ 'id' ] ) )
				Work::updateRegister( 'PedidosMenus', 'Menus_idMenu = ' . $food[ 'id' ], 'Pedidos_nroMesa = ' . $this->mesa);
			else
				Work::setRegister( 'PedidosMenus', 'Pedidos_nroMesa, Menus_idMenu', $this->mesa . ', ' . $food[ 'id' ] );

			$precio = Work::getRegister( 'Menus', 'precio', 'idMenu = '. $food[ 'id' ] );
			$precio = $precio[ 'precio' ];
			$this->monto = $this->monto + $precio;
		}


		//***********************************************************************************************

		private function setPedidoPizza( &$food )
		{
			if( Work::existRegister( 'PedidosPizzas', 'Pedidos_nroMesa = ' . $this->mesa . ' AND Pizzas_idPizza = ' . $food[ 'id' ] ) )
				Work::updateRegister( 'PedidosPizzas', 'Pizzas_idPizza = ' . $food[ 'id' ], 'Pedidos_nroMesa = ' . $this->mesa );
			else
				Work::setRegister( 'PedidosPizzas', 'Pedidos_nroMesa, Pizzas_idPizza', $this->mesa . ', ' . $food[ 'id' ] );

			$precio = Work::getRegister( 'Pizzas', 'precio', 'idPizza = '. $food [ 'id' ]  );
			$precio = $precio[ 'precio' ];
			$this->monto = $this->monto + $precio;
		}


		//***********************************************************************************************


		private function setPedidoBebida( &$food )
		{
			if( Work::existRegister( 'PedidosBebidas', 'Pedidos_nroMesa = ' . $this->mesa . ' AND Bebidas_idBebida = ' . $food[ 'id' ] ) )
				Work::updateRegister( 'PedidosBebidas', 'Pedidos_nroMesa = ' . $this->mesa . ' AND Bebidas_idBebida = ' . $food[ 'id' ] );
			else
				Work::setRegister( 'PedidosBebidas', 'Pedidos_nroMesa, Bebidas_idBebida', $this->mesa . ', ' . $food[ 'id' ] );

			$precio = Work::getRegister( 'Bebidas', 'precio', 'idBebida = '. $food [ 'id' ]  );
			$precio = $precio[ 'precio' ];
			$this->monto = $this->monto + $precio;
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
				"SELECT m.nombreMenu, m.precio, m.idMenu
				FROM Menus as m
				INNER JOIN PedidosMenus as pm
				ON m.idMenu = pm.Menus_idMenu
				AND pm.Pedidos_nroMesa = $mesaElegida", true );

			for( $i = 0; $i < sizeof( $this->datos['pedidos'] ); $i++ )
				$this->datos['pedidos'][ $i ][ 'tipo' ] = 1;
		}//end getPedidosMenus

		//************************************************************************************

		private function getPedidosPizzas( &$mesaElegida )
		{
			$datos['pedidos'] = Work::execQuery(
				"SELECT p.nombrePizza, p.precio, p.idPizza
				FROM Pizzas as p
				INNER JOIN PedidosPizzas as pp
				ON p.idPizza = pp.Pizzas_idPizza
				AND pp.Pedidos_nroMesa = $mesaElegida", true );

			for( $i = 0; $i < sizeof( $datos['pedidos'] ); $i++ )
				$datos['pedidos'][ $i ][ 'tipo' ] = 2;

			$array = array_merge( $this->datos[ 'pedidos' ], $datos['pedidos'] );

			$this->datos[ 'pedidos' ] = $array;
		}//end getPeddidosPizzas

		//*************************************************************************************

		private function getPedidosBebidas( &$mesaElegida )
		{
			$datos['pedidos'] = Work::execQuery(
				"SELECT b.nombreBebida, b.precio, b.idBebida
				FROM Bebidas as b
				INNER JOIN PedidosBebidas as pb
				ON b.idBebida = pb.Bebidas_idBebida
				AND pb.Pedidos_nroMesa = $mesaElegida", true );

			for( $i = 0; $i < sizeof( $datos['pedidos'] ); $i++ )
				$datos['pedidos'][ $i ][ 'tipo' ] = 3;

			$array = array_merge( $this->datos[ 'pedidos' ], $datos['pedidos'] );

			$this->datos[ 'pedidos' ] = $array;
		}//end getPedidosBebidas
	}//end Pedidos