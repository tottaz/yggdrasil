/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 var SpreadSheetHeaderEditor = {
	ed: null,
	init:function(){
		dhtmlxEvent(document.body, "mousedown", function(e) {
			var target = e.target || e.srcElement;
			if (target == SpreadSheetHeaderEditor.ed) return;
			SpreadSheetHeaderEditor.editStop();
		});
		return SpreadSheetHeaderEditor;
	},

	get_input: function() {
		var ed = document.createElement('input');
		SpreadSheetHeaderEditor.target.innerHTML = '';
		SpreadSheetHeaderEditor.target.appendChild(ed);
		SpreadSheetHeaderEditor.target.className = SpreadSheetHeaderEditor.target.className + ' no_paddings';
		ed.className = 'header_editor';
		ed.value = SpreadSheetHeaderEditor.value;
		return ed;
	},

	editStart: function(target, value, callback) {
		if (target === SpreadSheetHeaderEditor.ed) return false;
		SpreadSheetHeaderEditor.target = target;
		value  = value.replace(/&lt;/g, '<');
		value  = value.replace(/&gt;/g, '>');
		SpreadSheetHeaderEditor.value = value;
		SpreadSheetHeaderEditor.callback = callback;
		SpreadSheetHeaderEditor.ed = SpreadSheetHeaderEditor.get_input();
		target.parentNode.className += ' no_paddings_parent';
		dhtmlxEvent(SpreadSheetHeaderEditor.ed, "keydown", function(e) {
			var code = e.which||e.keyCode;
			if (code == 13 || code == 9)
				SpreadSheetHeaderEditor.editStop();
			else if (code == 27)
				SpreadSheetHeaderEditor.editStop(true);
		});
		SpreadSheetHeaderEditor.ed.focus();
	},

	editStop: function(dont_save) {
		if (SpreadSheetHeaderEditor.ed === null) return;
		dont_save = dont_save || false;
		var value = (dont_save === true) ? SpreadSheetHeaderEditor.value : SpreadSheetHeaderEditor.ed.value;
		value  = value.replace(/</g, '&lt;');
		value  = value.replace(/>/g, '&gt;');
		SpreadSheetHeaderEditor.target.removeChild(SpreadSheetHeaderEditor.ed);
		SpreadSheetHeaderEditor.target.innerHTML = value;
		SpreadSheetHeaderEditor.target.className = SpreadSheetHeaderEditor.target.className.replace(' no_paddings', '');
		SpreadSheetHeaderEditor.target.parentNode.className = SpreadSheetHeaderEditor.target.parentNode.className.replace(' no_paddings_parent', '');
		if (SpreadSheetHeaderEditor.callback && SpreadSheetHeaderEditor.value != value)
			SpreadSheetHeaderEditor.callback[0].saveHeadCell(SpreadSheetHeaderEditor.callback[1], value, SpreadSheetHeaderEditor.callback[2]);
		SpreadSheetHeaderEditor.unload();
	},

	unload: function() {
		SpreadSheetHeaderEditor.ed = null;
		SpreadSheetHeaderEditor.value = null;
		SpreadSheetHeaderEditor.callback = null;
		SpreadSheetHeaderEditor.target = null;
	}
};