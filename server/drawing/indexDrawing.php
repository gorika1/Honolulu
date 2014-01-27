<?php

	class IndexDrawing extends Drawing {

		private $myListar;

		public function __construct()
		{
			parent::__construct();
			$this->myListar = new Listar();
		}
		
		public function drawLista( $idTipoMenu, $isAJAX = false )
		{			
			$lista = $this->myListar->getLista( $idTipoMenu );
			$this->setList( 'menu' );

			if( $idTipoMenu == 6 ) {
				$this->pizzasList( $lista );
			} else {
				$this->menusList( $lista );
			}	

			//Si no es una peticion AJAX
			if( !$isAJAX )
			{
				$this->draw( 'Menus' );
			} 
			else
			{	
				$list[ 'Menus' ] = $this->list;
				$list[ 'DOM' ] = $this->template;
				return $list;
			}
		}

		//***********************************************************************

		public function menusList( $lista ) {
			//Por cada menu
			foreach( $lista as $menu ) {

				//Se almacena los siguientes elementos en list[]
				$this->list[] = array(
						'idMenu' => $menu[ 'idMenu' ],
						'Nombre' => $menu[ 'nombreMenu' ],
						'Ingredientes' => $menu[ 'stringIngredientes' ],
						'Precio' => $menu[ 'precio' ],
						'Type' => 1,
					);
				
			}//end foreach
		}//menusList


		//***************************************************************

		public function pizzasList( $lista ) {
			//Por cada pizza
			foreach( $lista as $pizza ) {

				//Se almacena los siguientes elementos en list[]
				$this->list[] = array(
						'idMenu' => $pizza[ 'idPizza' ],
						'Nombre' => $pizza[ 'nombrePizza' ],
						'Precio' => $pizza[ 'precio' ],
						'Ingredientes' => $pizza[ 'stringIngredientes' ],
						'Type' => 2					
					);
				
			}//end foreach
		}

	}//end CursosView

?>