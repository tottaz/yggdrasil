/*
  --- menu items --- 
  note that this structure has changed its format since previous version.
  additional third parameter is added for item scope settings.
  Now this structure is compatible with Tigra Menu GOLD.
  Format description can be found in product documentation.
*/

var MENU_ITEMS = [
	['Home','home.html', {'tw' : 'content'}],
	['SoftComplex','http://www.softcomplex.com/', {'tw' : 'content'},
		['Services','http://www.softcomplex.com/services.html', {'tw' : 'content'}],
		['Download','http://www.softcomplex.com/download.html', {'tw' : 'content'}],
		['Order','http://www.softcomplex.com/order.html', {'tw' : 'content'}],
		['Support','http://www.softcomplex.com/support.html', {'tw' : 'content'}],
	],
	['Special Targets', null, null,
		['New Window','http://www.javascript-menu.com/', {'tw' : '_blank'}],
		['Parent Window','http://www.javascript-menu.com/', {'tw' : '_parent'}],
		['Same Frame','http://www.javascript-menu.com/', {'tw' : '_self'}],
	],
	['Another Item', null, null,
		['Level 1 Item 0','another.html', {'tw' : 'content'}],
		['Level 1 Item 1','another.html', {'tw' : 'content'}],
		['Level 1 Item 2','another.html', {'tw' : 'content'}],
		['Level 1 Item 3','another.html', {'tw' : 'content'}],
	],
];