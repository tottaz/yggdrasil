// Title: Tigra Menu Builder v1.0 (07/21/2005)
// Copyright (c)2005 Softcomplex, Inc. (www.softcomplex.com)

// --------------------------------------------------------------------------------
var A_ITEMKEYS  = [
	{'key': 'tw', 'prop': 'link_target',    'subst': false},
	{'key': 'sb', 'prop': 'text_statusbar', 'subst': true}
];

function export_item_scope (o_item, a_children, b_preview) {
	var a_output = [];
	for (var i = 0; i < A_ITEMKEYS.length; i++) {

		// set targets to 'link_preview' if in preview mode
		if (b_preview && A_ITEMKEYS[i]['prop'] == 'link_target' && o_item['link_href']) {
			a_output[a_output.length] = "'" + A_ITEMKEYS[i]['key'] + "':'link_preview'"
			continue;
		}

		if (o_item[A_ITEMKEYS[i]['prop']]) {
			var s_value = text_subst(o_item, A_ITEMKEYS[i]);
			a_output[a_output.length] = "'" + A_ITEMKEYS[i]['key'] + "':"
				+ (isNaN(Number(s_value))
				? "'" + text_escape(s_value) + "'"
				: s_value);
		}
	}
	if (!a_output.length && !a_children)
		return ''
	if (!a_output.length)
		return ', null'

	return ', {' + a_output.join(',') + '}';
}

// --------------------------------------------------------------------------------
// generates the items structure
//	this function should be called first as it sets global variable N_MAXDEPTH
//	which is later used by other functions

var N_MAXDEPTH = 0;

function export_items (a_block, n_depth, b_preview) {

	if (!a_block || !a_block.length)
		return false;
	if (a_block[a_block.length - 1].temp) {
		a_block.length = a_block.length - 1;
		if (!a_block.length)
			return false;
	}

	// store maximum depth to avoid generating information for not existing items
	if (n_depth > N_MAXDEPTH) N_MAXDEPTH = n_depth;
	n_depth++;
	var o_item,
		a_children,
		s_output = '',
		s_tabs = "\n";

	for (var i = 0; i < n_depth; i++)
		s_tabs += "\t";
		
	for (var i = 0; i < a_block.length; i++) {
		o_item = a_block[i];

		a_children = export_items (o_item.children, n_depth, b_preview);
		s_output += s_tabs;
	
		s_output +=
			"['" + text_escape(o_item['text_caption']) + "', "
			+ (o_item['link_href'] ? "'" + text_escape(o_item['link_href']) + "'" : 'null')
			+ export_item_scope(o_item, a_children, b_preview)
			+ (a_children ? ',' + a_children + s_tabs : '')
			+ "]"
			+ (i == a_block.length -1 ? '' : ',');
	}
	return s_output;
}

// --------------------------------------------------------------------------------
// generates CSS for the menu
//	this function should be called before template generation as it generates
//	names of the css classes used in the template

var a_states = ['normal', 'hover', 'click'];

function export_styles (a_styles) {
	if (!a_styles || !a_styles.length)
		return '';

	style_reindex();
	items_reindex();
	
	var s_class,
		a_styles_cache = [];

	for (var i = 0; i < a_styles.length; i++) {
		var n_id = a_styles[i].n_id;
		
		// check if current style is referenced by any levels
		var a_references = style_level_refs(n_id, N_MAXDEPTH)
		if (!a_references.length)
			continue;
		
		a_styles[i]['classes_i'] = [];
		a_styles[i]['classes_o'] = [];

		for (var n_state = 0; n_state < 3; n_state++) {

			// generate the properties for the inner tag
			var s_cssprops = "\tfont-family: "
				+ style_template_property(n_id, 'font_family', n_state) +  ";\n\tcolor: "
				+ style_template_property(n_id, 'font_color', n_state) + ";\n\tfont-size: "
				+ style_template_property(n_id, 'font_size', n_state) + "px;\n\tfont-weight: "
				+ (style_template_property(n_id, 'font_weight', n_state) ? 'bold':'normal') + ";\n\tfont-style: "
				+ (style_template_property(n_id, 'font_style', n_state) ? 'italic':'normal') + ";\n\ttext-decoration: "
				+ (style_template_property(n_id, 'font_decoration', n_state) ? 'underline' : 'none') + ";\n",
			s_class = null;

			// avoid duplicate css classes by looking up the properties in the cache
			var a_cache_entry;
			for (var n_cidx = 0; n_cidx < a_styles_cache.length; n_cidx++)
				if (a_styles_cache[n_cidx]['props'] == s_cssprops) {
					a_cache_entry = a_styles_cache[n_cidx];
					s_class = a_cache_entry['class'];
					break;
				}

			// assign the new name if unique properties
			if (!s_class) {
				s_class = 'TM' + a_styles[i].n_id + 'i' + n_state;
				a_cache_entry = {
					'class' : s_class,
					'props' : s_cssprops,
					'name'  : a_styles[i].name,
					'tag'   : 'text',
					'states': []
				};
				a_styles_cache[a_styles_cache.length] = a_cache_entry;
			}
			a_cache_entry['states'][n_state] = true;

			// save the name for further reference in template
			a_styles[i]['classes_i'][n_state] = s_class;
			
			// generate the properties for the outer tag
			s_cssprops = "\tbackground: "
				+ style_template_property(n_id, 'box_background_color', n_state) + ";\n\tborder: "
				+ style_template_property(n_id, 'box_border_width', n_state) + 'px solid '
				+ style_template_property(n_id, 'box_border_color', n_state) + ";\n\tpadding: "
				+ style_template_property(n_id, 'box_padding', n_state) + "px;\n\ttext-align: "
				+ style_template_property(n_id, 'text_align', n_state) + ";\n\tvertical-align: "
				+ style_template_property(n_id, 'text_valign', n_state) + ";\n\t"
				+ 'text-decoration: none;\n';
			s_class = null;

			// avoid duplicate css classes by looking up the properties in the cache
			for (var n_cidx = 0; n_cidx < a_styles_cache.length; n_cidx++)
				if (a_styles_cache[n_cidx]['props'] == s_cssprops) {
					a_cache_entry = a_styles_cache[n_cidx];
					s_class = a_cache_entry['class'];
					break;
				}

			// assign the new name if unique properties
			if (!s_class) {
				s_class = 'TM' + a_styles[i].n_id + 'o' + n_state;
				a_cache_entry = {
					'class' : s_class,
					'props' : s_cssprops,
					'name'  : a_styles[i].name,
					'tag'   : 'box',
					'states': []
				};
				a_styles_cache[a_styles_cache.length] = a_cache_entry;
			}
			a_cache_entry['states'][n_state] = true;

			// save the name for further reference in template
			a_styles[i]['classes_o'][n_state] = s_class;
		}
	}
	
	// prepare output
	var s_output = '';
	for (var i = 0; i < a_styles_cache.length; i++) {
		var a_forstates = [];
		for (n_state = 0; n_state < 3; n_state++)
			if (a_styles_cache[i]['states'][n_state])
				a_forstates[a_forstates.length] = a_states[n_state];
	
		s_output +=
			"/* " + a_styles_cache[i]['name'] + 
			"; " + a_styles_cache[i]['tag'] + " properties for states: " +
			a_forstates.join(', ') + " */\n." +
			a_styles_cache[i]['class'] + " {\n" +
			a_styles_cache[i]['props'] + "}\n\n";
	}
	return s_output;
}

// --------------------------------------------------------------------------------
// generates the menu template structure
//	this function must be called after the items and styles

var A_LEVELKEYS  = [
	{'key': 'width',      'prop': 'level_width'},
	{'key': 'height',     'prop': 'level_height'},
	{'key': 'block_left', 'prop': 'level_bleft'},
	{'key': 'block_top',  'prop': 'level_btop'},
	{'key': 'left',       'prop': 'level_left'},
	{'key': 'top',        'prop': 'level_top'},
	{'key': 'hide_delay', 'prop': 'time_hide'},
	{'key': 'expd_delay', 'prop': 'time_expand'}
];

function export_template (a_menu, a_tpl, a_styles_index) {
	if (!a_menu) return '';

	var a_normtpl = [];
	for (var i = 0; i <= N_MAXDEPTH && i < a_tpl.length; i++) {
		// skip fully inherited levels
		if (!a_tpl[i])
			continue;

		for (var n_key = 0; n_key < A_LEVELKEYS.length; n_key++) {
			var s_value = a_tpl[i][A_LEVELKEYS[n_key]['prop']];
			if (s_value == null || s_value == 'i')
				continue;
	
			if (!a_normtpl[i])
				a_normtpl[i] = {};

			a_normtpl[i][A_LEVELKEYS[n_key]['key']] = s_value;
		}
		// add styles
		if (a_tpl[i]['level_style'] != null && a_tpl[i]['level_style'] != 'i') {

			if (!a_normtpl[i])
				a_normtpl[i] = {};
				
			if (a_tpl[i]['level_style'] == '-') {
				a_normtpl[i]['css'] = {'inner' : '', 'outer' : ''};
				continue;
			}
		
			var a_classes = a_styles_index[a_tpl[i]['level_style']]['classes_i'],
				a_css;
			if (a_classes[2] == a_classes[1] && a_classes[1] == a_classes[0])
				a_css = a_classes[0];
			else if (a_classes[2] == a_classes[1])
				a_css =  [a_classes[0], a_classes[1]];
			else
				a_css = a_classes;

			a_normtpl[i]['css'] = {'inner' : a_css};

			a_classes = a_styles_index[a_tpl[i]['level_style']]['classes_o'];
			if (a_classes[2] == a_classes[1] && a_classes[1] == a_classes[0])
				a_css = a_classes[0];
			else if (a_classes[2] == a_classes[1])
				a_css =  [a_classes[0], a_classes[1]];
			else
				a_css = a_classes;
	
			a_normtpl[i]['css']['outer'] = a_css;
		}
	}
	// add menu properties
	a_normtpl[0]['block_left'] = a_menu['menu_left'];
	a_normtpl[0]['block_top']  = a_menu['menu_top'];
	
	return dump_var(a_normtpl);
}

// --------------------------------------------------------------------------------

