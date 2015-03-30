// Title: Tigra Tree Menu (special version)
// Description: See the demo at url
// URL: http://www.softcomplex.com/products/tigra_menu_tree/
// Version: 1.1
// Date: 05/18/2005
// Notes: This script is free. Visit official site for further details.

function tree (a_items, a_index, a_template) {

	this.a_tpl      = a_template;
	this.o_root     = this;
	this.a_index    = typeof(a_index) == 'object' ? a_index : [];
	this.o_selected = null;
	this.n_depth    = -1;
	
	var o_icone = new Image(),
		o_iconl = new Image();
	o_icone.src = a_template['icon_e'];
	o_iconl.src = a_template['icon_l'];
	a_template['im_e'] = o_icone;
	a_template['im_l'] = o_iconl;
	for (var i = 0; i < 64; i++)
		if (a_template['icon_' + i]) {
			var o_icon = new Image();
			a_template['im_' + i] = o_icon;
			o_icon.src = a_template['icon_' + i];
		}
	
	this.toggle = function (n_id) {	var o_item = this.a_index[n_id]; o_item.open(o_item.b_opened) };
	this.select = function (n_id, e_element) { return this.a_index[n_id].select(null, e_element); };

	this.children = a_items;
	item_add_temp(this);
	for (var i = 0; i < a_items.length; i++)
		new tree_item(this, i);

	this.n_id = trees.length;
	trees[this.n_id] = this;
	
	for (var i = 0; i < this.children.length; i++) {
		document.write(this.children[i].init());
		this.children[i].open();
	}
}
function tree_item (o_parent, n_order) {

	var o_item = o_parent.children[n_order];
	if (typeof(o_item) != 'object')
		return;

	o_item.n_depth  = o_parent.n_depth + 1;
	o_item.o_root    = o_parent.o_root;
	o_item.o_parent  = o_parent;
	o_item.n_order   = n_order;
//	if (o_item.b_opened == null) 
//>>> todo: implement the state persistance
		o_item.b_opened  =  !o_item.n_depth;

	if (o_item.n_id == null) {
		o_item.n_id = o_item.o_root.a_index.length;
		o_item.o_root.a_index[o_item.n_id] = o_item;
	}

	o_item.get_icon = item_get_icon;
	o_item.select   = item_select;
	o_item.init     = item_init;
	o_item.is_last  = o_item.n_order == o_item.o_parent.children.length - 1;
	o_item.open     = item_open;

	if (!o_item.children)
		o_item.children = [];

	if (o_item.temp) return;
	item_add_temp(o_item);

	for (var i = 0; i < o_item.children.length; i++)
		new tree_item(o_item, i);

}

function item_open (b_close) {
	var o_idiv = get_element('i_div' + this.o_root.n_id + '_' + this.n_id);
	if (!o_idiv) return;
	
	var a_children = [];
	if (!o_idiv.innerHTML) {
		for (var i = 0; i < this.children.length; i++)
			a_children[i]= this.children[i].init();
		o_idiv.innerHTML = a_children.join('');
	}
	o_idiv.style.display = (b_close ? 'none' : 'block');
	
	this.b_opened = !b_close;
	var o_jicon = document.images['j_img' + this.o_root.n_id + '_' + this.n_id],
		o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
	if (o_jicon) o_jicon.src = this.get_icon(true);
	if (o_iicon) o_iicon.src = this.get_icon();
}

function item_select (b_deselect, e_element) {

	if (e_element)
		e_element.blur();
	if (this.o_root.b_selectmode) {
		this.o_root.b_selectmode = false;
		F_PROPS.item_move(null, this.n_id);
		return false;
	}

	if (!b_deselect) {
		var o_olditem = this.o_root.o_selected;
		this.o_root.o_selected = this;
		if (o_olditem) o_olditem.select(true);

		// open items recursively
		var o_item = this, a_parents = [];
		while (o_item.n_depth >= 0) {
			a_parents[o_item.n_depth] = o_item;
			o_item = o_item.o_parent;
		}
		for (var i = 0; i < a_parents.length; i++)
			if (!a_parents[i].b_opened) a_parents[i].open();
	}
	var o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
	if (o_iicon) o_iicon.src = this.get_icon();
	get_element('i_txt' + this.o_root.n_id + '_' + this.n_id).style.fontWeight = b_deselect ? 'normal' : 'bold';

	return true;
}

function item_init () {
	var a_offset = [],
		o_current_item = this.o_parent;
	for (var i = this.n_depth; i > 1; i--) {
		a_offset[i] = '<img src="' + this.o_root.a_tpl[o_current_item.is_last ? 'icon_e' : 'icon_l'] + '" border="0" align="absbottom">';
		o_current_item = o_current_item.o_parent;
	}
	return '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td nowrap>'
	+ (this.n_depth ? a_offset.join('') + (this.children.length
		? '<a href="javascript: trees[' + this.o_root.n_id + '].toggle(' + this.n_id
		+ ')" onclick="this.blur()"><img src="' + this.get_icon(true) + '" border="0" align="absbottom" name="j_img'
		+ this.o_root.n_id + '_' + this.n_id + '"></a>'
		: '<img src="' + this.get_icon(true) + '" border="0" align="absbottom">') : '') 
		+ '<a href="javascript:F_PROPS.item_'
		+ 'edit(' + this.n_id + ')" onclick="return trees[' + this.o_root.n_id + '].select(' + this.n_id
		+ ', this)" ondblclick="trees[' + this.o_root.n_id + '].toggle(' + this.n_id
		+ ')" class="t' + this.o_root.n_id + 'i" id="i_txt' + this.o_root.n_id + '_' + this.n_id
		+ '" title="Click to edit this item"><img src="' + this.get_icon() + '" border="0" align="absbottom" name="i_img'
		+ this.o_root.n_id + '_' + this.n_id + '" class="t' + this.o_root.n_id + 'im">'
		+ (this.temp ? '[new item here]' : this.text_caption) + '</a>' + (this.temp ? '' : '</td><td width="100%" background="images/dots.gif">&nbsp;</td><td align="right" nowrap>&nbsp;[<a href="javascript:F_PROPS.item_delete('
		+ this.n_id + ')" title="Click to delete this item">delete</a>][<a href="javascript:F_PROPS.item_copy(' + this.n_id + ')" title="click to duplicate this item">copy</a>]'
		+ (this.n_order ? '[<a href="javascript:F_PROPS.item_up(' + this.n_id + ')" title="click to move this item up in the same block">up</a>]' : '[<span style="color:gray;">up</span>]')
		+ (this.n_order == this.o_parent.children.length - 2 ? '[<span style="color:gray;">down</span>]' : '[<a href="javascript:F_PROPS.item_down(' + this.n_id + ')" title="click to move this item down in the same block">down</a>]')
		+ '[<a href="javascript:F_PROPS.item_move(' + this.n_id + ')" title="click to move this item to another parent">move</a>]</td>') + '</tr></table>' + (this.children.length ? '<div id="i_div' + this.o_root.n_id + '_' + this.n_id + '" style="display:none"></div>' : '');
}

function item_get_icon (b_junction) {
	return this.o_root.a_tpl['icon_' + ((this.n_depth ? 0 : 32) + (this.children.length ? 16 : 0) + (this.children.length && this.b_opened ? 8 : 0) + (!b_junction && this.o_root.o_selected == this ? 4 : 0) + (b_junction ? 2 : 0) + (b_junction && this.is_last ? 1 : 0))];
}

function item_add_temp(o_item) {
	if (!o_item.children.length || !o_item.children[o_item.children.length - 1].temp)
		o_item.children[o_item.children.length] = {'temp':1 };
}

var trees = [];
get_element = document.all ?
	function (s_id) { return document.all[s_id] } :
	function (s_id) { return document.getElementById(s_id) };
