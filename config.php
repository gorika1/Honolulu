<?php

	return array(
		'Master Page' => array(
			'HEAD' 		=> 'head',
			'HEADER' 	=> 'header',
			'FOOTER' 	=> 'footer',
			'Extras'	=> array(
				'BAR' 			=> 'bar',
				'CATEGORIAS'	=> 'categorias'
			),
		),

		'server' => $_SERVER[ 'HTTP_HOST'].'/Gear%20Projects/Honolulu',
	);

	//****************************************************************
	//*********************** VARIABLES GENERALES ********************
	//****************************************************************
	$login = new Login();
	$login->setFolder( 'media/html/cp-levels/' );