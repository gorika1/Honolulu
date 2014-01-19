<?php

	class Listar
	{
		public function getListaMenu( $idTipoMenu )
		{
			$lista;//almacena los elementos de las categorias (pizzas, menus y bebidas)
			$lista = Work::getRegisters( 'Menus', 'idMenu, nombreMenu, precio', 
				sprintf( 'TiposMenus_idTipoMenu=%s', 
						$idTipoMenu
					) );

			for( $i = 0; $i < sizeof( $lista ); $i++ )
			{				
				$lista[$i][ 'ingredientes' ] = $this->getIngredientes( $lista[$i][ 'idMenu'] );//almacena los ingredientes en un array
				$lista[$i][ 'stringIngredientes' ] = $this->getIngredientesAsString( $lista[$i][ 'ingredientes' ] );//almacena los ingredientes en string
			}
			
			return $lista;
		}//end getSalads


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
	}//end Listar