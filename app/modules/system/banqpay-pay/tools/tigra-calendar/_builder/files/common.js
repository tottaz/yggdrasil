// Title: Tigra Menu Builder v1.0 (07/21/2005)
// Copyright (c)2005 Softcomplex, Inc. (www.softcomplex.com)

// --------------------------------------------------------------------------------
// check if document is loaded within the frameset, reload if needed
if (window == top) {
//	alert ('This document can not be used as stand alone HTML page, reloading the frameset...');
	window.location = '../index.html';
}

get_element = document.all ?
	function (s_id) { return document.all[s_id] } :
	function (s_id) { return document.getElementById(s_id) };

// --------------------------------------------------------------------------------
// define short references to the frames
var F_TABS  = parent.frames['f_tabs'],
	F_DATA  = parent.frames['f_data'],
	F_LIST  = parent.frames['f_list'],
	F_PROPS = parent.frames['f_props'];

// --------------------------------------------------------------------------------
// check if preload parameter is provided
var RE_URL = /id=(\d+)$/,
	RE_UNSINT = /^\d+$/,
	RE_SIGINT = /^\-?\d+$/,
	RE_ALPHA = /^[\w\d]+$/,
	RE_COPY = /^copy (\d+) of (.+)$/;
var N_ID = RE_URL.exec(window.location) ? RegExp.$1 : null;

// --------------------------------------------------------------------------------
// check if data frame is loaded
function check_loaded () {
	if (!F_DATA || !F_DATA.B_LOADED)
		document.write('loading...');
		document.close();
}
	
// --------------------------------------------------------------------------------
function style_template_property(n_id, s_property, n_state) {
	var a_property = F_DATA.A_STYLES_INDEX[n_id][s_property];
	
	if (typeof(a_property) == 'string' || typeof(a_property) == 'number')
		return a_property;

	// inherit data from previous state if not explicitly defined
	for (var i = n_state; i >= 0; i--)
		if (a_property[i] != null)
			return a_property[i];
}

// --------------------------------------------------------------------------------
function style_generate_css () {
	if (!F_DATA.A_STYLES) return;
	document.write('<style>');
	for (var i = 0; i < F_DATA.A_STYLES.length; i++) {
		var n_id = F_DATA.A_STYLES[i].n_id;
		for (var n_state = 0; n_state < 3; n_state++)
			document.write(
				'.stylePreviewI', n_id, 'S', n_state,
				' {background:', style_template_property(n_id, 'box_background_color', n_state),
				';border:', style_template_property(n_id, 'box_border_width', n_state),
				'px solid ', style_template_property(n_id, 'box_border_color', n_state),
				';padding:', style_template_property(n_id, 'box_padding', n_state),
				'px;color:', style_template_property(n_id, 'font_color', n_state),
				';font-family:', style_template_property(n_id, 'font_family', n_state),
				';font-size:', style_template_property(n_id, 'font_size', n_state),
				';font-weight:', (style_template_property(n_id, 'font_weight', n_state) ? 'bold':'normal'),
				';font-style:',  (style_template_property(n_id, 'font_style', n_state) ? 'italic':'normal'),
				';text-decoration:', (style_template_property(n_id, 'font_decoration', n_state) ? 'underline' : 'none'),
				';text-align:', style_template_property(n_id, 'text_align', n_state),
				';vertical-align:', style_template_property(n_id, 'text_valign', n_state),
				";}\n"
			);
	}
	document.write('</style>');
}

// --------------------------------------------------------------------------------
function style_reindex () {
	if (!F_DATA.A_STYLES) return;
	for (var i = 0; i < F_DATA.A_STYLES.length; i++) {
		var o_item = F_DATA.A_STYLES[i];
		o_item.n_order = i;
		if (o_item.n_id == null) {
			o_item.n_id = F_DATA.A_STYLES_INDEX.length;
			F_DATA.A_STYLES_INDEX[o_item.n_id] = o_item;
		}
		else if (!F_DATA.A_STYLES_INDEX[o_item.n_id])
			F_DATA.A_STYLES_INDEX[o_item.n_id] = o_item;
	}
}

// --------------------------------------------------------------------------------
function items_reindex (a_block) {
	if (!a_block) {
		a_block = F_DATA.A_ITEMS;
		F_DATA.A_INDEX = [];
	}
	for (var i = 0; i < a_block.length; i++) {
		a_block[i].n_id = F_DATA.A_INDEX.length;
		F_DATA.A_INDEX[a_block[i].n_id] = a_block[i];
		if (a_block[i].children)
			items_reindex(a_block[i].children);
	}
}

// --------------------------------------------------------------------------------
function style_item_refs (n_id) {
	if (!F_DATA.A_INDEX.length)
		items_reindex();
	var a_list = [];
	for (var i = 0; i < F_DATA.A_INDEX.length; i++)
		if (F_DATA.A_INDEX[i]['style_template'] == n_id)
				a_list[a_list.length] = F_DATA.A_INDEX[i].n_id;
	return a_list;
}

// --------------------------------------------------------------------------------
// searches for the references to the style with id: n_id in levels up to n_maxdepth

function style_level_refs (n_id, n_maxdepth) {
	// get maximum depth of the hierarchy
	var a_list = [];
	for (var i = 0; i <= n_maxdepth && i < F_DATA.A_TPL.length; i++)
		if (F_DATA.A_TPL[i] && F_DATA.A_TPL[i]['level_style'] == n_id)
				a_list[a_list.length] = i;
	return a_list;
}

// --------------------------------------------------------------------------------
// escape apostropes and slashes to text can be safely inserted into ''
function text_escape (s_text) {
	s_text = s_text.replace(/\\/g, '\\\\');
	s_text = s_text.replace(/\'/g, '\\\'');
	return s_text;
}

// --------------------------------------------------------------------------------
// fills in the template with the property values
function text_subst (o_item, s_property) {
	if (!s_property['subst'])
		return o_item[s_property['prop']]
	var s_text = o_item[s_property['prop']].replace(/\%c/g, o_item.text_caption);
	return s_text.replace(/\%l/g, o_item.link_href);
}

// --------------------------------------------------------------------------------
// uniformly sets the value fo the input box or select box
function set_formfield (e_input, s_value) {
	if (!e_input)
		return false;
	if (s_value == null)
		s_value = '';
		
	// preset select boxes
	if (e_input.options) {
		for (var n_option = 0; n_option < e_input.options.length; n_option++)
			e_input.options[n_option].selected = (
				(e_input.options[n_option].value != null
				&& e_input.options[n_option].value == s_value) ||
				e_input.options[n_option].text == s_value
			)
	}
	// preset input boxes
	else {
		e_input.value = s_value;
	}
	return true;
}

// --------------------------------------------------------------------------------
// uniformly reads the value fo the input box or select box
function get_formfield (e_input) {
	var s_value;
	if (e_input.options)
		s_value = e_input.options[e_input.selectedIndex].value == null
			? e_input.options[e_input.selectedIndex].text
			: e_input.options[e_input.selectedIndex].value;
	else
		s_value = e_input.value;
		n_value = Number(s_value); 
		return (isNaN(n_value) ? s_value : n_value);
}

// --------------------------------------------------------------------------------
function f_feature_help (n_article) {

	var obj_calwindow = window.open(
		'../help/' + n_article + '.html',
		'Help', 'width=380,height=400,status=no,scrollbars=yes,resizable=no,top=200,left=300'
	);
	obj_calwindow.opener = window;
	obj_calwindow.focus();

}
function f_help (n_article) {

	var obj_calwindow = window.open(
		'help/' + n_article + '.html',
		'Help', 'width=380,height=400,status=no,scrollbars=yes,resizable=no,top=200,left=300'
	);
	obj_calwindow.opener = window;
	obj_calwindow.focus();
}

// --------------------------------------------------------------------------------
// highlight active navigation tab
function tab_active (s_tab) {
	if (F_TABS.s_tabactive) {
		F_TABS.s_tabover = F_TABS.s_tabactive;
		F_TABS.s_tabactive = null;
		F_TABS.tab_out();
	}
	F_TABS.s_tabactive = s_tab;
	F_TABS.tab_over(s_tab);
}

// --------------------------------------------------------------------------------
// checks if the template with ID provided is compatible with currently selected mode
function tpl_iscompatible (n_id) {
	return Boolean(F_DATA.A_TEMPLATES[n_id].n_modes & Math.pow(2,F_DATA.N_MODE));
}

// --------------------------------------------------------------------------------
// prepares items structure for saving by creating its copy 
// without tree specific data and recursive links
var a_skipkeys = {'children': 1, 'o_parent': 1, 'o_root': 1, 'n_depth': 1, 'n_order': 1, 'b_opened': 1, 'n_id': 1, 'get_icon': 1, 'select': 1, 'init': 1, 'is_last': 1, 'open': 1, 'temp': 1, 'path': 1 }

function prepare_items (a_items) {
	var a_copy = [];
	for (var i = 0; i < a_items.length; i++) {
		if (a_items[i]['temp']) break;
		var o_newitem = {}
		for (var s_key in a_items[i]) {
			if (a_skipkeys[s_key]) continue;
			o_newitem[s_key] = a_items[i][s_key];
		}
		if (a_items[i]['children']) {
			var a_children = prepare_items(a_items[i]['children']);
			if (a_children.length)
				o_newitem['children'] = a_children;
		}
		a_copy[a_copy.length] = o_newitem;
	}
	return a_copy;
}

// --------------------------------------------------------------------------------
// dumps complex javascript structure into the text string
function dump_var (u_var, n_depth) {

	if (n_depth == null)
		n_depth = 0;

	var s_tabs = "\n";
	for (var i = 0; i < n_depth; i++)
		s_tabs += "\t";
		
	n_depth++;
	// verify type
	if (typeof(u_var) == 'string' && u_var == '')
		return "''"
	else if (typeof(u_var) == 'number' || (typeof(u_var) == 'string' && !isNaN(Number(u_var))))
		return u_var;
	else if (typeof(u_var) == 'string')
		return "'" + text_escape(u_var) + "'";
	else if (typeof(u_var) == 'boolean')
		return (u_var ? 'true' : 'false');
	else if (typeof(u_var) == 'undefined' || u_var == null)
		return 'null';
	else if (typeof(u_var) == 'function')
		return 'function () {alert(\'function was not saved\')}';
	else if (typeof(u_var) != 'object') {
		alert('error');
		return '';
	}
	
	// detect numeric or symbolic keys
	var b_hash = false;
	for (var i in u_var)
		if (isNaN(Number(i))) {
			b_hash = true;
			break;
		}

	var s_output = '',
		b_first = true;
	if (b_hash) {
		s_output += "{";
		for (var i in u_var) {
			s_output += (b_first ? '' : ",") + s_tabs + "\t'" + i + "': " + dump_var(u_var[i], n_depth);
			b_first = false;
		}
		s_output += s_tabs + "}";
	}
	else {
		var b_newlines = false,
			a_output = [];
		for (var i = 0; i < u_var.length; i++) {
			a_output[i] = dump_var(u_var[i], n_depth);
			if (String(a_output[i]).indexOf("\n") != -1)
				b_newlines = true;
		}
		if (b_newlines)
			s_output += '[' + s_tabs + "\t" + a_output.join(',' + s_tabs + "\t") + s_tabs +']';
		else
			s_output += '[' + a_output.join(',') + ']';

	}
	return s_output;
}

// --------------------------------------------------------------------------------
function mark_dirty () { F_DATA.B_DIRTY = true; }
function mark_saved () { F_DATA.B_DIRTY = false; }

// --------------------------------------------------------------------------------

