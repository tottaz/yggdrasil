/*
  --- menu level scope settins structure --- 
  note that this structure has changed its format since previous version.
  Now this structure has the same layout as Tigra Menu GOLD.
  Format description can be found in product documentation.
*/
var MENU_POS2 = [
{
	// item sizes
	'width': 160,
	'height': 20,
	// menu block offset from the origin:
	//	for root level origin is upper left corner of the page
	//	for other levels origin is upper left corner of parent item
	'block_top': 150,
	'block_left': 300,
	// offsets between items of the same level
	'top': 21,
	'left': 0,
	// time in milliseconds before menu is hidden after cursor has gone out
	// of any items
	'hide_delay': 200,
	'css' : {
		'inner' : 'minner',
		'outer' : ['moout', 'moover']
	}
},
{
	'width': 140,
	'block_top': 16,
	'block_left': -120
},
{
	'block_left': 130
}
]

