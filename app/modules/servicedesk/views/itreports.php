	<script src="third_party/modules/dhtmlx/grid/dhtmlxcommon.js" 	type="text/javascript" charset="utf-8"></script>
	<script src="third_party/modules/dhtmlx/grid/dhtmlxgrid.js" 	type="text/javascript" charset="utf-8"></script>
	<script src="third_party/modules/dhtmlx/grid/dhtmlxgridcell.js" type="text/javascript" charset="utf-8"></script>
        <script  src="third_party/modules/dhtmlx/grid/dhtmlxcalendar.js" type="text/javascript" charset="utf-8"></script>        
        <script  src="third_party/modules/dhtmlx/grid/excells/dhtmlxgrid_excell_dhxcalendar.js" type="text/javascript" charset="utf-8"></script>        

        <script src="third_party/modules/dhtmlx/dhtmlx.js" type="text/javascript" charset="utf-8"></script>        
        <script src="third_party/modules/dhtmlx/grid/ext/dhtmlxgrid_export.js" type="text/javascript" charset="utf-8"></script>
        <script src="third_party/modules/dhtmlx/grid/dhtmlxtoolbar.js" type="text/javascript" charset="utf-8"></script>
        
	<script src="third_party/modules/dhtmlx/dhtmlxdataprocessor.js" type="text/javascript" charset="utf-8"></script>
	<script src="third_party/modules/dhtmlx/connector/connector.js" type="text/javascript" charset="utf-8"></script>
 
	<link rel="stylesheet" href="third_party/modules/dhtmlx/grid/dhtmlxgrid.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="third_party/modules/dhtmlx/grid/skins/dhtmlxgrid_dhx_skyblue.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="third_party/modules/dhtmlx/grid/dhtmlxcalendar.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="third_party/modules/dhtmlx/grid/dhtmlxcalendar_dhx_skyblue.css" type="text/css" media="screen" title="no title" charset="utf-8">
        
        
	<h1 style='width:95%; padding:20px; font-family:Tahoma;font-weight:normal;background:#f2f3f4;'>Akamai Usage Data</h1>
        <input type="button" value="Get as PDF" onclick="mygrid.toPDF('third_party/modules/dhtmlx/grid/grid-pdf/generate.php');">
        <input type="button" value="Get as Excel" onclick="mygrid.toExcel('third_party/modules/dhtmlx/grid/grid-excel/generate.php');">        
	<div id="akamai" style="width:95%; height:400px;">
	</div>
	<input type="button" value='Add' onclick='add_row();'>
	<input type="button" value='Delete selected' onclick='mygrid.deleteSelectedRows()'>
        
<script type="text/javascript" charset="utf-8">
	function add_row(){
		var id = mygrid.uid();
		mygrid.addRow(id, ["0000-00-00","0","0.00","0.00","0.00","0","0.00","0.00"]);
		mygrid.selectRowById(id);
	}

        function eXcell_button(cell){                             //excell name is defined here
            if (cell){                                                     //default pattern, just copy it
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
                eXcell_ed.call(this);                                //use methods of "ed" excell
            }
            this.setValue=function(val){
                this.setCValue("<input type='button' value='"+val+"'>",val);  
            }
            this.getValue=function(){
               return this.cell.firstChild.value; // get button label
            }
        }
        eXcell_button.prototype = new eXcell;    // nest all other methods from base class

        function eXcell_myprice(cell){                                    //excell name is defined here
            if (cell){                                                     //default pattern, just copy it
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
                eXcell_ed.call(this);                                //use methods of "ed" excell
            }
            this.setValue=function(val){
                this.setCValue("<span>"+val+"</span><span> USD</span>",val);                                     
            }
            this.getValue=function(){
               return this.cell.childNodes[0].innerHTML; // get value
            }
        }
        eXcell_myprice.prototype = new eXcell;    // nest all other methods from base class

        function eXcell_mytime(cell){                                    //excell name is defined here
            if (cell){                                                     //default pattern, just copy it
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue=function(val){
                this.setCValue(val);                                     
            }
            this.getValue=function(){
               return this.cell.innerHTML; // get value
            }
            this.edit=function(){
                this.val = this.getValue(); //save current value
                this.cell.innerHTML="<input type='text' style='width:50px;'><select style='width:50px;'><option value='AM'>AM<option value='PM'>PM</select>"; // editor's html
                this.cell.firstChild.value=parseInt(val); //set the first part of data
                if (val.indexOf("PM")!=-1) this.cell.childNodes[1].value="PM";



                  this.cell.childNodes[0].onclick=function(e){ (e||event).cancelBubble=true; } //block onclick event
                  this.cell.childNodes[1].onclick=function(e){ (e||event).cancelBubble=true; } //block onclick event
            }
            this.detach=function(){
                this.setValue(this.cell.childNodes[0].value+" "+this.cell.childNodes[1].value); //set the new value
                return this.val!=this.getValue();    // compare the new and the old values
            }
        }
        eXcell_mytime.prototype = new eXcell;    // nest all other methods from base class
        
        function str_custom(a,b,order){ 
            return (a.toLowerCase()>b.toLowerCase()?1:-1)*(order=="asc"?1:-1);
        }
        
	mygrid = new dhtmlXGridObject('akamai');
	mygrid.setImagePath("third_party/modules/dhtmlx/grid/imgs/");
	mygrid.setHeader("Date, Week, Total Mb, 95_5_mbps, Peak mbps, Total Hits, HTTP Total Mb, Stream Total Mb");
//        mygrid.attachFooter("A, B, C");
	mygrid.setInitWidths("100,50,*");
	mygrid.setColTypes("ed,ed,ed,ed,ed,ed,ed,ed");
//	mygrid.setColTypes("dhxCalendarA,ed,ed,ed,co,ed,ed,ed");
//        mygrid.enableAlterCss("even_row","odd_row");        
        mygrid.setColSorting("date,str,int,int,int,int,int,int");
//        mygrid.setNumberFormat("0,000.00", 2);        
//        mygrid.setNumberFormat("0,000.00", 5);        
//        mygrid.setNumberFormat("0,000.00", 6);        
//          mygrid.setDateFormat("%Y-%m-%d");        
        
        
        mygrid.enableStableSorting(true);
//        mygrid.sortRows(1,"str","asc");    // sort by the sibling column
//        mygrid.sortRows(0,"str","des");    // sort by the main column
//        mygrid.setCustomSorting(str_custom, 2);
	mygrid.setSkin("dhx_skyblue");
	mygrid.init();
	mygrid.loadXML("itreports/data"); // => /grid/data

	var dp = new dataProcessor("itreports/data");
	dp.action_param = "dhx_editor_status";

	dp.attachEvent("onAfterUpdate", function(sid, action, tid, xml){
		if (action == "invalid"){
			mygrid.setCellTextStyle(sid, 2, "background:#eeaaaa");
			dhtmlx.message(xml.getAttribute("details"));
		} else 
			dhtmlx.message("["+action+"] Data saved in DB");
	})
	dp.init(mygrid);
        
        combo = mygrid.getColumnCombo(columnIndex);
 
        combo.enableFilteingMode(true);
        combo.loadXML("itreports/options");
</script>
