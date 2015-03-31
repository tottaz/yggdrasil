/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 var SpreadSheetConfig = {
	init:function(){
		if (!SpreadSheetConfig.win){

			var str = "<div class='spread_config_cont'>";
			str += "<div>";
			str += "<label for='spread_config_rows' class='spread_config'>Rows number:</label>";
			str += "<input type='text' id='spread_config_rows' value='' class='spread_config' />";
			str += "</div><div>";
			str += "<label for='spread_config_cols' class='spread_config'>Columns number:</label>";
			str += "<input type='text' id='spread_config_cols' value='' class='spread_config' />";
			str += "</div><div>";
			str += "<input type='checkbox' id='show_row_numbers' value='' class='' />";
			str += "<label for='show_row_numbers' class='checkbox'>Show row numbers</label>";
			str += "</div><div>";
			str += "<input type='checkbox' id='show_export_buttons' value='' class='' />";
			str += "<label for='show_export_buttons' class='checkbox'>Show export buttons</label>";
			str += "</div><div>";
			str += "<input type='button' id='spread_config_save' value='OK' class='spread_config spread_config_button'>";
			str += "<input type='button' id='spread_config_cancel' value='Cancel' class='spread_config spread_config_button' />";
			str += "</div>";
			str += "</div>";

			var d = SpreadSheetConfig.win = document.createElement("DIV");
			d.className = "dhx_spread_window";
			d.style.display="none";
			document.body.appendChild(d);
			d.innerHTML = str;

			var save = document.getElementById("spread_config_save");
			dhtmlxEvent(save, "click", function() {
				var config = SpreadSheetConfig.get();
				SpreadSheetConfig.callback.refresh(config);
				SpreadSheetConfig.hide();
			});
			var cancel = document.getElementById("spread_config_cancel");
			dhtmlxEvent(cancel, "click", function() {
				SpreadSheetConfig.hide();
			});
		}
		return SpreadSheetConfig;
	},
	show: function(callback, x, y) {
		SpreadSheetConfig.callback = callback;
		var pos = SpreadSheetConfig.get_pos(callback.settings.parent.parent);

		var width = callback.settings.parent.grid.offsetWidth;
		var height = callback.settings.parent.toolbar.offsetHeight + callback.settings.parent.grid.offsetHeight;
//		SpreadSheetModal.size(width, height);
		SpreadSheetModal.show(callback.settings.parent.parent);

		SpreadSheetConfig.set_pos(x, y);
		SpreadSheetConfig.win.style.display="";
		document.getElementById('spread_config_rows').focus();
	},

	hide: function() {
		SpreadSheetModal.hide();
		SpreadSheetConfig.win.style.display="none";
		SpreadSheetConfig.callback = null;
	},

	get: function() {
		var config = {};
		config.rows = parseInt(document.getElementById('spread_config_rows').value, 10);
		config.cols = parseInt(document.getElementById('spread_config_cols').value, 10);
		config.show_row_numbers = document.getElementById('show_row_numbers').checked;
		config.show_export_buttons = document.getElementById('show_export_buttons').checked;
		return config;
	},

	set: function(config) {
		document.getElementById('spread_config_rows').value = config.rows;
		document.getElementById('spread_config_cols').value = config.cols;
		document.getElementById('show_row_numbers').checked = (config.show_row_numbers == 1) ? true : false;
		document.getElementById('show_export_buttons').checked = (config.show_export_buttons == 1) ? true : false;
	},

	set_pos: function(x, y) {
		SpreadSheetConfig.win.style.left = x + "px";
		SpreadSheetConfig.win.style.top = y + "px";
	},

	/*! returns position of html object
		@param e
			html object
		@return
			object { x: left, y: top }
	*/
	get_pos: function (e) {
		var left = 0;
		var top  = 0;
		while (e.offsetParent) {
			left += e.offsetLeft - e.scrollLeft;
			top  += e.offsetTop - e.scrollTop;
			e     = e.offsetParent;
		}

		left += e.offsetLeft;
		top  += e.offsetTop;
		return {x:left, y:top};
	}
};