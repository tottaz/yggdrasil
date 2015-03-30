/*
  --- menu level scope settins structure --- 
  note that this structure has changed its format since previous version.
  Now this structure has the same layout as Tigra Menu GOLD.
  Format description can be found in product documentation.
*/
var MENU_POS = [
{
	// item sizes
	'height': 25,
	'width': 150,
	// menu block offset from the origin:
	//	for root level origin is upper left corner of the page
	//	for other levels origin is upper left corner of parent item
	'block_top': 150,
	'block_left': 400,
	// offsets between items of the same level
	'top': 24,
	'left': 0,
	// time in milliseconds before menu is hidden after cursor has gone out
	// of any items
	'hide_delay': 200,
	'css' : {
		'inner' : 'minner',
		'outer' : ['moout', 'moover', 'modown']
	}
},
{
	'height': 280,
	'width': 363,
	'block_top': 10,
	'block_left': -363,
	'top': 21, 
	'css' : {
		'inner' : '',
		'outer' : ''
	}
}
]
