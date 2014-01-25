<?php

	class IndexDrawing extends Drawing {

		private $menus;
		private $myListar;

		public function __construct()
		{
			parent::__construct();
			$this->myListar = new Listar();
		}
		
		public function drawLista( $idTipoMenu, $isAJAX = false )
		{

			$this->menus = $this->myListar->getLista( $idTipoMenu );
			$this->setList( 'menu' );

			//Por cada curso
			foreach( $this->menus as $menu ) {

				//Se almacena los siguientes elementos en list[]
				$this->list[] = array(
						'idMenu' => $menu[ 'idMenu' ],
						'Nombre' => $menu[ 'nombreMenu' ],
						'Ingredientes' => $menu[ 'stringIngredientes' ],
						'Precio' => $menu[ 'precio' ]
					);
				
			}//end foreach

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

	}//end CursosView

?>