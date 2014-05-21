var generalInfoDom = '<h2 class="text-center">Bienvenido Usuario</h2>' +
'<div class="row">' +
	'<div class="col-md-8 col-md-offset-4">' +
		'<span class="general-information">' +
			'Hay <span>{Amount Mesas}</span>' +
		'</span>' +
		'<br />' +
		'<span class="general-information">' +
			'Hay <span>{Amount Cocina}</span> en la cocina' +
		'</span>' +
		'<br />' +
		'<span class="general-information">' +
			'Hay <span>{Amount Barra}</span> en la barra' +
		'</span>' +
	'</div>' +
'</div>';

var cocinaOrdersDom = '' +
'<div class="col-md-3" for="{Identificator}">' +
	'<div class="panel panel-primary">' +
		'<div class="panel-heading">' +
			'<h3 class="panel-title table-number">Mesa {Table}</h3>' +
		'</div>' +
		'<div class="panel-body">' +
			'<span class="food-amount-cocina">{Amount}</span>' +
			'{Food}' +
			'{Description}' +
		'</div>' +
		'<div class="panel-footer">' +
			'{Hour}' +
		'</div>' +
	'</div>' +
'</div>';

var currentOrders = {}; // save datas about the actual information in the list of order
var currentOrdersBarra = {};
var temporary = {};
var lastCocinaOrders = '';
var lastBarraOrders = '';