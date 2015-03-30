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
    <title>Tree Example</title>
    <style type="text/css">
      <!--
        @import url(../common/img/hiRes/dwtimgs.css);
        @import url(TreeExample.css);
      -->
    </style>
    <jsp:include page="../Messages.jsp"/>
    <jsp:include page="../Ajax.jsp"/>
    <script type="text/javascript" src="ExMsg.js"></script>
    <script type="text/javascript" src="TreeExample.js"></script>
  </head>
    <body>
    <noscript><p><b>Javascript must be enabled to use this.</b></p></noscript>
    <script language="JavaScript">   	
   		function launch() {
   			DBG = new AjxDebug(AjxDebug.NONE, null, false);
 	    	TreeExample.run();
	    }
        AjxCore.addOnloadListener(launch);
    </script>
    </body>
</html>

