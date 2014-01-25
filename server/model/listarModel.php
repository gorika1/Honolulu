<?php

	//Agregar la propiedad precio a la tabla Bebidas en la base de datos y luego obtener
	//ese dato tambien

	class Listar
	{
		private $lista;//almacena los elementos de las categorias (pizzas, menus y bebidas)

		public function getLista( $id )
		{
			//Si la peticion quiere las pizzas
			if( $id == 6 ) {
				$this->lista = Work::getRegisters( 'Pizzas', 'idPizza, nombreMenu, precio' );
			} else if( $id == 7 ) { //Si la peticion quiere las bebidas
				$this->lista = Work::getRegisters( 'Bebidas', 'idBebida, nombreBebida' );
			} else {
				$this->getListaMenu( $id );
			}//end if else interno

			return $this->lista;
		}//end getLista

		public function getListaMenu( $idTipoMenu )
		{			
			$this->lista = Work::getRegisters( 'Menus', 'idMenu, nombreMenu, precio', 
				sprintf( 'TiposMenus_idTipoMenu=%s', 
						$idTipoMenu
					) );

			for( $i = 0; $i < sizeof( $this->lista ); $i++ )
			{				
				$this->lista[$i][ 'ingredientes' ] = $this->getIngredientes( $this->lista[$i][ 'idMenu'] );//almacena los ingredientes en un array
				$this->lista[$i][ 'stringIngredientes' ] = $this->getIngredientesAsString( $this->lista[$i][ 'ingredientes' ] );//almacena los ingredientes en string
			}//end for
			return $this->lista;
		}//end getListaMenu

		public function getListaPizzas(){}


		public function getIngredientes( $idMenu )
		{
			$ingredientes = Work::execQuery( 
				"SELECT i.nombreIngrediente
				FROM IngredientesMenus as im
				INNER JOIN Menus as m
				ON im.Menus_idMenu = m.idMenu 
				AND m.idMenu = $idMenu
				INNER JOIN Ingredientes as i
				ON im.Ingredientes_idIngrediente = i.idIngrediente ", true );

			return $ingredientes;
		}//end getIngredientes


		public function getIngredientesAsString( $arrayIngredientes )
		{
			$string = '';
			for( $i = 0; $i < sizeof( $arrayIngredientes ); $i++ ) 
			{
				if( $i + 1 < sizeof( $arrayIngredientes ) ) //Si el indice actual no es el ultimo
					$string = $string . $arrayIngredientes[ $i ][ 'nombreIngrediente' ] . ', ';
				else
					$string = $string . $arrayIngredientes[ $i ][ 'nombreIngrediente' ];

			}//end for

			return $string;
		}//end getIngredientesAsString


		//Guarda el pedido cuando la mesa se haya cambiado
		public function setPedido( &$datos = array() )
		{
			if( isset( $datos[ 'before' ] ) && isset( $datos[ 'data' ] ) )
			{
				//$datos['before'] almacena la mesa que se cambio
				//$datos['current'] almacena la mesa seleccionada

				//Decodifica los idMenus
				$idMenus = json_decode( urldecode( $datos['data'] ) );

				$monto = 0;//monto de la compra

				foreach ( $idMenus as $id ) {
					if( Work::existRegister( 'PedidosMenus', 'Pedidos_nroMesa = ' . $datos[ 'before' ] . ' AND Menus_idMenu = ' . $id ) )
						Work::updateRegister( 'PedidosMenus', 'Menus_idMenu = ' . $id, 'Pedidos_nroMesa = ' . $datos[ 'before' ] );
					else
						Work::setRegister( 'PedidosMenus', 'Pedidos_nroMesa, Menus_idMenu', $datos[ 'before' ] . ', ' . $id );

					$precio = Work::getRegister( 'Menus', 'precio', 'idMenu = '. $id );
					$precio = $precio[ 'precio' ];
					$monto = $monto + $precio;
				}//end foreach

				//Si se efectuo algun pedido
				if( $monto > 0 ) {
					if( Work::existRegister( "Pedidos", "nroMesa = " . $datos[ 'before' ] ) ) 
						Work::updateRegister( "Pedidos", "monto = " . $monto, "nroMesa = " . $datos[ 'before' ] );
					else
						Work::setRegister( 'Pedidos', 'nroMesa, monto', $datos[ 'before' ] .', '. $monto );
				}//end if interno

			}//end if externo
			if( isset( $datos[ 'current' ] ) )
			{
				//Obtiene los pedidos ya hechos por la mesa elegida
				$pedido = $this->getCartSelect( $datos['current'] );
				return $pedido;
			}
		}//end setPedido
		
		
		//Obtiene los pedidos actuales de la mesa elegida
		public function getCartSelect( &$mesaElegida ) 
		{
			//Obtiene los pedidos, el precio y la cantidad
			$datos['pedidos'] = Work::execQuery(
				"SELECT m.nombreMenu, m.precio, m.idMenu
				FROM Menus as m
				INNER JOIN PedidosMenus as pm
				ON m.idMenu = pm.Menus_idMenu
				AND pm.Pedidos_nroMesa = $mesaElegida", true );

			//Obtiene el monto total del pedido
			$datos[ 'monto' ] = Work::getRegister( 'Pedidos', 'monto', 'nroMesa = ' . $mesaElegida );
			$datos[ 'monto' ] = $datos[ 'monto' ][ 'monto' ];
			return $datos;
		}//end getCartSelect
	}//end Listar