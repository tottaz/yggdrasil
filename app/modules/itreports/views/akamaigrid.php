	<script src="../third_party/modules/dhtmlx/grid/dhtmlxgrid_pro.js" type="text/javascript" charset="utf-8"></script>
	<script src="../third_party/modules/dhtmlx/grid/ext/dhtmlxgrid_export.js" type="text/javascript" charset="utf-8"></script>
	
	<script src="../third_party/modules/dhtmlx/dhtmlxCalendar/codebase/dhtmlxcalendar.js" type="text/javascript" charset="utf-8"></script>
	
	<script src="../third_party/modules/dhtmlx/dhtmlxdataprocessor.js" type="text/javascript" charset="utf-8"></script>
	<script src="../third_party/modules/dhtmlx/connector/connector.js" type="text/javascript" charset="utf-8"></script>
	
	<link rel="stylesheet" href="../third_party/modules/dhtmlx/grid/dhtmlxgrid_pro.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="../third_party/modules/dhtmlx/dhtmlxCalendar/codebase/dhtmlxcalendar.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="../third_party/modules/dhtmlx/dhtmlxCalendar/codebase/skins/dhtmlxcalendar_dhx_skyblue.css" type="text/css" media="screen" title="no title" charset="utf-8">

	<h1 style='width:95%; padding:20px; font-family:Tahoma;font-weight:normal;background:#f2f3f4;'>Akamai Usage Data</h1>
		<input class="btn btn-success" type="button" value="Get as PDF" onclick="mygrid.toPDF('../../third_party/modules/dhtmlx/grid/grid-pdf/generate.php');">
		<input class="btn btn-success" type="button" value="Get as Excel" onclick="mygrid.toExcel('../../third_party/modules/dhtmlx/grid/grid-excel/generate.php');">
	<div id="akamai" style="width:100%; height:500px;"></div>
	<div><span id="pagingArea"></span>&nbsp;<span id="infoArea"></span></div>
	<input class="btn btn-success" type="button" value='Add' onclick='add_row();'>
	<input class="btn btn-danger" type="button" value='Delete selected' onclick='mygrid.deleteSelectedRows()'>

	<script type="text/javascript" charset="utf-8">
	
	function onButtonClick(menuitemId, type)
	{
		var data = mygrid.contextID.split("_");
		//rowId_colInd;
		mygrid.setRowTextStyle(data[0], "color:" + menuitemId.split("_")[1]);
		return true;
	}

	function add_row()
	{
		var id = mygrid.uid();
		mygrid.addRow(id, ["0","0","0","0","0","0","0"]);
		mygrid.selectRowById(id);
	}

	// My Grid
	mygrid = new dhtmlXGridObject('akamai');
	//      Set the path of where the images are located        
	mygrid.setImagePath("../third_party/modules/dhtmlx/grid/imgs/");

	//      Set the text for the header of the grid        
	mygrid.setHeader("Date, Total Mb, 95_5_mbps, Peak mbps, Total Hits, HTTP Total Mb, Stream Total Mb");
	//      Set the width of the cells row for the grid
	mygrid.setInitWidths("100,*,*,*,*,*,*");
	mygrid.enableAutoWidth(true);
	//      Set the Column Alignment
//	mygrid.setColAlign("left,right,left,left,right,right,left");
	//      Set the column types for the grid        
	mygrid.setColTypes("dhxCalendarA,edn,ed,ed,edn,edn,ed");
	//      Set the column types for the grid        
	//            mygrid.setColTypes("ed,dhxCalendarA,ed,combo,combo,combo,ed,ed,ed,ed,ed,combo,combo,ed,ed");        

	mygrid.setColSorting("date,int,int,int,int,int,int");
	
	mygrid.setDateFormat("%Y-%m-%d"); 

// Grouping of columns
// mygrid.groupBy(1);        

//      setnumber format        
	mygrid.setNumberFormat("0,000.00",1);
	mygrid.setNumberFormat("0,000.00",4,".",",");  
	mygrid.setNumberFormat("0,000.00",5,".",",");  


// Enable Light Mouse Navigation
	mygrid.enableLightMouseNavigation(true);
	//      Enable enable hot keys
	mygrid.enableKeyboardSupport(true);
	
	mygrid.init();
	mygrid.setSkin("dhx_skyblue");

// mygrid.enableSmartRendering(true);
	mygrid.loadXML("itreports/data"); // => /grid/data

	//this code enables paging and sets its skin;
	mygrid.enablePaging(true, 25, 10, "pagingArea", true, "infoArea");
	mygrid.setPagingSkin("bricks");
	
	var dp = new dataProcessor("itreports/data");
	dp.action_param = "dhx_editor_status";

	dp.attachEvent("onAfterUpdate", function(sid, action, tid, xml)
	{
		if (action == "invalid"){
			mygrid.setCellTextStyle(sid, 2, "background:#eeaaaa");
			dhtmlx.message(xml.getAttribute("details"));
		} else 
			dhtmlx.message("["+action+"] Data saved in DB");
	}
	)
	dp.init(mygrid);

//	combo = mygrid.getColumnCombo(columnIndex);
 
//	combo.enableFilteingMode(true);
//	combo.loadXML("itreports/data");

</script>