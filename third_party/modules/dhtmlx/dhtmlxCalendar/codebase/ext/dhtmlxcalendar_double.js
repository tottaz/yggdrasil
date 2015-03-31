window.dhtmlxDblCalendarObject = window.dhtmlXDoubleCalendarObject = window.dhtmlXDoubleCalendar = function(parentId) {
	
	var that = this;
	
	this.leftCalendar = new dhtmlXCalendarObject(parentId);
	this.leftCalendar.hideTime();
	this.rightCalendar = new dhtmlXCalendarObject(parentId);
	this.rightCalendar.hideTime();
	
	this.leftCalendar.attachEvent("onClick", function(d){
		that._updateRange("rightCalendar", d, null);
		that.callEvent("onClick", ["left", d]);
	});
	
	this.rightCalendar.attachEvent("onClick", function(d){
		that._updateRange("leftCalendar", null, d);
		that.callEvent("onClick", ["right", d]);
	});
	
	this.leftCalendar.attachEvent("onBeforeChange", function(d){
		return that.callEvent("onBeforeChange", ["left",d]);
	});
	
	this.rightCalendar.attachEvent("onBeforeChange", function(d){
		return that.callEvent("onBeforeChange", ["right",d]);
	});
	
	this.show = function() {
		this.leftCalendar.show();
		this.rightCalendar.base.style.marginLeft=this.leftCalendar.base.offsetWidth-1+"px";
		this.rightCalendar.show();
	}
	
	this.hide = function() {
		this.leftCalendar.hide();
		this.rightCalendar.hide();
	}
	
	this.setDateFormat = function(t) {
		this.leftCalendar.setDateFormat(t);
		this.rightCalendar.setDateFormat(t);
	}
	
	this.setDates = function(d0, d1) {
		if (d0 != null) this.leftCalendar.setDate(d0);
		if (d1 != null) this.rightCalendar.setDate(d1);
		this._updateRange();
	}
	
	this._updateRange = function(obj, from, to) {
		if (arguments.length == 3) {
			this[obj].setSensitiveRange(from, to);
		} else {
			this.leftCalendar.setSensitiveRange(null, this.rightCalendar.getDate());
			this.rightCalendar.setSensitiveRange(this.leftCalendar.getDate(), null);
		}
	}
	
	this.getFormatedDate = function() {
		return this.leftCalendar.getFormatedDate.apply(this.leftCalendar, arguments);
	}
	
	dhtmlxEventable(this);
	
	return this;
}
