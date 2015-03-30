<!-- 
/*
* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1
*
* The contents of this file are subject to the Mozilla Public
* License Version 1.1 ("License"); you may not use this file except in
* compliance with the License. You may obtain a copy of the License at
* http://www.zimbra.com/license
*
* Software distributed under the License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
* the License for the specific language governing rights and limitations
* under the License.
*
* The Original Code is: Zimbra AJAX Toolkit.
*
* The Initial Developer of the Original Code is Zimbra, Inc.
* Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
* All Rights Reserved.
*
* Contributor(s):
*
* ***** END LICENSE BLOCK *****
*/

-->
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Flight Info</title>
    <style type="text/css">
      <!--
        @import url(../common/img/hiRes/dwtimgs.css);
        @import url(config/style/dv.css);
       -->
    </style>
    <jsp:include page="../Messages.jsp"/>
    <jsp:include page="../Ajax.jsp"/>
    
	<script type="text/javascript" src="config/msgs/DvMsg_en.js"/></script>
	<script type="text/javascript" src="model/DvModel.js"></script>
	<script type="text/javascript" src="model/DvEvent.js"></script>
	<script type="text/javascript" src="model/DvList.js"></script>
	<script type="text/javascript" src="model/DvItem.js"></script>
	<script type="text/javascript" src="model/DvItemList.js"></script>
	<script type="text/javascript" src="model/DvAttr.js"></script>
	<script type="text/javascript" src="model/DvAttrList.js"></script>
	<script type="text/javascript" src="view/DvFilterPanel.js"></script>
	<script type="text/javascript" src="view/DvListViewActionMenu.js"></script>
	<script type="text/javascript" src="view/DvListView.js"></script>
	<script type="text/javascript" src="view/DvTabView.js"></script>
	<script type="text/javascript" src="controller/DvController.js"></script>

	<script language="JavaScript">
		function launch() {
			DBG = new AjxDebug(AjxDebug.NONE, null, false);
			if (location.search && (location.search.indexOf("debug=") != -1)) {
				var m = location.search.match(/debug=(\d+)/);
				if (m.length) {
					var num = parseInt(m[1]);
					var level = AjxDebug.DBG[num];
					if (level)
						DBG.setDebugLevel(level);
				}
	   		}

			var attrs = getSampleAttrs();
			var data = getSampleFlights();
			var users = ["Kilgore", "Sherilynn"];
			
			var flightInfo = new DvController(attrs, data, users);
		}
		
		function getSampleAttrs() {

			var attrs = new Array();
			var i = 1;
			
			attrs[i++] = ["Res No", "Number", 55];
			attrs[i++] = ["Flight", "StringExact", 55];
			attrs[i++] = ["Airline", "StringContains", 120];
			attrs[i++] = ["Dep Date", "DateRange", 70];
			attrs[i++] = ["Dep Time", "TimeRange", 30];
			attrs[i++] = ["Dep City", "StringExact", 30];
			attrs[i++] = ["Arr Date", "DateRange", 70];
			attrs[i++] = ["Arr Time", "TimeRange", 30];
			attrs[i++] = ["Arr City", "StringExact", 30];
			attrs[i++] = ["Passenger", "StringContains", 100];
			attrs[i++] = ["Seat", "StringExact", 40];
			attrs[i++] = ["Fare Class", "SingleSelect", 40, ["Y", "K", "F", "B", "Q", "C", "W", "X", "H", "U", "J"]];
			attrs[i++] = ["Price", "NumberRange", 50];

			return attrs;
		}

		function getSampleFlights() {

			var flights = new Array();
			var i = 0;

			flights[i++] = [8839245,"CO9827","Continental Airlines","6/16/2005","6:15","SJC","6/16/2005","12:28","IAH","Roget Meyers","23A","Y",628.87];
			flights[i++] = [8839246,"CO9827","Continental Airlines","6/16/2005","6:15","SJC","6/16/2005","12:28","IAH","Alex Jones","23B","Y",587.33];
			flights[i++] = [8839247,"LH411","Lufthansa","6/22/2005","20:20","JFK","6/23/2005","10:15","MUC","Hans Kohler","33G","K",1879.87];
			flights[i++] = [8839248,"LH411","Lufthansa","6/22/2005","20:20","JFK","6/23/2005","10:15","MUC","Gerhard Meyer","22K","Y",2450.38];
			flights[i++] = [8839249,"AA257","American Airlines","6/23/2005","8:23","SFO","6/23/2005","16:45","BOS","Cherlyn Peters","1A","F",2343.00];
			flights[i++] = [8839250,"AA257","American Airlines","6/23/2005","8:23","SFO","6/23/2005","16:45","BOS","Andrew Thomas","3C","F",2467.87];
			flights[i++] = [8839251,"AA257","American Airlines","6/23/2005","8:23","SFO","6/23/2005","16:45","BOS","Suzanne Franks","21D","Y",976.65];
			flights[i++] = [8839252,"AM765","Aeromexico","6/23/2005","9:15","IAH","6/23/2005","12:25","MEX","Raoul Diaz","12F","B",324.95];
			flights[i++] = [8839253,"AM765","Aeromexico","6/23/2005","9:15","IAH","6/23/2005","12:25","MEX","Maria Diaz","12E","B",324.95];
			flights[i++] = [8839254,"AM765","Aeromexico","6/23/2005","9:15","IAH","6/23/2005","12:25","MEX","Jose Diaz","12D","B",324.95];
			flights[i++] = [8839255,"UA562","United Airlines","6/28/2005","7:55","SFO","6/28/2005","10:05","DEN","Shirley Kinard","27F","K",475.00];
			flights[i++] = [8839256,"UA562","United Airlines","6/28/2005","7:55","SFO","6/28/2005","10:05","DEN","Douglas Banks","3B","F",1205.76];
			flights[i++] = [8839257,"UA562","United Airlines","6/28/2005","7:55","SFO","6/28/2005","10:05","DEN","Jack Stringer","11A","Y",787.35];
			flights[i++] = [8839258,"UA562","United Airlines","6/28/2005","7:55","SFO","6/28/2005","10:05","DEN","Paul Arnot","24C","K",459.00];
			flights[i++] = [8839259,"US11","US Air","6/29/2005","14:30","BOS","6/29/2005","16:00","IAD","Greg Randaman","9D","Q",256.98];
			flights[i++] = [8839260,"US11","US Air","6/29/2005","14:30","BOS","6/29/2005","16:00","IAD","Bernard Martz","18E","Q",256.98];
			flights[i++] = [8839261,"US11","US Air","6/29/2005","14:30","BOS","6/29/2005","16:00","IAD","Greg Randaman","4D","Y",408.94];
			flights[i++] = [8839262,"AF","Air France","6/29/2005","19:35","BOS","7/1/2005","7:45","CDG","Jean Piquot","18A","C",6893.00];
			flights[i++] = [8839263,"CO1697","Continental Airlines","7/1/2005","12:06","IAH","7/1/2005","14:26","CZM","Sean Fannin","9E","Y",704.65];
			flights[i++] = [8839264,"AF","Air France","7/2/2005","8:15","CDG","7/2/2005","13:47","BOS","Jean Piquot","15A","C",7219.56];
			flights[i++] = [8839265,"AC76","Air Canada","7/5/2005","7:32","YVR","7/5/2005","13:11","YYZ","Michelle Dansk","17C","Q",876.00];
			flights[i++] = [8839266,"AC76","Air Canada","7/5/2005","7:32","YVR","7/5/2005","13:11","YYZ","Bob Jameson","17C","Q",876.00];
			flights[i++] = [8839267,"AC76","Air Canada","7/5/2005","7:32","YVR","7/5/2005","13:11","YYZ","Merideth Frisk","24A","W",425.00];
			flights[i++] = [8839268,"AC76","Air Canada","7/5/2005","7:32","YVR","7/5/2005","13:11","YYZ","Martin Guthries","25A","W",467.65];
			flights[i++] = [8839269,"CO4","Continental Airlines","7/6/2005","16:35","EWR","7/7/2005","8:10","FRA","Helmut Petry","36D","X",675.33];
			flights[i++] = [8839270,"DL765","Delta Airlines","7/26/2005","11:45","ATL","7/26/2005","14:05","LGA","Brad Silverspring","5C","Y",467.00];
			flights[i++] = [8839271,"DL765","Delta Airlines","7/26/2005","11:45","ATL","7/26/2005","14:05","LGA","Collen Johnson","18A","H",264.98];
			flights[i++] = [8839272,"DL765","Delta Airlines","7/26/2005","11:45","ATL","7/26/2005","14:05","LGA","Janet Worthing","18B","H",264.98];
			flights[i++] = [8839273,"DL765","Delta Airlines","7/26/2005","11:45","ATL","7/26/2005","14:05","LGA","Francine Olson","18C","U",245.67];
			flights[i++] = [8839274,"DL765","Delta Airlines","7/26/2005","11:45","ATL","7/26/2005","14:05","LGA","Mark Davis","19F","X",215.56];
			flights[i++] = [8839275,"DL765","Delta Airlines","7/29/2005","11:45","ATL","7/29/2005","14:05","LGA","Nicole Merideth","8A","U",245.78];
			flights[i++] = [8839276,"HA513","Hawaiian Airlines","8/21/2005","18:10","LAX","8/21/2005","20:15","HNL","Catherine Mills","3B","F",2435.90];
			flights[i++] = [8839277,"CO1697","Continental Airlines","9/4/2005","12:06","IAH","9/4/2005","14:26","CZM","Matthew Barts","14A","Y",765.98];
			flights[i++] = [8839278,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Robert Smith","3A","F",12745.87];
			flights[i++] = [8839279,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Michael Springer","43D","Q",1123.52];
			flights[i++] = [8839280,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Patrick Springer","43E","Q",1123.52];
			flights[i++] = [8839281,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Jane Springer","43F","Q",1123.52];
			flights[i++] = [8839282,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Arlene Springer","43G","Q",1123.52];
			flights[i++] = [8839283,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Jackie Delormier","17A","C",8783.00];
			flights[i++] = [8839284,"QF7","Qantas","9/7/2005","10:35","LAX","9/9/2005","10:30","SYD","Alexis Smith","3B","F",12745.87];
			flights[i++] = [8839285,"KE12","Korean Airlines","9/12/2005","12:30","LAX","9/13/2005","17:10","ICN","Jiho Li","39K","K",1207.00];
			flights[i++] = [8839286,"KE12","Korean Airlines","9/12/2005","12:30","LAX","9/13/2005","17:10","ICN","Stan Burton","31B","K",1189.82];
			flights[i++] = [8839287,"JL61","Japan Airlines","10/1/2005","12:10","HNL","10/2/2005","15:30","NRT","Toshiyuki Yamamoto","4B","F",13674.98];
			flights[i++] = [8839288,"JL61","Japan Airlines","10/1/2005","12:10","HNL","10/2/2005","15:30","NRT","Hide Toshe","2B","F",13674.98];
			flights[i++] = [8839289,"JL61","Japan Airlines","10/1/2005","12:10","HNL","10/2/2005","15:30","NRT","Hiroto Yamaguchi","2A","F",13674.98];
			flights[i++] = [8839290,"BA56","British Airways","10/3/2005","18:20","JFK","10/4/2005","7:47","LGW","Ian Farnsworth","12C","J",6589.65];
			flights[i++] = [8839291,"BA56","British Airways","10/3/2005","18:20","JFK","10/4/2005","7:47","LGW","Nigel Bosworth","7D","J",6963.87];
			flights[i++] = [8839292,"BA56","British Airways","10/3/2005","18:20","JFK","10/4/2005","7:47","LGW","Sharon Banks","37J","Y",1567.76];
			flights[i++] = [8839293,"CO1697","Continental Airlines","10/5/2005","12:06","IAH","10/5/2005","14:26","CZM","Beth Riggs","3B","F",1547.00];
			flights[i++] = [8839294,"AS135","Alaska Airlines","11/18/2005","9:55","SFO","11/18/2005","14:05","SJD","Tony Simons","7A","Y",765.00];
			flights[i++] = [8839295,"AS135","Alaska Airlines","11/18/2005","9:55","SFO","11/18/2005","14:05","SJD","Andrea Simons","7B","Y",765.00];
			flights[i++] = [8839296,"AS135","Alaska Airlines","11/18/2005","9:55","SFO","11/18/2005","14:05","SJD","Joseph Jenkins","27B","X",327.98];
			flights[i++] = [8839297,"CO1697","Continental Airlines","12/1/2005","12:06","IAH","12/1/2005","14:26","CZM","Carl Sumerston","11B","Q",558.76];

			return flights;
		}

	    AjxCore.addOnloadListener(launch);
	</script>

</head>
    <body>
    </body>
</html>
