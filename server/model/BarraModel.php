<?php

	class Barra
	{
		private $orders;
		private $pizzas;

		public function getPedidos()
		{
			$this->orders = Work::getRegisters( 'PedidosBebidas', '*', 'cantidad > entregado', 'hora' );

			for( $i = 0; $i < sizeof( $this->orders ); $i++ )
			{
				$this->orders[ $i ][ 'drinkName' ] = $this->getDrinkById( $this->orders[ $i ][ 'Bebidas_idBebida' ] );
				$this->orders[ $i ][ 'identificator' ] = $this->orders[ $i ][ 'Pedidos_nroMesa' ] . $this->orders[ $i ][ 'Bebidas_idBebida' ];
				$this->orders[ $i ][ 'cantidad' ] = $this->orders[ $i ][ 'cantidad' ] - $this->orders[ $i ][ 'entregado' ];
				unset( $this->orders[ $i ][ 'Bebidas_idBebida' ] );
			}

			return $this->orders;
		}//end getPedidos

		//*************************************************************************************************

		public function closePedido( &$data = array() )
		{
			print_r($data);
			$delivered = $this->getDelivered( $data );

			$newDelivered = $delivered + $data[ 'amount' ];
			
			$this->setDelivered( $newDelivered, $data );

		}

		//**************************************************************************************************

		private function getDelivered( &$data )
		{
			$delivered = Work::getRegister( 'PedidosBebidas', 'entregado',
			'Pedidos_nroMesa = ' . $data[ 'mesa' ] . ' AND Bebidas_idBebida = ' . $data[ 'id' ] );
			

			$delivered = $delivered[ 'entregado' ];

			return $delivered;
		}

		//**************************************************************************************************

		private function setDelivered( &$amount, &$data )
		{
			Work::updateRegister( 'PedidosBebidas', 'entregado = ' . $amount,
			'Pedidos_nroMesa = ' . $data[ 'mesa' ] . ' AND Bebidas_idBebida = '  . $data[ 'id' ] );
		}


		//***************************************************************************************************

		private function getDrinkById( $id )
		{
			$name = Work::getRegister( 'Bebidas', 'nombreBebida', 'idBebida = ' . $id );
			$name = $name[ 'nombreBebida' ];

			return $name;

		}//end getMenuById
	}//end Cocina