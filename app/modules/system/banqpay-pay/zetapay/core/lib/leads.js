

	function changeAccountNumber(form) {
			form.submit();
	}

	//this function ensures that string may either be numeric, alphabetic,
	//or alphanumeric and may contain only '-' and/or space character.
	function notValidProvince(str){
			// Accept character with accent.
			var numbers = "0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			numbers = numbers.toUpperCase();
			for (var i = 0; i < str.length; i++) {
					if (numbers.indexOf(str.toUpperCase().charAt(i)) == -1) {
						 return true;
					}
			}
			return false;
	}	

	function viewTransactionHistory(subAccountType, accountNumber, accountBalance) {
			document.transactionHistory.subAccountType.value = subAccountType;
      document.transactionHistory.statementAccount.value = accountNumber;
      document.transactionHistory.accountBalance.value = accountBalance;
      if (subAccountType == 'RESERVE') {
			  document.transactionHistory.event.value = "account.reserve";
      } else {
        document.transactionHistory.event.value = "account.history";
      }
			document.transactionHistory.submit();
	}

var txnPermissions = new Array("PCZ","PCZ");

  // ----------------------------------------------------------
  // Function when the account is selected by external users
  // Sets certain items on the page
  // ----------------------------------------------------------
  function onAccountChange() {
    var frm 					= document.forms[0];
    var selectedAcct 	= frm.merchantAccountNumber.selectedIndex;
    var opt;



    // set TX options

      for( i = frm.creditCardTransactionMode.length - 1; i >= 0; i-- ) {
        frm.creditCardTransactionMode[i] = null;
      }

      if( txnPermissions[selectedAcct].indexOf("P") != -1 ) {
        opt = document.createElement("option");
        opt.value = "P";
        opt.text = "P - Purchase";

        if( navigator.appName == "Microsoft Internet Explorer" ) {
          frm.creditCardTransactionMode.add( opt );
        }
        else {
          frm.creditCardTransactionMode.appendChild( opt );
        }
      }

      if( txnPermissions[selectedAcct].indexOf("A") != -1 ) {
        opt = document.createElement("option");
        opt.value = "A";
        opt.text = "A - Authorization";

        if( navigator.appName == "Microsoft Internet Explorer" ) {
          frm.creditCardTransactionMode.add( opt );
        }
        else {
          frm.creditCardTransactionMode.appendChild( opt );
        }
      }

      if( txnPermissions[selectedAcct].indexOf("V") != -1 ) {
        opt = document.createElement("option");
        opt.value = "V";
        opt.text = "V - AVS Check";

        if( navigator.appName == "Microsoft Internet Explorer" ) {
          frm.creditCardTransactionMode.add( opt );
        }
        else {
          frm.creditCardTransactionMode.appendChild( opt );
        }
      }


  }

  function onCountryChange(){
    document.virtual.event.value='terminal.repost';
    document.virtual.submit();
  }

  function onIDCountryChange(){
    document.virtual.event.value='terminal.repost';
    document.virtual.submit();
  }



  function swap(mode)
  {
    if(mode == "ADVANCED"){
      document.virtual.paymentMethodIndicator.value="CREDIT_CARD";
    }
    document.virtual.event.value="terminal";
    document.virtual.paymentModeIndicator.value=mode;
    document.virtual.submit();
  }

  function createMerchantTransactionId()
  {
    var d = new Date();
    var year = "" + d.getFullYear();
    var month = "" + (d.getMonth() + 1) ;
    var date = "" + d.getDate();
    var hours = "" + d.getHours();
    var minutes = "" + d.getMinutes();
    var seconds = "" + d.getSeconds();
    return year + month + date + hours + minutes + seconds;
  }

  function fillBasicTestValues() {
    document.virtual.firstName.value="John";
    document.virtual.lastName.value="Doe";
    document.virtual.phoneNumber.value="123-555-1212";
    document.virtual.emailAddress.value="abc@abc.com";
    document.virtual.address1.value="45 Sunset Blvd.";
    document.virtual.city.value="Los Angeles";
    document.virtual.state.selectedIndex=19;
    document.virtual.country.selectedIndex=224;
    document.virtual.zip.value="01209";


        document.virtual.merchantAccountNumber.selectedIndex=0;

    document.virtual.merchantTransactionId.value= createMerchantTransactionId();
    // generate random number
    var randomnumber = 100 +  Math.floor(2000*Math.random())%(2000-100);
    document.virtual.amount.value=randomnumber;


    document.virtual.creditCardTransactionMode.selectedIndex=0;
    document.virtual.creditCardType.selectedIndex=0;
    document.virtual.creditCardNumber.value="4545033417121188";
    document.virtual.creditCardExpiry.value="12/09";

  }

  function fillAdvancedCCTestValues() {
    fillBasicTestValues();

    document.virtual.address2.value="Apt 1001";

    document.virtual.shippingFirstName.value="Jane";
    document.virtual.shippingLastName.value="Smith";
    document.virtual.shippingAddress1.value="888 Santa Monica Blvd.";
    document.virtual.shippingEmailAddress.value="jane.smith@hollywood.com";
    document.virtual.shippingCity.value="Beverly Hills";
    document.virtual.shippingState.selectedIndex=19;
    document.virtual.shippingCountry.selectedIndex=224;
    document.virtual.shippingZip.value="90210";
    document.virtual.shippingMethod.selectedIndex=1;
    document.virtual.shippingCarrier.selectedIndex=1;

    document.virtual.productType.selectedIndex=1;
    document.virtual.productCode.value="6160";
    document.virtual.transactionPaymentMethod.selectedIndex=1;
    document.virtual.transactionCategory.selectedIndex=1;

    document.virtual.customerIdNumber.value="98765";
    document.virtual.customerWorkPhone.value="213-222-1515";
    document.virtual.customerAccountOpenDate.value="20041029";
    document.virtual.customerIpAddress.value="127.0.0.1";

    document.virtual.merchantSic.value="0069";
    document.virtual.merchantCountry.selectedIndex=224;
    document.virtual.merchantZip.value="456789";
    document.virtual.merchantUserData04.value="data 04";
    document.virtual.merchantUserData05.value="data 05";
    document.virtual.merchantUserData06.value="data 06";

    document.virtual.creditCardCVDIndicator.value="1";
    document.virtual.creditCardCVDValue.value="567";
  }

  function toggleCardIssueNumber() {
    var cct = document.virtual.creditCardType;
    var cctValue = cct.options[cct.selectedIndex].value;
    var ccIssueNumber = document.virtual.creditCardIssueNumber;
    // Issue Number only applicable to SW and SO
    if ( cctValue == "SW" || cctValue == "SO" ) {
      ccIssueNumber.disabled = false;
    } else {
      ccIssueNumber.disabled = true;
    }
  }

  function flagMandatoryParameter()
  {
    var cct = document.virtual.creditCardType;
    var cctValue = cct.options[cct.selectedIndex].value;
    if ( cctValue == "FP") {
      document.getElementById('emailMandatoryIndicator').innerHTML = '*';
      document.getElementById('zipMandatoryIndicator').innerHTML = '&nbsp;&nbsp;';
    } else {
      document.getElementById('emailMandatoryIndicator').innerHTML = '&nbsp;&nbsp;';
      document.getElementById('zipMandatoryIndicator').innerHTML = '*';
    }

    toggleCardIssueNumber();
  }

  function flagMandatoryIDParameter()
  {
    if (document.getElementById('directDebitIdNumber').value.length > 0) {
      document.getElementById('directDebitIdTypeMandatory').innerHTML = '*';
      document.getElementById('directDebitIdStateMandatory').innerHTML = '*';
      document.getElementById('directDebitIdCountryMandatory').innerHTML = '*';
    } else {
      document.getElementById('directDebitIdTypeMandatory').innerHTML = '&nbsp;&nbsp;';
      document.getElementById('directDebitIdStateMandatory').innerHTML = '&nbsp;&nbsp;';
      document.getElementById('directDebitIdCountryMandatory').innerHTML = '&nbsp;&nbsp;';
    }
  }

var mandatoryLeadsElementsArray
			= new Array(
						'cpos_leads_master-clm_lead_req_prod_service',
						'contacts-cnt_title',
						'contacts-cnt_first_name',
						'contacts-cnt_phone_number',
						'cpos_leads_master-clm_lead_sic_code',
						'cpos_leads_master-clm_lead_status',
						'cpos_leads_master-clm_lead_merchant_name',
						'location-ltn_city',
						'location-ltn_state_code',
						'location-ltn_country_code'
						
						);

function submitNewLeadForm(form){
	setMaxMinEmpStrength(form);
	setMaxMinSalesVol(form);
	setOperator(form);
//	alert(form.leadMarketPresenceOp.value);
//	return false;
	return validateNewLeadForm(form, "", mandatoryLeadsElementsArray);
}



function validateNewLeadForm(form, currDate, mandatoryElementsArray){	
	
	if(!validateForm(form,mandatoryElementsArray)){
		alert("The marked fields are mandatory. Please enter valid values.");
		return false;
	}
	/*
	// Product Check
	var field = document.getElementById('cpos_leads_master-clm_lead_req_prod_service');
	var value = Trim(field.value);	
	if(false &&( value == null || value == "")){
		errorIndicator(field, "Please select a Product.");
		alert(field.className);
		alert("Please select a Product / Service for the lead to proceed.");
		return false;
	}

	// Designation Check
	field = document.getElementById('contacts-cnt_title');
	value = Trim(field.value);
	if(value == null || value == "" ){
		errorIndicator(field, "Please enter the Designation of the lead to proceed.");		
		alert("Please enter the Designation of the lead to proceed.");
		return false;
	}else if(!isAlpha(value)){
		errorIndicator(field, "Please enter only alphabets in the Designation field");		
		alert("Please enter only alphabets in the Designation field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}	

	
	// First Name Check
	field = document.getElementById('contacts-cnt_first_name');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please enter the First Name.");		
		alert("Please enter the First Name of the lead to proceed.");
		return false;
	}else if(!isAlphaStrict(value)){
		errorIndicator(field, "Please enter only alphabets in the First Name field");		
		alert("Please enter only alphabets in the First Name field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}

	// Tel No Check
	field = document.getElementById('contacts-cnt_phone_number');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please enter the Telephone Number.");		
		alert("Please enter the Contact Telephone number of the lead to proceed.");
		return false;
	}else if(!isNumericSpace(value)){
		errorIndicator(field, "Please enter only digits/spaces in the Telephone Number field");		
		alert("Please enter only digits/spaces in the Telephone Number field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	// SIC Code
	field = document.getElementById('cpos_leads_master-clm_lead_sic_code');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please select the SIC Code that the business belongs to.");
		alert("Please select the SIC Code that the business belongs to.");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	// Status Check
	field = document.getElementById('cpos_leads_master-clm_lead_status');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please select a status to assign to the Lead.");
		alert("Please select a status to assign to the Lead.");
		return false;
	}else{
		removeErrorIndicator(field);		
	}

	
	// Business Name Check
	field = document.getElementById('cpos_leads_master-clm_lead_merchant_name');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please enter the Name of the Company the lead belongs to.");		
		alert("Please enter the Business Name of the lead to proceed.");
		return false;
	}else if(!isAlphaNumericSpace(value)){
		errorIndicator(field, "Please enter only alphabets/spaces in the Business Name field");		
		alert("Please enter only alphabets/spaces in the Business Name field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	// City Check
	field = document.getElementById('location-ltn_city');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please enter the City the Business belongs to.");		
		alert("Pleaseenter the City to which the business belongs to proceed.");
		return false;
	}else if(!isAlphaNumericSpace(value)){
		errorIndicator(field, "Please enter only alphabets/spaces in the City field");		
		alert("Please enter only alphabets/spaces in the City field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}	
	
	// Province Check
	field = document.getElementById('location-ltn_state_code');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please select the Province the Business belongs to.");		
		alert("Please select the Province to which the business belongs to proceed.");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	// Country Check
	field = document.getElementById('location-ltn_country_code');
	value = Trim(field.value);
	if(value == null || value == ""){
		errorIndicator(field, "Please select the Country the Business belongs to.");		
		alert("Please select the Country to which the business belongs to proceed.");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	*/
	// Email Check
	field = document.getElementById('contacts-cnt_email');	
	value = field!= null?Trim(field.value):"";
	if(value == null || value == ""){		
	}else if(!isEmail(value)){

		errorIndicator(field, "Please enter a valid email address in the E-Mail Address field");		
		alert("Please enter a valid email address in the E-Mail Address field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	// Fax No Check
	field = document.getElementById('contacts-cnt_fax_number');
	value = field!= null?Trim(field.value):"";
	if(value == null || value == ""){		
	}else if(!isNumericSpace(value)){
		errorIndicator(field, "Please enter only digits in the Fax Number field");		
		alert("Please enter only digits in the Fax Number field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	// Extn Check
	field = document.getElementById('contacts-cnt_phone_extension');
	value = field!= null?Trim(field.value):"";
	if(value == null || value == ""){		
	}else if(!isNumericStrict(value)){
		errorIndicator(field, "Please enter only digits in the Extension field");		
		alert("Please enter only digits in the Extension field");
		return false;
	}else{
		removeErrorIndicator(field);		
	}
	
	//Callback check
	field = document.getElementById('cpos_leads_master-clm_callback_date');
	value = field!= null?Trim(field.value):"";
	if(field!= null && field.value != "" && currDate != "" && !field.disabled){
		if(field.value == currDate){
			if(!confirm("Do you wish to set the Call Back date as Current Date ?")){
				errorIndicator(field, "Please enter the required Call Back date.");
				return false;
			}
		}
	}else if(field!= null && field.disabled){	
		field.value ="";
	}
	removeErrorIndicator(field);	
	
	return true;
}

function highlightRow(rowElement, className){
	rowElement.className=className;
}

function normalizeRow(rowElement, className){
	rowElement.className=className;
}


function LeadSummary(id, designation, title, firstname, lastname, busName, telno, xtn, sicCd, prod, assignedto, city, province, country, leadStatus, leadNotes, callBackDate){
	this.leadId = id;
 	this.leadDesignation = designation;
	this.leadTitle = title;
 	this.leadFirstName= firstname;
 	this.leadLastName = lastname;
	this.leadBusName = busName;
 	this.leadTelNo = telno;
 	this.xtnNo=xtn;
	this.leadBusSICCd=sicCd;
 	this.leadReqProd=prod;
 	this.leadAssignedTo=assignedto;
 	this.leadCity=city;
 	this.leadProvince=province;
 	this.leadCountry=country;
 	this.leadStatus = leadStatus;
 	this.leadNotes = leadNotes;
 	if(callBackDate =="0000-00-00")callBackDate="";
 	this.callBackDate = callBackDate;
 	
 	this.populateForm = function (form) { 
 		form.elements['cpos_leads_master-clm_lead_id'].value = this.leadId;//elements['contacts-cnt_title']
		form.elements['contacts-cnt_title'].value = this.leadDesignation;
		form.elements['contacts-cnt_name_prefix'].value = this.leadTitle ;
		form.elements['contacts-cnt_first_name'].value = this.leadFirstName;
		form.elements['contacts-cnt_last_name'].value = this.leadLastName;
		form.elements['cpos_leads_master-clm_lead_merchant_name'].value = this.leadBusName;
		form.elements['contacts-cnt_phone_number'].value = this.leadTelNo;
		form.elements['contacts-cnt_phone_extension'].value =this.xtnNo;
		form.elements['cpos_leads_master-clm_lead_sic_code'].value =this.leadBusSICCd;
		form.elements['cpos_leads_master-clm_lead_req_prod_service'].value =this.leadReqProd;
		form.elements['cpos_leads_master-clm_lead_assigned_to'].value =this.leadAssignedTo;
		form.elements['location-ltn_city'].value =this.leadCity;
		form.elements['cpos_leads_master-clm_lead_status'].value =this.leadStatus;
		//form.elements[''].value =this.leadStatus;
		form.elements['cpos_leads_master-clm_lead_notes'].value =this.leadNotes;		
		//Added to load and set Province as per the country selected
		loadProvinces(form.elements['location-ltn_state_code'], this.leadCountry);
		populateAssignedToBox(document.getElementById('cpos_leads_master-clm_lead_assigned_to'), status_array_map,document.getElementById('cpos_leads_master-clm_lead_status').value,false);
		form.elements['cpos_leads_master-clm_lead_assigned_to'].value =this.assignedto;
		form.elements['location-ltn_state_code'].value =this.leadProvince;
		form.elements['location-ltn_country_code'].value =this.leadCountry;
		form.elements['cpos_leads_master-clm_callback_date'].value =this.callBackDate;
 	
 	};
}

function populateLeadSummary(leadId, form, leadSummaryTable){		
	//Unbold the last selected Lead
	if(document.getElementById('cpos_leads_master-clm_lead_id').value != null && document.getElementById('cpos_leads_master-clm_lead_id').value != ""){
		var lastSelectedElement = document.getElementById(document.getElementById('cpos_leads_master-clm_lead_id').value);				
		if(lastSelectedElement != null){			
			lastSelectedElement.style.fontWeight="normal";
		}
	}
	
	for(i=0; i<objSummary.length && objSummary[i] != null; i++){
		if(leadId == objSummary[i].leadId){			
			objSummary[i].populateForm(form);
			break;
		}
	}
	
	
	// Bolden the Selected Lead
	document.getElementById(leadId).style.fontWeight = "bold";	
	document.getElementById('cpos_leads_master-clm_lead_id').value=leadId;
	//document.getElementById('leadSummary').focus();	
	leadSummaryTable.style.display = "";
	location.href="#leadSummary"
	
}
function submitLeadDetailsForm(form, currDate){
//	alert(document.getElementById('cpos_leads_master-clm_lead_market_presence').value);
	return validateLeadDetailsForm(form, currDate);
}

function validateLeadDetailsForm(form, currDate){

	if(!validateNewLeadForm(form, currDate, mandatoryLeadsElementsArray)){
		return false;
	}	

	field1 = document.getElementById('cpos_leads_master-clm_lead_req_prod_service');
	field2 = document.getElementById('cpos_competing_vendor-ccv_contract_end_date');
	field3 = document.getElementById('cpos_competing_vendor-ccv_vendor_related_notes');
	field4 = document.getElementById('cpos_competing_vendor-ccv_vendor_prod_desc');
	field5 = document.getElementById('cpos_competing_vendor-ccv_vendor_prod_name');
	
	if(!isBlank(field1) || !isBlank(field2) ||
		!isBlank(field3) || !isBlank(field4) ){
		if(isBlank(field5) ){
			if(!confirm("Vendor Info is incomplete. No Vendor Related Info will be entered if you proceed without the Vendor Name.\nThe Vendor Information present will be cleared. Do you wish to continue ?")){
				alert("Enter Vendor Name to complete Vendor Info.");
				errorIndicator(field5, "Please enter a Vendor Name.");
				return false;
			}else{
				removeErrorIndicator(field5);		
				//Clear vendor info
				field1.value= "";
				field2.value= "";
				field3.value= "";
				field4.value= "";
				field5.value= "";
			}
		}
	}	
	return true;
	
}

function showDetails(form){
	field= form.elements['cpos_leads_master-clm_lead_id'];
	
	if(field.value == ""){
		 alert("Please select a Lead to view details. Double click on any result below to select a Lead.");
		 
		 return false;
	}
	
	return true;
}

function changeNoOfLeadsDisplayed(form, newAction){
	form.action = newAction;
	form.submit();

}

function processLead(form, currDate, CALLBACK){	
	
	field= form.elements['cpos_leads_master-clm_lead_id'];		
	if(field.value == ""){
		 alert("Please select a Lead to view details. Double click on any result below to select a Lead.");		 
		 return false;
	}
	field= form.elements['cpos_leads_master-clm_lead_assigned_to'];
	if(Trim(field.value) == ""){	     
		 alert("Please select a value for the Assigned To field.");		 
		 errorIndicator(field, "Please Assign the lead to proceed.");
		 return false;
	}else{
		removeErrorIndicator(field);
	}	
	
	mandatoryElementsArray = mandatoryLeadsElementsArray;
	mandatoryElementsArray[mandatoryElementsArray.length] = 'cpos_leads_master-clm_lead_id';
	mandatoryElementsArray[mandatoryElementsArray.length] = 'cpos_leads_master-clm_lead_assigned_to';
	
	if(!validateNewLeadForm(form, currDate, mandatoryElementsArray)){
		return false;
	}
	
	field= form.lastLeadStatus;
	if(field.value==CALLBACK ){
		 if(confirm("Do you wish to mark this lead as 'Called Back' ?")){
		 	form.calledBack.value="true";
		 }else{
		 	form.calledBack.value="false";
		 }
	}
	
	form.action="./index.php?directory=modules&subdirectory=leads&function=assigned_leads&menu_type=assigned_leads#leadSummary";

	return true
}

function searchLead(form){
	setMaxMinEmpStrength(form);
	setMaxMinSalesVol(form);
	return true;
}

function goToLeadDetails(form, leadId){	
	form.elements['cpos_leads_master-clm_lead_id'].value = leadId;
	form.action = "./index.php?directory=modules&subdirectory=leads&function=search_leads&menu_type=lead_details";
	form.method="POST";	
	form.submit();
	return ;
}

function renderEmployeeStrengthList(elementName, onchange, className, emptyOption){
		return ' <select name="'+elementName+'" id="'+elementName+'" class="'+className+'" value=""  onchange="javascript:'+onchange+' ">\n'
				+(emptyOption?'<option value=""></option>':'')
				+ '<option value="4-9">4 to 9</option>\n'
				+ '<option value="9-15">9 to 15</option>\n'
				+ '<option value="15-25">15 to 25</option>\n'
				+ '</select>';
	
}

function setMaxMinEmpStrength(form){
		form.elements['cpos_leads_master-clm_lead_emp_max'].value=readMaxValue(Trim(form.leadBusEmpStrength.value));
		form.elements['cpos_leads_master-clm_lead_emp_min'].value=readMinValue(Trim(form.leadBusEmpStrength.value));
}

function renderMarkPresenceList  (elementName, onchange, className, emptyOption){
		return ' <select name="'+elementName+'" id="'+elementName+'" class="'+className+'" value=""  onchange="javascript:'+onchange+' ">\n'
				+(emptyOption?'<option value=""></option>':'')
					  +'<option value="1">1</option>'
					  +'<option value="2">2</option>'
					  +'<option value="3">3</option>'
					  +'<option value="4">4</option>'
					  +'<option value="5">5</option>'
					  +'<option value="6">6</option>'
					  +'<option value="7">7</option>'
					  +'<option value="8">8</option>'
					  +'<option value="9">9</option>'
					  +'<option value="10">10</option>'
					  +'<option value="11">11</option>'
					  +'<option value="12">12</option>'
					  +'<option value="13">13</option>'
					  +'<option value="14">14</option>'
					  +'<option value="15">15</option>'
					  +'<option value="16">More than 15 yrs</option>'
				  +'</select>(yrs)';

}

function setOperator(form){
	//form.elements['cpos_leads_master-clm_lead_market_presence'].value=readMinValue(Trim(form.leadBusPresence.value));
	form.elements['cpos_leads_master-clm_lead_market_presence'].value=form.leadBusPresence.value;
	//alert(readMaxValue(Trim(form.leadBusPresence.value)));
	//form.elements['cpos_leads_master-clm_lead_market_presence_op'].value=readMaxValue(Trim(form.leadBusPresence.value));
	//alert(form.leadMarketPresenceOp.value);
}

function renderSalesVolList (elementName, onchange, className, emptyOption){
		return ' <select name="'+elementName+'" id="'+elementName+'" class="'+className+'" value=""  onchange="javascript:'+onchange+' ">\n'
				+(emptyOption?'<option value=""></option>':'')
				+'	<option value="0-500000">Less than $500,000</option>'
				+'	<option value="500000-1000000">$500,000 to $1,000,000</option>'
			  	+'	<option value="1000000-0">More than $1,000,000</option>'
				+'</select>';

}

function setMaxMinSalesVol(form){	
	form.elements['cpos_leads_master-clm_lead_sales_max'].value=readMaxValue(Trim(form.leadBusSaleVol.value));
	form.elements['cpos_leads_master-clm_lead_sales_min'].value=readMinValue(Trim(form.leadBusSaleVol.value));
	//alert(form.sales_max.value+"-max "+form.sales_min.value+"-min ");
}

function readMaxValue(string){
	var i = string.indexOf("-");
	if(i<0){
		return Trim(string);
	}else if(i+1 == string.length){
		return 0;//string.substring(0,i);
	}
	return parseInt(string.substring(i+1, string.length));
}

function readMinValue(string){
	var i = string.indexOf("-");
	if(i<0){
		return string;
	}else if(0 == i){
		return 0;//string.substring(i+1, string.length);
	}
	return parseInt(string.substring(0,i));
}

function populateAssignedToBox(assignedToSelectObj, statusMapping, status ,emptyOption){		
	index =0;	
	if(status != 'ALL'){
		generateSelectBoxOptionsFromArray(assignedToSelectObj, statusMapping[status], emptyOption, index);
	}else{				
		temp = new Array();
		if((emptyOption != null && emptyOption)){
			assignedToSelectObj.options[index++] = new Option('','');				
		}
		for(statusIndex in statusMapping){						
			newList = true;			
			
			for(i in temp){
				if(statusMapping[statusIndex] == temp[i]){					
					newList = false;
					break;	
				}
			}
			if(newList){
				temp[temp.length] = statusMapping[statusIndex];
				index = generateSelectBoxOptionsFromArray(assignedToSelectObj, statusMapping[statusIndex], false, index);
				
			}
			
		}
	}
}

function generateSelectBoxOptionsFromArray(selectObj, selectArray, emptyOption, index){
	var i=0;
	if(index != null && !(index >0)){
		selectObj.options.length =0;
		i=0;
	}else{
		i =index;
	}		
	
	if(emptyOption != null && emptyOption){		
		selectObj.options[i++] = new Option('','');
	}

	for (var id in selectArray){		
		selectObj.options[i++] = new Option(selectArray[id], id);
		//alert(selectObj.options[i-1].text);
	}
	
	return i;	
}


function deleteLead(form,leadFunction,leadMenuType ){	 
	status = confirm("The Lead will be permanently deleted.\nDo you wish to continue ?");
	if(status){	
		form.action="./index.php?directory=modules&subdirectory=leads&function="+leadFunction+"&menu_type="+leadMenuType;
	}
	return status;
}

function renderSelectDateCombo(elementName, className, onchange, emptyOption){
	return ' <select name="'+elementName+'" id="'+elementName+'" class="'+className+'" value=""  onchange="javascript:'+onchange+' ">\n'
				+(emptyOption?'<option value=""></option>':'')
				+'	<option value="[LESSTHAN]">Before</option>'
				+'	<option value="[EQUAL]">Exactly</option>'
			  	+'	<option value="[GREATERTHAN]">After</option>'
				+'</select>';
}

function loadColumnNamesToCombos(prefix, colArray){
	elements = document.forms[0].elements;
//	alert(colArray.length);
	size = elements.length;	
	for( i=0, q=0; i< size; i++){
		if(elements[i].id.toString().indexOf(prefix) >-1 && elements[i].style.display != 'none' && q<colArray.length){
			//alert(elements[i].id.toString());
			loadColumns(elements[i], colArray, "");
			//select default settings						
			elements[i].selectedIndex = q+1;
			//alert(q+1);
			//colArray[q][1]=true;			
			q++;			
		}
	}
}

function loadColumns(selectObj, colArray, extraOption){
	if( colArray== null || colArray.length==0)
		return;
	selectObj.options.length =0;
	arraySize = colArray.length;
	j=0;	

	if(extraOption ==""){
		selectObj.options[j++] = new Option('','');
	}else{
		selectObj.options[j++] = new Option(extraOption,'');
	}	
	
	for ( k=0; k<arraySize; k++){	
//		if(!colArray[k][1]){
			selectObj.options[j] = new Option(colArray[k][0],colArray[k][0]);
			j++;
//		}
	}
}
/*
function unsetColumn(selectObj, columnNames){
	for (i=0 ; i< columnNames.length; i++){
		if(selectObj.value == columnNames[i][0]){
			columnNames[i][1] = false;
			break;
		}
	}
}

function setColumn(selectObj, columnNames){
	for (i=0 ; i< columnNames.length; i++){
		if(selectObj.value == columnNames[i][0]){
			columnNames[i][1] = true;
			break;
		}
	}
}
*/
function shuffleColumns(selectObj, prefix, columnNames){
	if(selectObj.value ==""){
		return ;
	}
	elements = document.forms[0].elements;
	size = elements.length;	
	//alert(selectObj.value+" "+selectObj.selectedIndex);
	for( i=0, q=0; i< size; i++){
		if(elements[i].id.toString().indexOf(prefix) >-1 ){
			selectedElement = elements[i].id;
			selectedValue = elements[i].value;			
			if(selectObj.value == elements[i].value && elements[i] != selectObj){
				//Clear all options from combo and reload
				alert("Another combo is mapping the same value. Please modify accordingly to proceed.");
				document.getElementById(selectedElement).value = selectedValue;
				break
			}else{
				removeErrorIndicator(elements[i]);

				document.getElementById(selectedElement).value = selectedValue;
			}
			
		}	
	}

}

function switchElement(checkBoxObj, checkedElement, uncheckedElement){	
	if(checkBoxObj.checked){
		checkedElement.style.display='';		
		uncheckedElement.style.display='none';
	}else{
		checkedElement.style.display='none';
		uncheckedElement.style.display='';	
	}
}

function uploadLeadsList(form){
/*
	if(form.cb_Country.checked){
		form.Country.value = form.preload_Country.value;
	}else{
		form.Country.value = form.default_Country.value;		
	}
	*/
	return true;
}

function renderDailyTrackingReportType(elementName, onchange, className, emptyOption){
		return ' <select name="'+elementName+'" id="'+elementName+'" class="'+className+'" value=""  onchange="javascript:'+onchange+' ">\n'
				+(emptyOption?'<option value=""></option>':'')
				+ '<option value="WEEKLY">Weekly</option>\n'
				+ '<option value="MONTHLY">Monthly</option>\n'
				+ '<option value="SIXMONTHLY">Half-Yearly</option>\n'				
				+ '<option value="YEARLY">Yearly</option>\n'
				+ '</select>';
}

function OnCalendarClose(doc){
	doc.forms[0].submit();
	return true;	
}

function toggleCallBackDateBox(objCallBackDate, objCalImage,selectedStatus, callbackStatusName, defDate ,currDate){
	if(selectedStatus == callbackStatusName){
		objCallBackDate.disabled =false;				
		objCalImage.style.display="";
		if(objCallBackDate.value == "" ){
			objCallBackDate.value = currDate;
		}		
	}else{
		objCallBackDate.disabled =true;	
		objCalImage.style.display="none";
		objCallBackDate.value = "";
	}	
}

function readFileMeta(copyFrom, copyTo){
	//copyTo.value = copyFrom.value; copyTo is type=file so value cannot be set
	return true;
}