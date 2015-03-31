/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 dhtmlxSpreadSheet.prototype.toPDF = function(url) {
	var xml = this._getExport(true);
	var form = document.createElement('div');
	form.style.display = 'none';
	document.body.appendChild(form);
	form.innerHTML = '<form method="post" action="' + url + '" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded" target="blank"><input type="hidden" name="grid_xml" id="grid_xml"/></form>';
	form.firstChild.firstChild.value = xml;
	form.firstChild.submit();
	form.parentNode.removeChild(form);
};

dhtmlxSpreadSheet.prototype.toExcel = function(url) {
	var xml = this._getExport();
	var iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.name = 'dhx_' + this.grid.uid();
	iframe.onload = function() {
		window.setTimeout(function() {
			iframe.parentNode.removeChild(iframe);
		}, 3000);
	};
	document.body.appendChild(iframe);

	var form = document.createElement('div');
	form.style.display = 'none';
	document.body.appendChild(form);
	form.innerHTML = '<form method="post" action="' + url + '" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded" target="' + iframe.name + '"><input type="hidden" name="grid_xml" id="grid_xml"/></form>';
	form.firstChild.firstChild.value = xml;
	form.firstChild.submit();
	form.parentNode.removeChild(form);
};

dhtmlxSpreadSheet.prototype._getExport = function(firstcol) {
	var maxrow = 0, maxcol = 1;
	this.mapCells(1, 1, this.settings.rows, this.settings.cols, function(row, col) {
		var cell = this.getCellValue(row, col);
		if (cell.value.length > 0) {
			if (row > maxrow) maxrow = row;
			if (col > maxcol) maxcol = col;
		}
	});
	if (maxrow < 5) maxrow = Math.min(5 || this.settings.rows);
	if (maxcol < 5) maxcol = Math.min(5 || this.settings.cols);
	var head = this._getExportHeader(maxrow, maxcol, firstcol);
	var rows = this._getExportData(maxrow, maxcol, firstcol);
	var orient = this._getExportWidth(maxrow, maxcol, firstcol);
	var xml = '<rows profile="full_color"' + orient + '><head>' + head + '</head>' + rows + '</rows>';
	return xml;
};

dhtmlxSpreadSheet.prototype._getExportHeader = function(maxrow, maxcol, firstcol) {
	var cols = [];
	if (firstcol) {
		var firstcol = this._headToXML({ name: '#', width: 100 });
		cols.push(firstcol);
	}
	var summarywidth = 0;
	for (var i = 1; i <= maxcol; i++) {
		var col = this.getCol(i);
		summarywidth += col.width;
		var xml = this._headToXML(col);
		cols.push(xml);
	}
	if (firstcol) cols[0] = this._headToXML({ name: '#', width: Math.round(summarywidth*0.04) });
	return '<columns>' + cols.join('') + '</columns>';
};

dhtmlxSpreadSheet.prototype._getExportWidth = function(maxrow, maxcol, firstcol) {
	var summarywidth = 0;
	for (var i = 1; i <= maxcol; i++)
		summarywidth += this.getCol(i).width;
	if (firstcol) summarywidth += summarywidth*0.04;

	if (summarywidth < 1200) return '';
	return ' orientation="landscape"';
};

dhtmlxSpreadSheet.prototype._headToXML = function(col) {
	var xml = '<column width="' + col.width + '" align="left" type="ro" hidden="false"><![CDATA[' + col.name + ']]></column>';
	return xml;
};

dhtmlxSpreadSheet.prototype._getExportData = function(maxrow, maxcol, firstcol) {
	var rows = [];
	this.mapCells(1, 1, maxrow, maxcol, function(row, col, rind, cind) {
		var cell = this.getCellValue(row, col);
		cell.style = this.getCellStyle(row, col);
		if (!rows[rind]) {
			rows[rind] = [];
			if (firstcol) rows[rind].push('<cell bgColor="#D1E5FE" align="center"><![CDATA[' + row + ']]></cell>');
		}
		rows[rind].push(this._cellToXML(cell));
	});
	for (var i = 0; i < rows.length; i++)
		rows[i] = '<row>' + rows[i].join('') + '</row>'
	return rows.join('');
};

dhtmlxSpreadSheet.prototype._cellToXML = function(cell) {
	var xml = "<cell";
	xml += " bgColor=\"#" + cell.style.get('bgcolor') + "\"";
	xml += " textColor=\"#" + cell.style.get('color') + "\"";
	xml += " bold=\"" + ((cell.style.get('bold') === 'true') ? 'bold' : 'normal') + "\"";
	xml += " italic=\"" + ((cell.style.get('italic') === 'true') ? 'italic' : 'normal') + "\"";
	xml += " align=\"" + cell.style.get('align') + "\"";
	xml += "><![CDATA[";
	xml += cell.value || ' ';
	xml += "]]></cell>";
	return xml;
};