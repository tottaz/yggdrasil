function time() {
	return Math.floor(new Date().getTime() / 1000);
}

function errorLog(msg) {
	//alert(msg);
}

function randomString(len) {
	var i, b = '', c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for (i = 0; i < len; i++) b += c.charAt(Math.floor(Math.random() * c.length));
	return b;
}

function strip_tags(str) {
	str = str.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
	return str.replace(/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi, '');
}

function bigInt(num, sep) {
	if (typeof(sep) == 'undefined') sep = '.';
	return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + sep);
}


function iframeSave(id) {
	$('#save_status_' + id).text('Saving...');
}

function onAjaxDelete(id, url) {
	if (confirm('Are you sure you want to delete this item?')) {
		$('#save_status_' + id).text('Deleting...');
		$.get(url, function(data) {
			$('#iframe_save_item_' + id).css('display', 'none');
		});
	}
	else {
		return false;
	}
}

function scrollIntoView(element, container) {
	
	var containerTop = container.scrollTop();
	var containerBottom = containerTop + container.height(); 
	var elemTop = element.get(0).offsetTop - element.get(0).parentNode.offsetTop - 5;
	var elemBottom = elemTop + element.height(); 
	if (elemTop < containerTop) {
		container.scrollTop(elemTop);
	} else if (elemBottom > containerBottom) {
		container.scrollTop(elemBottom - container.height() + 10);
	}
}



// General functions for every page
$(document).ready(function() {
	// Set the search field settings
	$('#input_menubar_search_submit').click(function() {
		location.href = this.href + '?search=' + $('#input_menubar_search').val();
		return false;
	});
	$('#input_menubar_search').keyup(function(event) {
		if (event.keyCode == 13) {
			location.href = $('#input_menubar_search_submit').attr('href') + '?search=' + this.value;
		}
	});
});



// Autocomplete function
function bzgAutoComplete(handle) {
	var thisHandle = this;
	this.inputHandle = handle;
	this.uniqueId = 'bzgAutoComplete' + Math.round(Math.random() * 9999);
	this.selectedIndex = -1;
	
	this.loadData = function(string, callBack) {
		callBack(["value 1", "value 2", "value 3"]);
	}
	
	this.onSelect = function(val) {
		this.inputHandle.val(val);
		this.hideDropdown();
	}
	
	this.showDropdown = function(data) {
		this.hideDropdown();
		this.selectedIndex = -1;
		var offset = handle.offset(), i, element = $('<div class="bzgAutoComplete"></div>'), temp;
		element.attr('id', thisHandle.uniqueId);
		element.css('top', offset.top + handle.outerHeight());
		element.css('left', offset.left);
		element.css('min-width', handle.outerWidth());
		for (i = 0; i < data.length; i++) {
			temp = $('<div title="' + data[i] + '">' + data[i] + '</div>');
			temp.click(function() {
				thisHandle.onSelect(this.title);
			});
			element.append(temp);
		}
		$('body').append(element);
	}
	
	this.hideDropdown = function() {
		$('.bzgAutoComplete').remove();
	}
	
	handle.keyup(function(e) {
		var handle = $('#' + thisHandle.uniqueId + ' > div');
		if (e.keyCode != KC_ENTER && e.keyCode != KC_UP && e.keyCode != KC_DOWN) {	
			thisHandle.loadData(this.value, function(data) {
				if (data.length) {
					thisHandle.showDropdown(data);
				}
				else {
					thisHandle.hideDropdown();
				}
			});
		}
		else if (e.keyCode == KC_ENTER) {
			if (thisHandle.selectedIndex != -1) {
				thisHandle.onSelect(handle.get(thisHandle.selectedIndex).title);
			}
		}
		else if (e.keyCode == KC_UP) {
			thisHandle.selectedIndex--;
			if (thisHandle.selectedIndex < 0) thisHandle.selectedIndex = handle.length - 1;
			handle.removeClass('selected');
			handle.get(thisHandle.selectedIndex).className = 'selected';
		}
		else if (e.keyCode == KC_DOWN) {
			thisHandle.selectedIndex++;
			if (thisHandle.selectedIndex >= handle.length) thisHandle.selectedIndex = 0;
			handle.removeClass('selected');
			handle.get(thisHandle.selectedIndex).className = 'selected';
		}
	});
	handle.focusout(function(e) {
		setTimeout(function() {thisHandle.hideDropdown();}, 300);
	});
	
	handle.attr('autocomplete', 'off');
}