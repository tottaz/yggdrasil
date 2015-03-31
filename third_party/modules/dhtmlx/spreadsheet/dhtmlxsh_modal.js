/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 var SpreadSheetModal = {
	x: 0,
	y: 0,
	width: null,
	height: null,
	_init_modal:function(parent){
		if (this._modal) return true;
		var d = document.createElement("DIV");
		d.className = "dhx_spread_modal";
		d.style.display="none";
		d.style.left = this.x + 'px';
		d.style.top = this.y + 'px';
		d.style.width = (this.width !== null) ? (this.width + 'px') : '100%';
		d.style.height = (this.height !== null) ? (this.height + 'px') : '100%';
		parent = parent || document.body;
		parent.appendChild(d);
		this._modal = d;
	},
	show: function(parent) {
		this._init_modal(parent);
		this._modal.style.display = 'block';
	},
	hide: function() {
		if (this._modal) {
			this._modal.style.display = 'none';
			this._modal.parentNode.removeChild(this._modal);
			this._modal = null;
		}
	},
	position: function(x, y) {
		this.x = x;
		this.y = y;
		console.log(x, y);
	},
	size: function(width, height) {
		this.width = width;
		this.height = height;
	}
}