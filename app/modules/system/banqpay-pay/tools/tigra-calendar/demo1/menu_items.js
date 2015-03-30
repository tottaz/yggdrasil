/*
  --- menu items --- 
  note that this structure has changed its format since previous version.
  additional third parameter is added for item scope settings.
  Now this structure is compatible with Tigra Menu GOLD.
  Format description can be found in product documentation.
*/
var MENU_ITEMS = [
	['Menu Compatibility', null, null,
		['Supported Browsers', null, null,
			['Win32 Browsers', null, null, 
				['Internet Explorer 5+'],
				['Netscape 6.0+'],
				['Mozilla 0.9+'],
				['AOL 5+'],
				['Opera 5+']
			],
			['Mac OS Browsers', null, null,
				['Internet Explorer 5+'],
				['Netscape 6.0+'],
				['Mozilla 0.9+'],
				['AOL 5+'],
				['Safari 1.0+']
			],
			['KDE (Linux, FreeBSD)', null, null,
				['Netscape 6.0+'],
				['Mozilla 0.9+']
			]
		],
		['Unsupported Browsers', null, null,
			['Internet Explorer 4.x'],
			['Netscape 4.x']
		],
		['Report test results', 'http://www.softcomplex.com/support.html'],
	],
	['Docs & Info', null, null,
		['Product Page', 'http://www.javascript-menu.com/'],
		['Welcome Page', '../'],
		['Documentation', 'http://www.javascript-menu.com/docs/'],
		['Forums', 'http://www.softcomplex.com/forum/forumdisplay.php?fid=29'],
		['TM Comparison Table', 'http://www.javascript-menu.com/docs/compare_menus.html'],
		['Online Menu Builder', 'http://www.javascript-menu.com/builder/'],
	],
	['Product Demos', null, null,
		['Traditional Blue', '../demo1/index.html'],
		['White Steps', '../demo2/index.html'],
		['Inner HTML', '../demo3/index.html'],
		['All Together', '../demo4/index.html'],
		['Frames Targeting', '../demo5/index.html']
	],
	['Contact', null, null,
		['E-mail', 'http://www.softcomplex.com/support.html'],
		['ICQ: 31599891'],
		['Y! ID: softcomplex'],
		['AIM ID: softcomplex']
	],
];

