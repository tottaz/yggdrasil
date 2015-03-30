// Move to modules.js 

// Generic constants
var MAX_TABS = 10;
var MAX_SUB_TABS = 20;
var TAB_ACTIVE = 'active';
//Tabs
var TAB_DIV = "<div class='inactive1'><div class='inactive2'><div class='inactive3'></div></div></div>";
var TAB_SEP_MAIN = "<td width='1%'  class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
var TAB_SEP_MAIN_LAST = "<td class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
// Sub tabs
var SUB_TAB_SEP_MAIN = "<td width='1%'  class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";
var SUB_TAB_SEP_MAIN_LAST = "<td class='inactiveTabSeparator' >&nbsp;&nbsp;</td>";


// Modules
var MOD_MERCHANT ='merchant';
var MOD_SALES = 'sale';
var MOD_LEADS = 'leads';

// Tabs
//Merchant module
var TAB_ACNT_STAT = 'account_statement';
var TAB_VIRT_TERM = 'virtual_terminal';
var TAB_REPORTS = 'merchant_report';
var TAB_CUST_SUPP = 'merchant_support';
var TAB_MY_ACNT = 'merchant_my_account';
// Sales module
var TAB_ORDER_INFO = 'order_info';
var TAB_NOTES = "notes";
var TAB_HOME = "home";
var TAB_PROD_INFO = "product_info";
var TAB_ACNT_INFO = "account_info";

//SubTabs
// Merchant module
var SUB_TAB_ACNT_STAT = "account_statement";
var SUB_TAB_ADV_MODE  = "advance_mode";
var SUB_TAB_BAS_MODE  = "basic_mode";
var SUB_TAB_ACT_REPORT ="activity_report";
var SUB_TAB_BATCH_REPORT = "batch_report";
var SUB_TAB_WELCOME = "welcome";
var SUB_TAB_CNTCT_US = "contact_us";
var SUB_TAB_DOC ="doc";
var SUB_TAB_CHANGE_PASS = "change_password";
var SUB_TAB_CHNG_BILL_ADDR = "change_billaddr";
var SUB_TAB_MY_ACNT = "merchant_my_account";
//Sales module
var SUB_TAB_NEW_ORDER = "new_order";
var SUB_TAB_NOTES = "notes";
var SUB_TAB_HOME = "home";
var SUB_TAB_PROD_INFO = "product_info";
var SUB_TAB_ACNT_INFO = "account_info"




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
tabArray[0] = new Tab(TAB_ACNT_STAT,'Account Statement',MOD_MERCHANT, 22, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=account_statement&menu_type=account_statement');
tabArray[1] = new Tab(TAB_VIRT_TERM,'Virtual Terminal',MOD_MERCHANT, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=virtual_terminal&menu_type=advance_mode');
tabArray[2] = new Tab(TAB_REPORTS,'Reports',MOD_MERCHANT, 12, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=activity_report');
tabArray[3] = new Tab(TAB_CUST_SUPP,'Customer Support',MOD_MERCHANT, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_password');
tabArray[4] = new Tab(TAB_MY_ACNT,'My Account',MOD_MERCHANT, 13, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_my_account&&menu_type=merchant_my_account');
tabArray[5] = new Tab(TAB_ORDER_INFO,'Order Info',MOD_SALES, 13, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=order_info&&menu_type=new_order');
tabArray[6] = new Tab(TAB_NOTES,'Notes',MOD_SALES, 13, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=notes&menu_type=notes');
tabArray[7] = new Tab(TAB_HOME,'Home',MOD_MERCHANT, 10, TAB_ACTIVE, 'index.php');
tabArray[8] = new Tab(TAB_HOME,'Home',MOD_SALES, 10, TAB_ACTIVE, 'index.php');
tabArray[9]  = new Tab(TAB_PROD_INFO,'Product Info',MOD_SALES, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=product_info&menu_type=product_info');
tabArray[10] = new Tab(TAB_ACNT_INFO,'Account Info',MOD_SALES, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=account_info&menu_type=account_info');
tabArray[11] = new Tab(TAB_HOME,'Home',MOD_LEADS, 10, TAB_ACTIVE, 'index.php');

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
subTabArray[0] = new SubTab(SUB_TAB_ACNT_STAT,'Account Statement', TAB_ACNT_STAT,20, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=account_statement&menu_type=account_statement');
subTabArray[1] = new SubTab(SUB_TAB_ADV_MODE,'Advance Mode', TAB_VIRT_TERM,15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=virtual_terminal&menu_type=advance_mode');
subTabArray[2] = new SubTab(SUB_TAB_BAS_MODE,'Basic Mode', TAB_VIRT_TERM,15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=virtual_terminal&menu_type=basic_mode');
subTabArray[3] = new SubTab(SUB_TAB_ACT_REPORT,'Activity Report', TAB_REPORTS, 15 , TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=activity_report');
subTabArray[4] = new SubTab(SUB_TAB_BATCH_REPORT,'Batch Report', TAB_REPORTS, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_report&menu_type=batch_report');
subTabArray[5] = new SubTab(SUB_TAB_WELCOME,'Welcome', TAB_CUST_SUPP, 10, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=welcome');
subTabArray[6] = new SubTab(SUB_TAB_CNTCT_US,'Contact Us', TAB_CUST_SUPP, 12, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=contact_us');
subTabArray[7] = new SubTab(SUB_TAB_DOC,'Documentation', TAB_CUST_SUPP, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=doc');
subTabArray[8] = new SubTab(SUB_TAB_CHANGE_PASS,'Change Password', TAB_CUST_SUPP, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_password');
subTabArray[9] = new SubTab(SUB_TAB_CHNG_BILL_ADDR,'Change Billing Address', TAB_CUST_SUPP, 18, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_support&menu_type=change_billaddr');
subTabArray[10]= new SubTab(SUB_TAB_MY_ACNT,'My Account', TAB_MY_ACNT, 20, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=merchant&function=merchant_my_account&&menu_type=merchant_my_account');
subTabArray[11]= new SubTab(SUB_TAB_NEW_ORDER,'New Order', TAB_ORDER_INFO, 12, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=order_info&&menu_type=new_order');
subTabArray[12]= new SubTab(SUB_TAB_NOTES,'Notes', TAB_NOTES, 10, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=notes&&menu_type=notes');
subTabArray[13]= new SubTab(SUB_TAB_HOME,'Home', TAB_HOME, 10, TAB_ACTIVE, 'index.php');
subTabArray[14]= new SubTab(SUB_TAB_PROD_INFO,'Product Info',TAB_PROD_INFO, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=product_info&menu_type=product_info');
subTabArray[15]= new SubTab(SUB_TAB_ACNT_INFO,'Account Info',TAB_ACNT_INFO, 15, TAB_ACTIVE, 'index.php?directory=modules&subdirectory=sale&function=account_info&menu_type=account_info');


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
	
	htmlTabs = htmlTabs + TAB_SEP_MAIN_LAST;
	
	//alert(htmlTabs);
	return htmlTabs;	
}


function getHTMLTab(module, tabId){
	//alert(module+"<>"+ tabId);
	for(k=0; k < tabArray.length && tabArray[k] != null; k++){
		//alert(tabArray[k].module+"<>"+tabArray[k].tabId );
		if(tabArray[k].module == module && tabArray[k].tabId == tabId){				
			return "<td width='"+tabArray[k].tabSize+"%' align='center' nowrap class='"+"inactiveTab"+"' id='"+tabArray[k].tabId+"'>"+TAB_DIV+"<div class='inactiveTabText'> &nbsp;<a href='"+tabArray[k].tabLink+"' >"+tabArray[k].tabName+"</a>&nbsp;</div></td>";
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
	return "<td width='"+subTabObject.tabSize +"%' id='sub_"+subTabObject.tabId+"' ><a href='"+subTabObject.tabLink+"'>"+subTabObject.tabName+"</a></td>";
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
