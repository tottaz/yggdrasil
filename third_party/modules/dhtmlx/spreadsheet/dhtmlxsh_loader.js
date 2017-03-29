/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 SpreadsheetLoader = {

	request: function(url, params, callback, master, method) {
		method = method || 'ajax';
		switch (method) {
			case 'jsonp':
				this.jsonp(url, params, callback, master);
				break;
			case 'ajax':
			default:
				this.ajax(url, params, callback, master);
				break;
		}
	},

	jsonp: function(url, params, callback, master){
		var id = "dhx_jsonp_" + this.uid();
		var script = document.createElement('script');
		script.id = id;
		script.type = 'text/javascript';

		var head = document.getElementsByTagName("head")[0];
		if (!params)
			params = {};
		params.jsonp = "SpreadsheetLoader."+id;
		this[id]=function(){
			callback.apply(master||window, arguments);
			script.parentNode.removeChild(script);
			callback = head = master = script = null;
			delete this[id];
		};

		var vals = [];
		for (var key in params)
			if (typeof(params[key]) == "object")
				for (var index in params[key])
					vals.push(key + '[' + index + ']=' + encodeURIComponent(params[key][index]));
			else
				vals.push(key + "=" + encodeURIComponent(params[key]));

		url += (url.indexOf("?") == -1 ? "?" : "&") + vals.join("&");

		script.src = url;
		head.appendChild(script);
	},

	ajax: function(url, params, callback) {
		params = this.serialize(params);
		dhtmlxAjax.post(url, params, function(response) {
			if (response.xmlDoc.responseText !== '')
				callback(eval('(' + response.xmlDoc.responseText + ')'));
		});
	},

	serialize: function(params, parent) {
		var parent_start = (!parent) ? '' : parent + '[';
		var parent_end = (!parent) ? '' : ']';
		var text = [];
		for (var i in params) {
			if (typeof(params[i]) == 'function') continue;
			if (typeof(params[i]) == 'object')
				text.push(this.serialize(params[i], (!parent)? i : parent + '[' + i + ']'));
			else
				text.push(parent_start + i + parent_end + "=" + encodeURIComponent(params[i]));
		}
		return text.join('&');
	},

	uid: function() {
		if (!this._seed) this._seed=(new Date).valueOf();	//init seed with timestemp
		this._seed++;
		return this._seed;
	}

};