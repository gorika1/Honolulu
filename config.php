<?php

	return array(
		'Master Page' => array(
			'HEAD' 		=> 'head',
			'HEADER' 	=> 'header',
			'FOOTER' 	=> 'footer',
			'Extras'	=> array(
				'BAR' 			=> 'bar',
				'CATEGORIAS'	=> 'categorias',
				'DIALOG'		=> 'dialog'
			),
		),

		'server' => $_SERVER[ 'HTTP_HOST'].'/GearProjects/Honolulu',
	);

	//****************************************************************
	//*********************** VARIABLES GENERALES ********************
	//****************************************************************
	$login = new Login();
	$login->setFolder( 'media/html/cp-levels/' );