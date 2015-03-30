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
    <title>Zimbra XForms Test Environment</title>
    <style type="text/css">
      <!--
        @import url(../common/img/hiRes/dwtimgs.css);
        @import url(config/style/dv.css);
       -->
    </style>
	<SCRIPT>var ot0 = new Date().getTime()</SCRIPT>
    <jsp:include page="../Messages.jsp"/>
    <jsp:include page="../Ajax.jsp"/>

	<SCRIPT language=JavaScript src="test_scripts.js"></SCRIPT>
	<SCRIPT>var ot1 = new Date().getTime();DBG.println("loading all libraries took " + (ot1-ot0) + " msec");</SCRIPT>
</head>
<body onload='loadTestForm();'>

<table width=100% height=100% cellspacing=0 cellpadding=0>
<tr><td height=1>
	<div class=testHeader>
		<table class=tabtable><tr>		
			<td class=borderbottom>&nbsp;&nbsp;</td>
			<td id=show_display class=tab onclick='showCard("display")'>Display</td>
			<td id=show_HTMLOutput class=tab onclick='showCard("HTMLOutput")'>HTML</td>

			<td id=show_debug class=tab onclick='showCard("debug")'>Debug</td>
			<td id=show_formItems class=tab onclick='showCard("formItems")'>Items</td>
			<td id=show_instanceValue class=tab onclick='showCard("instanceValue")'>Instance</td>
			<td id=show_updateScript class=tab onclick='showCard("updateScript")'>UpdateScr</td>

			<td width=100% class=borderbottom>&nbsp;&nbsp;&nbsp;</td>

			<td class=borderbottom><div class=label>Form:</div></td>
			<td class=borderbottom><select id=formList class=xform_select1 onchange='setCurrentForm(this.options[this.selectedIndex].value)'></select></td>
			<td class=borderbottom><div class=label>Instance:</div></td>
			<td class=borderbottom><select id=instanceList class=xform_select1 onchange='setCurrentInstance(this.selectedIndex)'></select></td>
			<td class=borderbottom>&nbsp;&nbsp;</td>

		</tr>
		</table>
	</div>
</td></tr>
<tr><td height=100%>
<div style='width:100%;height:100%;position:relative;overflow:auto;'>	
		<div ID=display class=displayCard width=100% height=100%>
		</div ID=output>
	
		<div ID=debug class=debugCard>
			<button onclick='DBG.clear()'>Clear</button><pre>
		</div ID=debug>
	
		<div ID=output class=displayCard>
		</div ID=output>
	</div>
</td>
</tr></table>

</body>

<!-- * ADD SCRIPT INCLUDES HERE FOR ALL THE FORMS YOU WANT TO REGISTER 	
	 * CREATE A HELPER FILE LIKE  LmAppoinmentView_helper.js  IF NEEDED 
		TO REGISTER YOUR FORM AND PROVIDE INSTANCES 					
-->
<SCRIPT language=JavaScript src="xform_model_test.js"></SCRIPT>


</html>
