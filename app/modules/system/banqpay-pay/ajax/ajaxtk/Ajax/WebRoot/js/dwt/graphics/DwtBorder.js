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


/**
* @class
* This static class  allows you to draw "interesting" borders
*		(eg: borders that are composed of multiple images)
*
*	Note that images for the border are used in the same style as AjxImg.
*
*
*	TODO: get the borders working with the AjxImg scheme to do hires/lores images.
*
* @author Owen Williams
*/

function DwtBorder() {
}

DwtBorder._borderTemplates = {};

DwtBorder.getBorderTemplate = 
function(style) {
	return this._borderTemplates[style];
};

DwtBorder.getBorderHtml = 
function (style, substitutions, innerDivId) {
	return AjxBuffer.append(
				this.getBorderStartHtml(style, substitutions),
				(innerDivId ? "<div id=" + innerDivId + "></div>" : ""),
				this.getBorderEndHtml(style, substitutions)
			);
};

DwtBorder.getBorderStartHtml = 
function(style, substitutions) {
	var template = this._borderTemplates[style];
	if (template == null) {
		DBG.println("DwtBorder.getBorderStartHtml(",style,"): no border template found.");
		return "";
	}

	var html = template.start;
	if (substitutions != null) {
		html = DwtBorder.performSubstitutions(html, substitutions);
	}
	return html;
};

DwtBorder.getBorderEndHtml = 
function(style, substitutions) {
	var template = this._borderTemplates[style];
	if (template == null || template == "") return "";

	var html = template.end;
	if (substitutions != null) {
		html = DwtBorder.performSubstitutions(html, substitutions);
	}
	return html;
};

DwtBorder.getBorderHeight = 
function(style) {
	var template = this._borderTemplates[style];
	return template ? template.height : 0;
};

DwtBorder.getBorderWidth = 
function(style) {
	var template = this._borderTemplates[style];
	return template ? template.width : 0;
};

DwtBorder.performSubstitutions = 
function (html, substitutions) {
	for (var prop in substitutions) {
		var str = "<!--$" + prop + "-->";
		if (html.indexOf(str)) {
			html = html.split(str).join(substitutions[prop]);
		}
		// MOW: Why is this here?  This will make substitution twice as slow... do we need it?
		var str = "{$"+prop+"}";
		if (html.indexOf(str)) {
			html = html.split(str).join(substitutions[prop]);
		}
	}
	return html;
};

DwtBorder.registerBorder = 
function (style, template) {
	this._borderTemplates[style] = template;
};

DwtBorder.registerBorder(
	"1pxBlack",
	{
		start:"<div style='border:1px solid black'>",
		end:"</div>",
		width:2,
		height:2
	}
);	
	
DwtBorder.registerBorder(
	"card",	
	{
		start:"<table class=card_border_table cellspacing=0 cellpadding=0>"+
				"<tr><td class=card_spacer_TL><div class=ImgCard_TL></div></td>"+
					"<td class=ImgCard_T__H></td>"+
					"<td class=card_spacer_TR><div class=ImgCard_TR></div></td>"+
				"</tr>"+
				"<tr><td class=ImgCard_L__V></td>"+
					"<td class=card_spacer_BG>"+
						"<div class=card_contents>",
		end:			"</div class=card_contents>"+
					"</td>"+
					"<td class=ImgCard_R__V></td>"+
				"</tr>"+
				"<tr><td class=card_spacer_BL><div class=ImgCard_BL></div></td>"+
					"<td class=ImgCard_B__H></td>"+
					"<td class=card_spacer_BR><div class=ImgCard_BR></div></td>"+
				"</tr>"+
			"</table>",
		width:20,
		height:20
	
	}
);

DwtBorder.registerBorder(
	"cardSel",
	{
		start:"<table class=card_border_table cellspacing=0 cellpadding=0>"+
				"<tr><td class=card_spacer_TL><div class=ImgCardSel_TL></div></td>"+
					"<td class=ImgCardSel_T__H></td>"+
					"<td class=card_spacer_TR><div class=ImgCardSel_TR></div></td>"+
				"</tr>"+
				"<tr><td class=ImgCardSel_L__V></td>"+
					"<td class=card_spacer_BG>"+
						"<div class=card_contents>",
		end:			"</div class=card_contents>"+
					"</td>"+
					"<td class=ImgCardSel_R__V></td>"+
				"</tr>"+
				"<tr><td class=card_spacer_BL><div class=ImgCardSel_BL></div></td>"+
					"<td class=ImgCardSel_B__H></td>"+
					"<td class=card_spacer_BR><div class=ImgCardSel_BR></div></td>"+
				"</tr>"+
			"</table>",
		width:19,
		height:18
	
	}
);

var dialogPieces = {
	start:AjxBuffer.concat(
				 "<table class='DialogTable' cellpadding='0' Xborder=1>",
					// top edge
					"<tr><td class='border_outset_c'><div class='ImgDialogOutset_TL'></div></td>",
						"<td colspan=3 class='ImgDialogOutset_T__H'></td>",
						"<td class='border_outset_c'><div class='ImgDialogOutset_TR'></div></td>",
						(AjxEnv.useTransparentPNGs ? "<td rowspan=2 valign=top class='border_shadow_v'><div class='ImgShadowBig_TR'></div><div class='ImgShadowBig_R__V' style='height:100%'></div></td>" : ""),
					"</tr>",
					// titlebar
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td colspan=3 id='<!--$titleId-->' class='DialogTitle'>",
						  "<table class='dialog_table' cellpadding='0'><tr>",
							"<td class='DialogTitleCell'><!--$icon--></td>",
							"<td id='<!--$titleTextId-->' class='DialogTitleCell'><!--$title--></td>",
							"<td class='DialogTitleCell'><div class='<!--$closeIcon2-->' style='cursor:pointer'></div></td>",
							"<td class='DialogTitleCell'><div class='<!--$closeIcon1-->' style='cursor:pointer'></div></td>",
						"</tr></table></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
					"</tr>"
				),
	
	topNoToolbar: AjxBuffer.concat(
					// top inside edge
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogBody'><div class='ImgDialogInset_TL'></div></td>",
						"<td class='DialogBody' Xstyle='width:100%'><div class='ImgDialogInset_T__H'></div></td>",
						"<td class='DialogBody'><div class='ImgDialogInset_TR'></div></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>"  : ""),
					"</tr>",
					// dialog center
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogBody ImgDialogInset_L__V' style='height:100%'></td>",
						"<td class='DialogBody'>"
				),
	
	topWithToolbar: AjxBuffer.concat(
					// top inside edge
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_TL'></div></td>",
						"<td class='DialogToolbar' style='width:100%'><div class='ImgDialogInset_T__H'></div></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_TR'></div></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					// top toolbar
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_L__V' style='height:20'></div></td>",
						"<td class='DialogToolbar'></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_R__V' style='height:20'></div></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='ImgDialogToolbarSep_L'></td>",
						"<td class='ImgDialogToolbarSep__H'></td>",
						"<td class='ImgDialogToolbarSep_R'></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					// dialog center
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogBody ImgDialogInset_L__V' style='height:100%'></td>",
						"<td class='DialogBody'>"
				),
	
	bottomNoToolbar: AjxBuffer.concat(
						"</td> ",
						"<td class='DialogBody ImgDialogInset_R__V' style='height:100%'></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					// bottom inside edge
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogBody'><div class='ImgDialogInset_BL'></div></td>",
						"<td class='DialogBody'><div class='ImgDialogInset_B__H'></div></td>",
						"<td class='DialogBody'><div class='ImgDialogInset_BR'></div></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>"
				),
	
	bottomWithToolbar: AjxBuffer.concat(
						"</td>",
						"<td class='DialogBody ImgDialogInset_R__V' style='height:100%'></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					// bottom toolbar
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='ImgDialogToolbarSep_L'></td>",
						"<td class='ImgDialogToolbarSep__H'></td>",
						"<td class='ImgDialogToolbarSep_R'></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_L__V' style='height:20'></td>",
						"<td class='DialogToolbar'><div id='<!--$id-->_bottom_toolbar'></div></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_R__V' style='height:20'></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					// bottom inside edge
					"<tr><td class='ImgDialogOutset_L__V' style='height:100%'></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_BL'></div></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_B__H'></div></td>",
						"<td class='DialogToolbar'><div class='ImgDialogInset_BR'></div></td>",
						"<td class='ImgDialogOutset_R__V' style='height:100%'></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>"	
				),
	
	end: AjxBuffer.concat(
					// bottom edge
					"<tr><td><div class='ImgDialogOutset_bl'></div></td>",
						"<td colspan=3 class='ImgDialogOutset_B__H'></td>",
						"<td><div class='ImgDialogOutset_br'></div></td>",
						(AjxEnv.useTransparentPNGs ? "<td class='ImgShadowBig_R__V'></div></td>" : ""),
					"</tr>",
					// bottom shadow
						(AjxEnv.useTransparentPNGs ? 
							"<tr><td colspan=5><table cellspacing=0 cellpadding=0 border=0><tr><td><div class='ImgShadowBig_BL'></div><td>"+
									"<td width=100%><div class='ImgShadowBig_B__H' style='width:100%'></div></td></tr></table>"+
								"</td>"+
								"<td class=dialog_shadow_c><div class='ImgShadowBig_BR'></div><td>"+
							"</tr>"
						  : ""
						),
			     "</table>"
				)
}

DwtBorder.registerBorder(
	"dialog",
	{
		start:	dialogPieces.start + dialogPieces.topNoToolbar,
		end: dialogPieces.bottomNoToolbar + dialogPieces.end,
		width:40,
		height:45
	}
);

DwtBorder.registerBorder(
	"dialogWithTopToolbar",
	{
		start:	dialogPieces.start + dialogPieces.topWithToolbar,
		end: dialogPieces.bottomNoToolbar + dialogPieces.end,
		width:40,
		height:45
	}
);

DwtBorder.registerBorder(
	"dialogWithBottomToolbar",
	{
		start:	dialogPieces.start + dialogPieces.topNoToolbar,
		end: dialogPieces.bottomWithToolbar + dialogPieces.end,
		width:40,
		height:45
	}
);

DwtBorder.registerBorder(
	"dialogWithBothToolbars",
	{
		start:	dialogPieces.start + dialogPieces.topWithToolbar,
		end: dialogPieces.bottomWithToolbar + dialogPieces.end,
		width:40,
		height:45
	}
);

DwtBorder.registerBorder(
	"h_sash",
	{	
		start: AjxBuffer.concat(
				"<table width=100% cellspacing=0 cellpadding=0><tr>",
					"<td><div  class=ImgHSash_L></div></td>",
					"<td class=ImgHSash__H style='width:50%'></td>",
					"<td><div class=ImgHSashGrip></div></td>",
					"<td class=ImgHSash__H style='width:50%'></td>",
					"<td><div  class=ImgHSash_TR></div></td>",
				"</tr></table>"
			),
		end:"",
		width:10,	//NOT ACCURATE
		height:7
	}
);

DwtBorder.registerBorder(
	"calendar_appt",
	{	
		start:AjxBuffer.concat(	
			"<div id='<!--$id-->_body' class='appt_body <!--$bodyColor-->'>",
				"<table style='width:100%;height:100%'cellspacing=0 cellpadding=2>",
				"<tr class='<!--$headerColor-->'>",
					"<td class=appt<!--$newState-->_time id='<!--$id-->_st'><!--$starttime--></td>",
					"<td class=appt_status-<!--$statusKey--> style='text-align:right'><!--$status--></td>",
//					"<td class=appt<!--$newState-->_tag><!--$tag--></td>",
				"</tr>",
				"<tr valign=top>",
					"<td colspan=2 class=appt<!--$newState-->_name style='height:100%'>",
						"<!--$name-->",
						"<BR>",
						"<!--$location-->",
					"</td>",
				"<tr>",
					"<td colspan=2 class=appt_end_time id='<!--$id-->_et'><!--$endtime--></td>",
				"</tr>",
				"</table>",
//				"<div style='position:absolute; bottom:0; right:0;' class=appt_end_time id='<!--$id-->_et'><!--$endtime--></div>",				
			"</div>"
			),
		end: "",
		width:10,	//NOT ACCURATE
		height:7
	}
);

DwtBorder.registerBorder(
	"calendar_appt_bottom_only",
	{	
		start:AjxBuffer.concat(	
			"<div id='<!--$id-->_body' class='appt_body <!--$bodyColor-->'>",
				"<table style='width:100%;height:100%'cellspacing=0 cellpadding=2>",
				"<tr valign=top>",
					"<td colspan=2 class=appt<!--$newState-->_name style='height:100%'>",
						"<!--$name-->",
						"<BR>",
						"<!--$location-->",
					"</td>",
				"<tr>",
					"<td colspan=2 class=appt_end_time id='<!--$id-->_et'><!--$endtime--></td>",
				"</tr>",
				"</table>",
			"</div>"
			),
		end: "",
		width:10,	//NOT ACCURATE
		height:7
	}
);

DwtBorder.registerBorder(
	"calendar_appt_30",
	{	
		start:AjxBuffer.concat(
			"<div id='<!--$id-->_body' class='appt_30_body <!--$headerColor-->'>",
				"<table width=100% cellspacing=0 cellpadding=2>",
				"<tr>",
					"<td class=appt_30<!--$newState-->_name><!--$name--></td>",
//					"<td class=appt<!--$newState-->_tag><!--$tag--></td>",
				"</tr>",
				"</table>",
			"</div>"
		),
		end:	"",
		width:4,
		height:4
	}
);

DwtBorder.registerBorder(
	"calendar_appt_allday",
	{	
		start:AjxBuffer.concat(
			"<div id='<!--$id-->_body' <!--$body_style--> class='appt_allday_body <!--$headerColor-->'>",
				"<table width=100% cellspacing=0 cellpadding=2>",
				"<tr>",
					"<td class=appt_allday<!--$newState-->_name><!--$name--></td>",
//					"<td class=appt<!--$newState-->_tag><!--$tag--></td>",
				"</tr>",
				"</table>",
			"</div>"
		),
		end:	"",
		width:4,
		height:4
	}
);

// NOTE:  For the hover border, we show a PNG transparency shadow if the platform supports it cleanly
//			(eg: in FF, not in IE or Linux)
DwtBorder.registerBorder( 
	"hover", 
	{ 
		start: AjxBuffer.concat(
				"<div id='{$id}_tip_t' class='hover_tip_top ImgHoverTip_T'></div>",
				"<table class=hover_frame_table border=0 cellspacing=0 cellpadding=0>", 
					"<tr>", 
						"<td id='{$id}_border_tl' class=ImgHover_TL></td>", 
						"<td id='{$id}_border_tm' class=ImgHover_T__H></td>", 
						"<td id='{$id}_border_tr' class=ImgHover_TR></td>", 
						(AjxEnv.useTransparentPNGs ? "<td class='ImgCurvedShadow_TR'></td>" : ""),
					"</tr>", 
					"<tr>",
						"<td id='{$id}_border_ml' class=ImgHover_L__V></td>", 
						"<td id='{$id}_border_mm' class=ImgHover__BG><div id='{$id}_contents' class=hover_contents>"
			),
		end: AjxBuffer.concat(
						"</div></td>", 
						"<td id='{$id}_border_mr' class=ImgHover_R__V></td>", 
						(AjxEnv.useTransparentPNGs ? "<td valign=top><div class='ImgCurvedShadow_T2R'></div><div class='ImgCurvedShadow_R__V' style='height:100%;'></div></td>" : ""),
					"</tr>", 
					"<tr>",
						"<td id='{$id}_border_bl' class=ImgHover_BL></div></td>", 
						"<td id='{$id}_border_bm' class=ImgHover_B__H></td>", 
						"<td id='{$id}_border_br' class=ImgHover_BR></div></td>", 
						(AjxEnv.useTransparentPNGs ? "<td></td>" : ""),
					"</tr>", 
						(AjxEnv.useTransparentPNGs ? 
							"<tr><td class='ImgCurvedShadow_BL'></td>"
								+"<td><div id='{$id}_border_shadow_b' class='ImgCurvedShadow_B__H' style='width:100%;'></td>"
								+"<td></td>"
								+"<td><div style='position:relative;'><div class='ImgCurvedShadow_BR' style='position:absolute;left:-20;top:-14'></div></div></td>"
							+"</tr>" 
							: ""
						),
				"</table>",
				"<div id='{$id}_tip_b' class='hover_tip_bottom ImgHoverTip_B'></div>"
			)
	} 
);

DwtBorder.registerBorder( 
	"SemiModalDialog", 
	{ 
		start: AjxBuffer.concat(
//				"<div id='{$id}_tip_t' class='hover_tip_top ImgSemiModalTip_T'></div>",
				"<table class=hover_frame_table border=0 cellspacing=0 cellpadding=0>", 
					"<tr>", 
						"<td id='{$id}_border_tl' class=ImgSemiModalHeader_TL></td>", 
						"<td id='{$id}_border_tm' class=ImgSemiModalHeader_T__H colspan=2></td>", 
						"<td id='{$id}_border_tr' class=ImgSemiModalHeader_TR></td>", 
						(AjxEnv.useTransparentPNGs ? "<td class='ImgCurvedShadow_TR'></td>" : ""),
					"</tr>", 
					"<tr>",
						"<td id='{$id}_border_ml' class='ImgSemiModalHeader_L__V'></td>", 
						"<td class='ImgSemiModalHeader__BG'><div id='{$id}_title' class='DwtStickyToolTipTitle'>{$title}</div></td>",
						"<td class='ImgSemiModalHeader__BG'><div id='{$id}_close' class='DwtStickyToolTipTitle' style='position:relative;top:-3px;left:20px;align:right;'></div></td>",
						"<td id='{$id}_border_mr' class=ImgSemiModalHeader_R__V></td>", 
						(AjxEnv.useTransparentPNGs ? "<td valign=top><div class='ImgCurvedShadow_T2R'></div><div class='ImgCurvedShadow_R__V' style='height:100%;'></div></td>" : ""),
					"</tr>",
					"<tr>",
						"<td id='{$id}_border_ml' class='ImgSemiModalBody_TL'></td>", 
						"<td id='{$id}_title' class='ImgSemiModalBody_T__H' colspan=2></td>",
						"<td id='{$id}_border_mr' class=ImgSemiModalBody_TR></td>", 
						(AjxEnv.useTransparentPNGs ? "<td><div class='ImgCurvedShadow_R__V' style='height:100%;'></div></td>" : ""),
					"</tr>",
					"<tr>",
						"<td id='{$id}_border_ml' class=ImgSemiModalBody_L__V></td>", 
						"<td id='{$id}_border_mm' class=ImgSemiModalBody__BG colspan=2><div id='{$id}_contents'>"
			),
		end: AjxBuffer.concat(
						"</div></td>", 
						"<td id='{$id}_border_mr' class=ImgSemiModalBody_R__V></td>", 
						(AjxEnv.useTransparentPNGs ? "<td valign=top><div class='ImgCurvedShadow_R__V' style='height:100%;'></div></td>" : ""),
					"</tr>", 
					"<tr>",
						"<td class=ImgSemiModalBody_B1L></div></td>", 
						"<td class=ImgSemiModalBody__BG colspan=2></td>", 
						"<td class=ImgSemiModalBody_B1R></div></td>", 
						(AjxEnv.useTransparentPNGs ? "<td><div class='ImgCurvedShadow_R__V' style='height:100%;'></div></td>" : ""),
					"</tr>", 
					"<tr>",
						"<td id='{$id}_border_bl' class=ImgSemiModalBody_B2L></div></td>", 
						"<td id='{$id}_border_bm' class=ImgSemiModalBody_B2__H colspan=2></td>", 
						"<td id='{$id}_border_br' class=ImgSemiModalBody_B2R></div></td>", 
						(AjxEnv.useTransparentPNGs ? "<td></td>" : ""),
					"</tr>", 
						(AjxEnv.useTransparentPNGs ? 
							"<tr><td class='ImgCurvedShadow_BL'></td>"
								+"<td colspan=2><div id='{$id}_border_shadow_b' class='ImgCurvedShadow_B__H' style='width:100%;'></td>"
								+"<td></td>"
								+"<td><div style='position:relative;'><div class='ImgCurvedShadow_BR' style='position:absolute;left:-20;top:-14'></div></div></td>"
							+"</tr>" 
							: ""
						),
				"</table>",
				"<div id='{$id}_tip_b' class='hover_tip_bottom ImgSemiModalBodyTip_B'></div>"
			)
	} 
);

DwtBorder.registerBorder( 
	"SplashScreen", 
	{ 
		start: AjxBuffer.concat(
				 "<table class='DialogTable' cellpadding='0' Xborder=1>",
					// top edge
					"<tr><td><div style='position:relative'>"+
							"<div class='ImgSplashScreen_blank' style='background-color:white'></div>",
							"<div class=SplashScreenUrl><!--$url--></div>",
							"<div class=SplashScreenShortVersion><!--$shortVersion--></div>",
							"<div class=SplashScreenAppName><!--$appName--></div>",
							"<div class=SplashScreenVersion><!--$version--></div>",
							"<div class=SplashScreenContents><!--$contents--></div>",
							"<div class=SplashScreenLicense><!--$license--></div>",
							"<div class=SplashScreenOKButton id='<!--$buttonId-->'><!--$button--></div>",
						"</div></td>",
						(AjxEnv.useTransparentPNGs ? "<td valign=top class='border_shadow_v'><div class='ImgShadowBig_TR'></div>"+
														"<div class='ImgShadowBig_R__V' style='height:100%'></div></td>" : ""),

					"</tr>"
				),

		end: AjxBuffer.concat(
					// bottom shadow
						(AjxEnv.useTransparentPNGs ? 
							"<tr><td>"+
									"<table cellspacing=0 cellpadding=0 Xborder=1 width=100%><tr>"+
										"<td><div class='ImgShadowBig_BL'></div><td>"+
										"<td width=100%><div class='ImgShadowBig_B__H' style='width:100%'></div></td>"+
									"</tr></table>"+
								"</td>"+
						        "<td class='dialog_shadow_c'><div class='ImgShadowBig_BR'></div></td>"+
							"</tr>"
						  : ""
						),
			     "</table>"
				)
	}
);

DwtBorder.registerBorder( 
	"LoginBanner", 
	{ 
		start: AjxBuffer.concat(
				 "<table class='DialogTable' cellpadding='0' Xborder=1>",
					// top edge
					"<tr><td><div style='position:relative'>"+
							"<div class='ImgLoginBanner_blank'></div>",
							"<div id=LoginBannerUrl><!--$url--></div>",
							"<div id=LoginBannerShortVersion><!--$shortVersion--></div>",
							"<div id=LoginBannerAppName><!--$appName--></div>",
							"<div id=LoginBannerVersion><!--$version--></div>",
						"</div></td>",
					"</tr>",
			     "</table>"
				),
		end:""
	}
);
