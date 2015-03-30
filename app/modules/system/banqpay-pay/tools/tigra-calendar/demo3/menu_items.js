/*
  --- menu items --- 
  note that this structure has changed its format since previous version.
  additional third parameter is added for item scope settings.
  Now this structure is compatible with Tigra Menu GOLD.
  Format description can be found in product documentation.
*/
var MENU_ITEMS = [
	['Inner HTML Demo'],
	['Tigra Menu PRO', null, null,
		[popup('<div style="text-decoration: none; font-family: Verdana, Geneva, Arial, Helvetica, sans-serif; font-size: 12px; color: black; margin: 4px;"><p><a href="http://www.softcomplex.com/products/tigra_menu_pro/" style="color: white; font-weight: bold;">Tigra Menu PRO additionally offers:</a><ul><li>Widest browser support on the market (4.x+)<li>Personal geometry for any menu item<li>Independent inner html for each state of item allows creating professionally looking graphical rollover effects<li>Frames, target windows, and pop-up tool tips are supported<li>Relative menu positioning, alignment (both vertical and horizontal)<li>Static menu positioning - menu can move as page is scrolled<li>Free setup support, free product updates, discounts for other products</ul></p></div>'), 'http://www.softcomplex.com/products/tigra_menu_pro/']
	],
	['Visit SoftComplex.com', null, null,
		[popup('<div style="text-decoration: none; font-family: Verdana, Geneva, Arial, Helvetica, sans-serif; font-size: 12px; color: black; margin: 4px;"><p><a href="http://www.softcomplex.com" style="color: white; font-weight: bold;">Softcomplex</a><p>Contact us at SoftComplex if you need any kind of software solution. For details visit our site at <p><a href="http://www.softcomplex.com/">www.softcomplex.com</a></div>'), 'http://www.softcomplex.com']
	]
];

/*
	This simple function is wrapper. It puts html around text given.
	You can write your own wrappers for higher efficiency and better
	code maintanability
*/
function popup (text) {
	return '<table border=0 cellpadding=0 cellspacing=0><tr><td><img border=0 src="01.gif" width=9 height=11></td><td background="02.gif"><img border=0 src="pixel.gif" width=261 height=11></td><td colspan=2 rowspan=2 valign="top"><img border=0 src="03.gif" width=89 height=167></td><td><img border=0 src="pixel.gif" width=1 height=11></td></tr><tr><td rowspan=2 background="04.gif"><img border=0 src="pixel.gif" width=9 height=200></td><td rowspan="2" bgcolor="#339933" valign="top" style="text-decoration: none;">'
		+ text + '</td><td><img border=0 src="pixel.gif" width=1 height=156></td></tr><tr><td background="05.gif"><img border=0 src="pixel.gif" width=13 height=200></td><td rowspan="2"><img border=0 src="pixel.gif" width=76 height=200></td><td><img border=0 src="pixel.gif" width=1 height=200></td></tr><tr><td><img border=0 src="06.gif" width=9 height=17></td><td background="07.gif"><img border=0 src="pixel.gif" width=1 height=17></td><td><img border=0 src="08.gif" width=13 height=17></td><td><img border=0 src="pixel.gif" width=1 height=17></td></tr></table>';
}