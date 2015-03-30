// Title: Tigra Menu Builder v1.0 (07/21/2005)
// Copyright (c)2005 Softcomplex, Inc. (www.softcomplex.com)

// --------------------------------------------------------------------------------
// process URL parameters
var RE_ID = /\?id=(\d+)/, N_ID;
if (RE_ID.exec(window.location))
	N_ID = RegExp.$1
else
	alert("Template ID not found in the URL");

var RE_CMD = /cmd=(\w+)$/;
if (RE_CMD.exec(window.location)) {
	if (RegExp.$1 == 'merge')
		tpl_merge(N_ID);
	else if (RegExp.$1 == 'select')
		tpl_select(N_ID);
	else
		alert ('Unknown template command: ' + RegExp.$1);
}

// --------------------------------------------------------------------------------
function tpl_copy_styles () {
	var A_GSTYLES  = parent.frames['f_data'].A_STYLES,
		A_STYLE_PROPERTIES = parent.frames['f_data'].A_STYLE_PROPERTIES,
		A_STINDEX = {},
		A_IGNORED = [];

	// index existing style names
	for (var i = 0; i < A_GSTYLES.length; i++)
		A_STINDEX[A_GSTYLES[i]['name']] = 1;
	
	// run through the list of the styles of current template
	for (var i = 0; i < A_STYLES.length; i++) {
		// check if style with the same name already exists
		if (A_STINDEX[A_STYLES[i]['name']]) {
			A_IGNORED[A_IGNORED.length] = A_STYLES[i]['name'];
			continue;
		}
		// copy the style properties one by one
		var o_copy = {};
		for (var p = 0; p < A_STYLE_PROPERTIES.length; p++)
			o_copy[A_STYLE_PROPERTIES[p]] = A_STYLES[i][A_STYLE_PROPERTIES[p]];
	
		A_GSTYLES[A_GSTYLES.length] = o_copy;
	}
	style_reindex ();
	if (A_IGNORED.length)
		alert("Following styles weren't added because styles with the same\nnames already exist in your menu configuration:\n-"
			+ A_IGNORED.join("\n-"));
}

// --------------------------------------------------------------------------------
function tpl_set (param) {
	var F_DATA = parent.frames['f_data'];
	// reset all configuration structures
	F_DATA.A_STYLES = [];
	F_DATA.A_MENU   = [];
	F_DATA.A_STYLES_INDEX = [];
	
	// copy styles
	tpl_copy_styles();

	// copy level settings
	var A_TPL  = get_template(param), A_GTPL = [];
	for (var i = 0; i < A_TPL.length; i++) {
		A_GTPL[i] = {};
		for (var p in A_TPL[i])
			A_GTPL[i][p] = A_TPL[i][p];
	}
	parent.frames['f_data'].A_TPL = A_GTPL;
	
	// copy menu settings
	for (var p in A_MENU)
		F_DATA.A_MENU[p] = A_MENU[p];
}

// --------------------------------------------------------------------------------
function style_reindex () {
	var F_DATA = parent.frames['f_data'];
	if (!F_DATA.A_STYLES) return;
	for (var i = 0; i < F_DATA.A_STYLES.length; i++) {
		var o_item = F_DATA.A_STYLES[i];
		o_item.n_order = i;
		if (o_item.n_id == null) {
			o_item.n_id = F_DATA.A_STYLES_INDEX.length;
			F_DATA.A_STYLES_INDEX[o_item.n_id] = o_item;
		}
	}
}

// --------------------------------------------------------------------------------
// form button commands
function inp_merge () {
	parent.frames['f_list'].tpl_merge(N_ID);
}
function inp_select () {
	parent.frames['f_list'].tpl_select(N_ID);
}

// --------------------------------------------------------------------------------
// sets the inputs
function inp_set () {
	if (!document.forms['tpl_view'] || !parent.frames['f_data'].A_TPL)
		return;
	// layout radiobutton
	var a_radio = document.forms['tpl_view'].elements['layout'],
		s_layout = (parent.frames['f_data'].A_TPL[0] && parent.frames['f_data'].A_TPL[0]['level_layout'] == 'v' ? 'vertical' : 'horizontal');;
	for (var i = 0; i < a_radio.length; i++)
		if (a_radio[i].value == s_layout) {
			a_radio[i].checked = true;
			img_rollover(a_radio[i]);
		}
		
	// merge button
	document.forms['tpl_view'].elements['merge'].disabled = (parent.frames['f_data'].N_TPL == null);
}

// --------------------------------------------------------------------------------
