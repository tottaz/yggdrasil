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
	'width': 140,
	// menu block offset from the origin:
	//	for root level origin is upper left corner of the page
	//	for other levels origin is upper left corner of parent item
	'block_top': 15,
	'block_left': 300,
	// offsets between items of the same level
	'top': 24,
	'left': 0,
	// time in milliseconds before menu is hidden after cursor has gone out
	// of any items
	'hide_delay': 200,
	'css' : {
		'outer' : ['m0l0oout', 'm0l0oover'],
		'inner' : ['m0l0iout', 'm0l0iover']
	}	
},
{
	'width': 120,
	'block_left': 30,
	'css' : {
		'outer' : ['m0l1oout', 'm0l1oover'],
		'inner' : ['m0l1iout', 'm0l1iover']
	}
}
];