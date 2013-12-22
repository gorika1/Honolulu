<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link href="js/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css" />
		<link rel="stylesheet" href="css/custom.css" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<title>Honolulu</title>
	</head>
	<body>
		<div class="navbar navbar-inverse navbar-fixed-top">
			<div class="navbar-header">	
				<img id="logo" src="images/icons/honolulu.png" alt="">			
				<a class="navbar-brand">Honolulu</a>
			</div>
		</div>
		<br><br><br>

		<div id="container" class="container">
			<div class="row">
				<div class="col-md-7 col-md-offset-2">
					<h3 class="text-center"><b>Menú</b></h3>
				</div>
			</div>

			<div class="row">
				<div class="col-md-2" id="options">
					<div class="bg-rect">
						<div class="active">
							<img src="images/icons/picadas.png">
						</div>
						<span class="option-name">Picadas</span>
					</div>
					<div class="bg-rect">
						<div>
							<img src="images/icons/pizzas.png" alt="">
						</div>
						<span class="option-name">Pizzas</span>
					</div>
					<div class="bg-rect">
						<div>
							<img src="images/icons/salads.png" alt="">
						</div>
						<span class="option-name">Salads</span>
					</div>
					<div class="bg-rect">
						<div>
							<img src="images/icons/bebidas.png" alt="">
						</div>
						<span class="option-name">Bebidas</span>
					</div>				
				</div>


				<div class="col-md-7">
					<div id="navigation">
						<?php
							for( $i = 0; $i < 5; $i++ )
							{
						?>
							<div class="food-container">
								<img src="http://placehold.it/120x120" class="food-img" />
								<div class="food-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, rerum, nam aut quae voluptatibus recusandae corporis ad fuga consequuntur eius explicabo ab eligendi commodi obcaecati alias iste blanditiis dignissimos.</div>
							</div>
						<?php
							}
						?>
					</div>
				</div>



				<div class="col-md-3" id="resumen-container">
					<div id="resumen">
						
					</div>
				</div>
			</div>
		</div>
		
		
		<script src="js/jquery.mCustomScrollbar.concat.min.js">
		</script>
		<script type="text/javascript">
			(function($){
				$(window).load(function(){
					$("#navigation").mCustomScrollbar({
						theme: 'dark',
						scrollButtons: {
							enable: true				
						},
					});
				});
			})(jQuery);
		</script>
	</body>
</html>