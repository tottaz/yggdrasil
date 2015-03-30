// Title: Tigra Menu Builder v1.0 (07/21/2005)
// Copyright (c)2005 Softcomplex, Inc. (www.softcomplex.com)

// common property interface
// this is as OO as it gets with JavaScript :(

// s_sname  - short name of the property
// s_lname  - full name of the property
// s_form   - name of the form to display the property
// s_modes  - bitmap of the modes the property should displayed for (see A_MODES)
// f_draw   - generates HTML of the form entry
// f_init   - initializes the form entry when form reloads
// f_preset - called when preset is changed
// f_update - called when value is changed
// f_valid  - value validation method
// f_get    - returns the value of the parameter set in the form
// f_save   - saves the form data in the configuration structure

var A_PROPS = [];

// --------------------------------------------------------------------------------
// Edit Item Form
// --------------------------------------------------------------------------------
// item path (all)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'path',
		's_lname'  : 'Path',
		's_form'   : 'item_edit',
		'n_modes'  : 31,
		'f_init'   : pm_init_readonly,
		'f_draw'   : pm_draw_readonly,
		'f_get'    : pm_get_path,
		'f_save'   : pm_save_nothing
};

function pm_init_readonly (o_item) {
	document.forms[this.s_form].elements[this.s_sname].value =  this.f_get();
}

function pm_get_path () {
	var o_item = A_INDEX[N_ID], a_path = [];
	var o_curr = o_item;
	while (o_curr.n_depth >= 0) {
		a_path[o_curr.n_depth] = o_curr['text_caption'];
		o_curr = o_curr.o_parent;
	}
	var s_path = '/' + a_path.join('/');
	if (o_item.temp)
		s_path += 'new item';
	if (s_path.match(/(.{40})$/))
		s_path = '...' + RegExp.$1;
	return s_path;
}

function pm_draw_readonly (o_item) {
	document.write (
		'<tr><td class="propName">', this.s_lname,' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td>',
		'<td class="propValue" colspan="2"><input type="Text" name="',
		this.s_sname ,'" value="',  this.f_get(), '" disabled style="border:0"></td></tr>'
	);
}

function pm_save_nothing (o_item) {
}

// --------------------------------------------------------------------------------
// item caption (all)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'text_caption',
		's_lname'  : 'Caption',
		's_form'   : 'item_edit',
		's_default': 'new item',
		'n_modes'  : 31,
		'f_init'   : pm_init_input,
		'f_valid'  : pm_valnotempty,
		'f_draw'   : pm_draw_input,
		'f_update' : pm_update_simplevalid,
		'f_get'    : pm_get_input,
		'f_save'   : pm_save_item
};

function pm_init_input (o_item) {
	var s_value = (!o_item[this.s_sname] ? this.s_default : o_item[this.s_sname]);
	document.forms[this.s_form].elements[this.s_sname].value = s_value;
}

function pm_update_simplevalid (s_input) {
	return this.f_valid (document.forms[this.s_form].elements[this.s_sname]);
}

function pm_draw_input (o_item) {
	var s_value = (!o_item[this.s_sname] ? this.s_default : o_item[this.s_sname]);
	document.write (
		'<tr><td class="propName">', this.s_lname,' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td>',
		'<td class="propValue" colspan="2"><input type="Text" name="',
		this.s_sname,'" value="', s_value ,'" onchange="return A_PMAP[\'',this.s_sname,
		'\'].f_update(this.value)"></td></tr>'
	);
}

function pm_valnotempty (e_input) {	
	if (e_input.value == '') {
		alert(this.s_lname + " can't be blank");
		e_input.focus();
		return false;
	}
	return true;
}

function pm_get_input () {
	return document.forms[this.s_form].elements[this.s_sname].value;
}

function pm_save_item (o_item) {
	// get the value
	var s_value = this.f_get();
	
	// delete default values from the configuration structure
	if (s_value == null) {
		o_item[this.s_sname] = null;
		delete(o_item[this.s_sname]);
	}
	// save value in the configuration structure
	else 
		o_item[this.s_sname] = s_value;
}

// --------------------------------------------------------------------------------
// item link (all)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'link_href',
		's_lname'  : 'Link',
		's_form'   : 'item_edit',
		'n_modes'  : 31,
		'f_init'   : pm_init_inpwpres,
		'f_draw'   : pm_draw_inpwpres,
		'f_update' : pm_update_inpwpres,
		'f_preset' : pm_preset_inpwpres,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'', 't':'no link'},
			{'v':'enter link here', 't':'custom link'},
			{'v':'http://', 't':'http://'},
			{'v':'ftp://', 't':'ftp://'},
			{'v':'mailto:', 't':'mailto:'},
			{'v':'javascript:', 't':'javascript:'}
		]
};

function pm_init_inpwpres (o_item) {
	var s_value = (o_item[this.s_sname] == null ? '' : o_item[this.s_sname]);
	var e_input = document.forms[this.s_form].elements[this.s_sname].value = s_value;
	this.f_update(s_value);
}

function pm_update_inpwpres (s_input) {
	var e_preset = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	var b_found = false;
	for (var n_option = 0; n_option < e_preset.options.length; n_option++) {
		var s_value = e_preset.options[n_option].value.toLowerCase();

		if ((s_value == '' && s_input == '') || (s_value != '' && s_input.indexOf(s_value) == 0)) {
			e_preset.selectedIndex = n_option;
			b_found = true;
			break;
		}
	}
	if (!b_found)
		e_preset.selectedIndex = 1;
}

function pm_preset_inpwpres (e_select) {
	var e_input = document.forms[this.s_form].elements[this.s_sname];
		e_input.value =	e_select.options[e_select.selectedIndex].value;
		e_input.focus();
}

function pm_draw_inpwpres (o_item) {
	var s_value = (o_item[this.s_sname] == null ? '' : o_item[this.s_sname]);

	document.write (
		'<tr><td class="propName">',this.s_lname,
		' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td><td class="propValue"><input type="Text" name="',this.s_sname,
		'" value="', s_value,
		'" class="propInput" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_update(this.value)"></td><td class="propPreset"><select name="',this.s_sname,
		'_preset" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)">'
	);
	for (var i = 0; i < this.a_presets.length; i++)
		document.write ('<option value="',this.a_presets[i]['v'], '">', this.a_presets[i]['t'], '</option>');
	document.write ('</select></td></tr>');
	this.f_update(s_value);
}

function pm_get_inpwpres () {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	var s_preset = e_select.options[e_select.selectedIndex].value;
	return (s_preset == 'i' || s_preset == '' ? null : e_input.value);
}

// --------------------------------------------------------------------------------
// target window (all)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'link_target',
		's_lname'  : 'Target',
		's_form'   : 'item_edit',
		'n_modes'  : 31,
		'f_init'   : pm_init_inpwpres,
		'f_draw'   : pm_draw_inpwpres,
		'f_update' : pm_update_inpwpres,
		'f_preset' : pm_preset_inpwpres,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'', 't':'default target'},
			{'v':'enter target here', 't':'custom target'},
			{'v':'_self', 't':'_self'},
			{'v':'_blank', 't':'_blank'},
			{'v':'_parent', 't':'_parent'},
			{'v':'_top', 't':'_top'}
		]
},

// --------------------------------------------------------------------------------
// status bar message (TM, TMG, TTM, TTMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'text_statusbar',
		's_lname'  : 'Status Bar Message',
		's_form'   : 'item_edit',
		'n_modes'  : 29,
		'f_init'   : pm_init_inpwpres,
		'f_draw'   : pm_draw_inpwpres,
		'f_update' : pm_update_inpwpres,
		'f_preset' : pm_preset_inpwpres,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'', 't':'default message'},
			{'v':'enter message here', 't':'custom message'},
			{'v':'%c (%l)', 't':'caption (link)'},
			{'v':'%c', 't':'caption'},
			{'v':'%l', 't':'link'}
		]
};

// --------------------------------------------------------------------------------
// tooltip box (TMP, TMG, TTMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'text_tooltip',
		's_lname'  : 'Pop Up Message',
		's_form'   : 'item_edit',
		'n_modes'  : 22,
		'f_init'   : pm_init_inpwpres,
		'f_draw'   : pm_draw_inpwpres,
		'f_update' : pm_update_inpwpres,
		'f_preset' : pm_preset_inpwpres,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'', 't':'default message'},
			{'v':'enter message here', 't':'custom message'},
			{'v':'%c (%l)', 't':'caption (link)'},
			{'v':'%c', 't':'caption'},
			{'v':'%l', 't':'link'}
		]
};

// --------------------------------------------------------------------------------
// item width (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_width',
		's_lname'  : 'Width (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_itemsize,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_inpwpres2,
		'f_preset' : pm_preset_inpwpres2,
		'f_valid'  : pm_valuns,
		's_inher'  : 'level_width',
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'enter here', 't':'custom width'}
		]
};

function pm_level_property (o_item, s_prop, b_inherit, s_default) {

	if (!o_item)
		o_item = F_DATA.A_INDEX[N_ID];

	var a_levedata =  F_DATA.A_TPL[o_item.n_depth];
	if (a_levedata && a_levedata[s_prop] != null && a_levedata[s_prop] != 'i')
		return a_levedata[s_prop];
	else if (b_inherit && o_item.n_depth > 0)
		return pm_level_property(o_item.o_parent, s_prop, true, s_default);
	else if (b_inherit && o_item.n_depth == 0 && s_default != null)
		return s_default;
	else
		return 'i';
}

function pm_draw_inpwpres2 (o_item) {
	document.write (
		'<tr><td class="propName">',this.s_lname,
		' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td><td class="propValue"><input type="Text" name="',this.s_sname,
		'" onchange="return A_PMAP[\'',this.s_sname,
		'\'].f_update(this.value)"></td><td class="propPreset"><select name="',this.s_sname,
		'_preset" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)"></select></td></tr>');
	this.f_init(o_item);
}

function pm_init_itemsize (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	// get level (default) value
	var n_default = pm_level_property(o_item, this.s_inher, true);

	// re-fill preset selectboxes with options
	e_select.options.length = 0;
	e_select.options[0] = new Option ('default size', '');
	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[i + 1] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	// highlight preset if matches the value
	if (o_item[this.s_sname] == null || o_item[this.s_sname] == n_default) {
		e_select.selectedIndex = 0;
		e_input.value =	n_default;
		e_input.disabled = true;
	}
	else {
		e_select.selectedIndex = 1;
		e_input.value =	o_item[this.s_sname];
		e_input.disabled = false;
	}

	// disable select if only one option is available		
	e_select.disabled = (e_select.options.length == 1);
}

function pm_update_inpwpres2 (s_input) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
		
	var n_default = pm_level_property(F_DATA.A_INDEX[N_ID], this.s_inher, true);
	if (Number(s_input) == n_default) {
		e_input.disabled = true;
		e_select.selectedIndex = 0;
		return;
	}
	else {
		e_input.disabled = false;
		e_select.selectedIndex = 1;
	}

	return this.f_valid (e_input);
}

function pm_preset_inpwpres2 (e_select) {
	var e_input = document.forms[this.s_form].elements[this.s_sname];
	
	// custom value selected
	if (e_select.selectedIndex) {
		e_input.disabled = false;
		e_input.focus();
	}
	// inherit
	else {
		e_input.value =	pm_level_property(F_DATA.A_INDEX[N_ID], this.s_inher, true);
		e_input.disabled = true;
	}
}

function pm_valuns (e_input) {
	if (!RE_UNSINT.exec(e_input.value)) {
		alert("'" + e_input.value + "' is not valid value for " + this.s_lname + ".\nOnly positive integer numbers are accepted.");
		e_input.focus();
		return false;
	}
	return true;
}

// --------------------------------------------------------------------------------
// item width (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_width',
		's_lname'  : 'Width (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_itemsizetmg,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_itemsizetmg,
		'f_preset' : pm_preset_itemsizetmg,
		'f_valid'  : pm_valuns,
		's_inher1' : 'item_bwidth',
		's_inher2' : 'level_width',
		's_disblon': 'v',
		'f_default': pm_default_sizetmg,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'', 't':'default width'},
			{'v':'enter here', 't':'custom width'}
		]
};

// available only in horizontal blocks
function pm_init_itemsizetmg (o_item, b_fromform)  {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
		
	// get the layout from saved data or from form
	var s_layout = pm_level_property (null, 'level_layout', true);

	// re-fill preset selectboxes with options
	e_select.options.length = 0;
	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[i] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	// get default value from block settings or from level settings
	var n_default = this.f_default(b_fromform);

	// disable control when setting is not available	
	if (s_layout.charAt(0) == this.s_disblon) {
		e_select.selectedIndex = 0;
		e_select.disabled = true;
		e_input.value = n_default;
		e_input.disabled = true;
	}
	else if (o_item[this.s_sname] == null || o_item[this.s_sname] == n_default) {
		e_select.selectedIndex = 0;
		e_select.disabled = false;
		e_input.value = n_default;
		e_input.disabled = true;
	}
	else {
		e_select.selectedIndex = 1;
		e_select.disabled = false;
		e_input.value = o_item[this.s_sname];
		e_input.disabled = false;
	}

	// disable select if only one option is available		
	if (e_select.options.length == 1)
		e_select.disabled = true;
}

function pm_preset_itemsizetmg (e_select) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname];

	// custom value selected
	if (e_select.selectedIndex) {
		e_input.disabled = false;
		e_input.focus();
	}
	// inherit
	else {
		e_input.value =	this.f_default();
		e_input.disabled = true;
	}
	if (this.s_notif)
		A_PMAP[this.s_notif].f_init(F_DATA.A_INDEX[N_ID]);
}

function pm_update_itemsizetmg (s_input) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
		
	if (Number(s_input) == this.f_default()) {
		e_input.disabled = true;
		e_select.selectedIndex = 0;
		if (this.s_notif)
			A_PMAP[this.s_notif].f_init(F_DATA.A_INDEX[N_ID], true);
		return true;
	}
	else {
		e_input.disabled = false;
		e_select.selectedIndex = 1;
		if (this.f_valid (e_input)) {
			if (this.s_notif)
				A_PMAP[this.s_notif].f_init(F_DATA.A_INDEX[N_ID], true);
			return true;
		}
		else
			return false;
	}
}

function pm_default_sizetmg (b_fromform) {
	// get block scope information from config or from the form
	var n_blockparam,
		o_item = F_DATA.A_INDEX[N_ID];

	if (b_fromform)
		n_blockparam = A_PMAP[this.s_inher1].f_get()
	else if (o_item.n_depth)
		n_blockparam = o_item.o_parent[this.s_inher1];

	// if block scope information is not available then inherit from level data
	return (n_blockparam == null
		? pm_level_property(F_DATA.A_INDEX[N_ID], this.s_inher2, true)
		: n_blockparam);
}

// --------------------------------------------------------------------------------
// item height (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_height',
		's_lname'  : 'Height (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_itemsize,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_inpwpres2,
		'f_preset' : pm_preset_inpwpres2,
		'f_valid'  : pm_valuns,
		's_inher'  : 'level_height',
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'enter here', 't':'custom height'}
		]
};

// --------------------------------------------------------------------------------
// item height (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_height',
		's_lname'  : 'Height (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_itemsizetmg,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_itemsizetmg,
		'f_preset' : pm_preset_itemsizetmg,
		'f_valid'  : pm_valuns,
		's_inher1' : 'item_bheight',
		's_inher2' : 'level_height',
		's_disblon': 'h',
		'f_default': pm_default_sizetmg,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_item,
		'a_presets': [
			{'v':'', 't':'default width'},
			{'v':'enter here', 't':'custom width'}
		]
};

// --------------------------------------------------------------------------------
// block width (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_bwidth',
		's_lname'  : 'Block Width (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_blocksizetmg,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_itemsizetmg,
		'f_preset' : pm_preset_itemsizetmg,
		'f_valid'  : pm_valuns,
		's_inher'  : 'level_width',
		's_notif'  : 'item_width',
		's_disblon': 'h',
		'f_default': pm_default_bsizetmg,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_parentitem,
		'a_presets': [
			{'v':'', 't':'default width'},
			{'v':'enter here', 't':'custom width'}
		]
};

function pm_init_blocksizetmg (o_item)  {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
		
	// get the layout from saved data or from form
	var s_layout = pm_level_property (null, 'level_layout', true);

	e_select.options.length = 0;

	// re-fill preset selectboxes with options
	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[i] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	// get default value from block settings or from level settings
	var n_default = this.f_default();

	// disable control when setting is not available
	if (!o_item.n_depth || s_layout.charAt(0) == this.s_disblon) {
		e_select.selectedIndex = 0;
		e_select.disabled = true;
		e_input.value = n_default;
		e_input.disabled = true;
	}
	else if (o_item.o_parent[this.s_sname] == null || o_item.o_parent[this.s_sname] == n_default) {
		e_select.selectedIndex = 0;
		e_select.disabled = false;
		e_input.value = n_default;
		e_input.disabled = true;
	}
	else {
		e_select.selectedIndex = 1;
		e_select.disabled = false;
		e_input.value = o_item.o_parent[this.s_sname];
		e_input.disabled = false;
	}

	// disable select if only one option is available		
	if (e_select.options.length == 1)
		e_select.disabled = true;
}

function pm_default_bsizetmg () {
	return pm_level_property(F_DATA.A_INDEX[N_ID], this.s_inher, true);
}

function pm_save_parentitem (o_item) {
	if (!o_item.n_depth)
		return;
		
	o_item = o_item.o_parent;
	
	// get the value
	var s_value = this.f_get();
	
	// delete default values from the configuration structure
	if (s_value == null) {
		o_item[this.s_sname] = null;
		delete(o_item[this.s_sname]);
	}
	// save value in the configuration structure
	else 
		o_item[this.s_sname] = s_value;
}

// --------------------------------------------------------------------------------
// block height (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_bheight',
		's_lname'  : 'Block Height (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_blocksizetmg,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_itemsizetmg,
		'f_preset' : pm_preset_itemsizetmg,
		'f_valid'  : pm_valuns,
		's_inher' : 'level_height',
		's_notif'  : 'item_height',
		's_disblon': 'v',
		'f_default': pm_default_bsizetmg,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_parentitem,
		'a_presets': [
			{'v':'', 't':'default width'},
			{'v':'enter here', 't':'custom width'}
		]
};

// --------------------------------------------------------------------------------
// item horizontal offset (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_left',
		's_lname'  : 'Horizontal Offset (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_tmpboffset,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_tmpboffset,
		'f_preset' : pm_preset_tmpboffset,
		'f_valid'  : pm_valuns,
		's_altname': 'item_bleft',
		's_inher1' : 'level_bleft',
		's_inher2' : 'level_left',
		's_inher3' : 'menu_left',
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_tmpboffset,
		'a_presets': [
			{'v':'enter here', 't':'custom offset'}
		]
};

function pm_init_tmpboffset (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	e_select.options.length = 0;
	e_select.options[0] = new Option ('default offset', '');

	// get level (default) value
	if (o_item.n_depth == 0 && o_item.n_order == 0) {
		e_input.value = F_DATA.A_MENU[this.s_inher3];
		e_input.disabled = true;
	}
	else {
		var n_default = pm_level_property(o_item, (o_item.n_order == 0 ? this.s_inher1 : this.s_inher2), true);
		var s_value = o_item.n_order ? o_item[this.s_sname] : o_item.o_parent[this.s_altname];
		// re-fill preset selectboxes with options
		for (var i = 0; i < this.a_presets.length; i++)
			e_select.options[i + 1] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

		// highlight preset if matches the value
		if (s_value == null || s_value == n_default) {
			e_select.selectedIndex = 0;
			e_input.value =	n_default;
			e_input.disabled = true;
		}
		else {
			e_select.selectedIndex = 1;
			e_input.value =	s_value;
			e_input.disabled = false;
		}
	}

	// disable select if only one option is available		
	e_select.disabled = (e_select.options.length == 1);
}

function pm_update_tmpboffset (s_input) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	
	var o_item = F_DATA.A_INDEX[N_ID];
	var n_default = pm_level_property(o_item, (o_item.n_order == 0 ? this.s_inher1 : this.s_inher2), true);
	if (Number(s_input) == n_default) {
		e_input.disabled = true;
		e_select.selectedIndex = 0;
		return;
	}
	else {
		e_input.disabled = false;
		e_select.selectedIndex = 1;
	}

	return this.f_valid (e_input);
}

function pm_preset_tmpboffset (e_select) {
	var e_input = document.forms[this.s_form].elements[this.s_sname];
	
	// custom value selected
	if (e_select.selectedIndex) {
		e_input.disabled = false;
		e_input.focus();
	}
	// inherit
	else {
		var o_item = F_DATA.A_INDEX[N_ID];
		e_input.value =	pm_level_property(o_item, (o_item.n_order == 0 ? this.s_inher1 : this.s_inher2), true);
		e_input.disabled = true;
	}
}

function pm_save_tmpboffset (o_item) {
	// get the value
	var s_value = this.f_get()

	if (o_item.n_order)
		s_name = this.s_sname;
	else  {
		o_item = o_item.o_parent;
		s_name = this.s_altname;
	}
	
	// delete default values from the configuration structure
	if (s_value == null) {
		o_item[s_name] = null;
		delete(o_item[s_name]);
	}
	// save value in the configuration structure
	else 
		o_item[s_name] = s_value;
}

// --------------------------------------------------------------------------------
// item vertical offset (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_top',
		's_lname'  : 'Vertical Offset (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_tmpboffset,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_tmpboffset,
		'f_preset' : pm_preset_tmpboffset,
		'f_valid'  : pm_valuns,
		's_altname': 'item_btop',
		's_inher1' : 'level_btop',
		's_inher2' : 'level_top',
		's_inher3' : 'menu_top',
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_tmpboffset,
		'a_presets': [
			{'v':'enter here', 't':'custom offset'}
		]
};

// --------------------------------------------------------------------------------
// block horizontal offset (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_bleft',
		's_lname'  : 'Block Hor. Offset (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_tmgboffset,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_tmpboffset,
		'f_preset' : pm_preset_tmpboffset,
		'f_valid'  : pm_valuns,
		'f_default': pm_default_boffsettmg,
		's_inher1' : 'level_bleft',
		's_inher2' : 'menu_left',
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_parentitem,
		'a_presets': [
			{'v':'', 't':'default offset'},
			{'v':'enter here', 't':'custom offset'}
		]
};

function pm_init_tmgboffset (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	e_select.options.length = 0;

	// re-fill preset selectboxes with options
	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[i] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	// get default value from block settings or from level settings
	var n_default = this.f_default();

	// disable control when setting is not available
	if (!o_item.n_depth) {
		e_select.selectedIndex = 0;
		e_select.disabled = true;
		e_input.value = n_default;
		e_input.disabled = true;
	}
	else if (o_item.o_parent[this.s_sname] == null || o_item.o_parent[this.s_sname] == n_default) {
		e_select.selectedIndex = 0;
		e_select.disabled = false;
		e_input.value = n_default;
		e_input.disabled = true;
	}
	else {
		e_select.selectedIndex = 1;
		e_select.disabled = false;
		e_input.value = o_item.o_parent[this.s_sname];
		e_input.disabled = false;
	}

	// disable select if only one option is available		
	if (e_select.options.length == 1)
		e_select.disabled = true;
}

function pm_default_boffsettmg () {
	var o_item = F_DATA.A_INDEX[N_ID];
	return o_item.n_depth
		? pm_level_property(F_DATA.A_INDEX[N_ID], this.s_inher1, true)
		: F_DATA.A_MENU['menu_pos'] == 'absolute'
			? F_DATA.A_MENU[this.s_inher2]
			: 'n/a (relative)';
}

// --------------------------------------------------------------------------------
// block vertical offset (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_btop',
		's_lname'  : 'Block Ver. Offset (px)',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_tmgboffset,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_tmpboffset,
		'f_preset' : pm_preset_tmpboffset,
		'f_valid'  : pm_valuns,
		'f_default': pm_default_boffsettmg,
		's_inher1' : 'level_btop',
		's_inher2' : 'menu_top',
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_parentitem,
		'a_presets': [
			{'v':'', 't':'default offset'},
			{'v':'enter here', 't':'custom offset'}
		]
};

// --------------------------------------------------------------------------------
// block expand transition
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_btransexp',
		's_lname'  : 'Expand Transition',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_btransaction,
		'f_draw'   : pm_draw_transition,
		'f_update' : pm_update_btransition,
		'f_preset' : pm_preset_btransition,
		'f_default': pm_default_btransition,
		's_inher'  : 'level_transexp',
		'f_get'    : pm_get_btransition,
		'f_save'   : pm_save_item,
		'a_presets': F_DATA.A_TRANSITIONS
};

function pm_init_btransaction (o_item) {
	var e_durat  = document.forms[this.s_form].elements[this.s_sname + '_duration'],
		e_trans = document.forms[this.s_form].elements[this.s_sname + '_trans'];

	// value format: "effect_index,duration"
	var s_value = o_item[this.s_sname] ? o_item[this.s_sname] : 'i';
	var a_value = s_value.split(',');
	var s_default = this.f_default();
	var a_default = s_default.split(',');

	// re-fill preset selectboxes with options
	e_trans.options.length = 0;
	e_trans.options[0] = new Option ('default (' + this.a_presets[a_default[0]]['t'] + ')', 'i');

	for (var i = 0; i < this.a_presets.length; i++)
		e_trans.options[i + 1] = new Option (this.a_presets[i]['t'], i);
	
	// default
	if (s_value == 'i') {
		e_trans.selectedIndex = 0;
		e_durat.selectedIndex = a_default[1];
		e_durat.disabled = true;
	}
	// disabled
	else if (a_value[0] == 0) {
		e_trans.selectedIndex = 1;
		e_durat.disabled = true;
	}
	// explicitly set
	else {
		e_trans.selectedIndex = Number(a_value[0]) + 1;
		e_durat.selectedIndex = a_value[1];
		e_durat.disabled = false;
	}
}

function pm_preset_btransition (e_select) {
	var e_durat = document.forms[this.s_form].elements[this.s_sname + '_duration'];
	var s_value = e_select.options[e_select.selectedIndex].value;

	if (s_value == 'i') {
		var s_default = this.f_default();
		a_default = s_default.split(',');

		e_durat.selectedIndex = a_default[1];
		e_durat.disabled = true;
	}
	else if (s_value == 0) {
		e_durat.selectedIndex = 0;
		e_durat.disabled = true;
	}	
	else {
		if (e_durat.selectedIndex == 0)
			e_durat.selectedIndex = 5;
		e_durat.disabled = false;
	}
}

function pm_update_btransition (e_select) {
	var e_trans = document.forms[this.s_form].elements[this.s_sname + '_trans'];
	if (e_select.selectedIndex == 0) {
		e_trans.selectedIndex = 1;
		e_select.disabled = true;
	}
}

function pm_get_btransition () {
	var e_trans = document.forms[this.s_form].elements[this.s_sname + '_trans'],
		e_durat = document.forms[this.s_form].elements[this.s_sname + '_duration'];
	var n_trans = e_trans.options[e_trans.selectedIndex].value;
	
	if (n_trans == 'i')
		return null
	var s_result = n_trans + ',' + e_durat.options[e_durat.selectedIndex].value;
	return (s_result == this.f_default() ? null : s_result);
	
}

function pm_default_btransition () {
	return pm_level_property(F_DATA.A_INDEX[N_ID], this.s_inher, true, A_PMAP[this.s_inher].f_default());
}



// --------------------------------------------------------------------------------
// block collapse transition
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'item_btranscol',
		's_lname'  : 'Collapse Transition',
		's_form'   : 'item_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_btransaction,
		'f_draw'   : pm_draw_transition,
		'f_update' : pm_update_btransition,
		'f_preset' : pm_preset_btransition,
		'f_default': pm_default_btransition,
		's_inher'  : 'level_transcol',
		'f_get'    : pm_get_btransition,
		'f_save'   : pm_save_item,
		'a_presets': F_DATA.A_TRANSITIONS
};

// --------------------------------------------------------------------------------
// Edit Level Form
// --------------------------------------------------------------------------------
// level depth (all)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_depth',
		's_lname'  : 'Depth',
		's_form'   : 'level_edit',
		'n_modes'  : 31,
		'f_init'   : pm_init_readonly,
		'f_draw'   : pm_draw_readonly,
		'f_get'    : pm_get_depth,
		'f_save'   : pm_save_nothing
};

function pm_get_depth () {
	return A_INDEX[N_ID].n_depth;
}

// --------------------------------------------------------------------------------
// level style (TM, TMP, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_style',
		's_lname'  : 'Style',
		's_form'   : 'level_edit',
		'n_modes'  : 7,
		'f_init'   : pm_init_style,
		'f_draw'   : pm_draw_style,
		'f_preset' : pm_preset_style,
		'f_get'    : pm_get_preset,
		'f_save'   : pm_save_level
};

function pm_set_style (n_state) {
	var o_prop = A_PMAP['level_style'];
	var e_select = document.forms[o_prop.s_form].elements[o_prop.s_sname];
	var n_style_id = e_select.options[e_select.selectedIndex].value;
		
	if (n_style_id == 'i')
		n_style_id = pm_level_property(F_DATA.A_INDEX[N_ID].o_parent, o_prop.s_sname, true);

	var e_preview = get_element('style_template_preview');
	e_preview.className = n_style_id == '-' ? '' : ('stylePreviewI' + n_style_id + 'S' + (n_state ? n_state : 0));
}


function pm_init_style (o_item) {
	var e_select = document.forms[this.s_form].elements[this.s_sname];
	var s_value = pm_level_property (o_item, this.s_sname);

	e_select.options.length = 0;
	if (o_item.n_depth) {
		s_inherited = pm_level_property(o_item.o_parent, this.s_sname, true);
		e_select.options[0] = new Option(
			'inherit (' + (s_inherited == '-' ? 'no style' : F_DATA.A_STYLES_INDEX[s_inherited]['name']) + ')', 'i');
	}
	e_select.options[e_select.options.length] = new Option('no style', '-');
	for (var i = 0; i < F_DATA.A_STYLES.length; i++)
			e_select.options[e_select.options.length] = new Option(F_DATA.A_STYLES[i]['name'], F_DATA.A_STYLES[i].n_id);

	for (var i = 0; i < e_select.options.length; i++)
		if (e_select[i].value == s_value) {
			e_select.selectedIndex = i;
			break;
		}
	pm_set_style(0);
}

function pm_preset_style (e_select) {
	pm_set_style(0);
}

function pm_draw_style (o_item) {
	document.write (
		'<tr><td class="propName" rowspan="2" valign="top">', this.s_lname,
		' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td><td class="propValue" colspan="2"><select name="', this.s_sname,
		'" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)"></select></td></tr><tr><td colspan="2" background="images/grid.gif" class="propValue"onmouseout="pm_set_style(0)" onmouseover="pm_set_style(1)" onmousedown="pm_set_style(2)" style="cursor:hand;padding:4px;"><div id="style_template_preview">style preview</div></td>'
	);
	this.f_init(o_item);
}

function pm_get_preset () {
	var e_select = document.forms[this.s_form].elements[this.s_sname];
	var s_value = e_select.options[e_select.selectedIndex].value;
	return (s_value == '' || s_value == 'i' ? null : s_value);
}

function pm_save_level (o_item) {
	var o_item = F_DATA.A_INDEX[N_ID];

	// init level information if doesn't exist
	if (!F_DATA.A_TPL[o_item.n_depth])
		F_DATA.A_TPL[o_item.n_depth] = {};

	// get the value
	var s_value = this.f_get();
		
	// delete default values from the configuration structure
	if (s_value == null) {
		F_DATA.A_TPL[o_item.n_depth][this.s_sname] = null;
		delete(F_DATA.A_TPL[o_item.n_depth][this.s_sname]);
	}
	// save value in the configuration structure
	else 
		F_DATA.A_TPL[o_item.n_depth][this.s_sname] = s_value;
}

// --------------------------------------------------------------------------------
// level layout (TM, TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_layout',
		's_lname'  : 'Layout',
		's_form'   : 'level_edit',
		'n_modes'  : 3,
		'f_init'   : pm_init_layout,
		'f_draw'   : pm_draw_preset,
		'f_preset' : pm_preset_layout,
		'f_get'    : pm_get_preset,
		'f_save'   : pm_save_layout,
		'a_presets': [
			{'v':'hr', 't':'horizontal - left to right'},
			{'v':'hl', 't':'horizontal - right to left'},
			{'v':'vb', 't':'vertical - top to bottom'},
			{'v':'vt', 't':'vertical - bottom to top'},
			{'v':'c', 't':'custom '}
		]
};

function pm_getlayout (o_item, b_noinherit) {
	var s_value = 'c',
		s_left  = pm_level_property (o_item, 'level_left'),
		s_top   = pm_level_property (o_item, 'level_top'),
		n_aleft = pm_level_property (o_item, 'level_left', true),
		n_atop  = pm_level_property (o_item, 'level_top', true);

	if (s_left == 'i' && s_left == 'i' && !b_noinherit)
		s_value = 'i'
	else if (n_atop == 0)
		s_value = 'h' + (n_aleft >= 0 ? 'r' : 'l');
	else if (n_aleft == 0)
		s_value = 'v' + (n_atop >= 0 ? 'b' : 't');

	return s_value;
}

function pm_init_layout (o_item) {

	var e_select = document.forms[this.s_form].elements[this.s_sname];
	e_select.options.length = 0;

	if (o_item.n_depth) {
		var s_parentlayout = pm_getlayout(o_item.o_parent, true);
		for (var i = 0; i < this.a_presets.length; i++)
			if (this.a_presets[i]['v'] == s_parentlayout) {
				e_select.options[0] = new Option ('inherit (' + this.a_presets[i]['t'] + ')', '');
				break;
			}
	}

	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[e_select.options.length] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	var s_value = pm_getlayout(o_item);
	for (var i = 0; i < e_select.options.length; i++)
		if (e_select[i].value == s_value) {
			e_select.selectedIndex = i;
			break;
		}
}

function pm_preset_layout (e_select) {
	var s_value  = e_select.options[e_select.selectedIndex].value;

	// horizontal
	if (s_value.charAt(0) == 'h') {
		A_PMAP['level_top'].f_update(0);
		A_PMAP['level_left'].f_update(
			(s_value.charAt(1) == 'r' ? 1 : -1) * pm_level_property (null, 'level_width', true));
	}
	// vertical
	else if (s_value.charAt(0) == 'v') {
		A_PMAP['level_left'].f_update(0);
		A_PMAP['level_top'].f_update(
			(s_value.charAt(1) == 'b' ? 1 : -1) * pm_level_property (null, 'level_height', true));
	}
	// inherit
	else if (s_value == 'i') {
		A_PMAP['level_left'].f_update('i');
		A_PMAP['level_top'].f_update('i');
	}
	// custom
	else {
		A_PMAP['level_left'].f_update();
		A_PMAP['level_top'].f_update();
	}
}

function pm_draw_preset(o_item) {
	document.write (
		'<tr><td class="propName">',this.s_lname,
		' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td><td colspan="2" class="propValue"><select name="',this.s_sname,
		'" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)"></select></td></tr>');
	this.f_init(o_item);
}

function pm_save_layout () {
	var o_item = F_DATA.A_INDEX[N_ID];
	
	// init level information if doesn't exist
	if (!F_DATA.A_TPL[o_item.n_depth])
		F_DATA.A_TPL[o_item.n_depth] = {};

	// get the value
	var s_value = this.f_get();
		
	// delete default values from the configuration structure
	if (s_value == null) {
		F_DATA.A_TPL[o_item.n_depth][this.s_sname] = null;
		delete(F_DATA.A_TPL[o_item.n_depth][this.s_sname]);
		return;
	}
	// save value in the configuration structure
	else 
		F_DATA.A_TPL[o_item.n_depth][this.s_sname] = s_value;

	// do nothing if no 
	if (!F_DATA.A_TPL[o_item.n_depth + 1])
		F_DATA.A_TPL[o_item.n_depth + 1] = {};

	// horizontal blocks - vertical offset 0
	if (s_value.charAt(0) == 'h') {
		F_DATA.A_TPL[o_item.n_depth + 1]['level_bleft'] = 0;
		F_DATA.A_TPL[o_item.n_depth + 1]['level_btop'] = Number(pm_level_property (o_item, 'level_height', true));
	}
	// vertical blocks - horizontal offset 0
	else if (s_value.charAt(0) == 'v') {
		F_DATA.A_TPL[o_item.n_depth + 1]['level_btop'] = 0;
		F_DATA.A_TPL[o_item.n_depth + 1]['level_bleft'] = Number(pm_level_property (o_item, 'level_width', true));
	}	
}

// --------------------------------------------------------------------------------
// level layout (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_layout',
		's_lname'  : 'Layout',
		's_form'   : 'level_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_layout,
		'f_draw'   : pm_draw_preset,
		'f_preset' : pm_preset_layouttmg,
		'f_get'    : pm_get_preset,
		'f_save'   : pm_save_layout,
		'a_presets': [
			{'v':'hr', 't':'horizontal - left to right'},
			{'v':'hl', 't':'horizontal - right to left'},
			{'v':'vb', 't':'vertical - top to bottom'},
			{'v':'vt', 't':'vertical - bottom to top'}
		]
};

function pm_preset_layouttmg (e_select) {
}

// --------------------------------------------------------------------------------
// level width (TM, TMP, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_width',
		's_lname'  : 'Width (px)',
		's_form'   : 'level_edit',
		'n_modes'  : 7,
		'f_init'   : pm_init_levpar,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		'a_presets': [
			{'v':'enter here', 't':'custom width'}
		]
};

function pm_init_levpar (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	e_input.value =	pm_level_property (o_item, this.s_sname, true);

	// re-fill preset selectboxes with options
	e_select.options.length = 0;
	if (o_item.n_depth)
		e_select.options[0] = new Option ('inherit', '');
	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[e_select.options.length] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	// highlight preset if matches the value
	var s_value = pm_level_property (o_item, this.s_sname),
		b_found = false;

	if (pm_level_property (o_item, this.s_sname) == 'i') {
		e_select.selectedIndex = 0;
		e_input.disabled = true;
	}		
	else {
		e_select.selectedIndex = e_select.options.length - 1;
		e_input.disabled = false;
	}

	// disable select if only one option is available		
	e_select.disabled = (e_select.options.length == 1);
}

function pm_update_levpar (s_input) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	if (s_input == 'i') {
		e_input.value =	pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true);
		e_input.disabled = true;
		e_select.selectedIndex = 0;
		return;
	}
		
	if (s_input != null && s_input != e_input.value)
		e_input.value = s_input;
		
	// higlight custom value in preset
	e_select.selectedIndex = e_select.options.length - 1;
	e_input.disabled = false;

	return this.f_valid (e_input);
}

function pm_preset_levpar (e_select) {
	var e_input = document.forms[this.s_form].elements[this.s_sname];
	
	// custom value selected
	if (e_select.selectedIndex == (e_select.options.length - 1)) {
		e_input.disabled = false;
		e_input.focus();
	}
	// inherit
	else if (e_select.options[e_select.selectedIndex].value == 'i') {
		e_input.value =	pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true);
		e_input.disabled = true;
	}
}

// --------------------------------------------------------------------------------
// level height (TM, TMP, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_height',
		's_lname'  : 'Height (px)',
		's_form'   : 'level_edit',
		'n_modes'  : 7,
		'f_init'   : pm_init_levpar,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		'a_presets': [
			{'v':'enter here', 't':'custom height'}
		]
};

// --------------------------------------------------------------------------------
// level horizontal offset (TM, TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_left',
		's_lname'  : 'Horizontal Offset (px)',
		's_form'   : 'level_edit',
		'n_modes'  : 3,
		'f_init'   : pm_init_levpar,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valsig,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		'a_presets': [
			{'v':'enter here', 't':'custom offset'}
		]
};

function pm_valsig (e_input) {
	if (!RE_SIGINT.exec(e_input.value)) {
		alert("'" + e_input.value + "' is not valid value for " + this.s_lname + ".\nOnly integer numbers are accepted.");
		e_input.focus();
		return false;
	}
	return true;
}

// --------------------------------------------------------------------------------
// level vertical offset (TM, TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_top',
		's_lname'  : 'Vertical Offset (px)',
		's_form'   : 'level_edit',
		'n_modes'  : 3,
		'f_init'   : pm_init_levpar,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valsig,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		'a_presets': [
			{'v':'enter here', 't':'custom offset'}
		]
};

// --------------------------------------------------------------------------------
// level horizontal block offset (TM, TMP, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_bleft',
		's_lname'  : 'Block Hor. Offset (px)',
		's_form'   : 'level_edit',
		'n_modes'  : 7,
		'f_init'   : pm_init_bloffset,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valsig,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		's_inher'  : 'menu_left',
		'a_presets': [
			{'v':'enter here', 't':'custom offset'}
		]
};

function pm_init_bloffset (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	e_input.value =	pm_level_property (o_item, this.s_sname, true);

	// re-fill preset selectboxes with options
	e_select.options.length = 0;
	if (!o_item.n_depth) {
		e_select.options[0] = new Option ('default offset', '');
		e_input.value = F_DATA.N_MODE == 2 && F_DATA.A_MENU['menu_pos'] == 'relative'
			? 'n/a (relative)'
			: F_DATA.A_MENU[this.s_inher];
		e_input.disabled = true;
	}
	else {
		if (o_item.n_depth > 1)
			e_select.options[0] = new Option ('inherit', '');

		for (var i = 0; i < this.a_presets.length; i++)
			e_select.options[e_select.options.length] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

		// highlight preset if matches the value
		var s_value = pm_level_property (o_item, this.s_sname),
			b_found = false;

		if (pm_level_property (o_item, this.s_sname) == 'i') {
			e_select.selectedIndex = 0;
			e_input.disabled = true;
		}		
		else {
			e_select.selectedIndex = e_select.options.length - 1;
			e_input.disabled = false;
		}
	}

	// disable select if only one option is available		
	e_select.disabled = (e_select.options.length == 1);
}

// --------------------------------------------------------------------------------
// level vertical block offset (TM, TMP, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_btop',
		's_lname'  : 'Block Ver. Offset (px)',
		's_form'   : 'level_edit',
		'n_modes'  : 7,
		'f_init'   : pm_init_bloffset,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valsig,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		's_inher'  : 'menu_top',
		'a_presets': [
			{'v':'enter here', 't':'custom offset'}
		]
};

// --------------------------------------------------------------------------------
// expand delay (TM, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'time_expand',
		's_lname'  : 'Expand Delay (ms)',
		's_form'   : 'level_edit',
		'n_modes'  : 5,
		'f_init'   : pm_init_levpar,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		'a_presets': [
			{'v':'enter here', 't':'custom delay'}
		]
};

// --------------------------------------------------------------------------------
// hide delay (TM, TMP, TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'time_hide',
		's_lname'  : 'Hide Delay (ms)',
		's_form'   : 'level_edit',
		'n_modes'  : 7,
		'f_init'   : pm_init_levpar,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_levpar,
		'f_preset' : pm_preset_levpar,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		'a_presets': [
			{'v':'enter here', 't':'custom delay'}
		]
};

// --------------------------------------------------------------------------------
// level opacity (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_opacity',
		's_lname'  : 'Opacity (%)',
		's_form'   : 'level_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_opacity,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_opacity,
		'f_preset' : pm_preset_opacity,
		'f_valid'  : pm_valopacity,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_level,
		's_default': 100,
		'a_presets': [
			{'v':100, 't':'default opacity'},
			{'v':95, 't':'95%'},
			{'v':90, 't':'90%'},
			{'v':85, 't':'85%'},
			{'v':80, 't':'80%'},
			{'v':'enter here', 't':'custom opacity'}
		]
};

function pm_init_opacity (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	e_select.options.length = 0;
	var n_value = pm_level_property (o_item, this.s_sname, false);

	// get level (default) value
	if (o_item.n_depth)
		e_select.options[0] = new Option ('inherit', 'i');
	
	// re-fill preset selectboxes with options
	var n_index, n_selected;
	for (var i = 0; i < this.a_presets.length; i++) {
		n_index = e_select.options.length;
		e_select.options[n_index] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);
		if (this.a_presets[i]['v'] == n_value)
			n_selected = n_index;
	}
	
	var n_inherited = o_item.n_depth
		? pm_level_property (o_item.o_parent, this.s_sname, true, this.s_default)
		: this.s_default;

	if (n_selected != null) {
		e_select.selectedIndex = n_selected;
		e_input.value =	n_value;
	}
	else if (n_value == 'i' || n_value == n_inherited) {
		e_select.selectedIndex = 0;
		e_input.value =	n_inherited;
		e_input.disabled = true;
	}
	else if (n_value == this.s_default) {
		e_select.selectedIndex = o_item.n_depth ? 1 : 0;
		e_input.value =	this.s_default;
		e_input.disabled = true;
	}
	else {
		e_select.selectedIndex = e_select.options.length - 1;
		e_input.value =	n_value;
		e_input.disabled = false;
	}

	// disable select if only one option is available		
	e_select.disabled = (e_select.options.length == 1);
}

function pm_preset_opacity (e_select) {
	var e_input = document.forms[this.s_form].elements[this.s_sname];
	if (e_select.selectedIndex == (e_select.options.length - 1)) {
		e_input.disabled = false;
		return;
	}
	var s_value = e_select.options[e_select.selectedIndex].value;
	if (!s_value || s_value == this.s_default) {
		e_input.value = this.s_default;
		e_input.disabled = true;
		return;
	}
	if (s_value == 'i') {
		e_input.value = pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true, this.s_default);
		e_input.disabled = true;
		return;
	}
	e_input.value = s_value;
	e_input.disabled = false;
}

function pm_update_opacity (s_input) {

	var e_input  = document.forms[this.s_form].elements[this.s_sname];
	var e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	if (!this.f_valid (e_input) || s_input > 100)
		return;

	var o_item = F_DATA.A_INDEX[N_ID];
	var n_inherited = o_item.n_depth
		? pm_level_property (o_item.o_parent, this.s_sname, true, this.s_default)
		: this.s_default;

	if (s_input == n_inherited) {
		e_select.selectedIndex = 0;
		e_input.disabled = true;
		return;
	}

	if (s_input == this.s_default) {
		e_select.selectedIndex = o_item.n_depth ? 1 : 0;
		e_input.disabled = true;
		return;
	}

	var b_found = false;
	for (var n_option = 0; n_option < e_select.options.length; n_option++)
		if (e_select.options[n_option].value == s_input) {
			e_select.selectedIndex = n_option;
			return;
		}

	e_select.selectedIndex = e_select.options.length - 1;
}

function pm_valopacity (e_input) {
	if (!RE_UNSINT.exec(e_input.value) || Number(e_input.value) > 100) {
		alert("'" + e_input.value + "' is not valid value for " + this.s_lname + ".\nOnly integer numbers 0..100 are accepted.");
		e_input.focus();
		return false;
	}
	return true;
}

// --------------------------------------------------------------------------------
// level expand transition
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_transexp',
		's_lname'  : 'Expand Transition',
		's_form'   : 'level_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_transition,
		'f_draw'   : pm_draw_transition,
		'f_update' : pm_update_transition,
		'f_preset' : pm_preset_transition,
		'f_default': function () {return '0,0'},
		'f_get'    : pm_get_transition,
		'f_save'   : pm_save_level,
		'a_presets': F_DATA.A_TRANSITIONS
};

function pm_draw_transition (o_item) {
	document.write (
		'<tr><td class="propName">',this.s_lname,
		' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td><td class="propValue"><select name="',this.s_sname,
		'_duration" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_update(this)"><option value="0">no trans.</option>'
	);
		
	for (var i = 1; i <= 15; i++)
		document.write ('<option value="', i, '">', i/10, ' sec.</option>');
		
	document.write (
		'</select></td><td class="propPreset"><select name="',this.s_sname,
		'_trans" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)"></select></td></tr>'
	);
	this.f_init(o_item);
}

function pm_init_transition (o_item) {
	var e_durat  = document.forms[this.s_form].elements[this.s_sname + '_duration'],
		e_trans = document.forms[this.s_form].elements[this.s_sname + '_trans'];

	// value format: "effect_index,duration"
	var s_value = pm_level_property (o_item, this.s_sname, false);
	var a_value = s_value.split(','),
		s_inherited, a_inherited;

	// re-fill preset selectboxes with options
	e_trans.options.length = 0;
	if (o_item.n_depth) {
		s_inherited = pm_level_property (o_item.o_parent, this.s_sname, true, this.f_default());
		a_inherited = s_inherited.split(',');
		e_trans.options[0] = new Option ('inherit (' + this.a_presets[a_inherited[0]]['t'] + ')', 'i');
	}

	for (var i = 0; i < this.a_presets.length; i++)
		e_trans.options[e_trans.options.length] = new Option (this.a_presets[i]['t'], i);
	
	// inherited
	if (s_value == 'i') {
		e_trans.selectedIndex = 0;
		e_durat.selectedIndex = a_inherited ? a_inherited[1] : 0;
		e_durat.disabled = true;
	}
	// disabled
	else if (a_value[0] == 0) {
		e_trans.selectedIndex = o_item.n_depth ? 1 : 0;
		e_durat.disabled = true;
	}
	// explicitly set
	else {
		e_trans.selectedIndex = Number(a_value[0]) + (o_item.n_depth ? 1 : 0);
		e_durat.selectedIndex = a_value[1];
		e_durat.disabled = false;
	}
}

function pm_preset_transition (e_select) {
	var e_durat = document.forms[this.s_form].elements[this.s_sname + '_duration'];

	var s_value = e_select.options[e_select.selectedIndex].value;
	if (s_value == 'i') {
		var s_inherited = pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true, this.f_default());
		a_inherited = s_inherited.split(',');

		e_durat.selectedIndex = a_inherited[1];
		e_durat.disabled = true;
	}
	else if (s_value == 0) {
		e_durat.selectedIndex = 0;
		e_durat.disabled = true;
	}	
	else {
		if (e_durat.selectedIndex == 0)
			e_durat.selectedIndex = 5;
		e_durat.disabled = false;
	}
}

function pm_update_transition (e_select) {
	var e_trans = document.forms[this.s_form].elements[this.s_sname + '_trans'];
	if (e_select.selectedIndex == 0) {
		e_trans.selectedIndex = F_DATA.A_INDEX[N_ID].n_depth ? 1 : 0;
		e_select.disabled = true;
	}
}

function pm_get_transition () {
	var e_trans = document.forms[this.s_form].elements[this.s_sname + '_trans'],
		e_durat = document.forms[this.s_form].elements[this.s_sname + '_duration'],
		n_depth = F_DATA.A_INDEX[N_ID].n_depth;
	var n_trans = e_trans.options[e_trans.selectedIndex].value;
	
	if (n_trans == 'i' || (n_trans == 0 && !n_depth))
		return null;

	var s_result = n_trans + ',' + e_durat.options[e_durat.selectedIndex].value;
	if (n_depth && (s_result == pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true, this.f_default())))
		return null;
	return s_result;
}

// --------------------------------------------------------------------------------
// level hide transition
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_transcol',
		's_lname'  : 'Collapse Transition',
		's_form'   : 'level_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_transition,
		'f_draw'   : pm_draw_transition,
		'f_update' : pm_update_transition,
		'f_preset' : pm_preset_transition,
		'f_default': function () {return '0,0'},
		'f_get'    : pm_get_transition,
		'f_save'   : pm_save_level,
		'a_presets': F_DATA.A_TRANSITIONS
};


// --------------------------------------------------------------------------------
// level shadow (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'level_shadow',
		's_lname'  : 'Shadow',
		's_form'   : 'level_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_shadow,
		'f_draw'   : pm_draw_shadow,
		'f_update' : pm_update_shadow,
		'f_preset' : pm_preset_shadow,
		'f_get'    : pm_get_shadow,
		'f_save'   : pm_save_level
};

function pm_draw_shadow (o_item) {
	document.write (
		'<tr><td class="propName" rowspan="2">',this.s_lname,
		' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td><td class="propValue"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td width="1%" style="padding:1px">Hor. </td><td align="right"><select name="',this.s_sname,
		'_x" onchange="A_PMAP[\'',this.s_sname, '\'].f_preset(this)" style="width: 55px"><option value="0">n/a</option>');
		
	for (var i = 1; i <= 10; i++)
		document.write ('<option value="', i, '">', i, ' px</option>');
		
	document.write (
		'</select></td></tr></table></td><td class="propValue"><select name="',this.s_sname,
		'" onchange="A_PMAP[\'',this.s_sname, '\'].f_preset(this)"></select></td></tr><tr><td class="propValue"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td width="1%" style="padding:1px">Ver. </td><td align="right"><select name="',this.s_sname,
		'_y" onchange="A_PMAP[\'',this.s_sname, '\'].f_preset(this)" style="width: 55px"><option value="0">n/a</option>');
		
	for (var i = 1; i <= 10; i++)
		document.write ('<option value="', i, '">', i, ' px</option>');

	document.write (
		'</select></td></tr></table></td><td class="propPreset"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td width="35" align="center">Color:</td><td><input type="text" name="',this.s_sname,
		'_color" onchange="return A_PMAP[\'',this.s_sname,'\'].f_update(this)" style="width:100%"></td><td width="19" align="center"><a href="javascript:if(!document.forms[\'', this.s_form, '\'].elements[\'', this.s_sname, '_color\'].disabled) TCP.popup(document.forms[\'', this.s_form, '\'].elements[\'', this.s_sname, '_color\'])"><img width="15" height="13" border="0" alt="Click Here to Pick up the color" src="images/sel.gif"></a></td></tr></table></td></tr>'
	);
	this.f_init(o_item);
}

function pm_init_shadow (o_item) {
	var e_presets  = document.forms[this.s_form].elements[this.s_sname],
		e_offset_x = document.forms[this.s_form].elements[this.s_sname + '_x'],
		e_offset_y = document.forms[this.s_form].elements[this.s_sname + '_y'],
		e_color    = document.forms[this.s_form].elements[this.s_sname + '_color'];

	// not available for root level
	e_presets.options.length = 0;
	e_presets.options[0] = new Option ('no shadow', '');
	
	if (!o_item.n_depth) {
		e_presets.disabled = true;
		e_offset_x.selectedIndex = 0;
		e_offset_x.disabled = true;
		e_offset_y.selectedIndex = 0;
		e_offset_y.disabled = true;
		e_color.value = 'n/a (root)';
		e_color.disabled = true;
		return;
	}

	e_presets.disabled = false;
	if (o_item.n_depth > 1)
		e_presets.options[1] = new Option ('inherit', 'i');

	e_presets.options[e_presets.options.length] = new Option ('custom shadow', 'c');
	
	// load value
	var s_value = pm_level_property (o_item, this.s_sname, false);
	var s_inherited = pm_level_property (o_item.o_parent, this.s_sname, true);
	
	if (s_value == 'i') {
		// disabled
		if (o_item.n_depth == 1) {
			e_presets.selectedIndex = 0;
			e_offset_x.selectedIndex = 0;
			e_offset_x.disabled = true;
			e_offset_y.selectedIndex = 0;
			e_offset_y.disabled = true;
			e_color.value = 'n/a (off)';
			e_color.disabled = true;
			return;
		}
		// inherited
		else {
			var a_inherited = s_inherited.split(',');
			e_presets.selectedIndex = 1;
			e_offset_x.selectedIndex = s_inherited == 'i' ? 0 : a_inherited[0];
			e_offset_x.disabled = true;
			e_offset_y.selectedIndex = s_inherited == 'i' ? 0 : a_inherited[1];
			e_offset_y.disabled = true;
			e_color.value  = s_inherited == 'i' ? 'n/a (off)' : a_inherited[2];
			e_color.disabled = true;
			return;
		}
	}
	// custom
	var a_value = s_value.split(',');
	e_presets.selectedIndex = e_presets.options.length - 1;
	e_offset_x.selectedIndex = a_value[0];
	e_offset_x.disabled = false;
	e_offset_y.selectedIndex = a_value[1];
	e_offset_y.disabled = false;
	e_color.value  = a_value[2];
	e_color.disabled = false;
}

function pm_preset_shadow (e_select) {
	var e_presets  = document.forms[this.s_form].elements[this.s_sname],
		e_offset_x = document.forms[this.s_form].elements[this.s_sname + '_x'],
		e_offset_y = document.forms[this.s_form].elements[this.s_sname + '_y'],
		e_color    = document.forms[this.s_form].elements[this.s_sname + '_color'];

		// disabled
		if (e_select.selectedIndex == 0) {
			e_presets.selectedInxex = 0;
			e_offset_x.selectedIndex = 0;
			e_offset_x.disabled = true;
			e_offset_y.selectedIndex = 0;
			e_offset_y.disabled = true;
			e_color.value = 'n/a (off)';
			e_color.disabled = true;
			return;
		}
		if (e_select != e_presets)
			return;
		
		// inherited
		var s_inherited = pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true);
		if (e_presets.options[e_presets.selectedIndex].value == 'i') {
			var a_inherited = s_inherited.split(',');
			e_offset_x.selectedIndex = s_inherited == 'i' ? 0 : a_inherited[0];
			e_offset_x.disabled = true;
			e_offset_y.selectedIndex = s_inherited == 'i' ? 0 : a_inherited[1];
			e_offset_y.disabled = true;
			e_color.value  = s_inherited == 'i' ? 'n/a (off)' : a_inherited[2];
			e_color.disabled = true;
			return;
		}
		
		// custom
		if (!e_offset_x.selectedIndex) {
			e_offset_x.selectedIndex = 4;
			e_offset_y.selectedIndex = 4;
			e_color.value = '#A0A0A0';
		}
		e_offset_x.disabled = false;
		e_offset_y.disabled = false;
		e_color.disabled = false;
}

function pm_update_shadow (e_input) {
	var s_value = String(e_input.value);
	if (!s_value.match(/(^\#[a-f\d]{6}$)|(^[a-z]+$)/i)) {
		alert(s_value + ' is not valid color for shadow.')
		return false;
	}
	return true;
}

function pm_get_shadow () {
	var e_presets  = document.forms[this.s_form].elements[this.s_sname],
		e_offset_x = document.forms[this.s_form].elements[this.s_sname + '_x'],
		e_offset_y = document.forms[this.s_form].elements[this.s_sname + '_y'],
		e_color    = document.forms[this.s_form].elements[this.s_sname + '_color'],
		n_depth = F_DATA.A_INDEX[N_ID].n_depth;

	// validate color
	var s_preset = e_presets.options[e_presets.selectedIndex].value;
	
	if (s_preset == 'i' || (!s_preset && n_depth < 2))
		return null;

	var s_result = 
		e_offset_x.options[e_offset_x.selectedIndex].value + ',' +
		e_offset_y.options[e_offset_y.selectedIndex].value + ',' +
		e_color.value;
	
	if (n_depth && (s_result == pm_level_property (F_DATA.A_INDEX[N_ID].o_parent, this.s_sname, true)))
		return null;
	return s_result;
}

// --------------------------------------------------------------------------------
// Edit Menu Form
// --------------------------------------------------------------------------------
// menu name (all)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_name',
		's_lname'  : 'Name',
		's_form'   : 'menu_edit',
		'n_modes'  : 7,
		's_default': '- Untitled -',
		'f_init'   : pm_init_menuname,
		'f_draw'   : pm_draw_menuname,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valalpha,
		'f_get'    : pm_get_input,
		'f_save'   : pm_save_menu
};

function pm_init_menuname (o_item) {
	document.forms[this.s_form].elements[this.s_sname].value = (!F_DATA.A_MENU[this.s_sname] ? this.s_default : F_DATA.A_MENU[this.s_sname]);
}

function pm_valalpha (e_input) {
	if (!RE_ALPHA.exec(e_input.value)) {
		alert("'" + e_input.value + "' is not valid value for " + this.s_lname + ".\nOnly alphanumeric characters are allowed.");
		e_input.focus();
		return false;
	}
	return true;
}

function pm_draw_menuname () {
	var s_value = (!F_DATA.A_MENU[this.s_sname] ? this.s_default : F_DATA.A_MENU[this.s_sname]);
	document.write (
		'<tr><td class="propName">', this.s_lname,' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td>',
		'<td class="propValue" colspan="2"><input type="Text" name="',
		this.s_sname,'" value="', s_value ,'" onchange="A_PMAP[\'',this.s_sname,
		'\'].f_update(this.value)"></td></tr>'
	);
}


function pm_save_menu () {
	// get the value
	var s_value = this.f_get();
	
	// delete default values from the configuration structure
	if (s_value == null) {
		F_DATA.A_MENU[this.s_sname] = null;
		delete(F_DATA.A_MENU[this.s_sname]);
	}
	// save value in the configuration structure
	else 
		F_DATA.A_MENU[this.s_sname] = s_value;
}

// --------------------------------------------------------------------------------
// menu positioning (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_pos',
		's_lname'  : 'Positioning',
		's_form'   : 'menu_edit',
		's_default': 'relative', // relative positioning by default
		'n_modes'  : 4,
		'f_init'   : pm_init_tmgpos,
		'f_draw'   : pm_draw_tmgpos,
		'f_preset' : pm_preset_tmgpos,
		'f_get'    : pm_get_radio,
		'f_save'   : pm_save_menu
};

function pm_init_tmgpos (o_item) {
	var e_radio = document.forms[this.s_form].elements[this.s_sname];
	var s_value = F_DATA.A_MENU[this.s_sname] ? F_DATA.A_MENU[this.s_sname] : this.s_default;

	for (var i = 0; i < e_radio.length; i++)
		e_radio[i].checked = (s_value == e_radio[i].value);
}

function pm_preset_tmgpos (e_radio) {
	A_PMAP['menu_left'].f_init();
	A_PMAP['menu_top'].f_init();
	e_radio.blur();
}

function pm_draw_tmgpos (o_item) {

	document.write (
		'<tr><td class="propName">', this.s_lname,' <a href="javascript:f_help(\'', this.s_sname,
		'\')" title="more details about this feature"><img src="images/help.gif" border="0" align="absmiddle"></a></td>',
		'<td class="propValue" colspan="2"><table border="0" cellpadding="0" cellspacing="0"><tr><td><input type="Radio" name="',
		this.s_sname,'" value="relative" onclick="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)" style="width: 24px; border: 0"></td><td>relative</td><td><input type="Radio" name="',
		this.s_sname,'" value="absolute" onclick="A_PMAP[\'',this.s_sname,
		'\'].f_preset(this)" style="width: 24px; border: 0"></td><td>absolute</td></tr></table></td></tr>'
	);
	this.f_init(o_item);
}

function pm_get_radio () {
	var e_radio  = document.forms[this.s_form].elements[this.s_sname],
		s_value;
	for (var i = 0; i < e_radio.length; i++)
		if (e_radio[i].checked) {
			s_value = e_radio[i].value;
			break;
		}
	return s_value;
}

// --------------------------------------------------------------------------------
// menu z-index (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_zindex',
		's_lname'  : 'Base z-index',
		's_form'   : 'menu_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_menzindex,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_menuzindex,
		'f_preset' : pm_preset_menuzindex,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_menu
};

function pm_init_menzindex (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	e_select.options[0] = new Option ('default z-Index', '');
	e_select.options[1] = new Option ('custom z-Index', 'enter z-Index here');
	var s_value = (!F_DATA.A_MENU[this.s_sname] ? 0 : F_DATA.A_MENU[this.s_sname]);
	
	e_input.value = s_value;
	if (s_value) {
		e_select.selectedIndex = 1;
		e_input.disabled = false;
	}
	else {
		e_select.selectedIndex = 0;
		e_input.disabled = true;
	}
}

function pm_preset_menuzindex (e_select) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		s_value = e_select.options[e_select.selectedIndex].value;
	
	e_input.value = s_value ? s_value : 0;
	e_input.disabled = !e_select.selectedIndex;
}

function pm_update_menuzindex (s_input) {

	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	if (Number(s_input)) {
		e_input.disabled = false;
		e_select.selectedIndex = 1;
	}
	else {
		e_input.disabled = true;
		e_select.selectedIndex = 0;
		return;
	}

	return this.f_valid (e_input);
}


// --------------------------------------------------------------------------------
// menu x coord (TM)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_left',
		's_lname'  : 'Menu Hor. Offset (px)',
		's_form'   : 'menu_edit',
		'n_modes'  : 1,
		'f_init'   : pm_init_menupos,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_menu,
		's_default': 20
};

function pm_init_menupos (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];
	e_input.value = (!F_DATA.A_MENU[this.s_sname] ? this.s_default : F_DATA.A_MENU[this.s_sname]);
	if (!e_select.options.length) {
		e_select.options[0] = new Option ('custom offset');
		e_select.disabled = true;
	}
}

// --------------------------------------------------------------------------------
// menu x coord (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_left',
		's_lname'  : 'Menu Hor. Offset (px)',
		's_form'   : 'menu_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_menupos,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valsig,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_menu,
		's_default': 20
};

// --------------------------------------------------------------------------------
// menu x coord (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_left',
		's_lname'  : 'Menu Hor. Offset (px)',
		's_form'   : 'menu_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_postmg,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_postmg,
		'f_save'   : pm_save_menu,
		's_default': 20
};

function pm_init_postmg (o_item) {
	var e_input  = document.forms[this.s_form].elements[this.s_sname],
		e_select = document.forms[this.s_form].elements[this.s_sname + '_preset'];

	e_select.options[0] = new Option ('custom offset');
	e_select.disabled = true;

	var s_value = F_DATA.A_MENU[this.s_sname] ? F_DATA.A_MENU[this.s_sname] : this.s_default;

	if (A_PMAP['menu_pos'].f_get() == 'relative') {
		e_input.value = 'n/a (relative)';
		e_input.disabled = true;
	}
	else {
		e_input.value = s_value;
		e_input.disabled = false;
	}
}

function pm_get_postmg () {
	if (A_PMAP['menu_pos'].f_get() == 'relative')
		return F_DATA.A_MENU[this.s_sname] ? F_DATA.A_MENU[this.s_sname] : this.s_default;
	return document.forms[this.s_form].elements[this.s_sname].value;
}

// --------------------------------------------------------------------------------
// menu y coord (TM)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_top',
		's_lname'  : 'Menu Ver. Offset (px)',
		's_form'   : 'menu_edit',
		'n_modes'  : 1,
		'f_init'   : pm_init_menupos,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_menu,
		's_default': 20
};

// --------------------------------------------------------------------------------
// menu y coord (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_top',
		's_lname'  : 'Menu Ver. Offset (px)',
		's_form'   : 'menu_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_menupos,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valsig,
		'f_get'    : pm_get_inpwpres,
		'f_save'   : pm_save_menu,
		's_default': 20
};

// --------------------------------------------------------------------------------
// menu y coord (TMG)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_top',
		's_lname'  : 'Menu Ver. Offset (px)',
		's_form'   : 'menu_edit',
		'n_modes'  : 4,
		'f_init'   : pm_init_postmg,
		'f_draw'   : pm_draw_inpwpres2,
		'f_update' : pm_update_simplevalid,
		'f_valid'  : pm_valuns,
		'f_get'    : pm_get_postmg,
		'f_save'   : pm_save_menu,
		's_default': 20
};

// --------------------------------------------------------------------------------
// menu align (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_align',
		's_lname'  : 'Menu Align',
		's_form'   : 'menu_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_menuprop,
		'f_draw'   : pm_draw_preset,
		'f_preset' : pm_nop,
		'f_get'    : pm_get_preset,
		'f_save'   : pm_save_menu,
		'a_presets': [
			{'v':'left', 't':'left (default)'},
			{'v':'center', 't':'center'},
			{'v':'right', 't':'right'}
		]
};

function pm_init_menuprop (o_item) {
	var e_select = document.forms[this.s_form].elements[this.s_sname];
	e_select.options.length = 0;

	for (var i = 0; i < this.a_presets.length; i++)
		e_select.options[i] = new Option (this.a_presets[i]['t'], this.a_presets[i]['v']);

	var s_value = F_DATA.A_MENU[this.s_sname];
	for (var i = 0; i < e_select.options.length; i++)
		if (e_select[i].value == s_value) {
			e_select.selectedIndex = i;
			break;
		}
}

function pm_nop (s_input) {
}

// --------------------------------------------------------------------------------
// menu vertical align (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_valign',
		's_lname'  : 'Menu Vertical Align',
		's_form'   : 'menu_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_menuprop,
		'f_draw'   : pm_draw_preset,
		'f_preset' : pm_nop,
		'f_get'    : pm_get_preset,
		'f_save'   : pm_save_menu,
		'a_presets': [
			{'v':'top', 't':'top (default)'},
			{'v':'center', 't':'midlle'},
			{'v':'bottom', 't':'bottom'}
		]
};

// --------------------------------------------------------------------------------
// menu static positioning (TMP)
A_PROPS[A_PROPS.length] = {
		's_sname'  : 'menu_static',
		's_lname'  : 'Static Positioning',
		's_form'   : 'menu_edit',
		'n_modes'  : 2,
		'f_init'   : pm_init_menuprop,
		'f_draw'   : pm_draw_preset,
		'f_preset' : pm_nop,
		'f_get'    : pm_get_preset,
		'f_save'   : pm_save_menu,
		'a_presets': [
			{'v':'none', 't':'off (default)'},
			{'v':'vertical', 't':'vertical'},
			{'v':'horizontal', 't':'horizontal'},
			{'v':'both', 't':'both'}
		]
};

// --------------------------------------------------------------------------------
