// Move to modules.js 

// Generic constants
var MAX_TABS = 10;
var MAX_SUB_TABS = 20;
var TAB_ACTIVE = 'active';
//Tabs
var TAB_DIV = "<div class='inactive1'><div class='inactive2'><div class='inactive3'></div></div></div>";
var TAB_SEP_MAIN = "<td width='1%' class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
var TAB_SEP_MAIN_LAST = "<td class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
// Sub tabs
var SUB_TAB_SEP_MAIN = "<td width='1%' class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
var SUB_TAB_SEP_MAIN_LAST = "<td class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
// Empty
var SUB_TAB_FILLER ="<td width='100%'>&nbsp;</td>"

// Modules
var MOD_MERCHANT 		= 'merchant';
var MOD_BUYER 		= 'buyer';

//Merchant module
var TAB_ACNT_STAT 	= 'account_statement';
var TAB_VIRT_TERM 	= 'virtual_terminal';
var TAB_REPORTS 		= 'merchant_report';
var TAB_CUST_SUPP		= 'merchant_support';
var TAB_MERCH_TOOL	= 'merchant_links';
var TAB_MY_ACNT 		= 'merchant_my_account';

// Buyer module
var TAB_BUYER_ACNT_STAT  = 'account_statement';
var TAB_FUND_ACCOUNT 	 = 'deposit';
var TAB_BUYER_MY_ACCOUNT = 'buyer_my_account';
var TAB_HOME 		 = "home";

// Merchant module
var SUB_TAB_ACNT_STAT 			= "account_statement";
var SUB_TAB_ADV_MODE  			= "advance_mode";
var SUB_TAB_BAS_MODE  			= "basic_mode";
var SUB_TAB_ACT_REPORT 			= "activity_report";
var SUB_TAB_BATCH_REPORT		= "batch_report";

var SUB_TAB_HELP_DESK 			= "help_desk";
var SUB_TAB_CNTCT_US 			= "contact_us";
var SUB_TAB_DOC 				= "document";
var SUB_TAB_CHANGE_PASS 		= "change_password";
var SUB_TAB_CHNG_BILL_ADDR 		= "change_billaddr";
var SUB_TAB_MY_ACNT 			= "merchant_my_account";

//Sales module
var SUB_TAB_BUYER_ORDER_INFO 		= "order_info";
var SUB_TAB_BUYER_ORDER_STATUS 		= "sales_order_status";
var SUB_TAB_BUYER_DAILY_TRACKING 	= "sales_daily_tracking";
var SUB_TAB_BUYER_COMPLETED_ORDERS 	= "sales_completed_orders";
var SUB_TAB_BUYER_NOTES 			= "notes";
var SUB_TAB_BUYER_HOME 				= "home";
var SUB_TAB_BUYER_PROD_INFO 		= "product_info";
var SUB_TAB_BUYER_ACNT_INFO 		= "account_info";
var SUB_TAB_BUYER_MYACC 			= "sales_my_account";
var SUB_TAB_SALES_CHGPASS 			= "change_password";

/*------------------------------------------------------------------*/

function Tab(id, name, module,size, state, link){
	this.tabName = name;
	this.tabId = id;
	this.module = module;	
	this.tabSize = size;	
	this.tabState = state;		
	this.tabLink = link;	
	this.isActive = function () { return (this.tabState==TAB_ACTIVE ? true:false); };
	
}
var tabArray = new Array(MAX_TABS);
var tabCount= 0;
tabArray[tabCount++] = new Tab(TAB_HOME,'Home',MOD_MERCHANT, 10, TAB_ACTIVE, 'index.php');
tabArray[tabCount++] = new Tab(TAB_ACNT_STAT,'Account Statement',MOD_MERCHANT, 22, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=account_statement&menu_type=account_statement');
tabArray[tabCount++] = new Tab(TAB_VIRT_TERM,'Virtual Terminal',MOD_MERCHANT, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=virtual_terminal&menu_type=advance_mode');
tabArray[tabCount++] = new Tab(TAB_REPORTS,'Reports',MOD_MERCHANT, 12, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=activity_report');
tabArray[tabCount++] = new Tab(TAB_CUST_SUPP,'Customer Support',MOD_MERCHANT, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_password');
tabArray[tabCount++] = new Tab(TAB_MERCH_TOOL,'Merchant Tools',MOD_MERCHANT, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_links&menu_type=merchant_links');
tabArray[tabCount++] = new Tab(TAB_MY_ACNT,'My Account',MOD_MERCHANT, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_my_account&menu_type=merchant_my_account');

tabArray[tabCount++] = new Tab(TAB_HOME,'Home',MOD_BUYER, 10, TAB_ACTIVE, 'index.php');
tabArray[tabCount++] = new Tab(TAB_BUYER_ACNT_STAT,'Account Statement',MOD_BUYER, 22, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=buyer&function=account_statement&menu_type=account_statement');
tabArray[tabCount++] = new Tab(TAB_FUND_ACCOUNT,'Fund Account',MOD_BUYER, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=buyer&function=deposit&menu_type=deposit');
tabArray[tabCount++] = new Tab(TAB_BUYER_MY_ACCOUNT,'My Account',MOD_BUYER, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=buyer&function=buyer_my_account&menu_type=buyer_my_account');

function SubTab(id, name, mainTab,size, state, link){
	this.tabName = name;
	this.tabId = id;
	this.tabSize = size;
	this.mainTabId = mainTab;
	this.tabState = state;	
	this.tabLink = link;	
	this.isActive = function () { return (this.tabState==TAB_ACTIVE ? true:false); };
	
}
var subTabArray = new Array(MAX_SUB_TABS);
var subTabCount = 0;
subTabArray[subTabCount++] = new SubTab(SUB_TAB_ADV_MODE,'Advance Mode', TAB_VIRT_TERM,15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=virtual_terminal&menu_type=advance_mode');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_BAS_MODE,'Basic Mode', TAB_VIRT_TERM,15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=virtual_terminal&menu_type=basic_mode');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_ACT_REPORT,'Activity Report', TAB_REPORTS, 15 , TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=activity_report');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_BATCH_REPORT,'Batch Report', TAB_REPORTS, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=batch_report');

subTabArray[subTabCount++] = new SubTab(SUB_TAB_HELP_DESK,'Help Desk', TAB_CUST_SUPP, 10, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=help_desk');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_CNTCT_US,'Contact Us', TAB_CUST_SUPP, 12, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=contact_us');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_DOC,'Documentation', TAB_CUST_SUPP, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=document');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_CHANGE_PASS,'Change Password', TAB_CUST_SUPP, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_password');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_CHNG_BILL_ADDR,'Change Billing Address', TAB_CUST_SUPP, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_billaddr');
subTabArray[subTabCount++]= new SubTab(SUB_TAB_MY_ACNT,'My Account', TAB_CUST_SUPP, 20, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=merchant_my_account');

subTabArray[subTabCount++]= new SubTab(SUB_TAB_BUYER_HOME,'Home', TAB_HOME, 8, TAB_ACTIVE, 'index.php');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_BUYER_MYACC,'My Account',TAB_BUYER_MY_ACCOUNT, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=sales_my_account&menu_type=sales_my_account');
subTabArray[subTabCount++] = new SubTab(SUB_TAB_BUYER_CHGPASS,'Change Password',TAB_BUYER_MY_ACCOUNT, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=sales_my_account&menu_type=change_password');

/**-------------*/

function chk_notes()
{
	if(document.frmformname.txtusertype.value=="olduser")
		window.location.href='index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=notes';
	else
		alert("Please Press Save Button For Save Ur Information");
}

function chk_product_info()
{
	if(document.frmformname.txtusertype.value=="olduser")
		window.location.href='index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=product_info';
	else
		alert("Please Press Save Button For Save Ur Information");

}
function chk_account_info()
{
	if(document.frmformname.txtusertype.value=="olduser")
		window.location.href='index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=account_info';
	else
		alert("Please Press 'Save' Button For Save Ur Information");
}


function confirmationForSubmition()
{
	var msg=confirm("Are You Sure To Save The Informtion");
	if(msg)
		return true;
	else
		return false;
}


function drawTabs(){	
	var module = drawTabs.arguments[0];	
	var tabs = new Array(MAX_TABS);	
	
	//alert(module);
	var htmlTabs ="";	
	
	for( i=1; i< drawTabs.arguments.length && drawTabs.arguments[i] != null; i++){
		//alert(drawTabs.arguments[i]);		
		tabs[i-1] = getHTMLTab(module, drawTabs.arguments[i] );			
		
	}
	
	
	for(i in tabs){
		if(tabs[i] != null && tabs[i] != ""){				
			if(i !=0 ){
				htmlTabs = htmlTabs + TAB_SEP_MAIN + tabs[i];
			}else{
				htmlTabs = tabs[0];
			}			
		}		
	}
	
	if(htmlTabs != "" ){
		htmlTabs = htmlTabs + TAB_SEP_MAIN_LAST;
	}else{
		htmlTabs = SUB_TAB_FILLER;
	}
	//alert(htmlTabs);
	return htmlTabs;	
}


function getHTMLTab(module, tabId){
	//alert(module+"<>"+ tabId);
	for(k=0; k < tabArray.length && tabArray[k] != null; k++){
		//alert(tabArray[k].module+"<>"+tabArray[k].tabId );
		if(tabArray[k].module == module && tabArray[k].tabId == tabId){				
			return "<td width='"+tabArray[k].tabSize+"%' align='center' nowrap class='"+"inactiveTab"+"' id='"+tabArray[k].tabId+"' name='"+tabArray[k].tabId+"'>"+TAB_DIV+"<div class='inactiveTabText'> &nbsp;<a href='"+tabArray[k].tabLink+"' >"+tabArray[k].tabName+"</a>&nbsp;</div></td>";
		}
	}
		
	//alert("Tab "+tabId+" not found");
	
	return "";
}

function highlightMainTab(tabId){
	if(tabId == ""){
			tabId = "home";// If link doesnot have tab info default to home.
	}
 	if(document.getElementById(tabId) != null){
		document.getElementById(tabId).className="activeTab";
	}
}

//subTabs
function drawSubTabs(){	
	var mainTabId = drawSubTabs.arguments[0];
	if(mainTabId ==""){
		mainTabId= "home"; // If link doesnot have tab info default to home.
	}
	
	var htmlSubTabs = "";		
	
	for( j in subTabArray){
		//alert(j+"<>"+subTabArray[j].mainTabId +"<>"+ mainTabId);
		if( subTabArray[j].mainTabId == mainTabId){
			//alert(mainTabId+"<>"+subTabArray[j].mainTabId);
			for ( k=1; k < drawSubTabs.arguments.length && drawSubTabs.arguments[k] != null ; k++){
				//alert(drawSubTabs.arguments[k]);
				if(subTabArray[j].tabId == drawSubTabs.arguments[k] ){
					htmlSubTabs = htmlSubTabs + getHTMLSubTabs(subTabArray[j]);
				}
			}			
		}
	}
	
	//alert(htmlSubTabs);
	return htmlSubTabs;
		
}

function getHTMLSubTabs(subTabObject){	
	return "<td width='"+subTabObject.tabSize +"%' id='sub_"+subTabObject.tabId+"' name='sub_"+subTabObject.tabId+"' ><a href='"+subTabObject.tabLink+"'>"+subTabObject.tabName+"</a></td>";
}

function highlightSubTab(tabId){
	if(tabId == ""){
		tabId = "home";
	}
	//alert("sub_"+tabId);
	if(document.getElementById("sub_"+tabId) != null){		
		document.getElementById("sub_"+tabId).className="activeSubTab";
	}
}

/*function newOrderForm_chk()
{
	if(document.frmneworder.legal_registration.value=="")
	{
		alert("Please Enter The Legal/Registration Name");
		document.frmneworder.legal_registration.focus();
		return false;
	}
	if(document.frmneworder.billingphonenumber.value=="")
	{
		alert("Please Enter The Phone No");
		document.frmneworder.billingphonenumber.focus();
		return false;
	}

	if(document.frmneworder.billingstreetno.value=="")
	{
		alert("Please Enter The Street No");
		document.frmneworder.billingstreetno.focus();
		return false;
	}

	if(document.frmneworder.billingstreetname.value=="")
	{
		alert("Please Enter The Street Name");
		document.frmneworder.billingstreetname.focus();
		return false;
	}

	if(document.frmneworder.billingcity.value=="")
	{
		alert("Please Enter The City");
		document.frmneworder.billingcity.focus();
		return false;
	}

	if(document.frmneworder.billingpostal.value=="")
	{
		alert("Please Enter The Postal Code");
		document.frmneworder.billingpostal.focus();
		return false;
	}
	
	
		if(document.frmneworder.deliveryphonenumber.value=="")
	{
		alert("Please Enter The Phone No");
		document.frmneworder.deliveryphonenumber.focus();
		return false;
	}

	if(document.frmneworder.deliverystreetno.value=="")
	{
		alert("Please Enter The Street No");
		document.frmneworder.deliverystreetno.focus();
		return false;
	}

	if(document.frmneworder.deliverystreetname.value=="")
	{
		alert("Please Enter The Street Name");
		document.frmneworder.deliverystreetname.focus();
		return false;
	}

	if(document.frmneworder.deliverycity.value=="")
	{
		alert("Please Enter The City");
		document.frmneworder.deliverycity.focus();
		return false;
	}

	if(document.frmneworder.deliverypostal.value=="")
	{
		alert("Please Enter The Postal Code");
		document.frmneworder.deliverypostal.focus();
		return false;
	}
	

	return true;
}*/


