<?php

	class Cocina
	{
		private $orders;
		private $pizzas;

		public function getPedidos()
		{
			$this->orders = Work::getRegisters( 'PedidosMenus', '*', null, 'hora' );

			for( $i = 0; $i < sizeof( $this->orders ); $i++ ) 
			{
				$this->orders[ $i ][ 'foodName' ] = $this->getFoodById( $this->orders[ $i ][ 'Menus_idMenu' ], 1 );
			}

			$this->getPizzas();

			$this->orders = array_merge( $this->orders, $this->pizzas );

			return $this->orders;
		}//end getPedidos

		//**************************************************************************************************

		private function getPizzas()
		{
			$this->pizzas = Work::getRegisters( 'PedidosPizzas', '*', null, 'hora' );

			for( $i = 0; $i < sizeof( $this->pizzas ); $i++ )
			{
				$this->pizzas[ $i ][ 'foodName' ] = $this->getFoodById( $this->pizzas[ $i ][ 'Pizzas_idPizza' ], 2 );
			}//end for

		}//end getPizzas

		//***************************************************************************************************

		private function getFoodById( $id, $type )
		{
			if( $type == 1 ) // if it needs the menus
			{
				$name = Work::getRegister( 'Menus', 'nombreMenu', 'idMenu = ' . $id );
				$name = $name[ 'nombreMenu' ];
			}
			else //if it needs the pizzas
			{
				$name = Work::getRegister( 'Pizzas', 'nombrePizza', 'idPizza = ' . $id );
				$name = $name[ 'nombrePizza' ];
			}//end if...else

			return $name;

		}//end getMenuById
	}