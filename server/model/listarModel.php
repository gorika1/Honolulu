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
				$this->getListaPizzas();
			} else if( $id == 7 ) { //Si la peticion quiere las bebidas
				$this->lista = Work::getRegisters( 'Bebidas', 'idBebida, nombreBebida' );
			} else {
				$this->getListaMenu( $id );
			}//end if else interno

			return $this->lista;
		}//end getLista


		//****************************************************************************************

		public function getListaMenu( $idTipoMenu )
		{			
			$this->lista = Work::getRegisters( 'Menus', 'idMenu, nombreMenu, precio', 
				sprintf( 'TiposMenus_idTipoMenu=%s', 
						$idTipoMenu
					) );

			for( $i = 0; $i < sizeof( $this->lista ); $i++ )
			{				
				$this->lista[$i][ 'ingredientes' ] = $this->getIngredientes( $this->lista[$i][ 'idMenu'], 1 );//almacena los ingredientes en un array
				$this->lista[$i][ 'stringIngredientes' ] = $this->getIngredientesAsString( $this->lista[$i][ 'ingredientes' ] );//almacena los ingredientes en string
			}//end for

		}//end getListaMenu

		//************************************************************************************************

		public function getListaPizzas(){
			$this->lista = Work::getRegisters( 'Pizzas', 'idPizza, nombrePizza, precio' );

			for( $i = 0; $i < sizeof( $this->lista ); $i++ )
			{
				$this->lista[ $i ][ 'ingredientes' ] = $this->getIngredientes( $this->lista[$i]['idPizza'], 2 );
				$this->lista[ $i ][ 'stringIngredientes' ] = $this->getIngredientesAsString( $this->lista[ $i ][ 'ingredientes' ] );
			}//end for
		}

		//*************************************************************************************************

		public function getIngredientes( $idMenu, $tipo )
		{
			//Si se quiere los ingredientes de un Menu
			if( $tipo == 1 ) {
				$ingredientes = Work::execQuery( 
					"SELECT i.nombreIngrediente
					FROM IngredientesMenus as im
					INNER JOIN Menus as m
					ON im.Menus_idMenu = m.idMenu 
					AND m.idMenu = $idMenu
					INNER JOIN Ingredientes as i
					ON im.Ingredientes_idIngrediente = i.idIngrediente ", true );

			} else if( $tipo == 2 ) {//Si se quiere los ingredientes de una pizza
				$ingredientes = Work::execQuery( 
					"SELECT i.nombreIngrediente
					FROM IngredientesPizzas as ip
					INNER JOIN Pizzas as p
					ON ip.Pizzas_idPizza = p.idPizza
					INNER JOIN Ingredientes as i
					ON ip.Ingredientes_idIngrediente = i.idIngrediente ", true );
			}

			return $ingredientes;
		}//end getIngredientes


		//********************************************************************************

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
			if( isset( $datos[ 'mesa' ] ) && isset( $datos[ 'data' ] ) )
			{
				//$datos['before'] almacena la mesa que se cambio
				//$datos['current'] almacena la mesa seleccionada
				
				//Decodifica los idMenus
				$idMenus = json_decode( urldecode( $datos['data'] ) );

				$monto = 0;//monto de la compra
				foreach ( $idMenus as $id ) {
					echo 'hola';
					if( Work::existRegister( 'PedidosMenus', 'Pedidos_nroMesa = ' . $datos[ 'mesa' ] . ' AND Menus_idMenu = ' . $id ) )
						Work::updateRegister( 'PedidosMenus', 'Menus_idMenu = ' . $id, 'Pedidos_nroMesa = ' . $datos[ 'mesa' ] );
					else
						Work::setRegister( 'PedidosMenus', 'Pedidos_nroMesa, Menus_idMenu', $datos[ 'mesa' ] . ', ' . $id );

					$precio = Work::getRegister( 'Menus', 'precio', 'idMenu = '. $id );
					$precio = $precio[ 'precio' ];
					$monto = $monto + $precio;
				}//end foreach

				//Si se efectuo algun pedido
				if( $monto > 0 ) {
					if( Work::existRegister( "Pedidos", "nroMesa = " . $datos[ 'mesa' ] ) ) 
						Work::updateRegister( "Pedidos", "monto = " . $monto, "nroMesa = " . $datos[ 'mesa' ] );
					else
						Work::setRegister( 'Pedidos', 'nroMesa, monto', $datos[ 'mesa' ] .', '. $monto );
				}//end if interno

			}//end if externo
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