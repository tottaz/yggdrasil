/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 function source_loader(filename, type, callback) {
	type = type || "js";
	switch (type) {
		case "js":
			var source = document.createElement('script');
			source.setAttribute("type", "text/javascript");
			source.setAttribute("src", filename);
			break;
		case "css":
			var source = document.createElement("link");
			source.setAttribute("rel", "stylesheet");
			source.setAttribute("type", "text/css");
			source.setAttribute("href", filename);
			document.getElementsByTagName("head")[0].appendChild(source);
			break;
		default:
			//do nothing
			break;
	}
	if (callback) {
		if (navigator.appName.indexOf("Microsoft") != -1){
			source.onreadystatechange = function() {
				if ((this.readyState == 'complete')||(this.readyState == 'loaded')) {
					callback();
				}
			};
		}
		else
			source.onload = callback;
	}
	document.getElementsByTagName("head")[0].appendChild(source);
	return source;
}

/*! DEPENDS */
var depends = {
	js: [ 'spreadsheet.php?load=js' ],
	css: [
		'dhtmlx_core.css',
		'dhtmlxspreadsheet.css'
	]
};
if (window.cfg.skin === 'dhx_web') {
	depends.css.push('dhtmlxspreadsheet_dhx_web.css');
	depends.css.push('skins/dhtmlxgrid_dhx_web.css');
	depends.css.push('skins/dhtmlxtoolbar_dhx_web.css');
}

for (var i = 0; i < depends.js.length; i++)
	source_loader(window.cfg['dhx_rel_path'] + depends.js[i], 'js', onload_func);
for (var i = 0; i < depends.css.length; i++)
	source_loader(window.cfg['dhx_rel_path'] + depends.css[i], 'css');


/*! INITIALIZATION */
var dhx_sh;
function onload_func() {
	window.setTimeout(function() {
		dhx_sh = new window.dhtmlxSpreadSheet({
			load: window.cfg.load || window.cfg['dhx_rel_path'] + "php/data.php",
			save: window.cfg.save || window.cfg['dhx_rel_path'] + "php/data.php",
			parent: window.cfg.parent || null,
			icons_path: window.cfg['dhx_rel_path'] + "imgs/icons/",
			image_path: window.cfg['dhx_rel_path'] + "imgs/",
			skin: window.cfg.skin || 'dhx_skyblue',
			autowidth: typeof(window.cfg.autowidth) !== 'undefined' ? window.cfg.autowidth : false,
			autoheight: typeof(window.cfg.autoheight) !== 'undefined' ? window.cfg.autoheight : false,
			math: typeof(window.cfg.math) !== 'undefined' ? window.cfg.math : false
		});
		dhx_sh.load(window.cfg.sheet||"1", window.cfg.key||null);
	}, 1);
}