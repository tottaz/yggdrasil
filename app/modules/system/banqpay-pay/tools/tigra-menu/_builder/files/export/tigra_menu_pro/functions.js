// Title: Tigra Menu Builder v1.0 (07/21/2005)
// Copyright (c)2005 Softcomplex, Inc. (www.softcomplex.com)

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

		var a_link = [];
		if (o_item['link_href'])    a_link[0] = "'" + text_escape(o_item['link_href'])    + "'";
		if (o_item['link_target'])  a_link[1] = "'" + text_escape(o_item['link_target'])  + "'";
		if (o_item['text_tooltip']) a_link[2] = "'" + text_escape(o_item['text_tooltip']) + "'";
		if (b_preview) a_link[1] = "'link_preview'";

		var a_item_scope = [];
		if (o_item['item_left'] != null)   a_item_scope[0] = o_item['item_left'];
		if (o_item['item_top'] != null)    a_item_scope[1] = o_item['item_top'];
		if (o_item['item_width'] != null)  a_item_scope[2] = o_item['item_width'];
		if (o_item['item_height'] != null) a_item_scope[3] = o_item['item_height'];
	
		s_output +=
			"['" + text_escape(o_item['text_caption']) + "'" +
			(a_link.length > 1
				? ', [' + a_link.join(', ') + ']'
				: (a_link[0] ? ', ' + a_link[0] : (a_item_scope.length > 0 || a_children ? ', null' : ''))) +
			(a_item_scope.length > 0
				? ', [' + a_item_scope.join(', ') + ']'
				: (a_children ? ', null' : '')) +
			(a_children ? ',' + a_children + s_tabs : '')
			+ "]"
			+ (i == a_block.length -1 ? '' : ',');
	}
	return s_output;
}

// --------------------------------------------------------------------------------
// generates CSS for the menu

var a_states       = ['normal', 'hover', 'click'];
var a_short_states = ['mout'  , 'mover', 'mdown'];

function export_styles (a_styles_index, a_tpl) {

	style_reindex();
	if (!a_styles_index || !a_styles_index.length) return '';

	var a_styles_cache = [];

	for (var i = 0; i <= N_MAXDEPTH; i++) {
		// get style_id recursively
		var n_id = null, n_level = i;
		while (n_level >= 0) {
			if (a_tpl[n_level] && a_tpl[n_level]['level_style'] != null) {
				n_id = a_tpl[n_level]['level_style'];
				break;
			}
			n_level--;
		}
		// skip if level doesn't have style assigned
		if (n_id == '-' || n_id == null)
			continue;

		for (var n_state = 0; n_state < 3; n_state++) {

			// generate the properties for the inner tag
			var s_cssprops = "\tfont-family: "
				+  style_template_property(n_id, 'font_family'    , n_state) +  ";\n\tcolor: "
				+  style_template_property(n_id, 'font_color'     , n_state) + ";\n\tfont-size: "
				+  style_template_property(n_id, 'font_size'      , n_state) + "px;\n\tfont-weight: "
				+ (style_template_property(n_id, 'font_weight'    , n_state) ? 'bold':'normal') + ";\n\tfont-style: "
				+ (style_template_property(n_id, 'font_style'     , n_state) ? 'italic':'normal') + ";\n\ttext-decoration: "
				+ (style_template_property(n_id, 'font_decoration', n_state) ? 'underline' : 'none') + ";\n",
			s_class = '.m0l' + i + a_short_states[n_state] + 'i';

			// avoid duplicate css classes by looking up the properties in the cache
			var a_cache_entry = null;
			for (var n_cidx = 0; n_cidx < a_styles_cache.length; n_cidx++)
				if (a_styles_cache[n_cidx]['props'] == s_cssprops) {
					a_cache_entry = a_styles_cache[n_cidx];
					break;
				}

			// assign the new name if unique properties
			if (a_cache_entry) {
				a_cache_entry['class'][a_cache_entry['class'].length] = s_class;
			}
			else {
				a_cache_entry = {
					'class' : [s_class],
					'props' : s_cssprops,
					'name'  : a_styles_index[i].name,
					'tag'   : 'text'
				};
				a_styles_cache[a_styles_cache.length] = a_cache_entry;
			}

			// generate the properties for the outer tag
			s_cssprops = "\tbackground: "
				+ style_template_property(n_id, 'box_background_color', n_state) + ";\n\tborder: "
				+ style_template_property(n_id, 'box_border_width', n_state) + 'px solid '
				+ style_template_property(n_id, 'box_border_color', n_state) + ";\n\tpadding: "
				+ style_template_property(n_id, 'box_padding', n_state) + "px;\n\ttext-align: "
				+ style_template_property(n_id, 'text_align', n_state) + ";\n\tvertical-align: "
				+ style_template_property(n_id, 'text_valign', n_state) + ";\n\t"
				+ 'text-decoration: none;\n';
			s_class = '.m0l' + i + a_short_states[n_state] + 'o';

			// avoid duplicate css classes by looking up the properties in the cache
			var a_cache_entry = null;
			for (var n_cidx = 0; n_cidx < a_styles_cache.length; n_cidx++)
				if (a_styles_cache[n_cidx]['props'] == s_cssprops) {
					a_cache_entry = a_styles_cache[n_cidx];
					break;
				}

			// assign the new name if unique properties
			if (a_cache_entry) {
				a_cache_entry['class'][a_cache_entry['class'].length] = s_class;
			}
			else {
				a_cache_entry = {
					'class' : [s_class],
					'props' : s_cssprops,
					'name'  : a_styles_index[i].name,
					'tag'   : 'box'
				};
				a_styles_cache[a_styles_cache.length] = a_cache_entry;
			}
		}
	}
	
	// prepare output
	var s_output = '';
	for (var i = 0; i < a_styles_cache.length; i++) {
	
		s_output +=
			"/* " + a_styles_cache[i]['name'] + 
			"; " + a_styles_cache[i]['tag'] + " properties */\n" +
			a_styles_cache[i]['class'].join(",\n") + " {\n" +
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

function export_template (a_menu, a_tpl) {
	if (!a_menu) return '';

	var a_normtpl = {};
	for (var n_key = 0; n_key < A_LEVELKEYS.length; n_key++) {
		var a_prop = [];
		a_normtpl[A_LEVELKEYS[n_key]['key']] = a_prop;

		for (var i = 0; i <= N_MAXDEPTH; i++) {
			var s_value = (a_tpl[i] ? a_tpl[i][A_LEVELKEYS[n_key]['prop']] : null);
			a_prop[i]  = s_value == null || s_value == 'i' ? (i ? a_prop[i - 1] : 'error') : s_value;
		}
	}

	// add menu properties
	a_normtpl['block_left'][0] = a_menu['menu_left'];
	a_normtpl['block_top'][0] = a_menu['menu_top'];
	if (a_menu['menu_align'] && a_menu['menu_align'] != 'left')
		a_normtpl['align'] = a_menu['menu_align'];
	if (a_menu['menu_valign'] && a_menu['menu_valign'] != 'top')
		a_normtpl['valign'] = a_menu['menu_valign'];
	if (a_menu['menu_static'] && a_menu['menu_static'] != 'none')
		a_normtpl['scroll'] = a_menu['menu_static'];
	a_normtpl['pixel_path'] = 'pixel.gif';
	
	return dump_var(a_normtpl);
}

// --------------------------------------------------------------------------------

