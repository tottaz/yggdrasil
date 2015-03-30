// Javascript funcs for Sales module

function renderOrderTypeCombo(elementName, onchange, className, emptyOption,ordertype){
/*	var strBuffer =  '<select name="'+elementName+'" id="'+elementName+'" class="'+className+'">'
					+(emptyOption!=""?'<option value="" ></option>':'')
					+'<option value="115000000" >Buy</option>'
			   		+'<option value="125000000">Lease</option>'
//				   	+'<option value="Change Request">Change Request</option>'
//			   		+'<option value="Repo">Repo</option></select>';*/
		switch (ordertype)
		{
			case 'buy':
				var strBuffer =  '<select name="'+elementName+'" id="'+elementName+'" class="'+className+'">'
								+'<option value="115000000" >Buy</option>';
								break;
			case 'lease':
				var strBuffer =  '<select name="'+elementName+'" id="'+elementName+'" class="'+className+'">'
								+'<option value="125000000">Lease</option>';
								break;
			case 'changerequest':
				var strBuffer =  '<select name="'+elementName+'" id="'+elementName+'" class="'+className+'">'
								+'<option value="990000000">Change Request</option>';
								break;

			case 'other':
				var strBuffer =  '<select name="'+elementName+'" id="'+elementName+'" class="'+className+'">'
								+'<option value="210000000">Other</option>';
								break;
			default :
				var strBuffer =  '<select name="'+elementName+'" id="'+elementName+'" class="'+className+'">'
								+(emptyOption!=""?'<option value="" ></option>':'')
								+'<option value="115000000" >Buy</option>'
						   		+'<option value="125000000">Lease</option>';
								break;
		}
	return strBuffer;
}

var mandatoryCreateUserFields = new Array(
									"txtpassword",
									"txtconfirmpassword",
									"selMainMenu",
									"selModuleType",
									"selSubMenu",									
									"txtloginid");
									
									
var mandatoryOrderFields = new Array(
									"ord_order_credit_id",
									"ord_assigned_to",
									"ord_prepared_by_id",
									"cli_operating_text",
									"cli_sic",									
									"cli_timezone",
									//"cli_ownership",
									//"billcnttitle",
									//"billingfirstname",									
									"billingphonenumber",
									"billingstreetname",
									"billingcity",
									"billingstate",
									"billingcountry",
									"chk_delivery",
									//"deliverytitle",
									//"deliveryfirstname",
									"deliveryphonenumber",
									"deliverystreetname",
									"deliverycity",
									"deliverystate",
									"deliverycountry"
										);

var mandatoryOwnerElements = new Array(
										'own-principalname-',
										'own-ownershiptitle-',
										'own-ownershippercent-',
										'own-ownershipsin-',
										'own-ownerdob-',
										'own-ownershipstreet-',
										'own-ownershipcity-',
										'own-ownershipstate-',
										'own-ownershippostal-',
										'own-ownershipphone-'
										,'own-ownershipcountry-'										
										);
function validateOwnerInfo(form){
	ownersSelected = 0;		
	visibleElements = new Array();
	for(g=0; form.elements['own-principalname-'+g]!= null; g++){				
		ownerselected = false;
		for(h in mandatoryOwnerElements){
			visibleElements[visibleElements.length] = mandatoryOwnerElements[h]+g+"";
			field = document.getElementById(visibleElements[visibleElements.length-1]);
			if(Trim(field.value).length>0){
				ownerselected = true;
				break;
			}
		}
		/* 
		if(document.getElementById('own-ownershipsin-'+g).value=="" && document.getElementById('own-ownerdob-'+g).value==""){
			errorIndicator(document.getElementById('own-ownershipsin-'+g), "Please enter a non-blank value in this field.");
			errorIndicator(document.getElementById('own-ownerdob-'+g), "Please enter a non-blank value in this field.");				
			alert("Atleast one of SIN / Date of Birth are required in the Ownership Information to proceed.");
			return false;
		}else{
			removeErrorIndicator(element);	
		}
		/**/			
		if(ownerselected){
			ownersSelected++;
		}
	}
	
	if(ownersSelected >0 ){
		//if(confirm("Do you wish to add Ownership Info for "+ownersSelected+" owner(s)?")){
			if(!validateForm(form, visibleElements)){
				alert("The marked fields are mandatory for each owner. Please enter the info to proceed.");
				return false;
			}	
		//}else{
			//alert("If you wish to proceed without Ownership Info, clear all ownership fields.");
		//	return false;
	//	}
	}	
	
	return true;
}

var mandatoryEquipElements = new Array(
										'eqp-pod_product_id-'
										);

function validateEquipmentInfo(form){
	equipmentsSelected = 0;		
	visibleElements = new Array();
	for(p=0; form.elements['eqp-pod_product_id-'+p]!= null; p++){				
		equipselected = false;
		for(m in mandatoryEquipElements){
			visibleElements[visibleElements.length] = mandatoryEquipElements[m]+p+"";
			field = document.getElementById(visibleElements[visibleElements.length-1]);
			if(Trim(field.value).length>0){
				equipselected = true;
				break;
			}
		}			
		if(equipselected){
			equipmentsSelected++;
		}
	}
	
	if(true || equipmentsSelected >0 ){
		if(true || confirm("Do you wish to add "+equipmentsSelected+" equipment(s)?")){
			if(!validateForm(form, visibleElements)){
				alert("The marked fields are mandatory for each equipment. Please enter the info to proceed.");
				return false;
			}	
		}else{
			alert("If you wish to proceed without Equipment Info, clear all equipment fields.");
			return false;
		}
	}	
	
	return true;
}

var mandatorySecondaryBillingInfo = new Array(
											  "account_num_2",
											  "route_num_2",
											  "transit_num_2"
												);
var mandatoryPrimaryBillingInfo = new Array(
											  "account_num_1",
											  "route_num_1",
											  "transit_num_1"
												);

function validateBillingInfo(form){
	
	if(!validateForm(form, mandatoryPrimaryBillingInfo)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;
	}
	
	if(document.getElementById('cb-use_diff_billing_account').checked){
		if(!validateForm(form, mandatorySecondaryBillingInfo)){
			alert("The marked fields are mandatory. Enter the required info or uncheck the Billing Account checkbox to proceed.");
			return false;
		}
	}
	return true;
}


function createNewOrder(form){	
	if(	!validateForm(form, mandatoryOrderFields)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;	
	}
	if( validateOwnerInfo(form) &&
		validateEquipmentInfo(form) &&
		validateBillingInfo(form)){
		return true;		 	
	}
	return false;	
}

function updateOrder(form){
	if(	!validateForm(form, mandatoryOrderFields)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;	
	}
	//if(!confirm("The information will be updated for the checked boxes only. Do you wish to continue ?"))
	//		return false;
	form.action = "index.php?directory=modules&subdirectory=sale&function=create_order&menu_type=new_order"
	form.submit();
	return false;
}


function disableAll(prefix){
	
	elements = document.forms[0].elements;	
	for(i=0; elements[i] != null; i++ ){
		if(elements[i].name.toString().indexOf(prefix) >=0){
			elements[i].readOnly = true;
		}
	}
	
}

function toggleEditStatus(toggle, elementsToTogglePrefix, multiple){				
	elementToToggle = document.getElementById(elementsToTogglePrefix);
	if(toggle){
			elementToToggle.readOnly = false;
	}else{
			elementToToggle.readOnly = true;
	}
				
	for(i =1 ; (elementToToggle = document.getElementById(elementsToTogglePrefix+"_"+i))!= null; i++){
		if(toggle){
			elementToToggle.readOnly = false;
		}else{
			elementToToggle.readOnly = true;
		}
	}
}


function toggleMandatoryServices(toggle, prefix){
	elements = document.forms[0].elements;
	for(i=0; elements[i]!= null; i++){
		if(elements[i].name.toString().indexOf(prefix)>=0 || elements[i].id.toString().indexOf(prefix)>=0){
			if(toggle){
				elements[i].value='on';
			}else{
				elements[i].value='off';
			}
		}
	}
	
}

function submitFeeDetails(servicesWindow, form, openerForm){

	if(!validateAllSubServices(form)){
		return false;
	}
		
	form.action = "add_services.php";
	form.method = "POST";
	form.submit();
	
}

function validateAllSubServicesOnChange(form){
	var checkBoxElements = form.elements;
	k=0;
	for(i=0; form.elements[i] != null; i++){
		if(form.elements[i].name=="cb-"){
			alert(form.elements[i].name);
			checkBoxElements[k++] = form.elements[i];
		}
	}	
	
	if(false && !checkAtleastOneChildSelected( checkBoxElements)){
		document.getElementById('selectService').value = document.getElementById('lastService').value;
		serviceName = document.getElementById('selectService').options[document.getElementById('selectService').selectedIndex].text
		alert("Please select at least one service under "+serviceName+" or deselect "+serviceName+" to proceed.");
	}
	
	toggleDisplay(false,document.getElementById(document.getElementById('lastService').value));
	toggleDisplay(true,document.getElementById(document.getElementById('selectService').value));
	document.getElementById('lastService').value=document.getElementById('selectService').value;
	return true;
}

function checkTerminalSelected(){					
		var j =0;
		var equipcount = document.getElementById('equipRowCount').value;		
		for(j=0; j<equipcount; j++){			
			element = document.getElementById('eqp-pod_product_id-'+j);			
			if(element != null){			
				if(terminalTypes[element.value]!=null){					
					toggleDisplay(true,document.getElementById('table-term_features_title'), document.getElementById('table-term_features'), document.getElementById('table-term_features_spacer'));
					return;
				}
			}else{
				//alert(element.name);
				break;	
			}
		}
		toggleDisplay(false,document.getElementById('table-term_features_title'), document.getElementById('table-term_features'), document.getElementById('table-term_features_spacer'));
	}

function validateAllSubServices(form){
	var checkBoxElements = new Array();
	k=0;
	for(i=0; form.elements[i] != null; i++){
		if(form.elements[i].name.indexOf("cb-")==0){
			//alert(form.elements[i].name);
			checkBoxElements[k++] = form.elements[i];
		}
	}		
	
	if(false && !checkAtleastOneChildSelected( checkBoxElements)){
		serviceName = form.lastService.options[form.selectService.selectedIndex].text;		
		alert("Please select at least one service under "+serviceName +" to proceed.");		
		return false;
	}
	
	toggleDisplay(false,document.getElementById(document.getElementById('lastService').value));
	toggleDisplay(true,document.getElementById(document.getElementById('selectService').value));
	document.getElementById('lastService').value=document.getElementById('selectService').value;
	return true;
}

function checkAtleastOneChildSelected( checkBoxElements){
	var childSelected = false;
	var hasChild = false;
	for(i=0; checkBoxElements[i]!=null; i++){
		if(checkBoxElements[i].checked){
			childSelected = false;
			hasChild = false;
			for(k=i+1; checkBoxElements[k].name.indexOf(checkBoxElements[i].name)>=0; k++){
				childName = checkBoxElements[k].name;
				childName = childName.replace("cb-","txt-");						
				if(document.getElementById(childName) != null){ // skip checkboxes next to fields					
					continue;
				}				
				//alert(childName);	
				//alert( checkBoxElements[k].name+"-"+checkBoxElements[i].name);
				hasChild = true;				
				if(checkBoxElements[k].checked){
					childSelected = true;
					break;
				}
			}
			if(hasChild && !childSelected){
				//alert(checkBoxElements[i].name);
				return false;
			}
		}
	}
	return true;
}

function addOwnerRow(addToElement, rowHTML, rowNumber){	

	allElements = document.forms[0].elements;
	if(rowNumber == null){
		rowCount = document.forms[0].ownerRowCount.value;
	}else{
		rowCount = parseInt(rowNumber);
	}

	strRowCount = "-"+rowCount;
	rowHTML = rowHTML.replace(/-0/gi,strRowCount);				
	values = new Array();
	
	//Read all values
	for(i=0 ; i< allElements.length; i++){
			if(allElements[i].name.indexOf("own-")==0){
				values[allElements[i].name] = allElements[i].value;
			}
	}
	addToElement.innerHTML = addToElement.innerHTML + '<table cellspacing="0" cellpadding="0"  width="100%">' + rowHTML+'</table>';		
	
	document.forms[0].ownerRowCount.value = parseInt(rowCount)+1;  		
	//document.getElementById('shippingnotes').value = "<temp>"+addToElement.innerHTML+"</temp>";		
		//Set All values					
		for(i=0 ; i< allElements.length; i++){
			if(allElements[i].name.indexOf("own-")==0){
				if(values[allElements[i].name] == null){
					break;
				}
				allElements[i].value = values[allElements[i].name];							
			}
		}
		
		//Display all checkboxes except cb-owner-selected-0
		for(i=0 ; i< allElements.length; i++){
			if(allElements[i].name.indexOf("cb-owner-selected-")==0){
				if(allElements[i].name != "cb-owner-selected-0"){
					allElements[i].style.display="";
				}				
			}
		}
	}
		


function addAllOwnerRows(addToElement, rowHTML, ownersArray){
	for(k=0; k< ownersArray.length && ownersArray[k] != null; k++){		
		if(k!=0)
			addOwnerRow(addToElement, rowHTML, k);
		ownersArray[k].populateForm(document.forms[0]);
	}
}

function addAllEquipmentRows(addToElement, rowHTML, equipmentArray){
	for(k=0; k< equipmentArray.length && equipmentArray[k] != null; k++){		
		if(k!=0){
			addEquipmentRow(addToElement, rowHTML, k);
		}		
		equipmentArray[k].populateForm(document.forms[0]);
		updateLineTotal(document.getElementById('eqp-pod_unit_price-'+k),document.getElementById('eqp-pod_quantity-'+k),document.getElementById('eqp-equipmenttotal-'+k));
	}
}

function OwnerShipInfo( ceo_bus_owner_id, principalname, ownershiptitle, ownershippercent, ownershipsin, 
							ownershipstreet, ownershipcity, ownershipstate, ownershippostal, 
							ownershipphone, ownershipcountry , ownerdob){
		this.ceo_bus_owner_id=ceo_bus_owner_id;
		this.principalname = principalname;
	 	this.ownershiptitle = ownershiptitle;
		this.ownershippercent = ownershippercent;
	 	this.ownershipsin= ownershipsin;
	 	this.ownershipstreet = ownershipstreet;
		this.ownershipcity = ownershipcity;
	 	this.ownershipstate = ownershipstate;
	 	this.ownershippostal = ownershippostal;
		this.ownershipphone=ownershipphone;
	 	this.ownershipcountry=ownershipcountry;
		this.ownerdob = ownerdob;
		
		this.populateForm = function (form){
			form.elements['own-principalname-'+this.ceo_bus_owner_id].value=this.principalname;
			form.elements['own-ownershiptitle-'+this.ceo_bus_owner_id].value=this.ownershiptitle;
			form.elements['own-ownershippercent-'+this.ceo_bus_owner_id].value=this.ownershippercent;
			form.elements['own-ownershipsin-'+this.ceo_bus_owner_id].value=this.ownershipsin;
			form.elements['own-ownershipstreet-'+this.ceo_bus_owner_id].value=this.ownershipstreet;			
			form.elements['own-ownershipcity-'+this.ceo_bus_owner_id].value=this.ownershipcity;
			form.elements['own-ownerdob-'+this.ceo_bus_owner_id].value=this.ownerdob;
			
			loadProvinces(form.elements['own-ownershipstate-'+this.ceo_bus_owner_id],this.ownershipcountry);
			form.elements['own-ownershipstate-'+this.ceo_bus_owner_id].value=this.ownershipstate;
			
			form.elements['own-ownershippostal-'+this.ceo_bus_owner_id].value=this.ownershippostal;
			form.elements['own-ownershipphone-'+this.ceo_bus_owner_id].value=this.ownershipphone;
			form.elements['own-ownershipcountry-'+this.ceo_bus_owner_id].value=this.ownershipcountry;
		}
}

function EquipmentInfo( pod_ord_line_num, pod_product_label, pod_product_id, pod_unit_price, pod_quantity, pod_max_surcharge, pod_refund, pod_lease_type, pod_lease_payment ){
		this.pod_ord_line_num=pod_ord_line_num;
		this.pod_product_label=pod_product_label;
		this.pod_product_id = pod_product_id;
	 	this.pod_unit_price = pod_unit_price;
		this.pod_quantity = pod_quantity;	 	
		this.pod_max_surcharge = pod_max_surcharge;
		this.pod_refund = pod_refund;		
		this.pod_lease_type = pod_lease_type;
		this.pod_lease_payment = pod_lease_payment;
		
		
		this.populateForm = function (form){			
		//alert('eqp-pod_product_id-'+this.pod_ord_line_num+" " +form.elements['eqp-pod_product_id-'+this.pod_ord_line_num]);
			form.elements['eqp-pod_ord_line_num-'+this.pod_ord_line_num].value=this.pod_ord_line_num;
			form.elements['eqp-pod_product_label-'+this.pod_ord_line_num].value=this.pod_product_label;
			if(form.elements['eqp-pod_product_id-'+this.pod_ord_line_num]!=null){form.elements['eqp-pod_product_id-'+this.pod_ord_line_num].value=this.pod_product_id;}			
			if(form.elements['eqp-pod_unit_price-'+this.pod_ord_line_num]!=null)form.elements['eqp-pod_unit_price-'+this.pod_ord_line_num].value=this.pod_unit_price;
			if(form.elements['eqp-pod_quantity-'+this.pod_ord_line_num] !=null )form.elements['eqp-pod_quantity-'+this.pod_ord_line_num].value=this.pod_quantity;
			if(form.elements['eqp-pod_lease_type-'+this.pod_ord_line_num] !=null)form.elements['eqp-pod_lease_type-'+this.pod_ord_line_num].value=this.pod_unit_price;
			if(form.elements['eqp-pod_lease_payment-'+this.pod_ord_line_num] != null)form.elements['eqp-pod_lease_payment-'+this.pod_ord_line_num].value=this.pod_quantity;
			/*			
			form.elements['eqp-pod_max_surcharge-'+this.pod_ord_line_num].value=this.pod_max_surcharge;
			form.elements['eqp-pod_refund-'+this.pod_ord_line_num].value=this.pod_refund;
			*/
		}
}


function addEquipmentRow(addToElement, rowHTML, rowNumber){	
	allElements = document.forms[0].elements;
	if(rowNumber == null){
		rowCount = parseInt(document.forms[0].equipRowCount.value);
	}else{
		rowCount = parseInt(rowNumber);
	}
	
	strRowCount = "-"+rowCount;
	rowHTML = rowHTML.replace(/PRD-0/gi,"PRD0");
	rowHTML = rowHTML.replace(/-0/gi,strRowCount);
	rowHTML = rowHTML.replace(/PRD0/gi,"PRD-0");
	
	values = new Array();
	//Read all values
	for(i=0 ; i< allElements.length; i++){
		if(allElements[i].name.indexOf("eqp-")==0){
				values[allElements[i].name] = allElements[i].value;
			}
		}
					
		addToElement.innerHTML = addToElement.innerHTML + '<table width="100%"  cellspacing="0" cellpadding="0" border=0>' + rowHTML+'</table>';
		document.forms[0].equipRowCount.value = rowCount+1;  
		document.getElementById('eqp-pod_ord_line_num-'+rowCount).value = rowCount; 
		//document.forms[0].shippingnotes.value = "<temp>"+addToElement.innerHTML+"</temp>";
		//alert(addToElement.innerHTML);
		
		//Set All values					
		for(i=0 ; i< allElements.length; i++){
			if(allElements[i].name.indexOf("eqp-")==0){
				if(values[allElements[i].name] == null){
					break;
				}
				allElements[i].value = values[allElements[i].name];							
			}
		}
		
		//Display all checkboxes except cb-owner-selected-0
		for(i=0 ; i< allElements.length; i++){
			if(allElements[i].name.indexOf("cb-equipment-selected-")==0){
				if(allElements[i].name != "cb-equipment-selected-0"){
					allElements[i].style.display="";
				}				
			}
		}
		
}

function updatePriceList(agentId,  priceListAll){		       				       				
	return priceListAll[agentId];
}


function showPrice(prodId, objUnitPrice, priceList){     			
		if(isNaN(priceList )){			
			return;		
		}
		price = priceList[prodId];		
     	objUnitPrice.value=(isNaN(price)?0:price);   
     	//alert(prodId+" "+priceList[prodId]); 	
}
     
function updateTotals(objSubTotal, objGSTHST, objPST, objGrandTotal, taxVals){
		
	    allElements = document.forms[0].elements;
     	total = 0;
     	
     	//Sum all Line Totals
     	for(i=0; i< allElements.length; i++){
     		if(allElements[i].name.indexOf("eqp-equipmenttotal-")==0 || allElements[i].name.indexOf("eqp-pod_lease_payment-")==0){
     			total = total + parseFloat(allElements[i].value); 
     		}
     	}
     	
     	if(isNaN(total))
     		return ;

     	//Set SubTotal
     	if(objSubTotal!= null) objSubTotal.value = trimToDecimalPlaces(total,2);
     	
     	if(taxVals==null || isNaN(taxVals['GST']) || isNaN(taxVals['HST']) || isNaN(taxVals['PST']) ){
     		taxVals = new Array();
     		taxVals['GST'] =0;
     		taxVals['HST'] =0;
     		taxVals['PST']= 0;
     	}
     	
     	//Calculate and set GSTHST
     	gsthst=parseFloat(taxVals['GST'])*total + parseFloat(taxVals['HST'])*total; 
     	if(objGSTHST!= null) objGSTHST.value=trimToDecimalPlaces(gsthst,NO_OF_DECIMAL_PLACES);

     	//Calculate and set PST
     	pst=parseFloat(taxVals['PST'])*total;
     	if(objPST!= null) objPST.value=trimToDecimalPlaces(pst,NO_OF_DECIMAL_PLACES);
     	
     	//Sum LineTotals and taxes
     	grandtotal = total + pst + gsthst;     	
     	
     	//Set Grand Total
     	if(objGrandTotal!= null) objGrandTotal.value = trimToDecimalPlaces(grandtotal,NO_OF_DECIMAL_PLACES);
	
}
function updateLineTotal(objUnitPrice, objQty, objLineTotal){
	
     	if(objUnitPrice == null)
     		return;
     		
     	if(objUnitPrice.value =="")
     		return;
     		
     	if(objQty.value == null)
     		return; 
     	if(objQty.value=="")
     		objQty.value = 1;
    	
     if(objLineTotal!= null)objLineTotal.value  = objQty.value * objUnitPrice.value ;    	     	
}

function setEquipName(objSelEquip, objEquipName){
	objEquipName.value= objSelEquip.options[objSelEquip.selectedIndex].text;
}
  
function removeOwnerRow(addToElement, rowNumberToDelete){		
	rowHTML = document.getElementById('ownershipinfotable-0').innerHTML;
	saveOwnerInfo = new Array();
	rowNumberToDelete = parseInt(rowNumberToDelete.substr(1, rowNumberToDelete.length));
	if(rowNumberToDelete == 0){
		document.getElementById('cb-owner-selected-0').checked=true;
		return;
	}
	
	if(!confirm("Any changes done to this row will be lost. Do you wish to continue ? ")){
		document.getElementById('cb-owner-selected-'+rowNumberToDelete).checked=true;
		return ;
	}
	
	//Read all Owner values 
	allElements = document.forms[0].elements;
	offset = 0;
	//alert("rowNumberToDelete "+ rowNumberToDelete);
	for(i=0; i<allElements.length && allElements[i] != null; i++){
		if(allElements[i].name.indexOf('own-') ==0){
			rowNumber=parseInt(allElements[i].name.substr(allElements[i].name.lastIndexOf("-")+1,allElements[i].name.length));						
			if(rowNumber != rowNumberToDelete){				
				elementName = allElements[i].name;				
				elementName = elementName.replace("-"+rowNumber,"-"+(rowNumber-offset));
				saveOwnerInfo[elementName] = allElements[i].value;	
				//document.getElementById('shippingnotes').value=document.getElementById('shippingnotes').value+elementName+"\n"	;									
			}else{
				if(lastRowNumber != rowNumber){
					offset++;
				}
				
			}
			lastRowNumber = rowNumber;
		}
	}
	
	
	rowCounter = parseInt(document.getElementById('ownerRowCount').value)-1;	
	document.getElementById('ownerRowCount').value = 1;
	addToElement.innerHTML = "";
	//Rewrite Rows and skip removed row		
	for (n=1; n< rowCounter; n++){		
		addOwnerRow(addToElement, rowHTML);		
		
	}
	//document.getElementById('shippingnotes').value=addToElement.innerHTML;
	k=0;
	//Fill in values skip removed row
	for(i=0; i<allElements.length && allElements[i] != null; i++){
		if(allElements[i].name.indexOf('own-') ==0){
			//rowNumber=parseInt(allElements[i].name.substr(allElements[i].name.lastIndexOf("-")+1,allElements[i].name.length));
			allElements[i].value = saveOwnerInfo[allElements[i].name];
			//alert(allElements[i].name);
		}
	}
}
 
function removeEquipmentRow(addToElement, rowNumberToDelete){			
	rowHTML = document.getElementById('equipmentTable-0').innerHTML;
	saveEquipmentInfo = new Array();
	rowNumberToDelete = parseInt(rowNumberToDelete.substr(1, rowNumberToDelete.length));
	if(rowNumberToDelete == 0){
		document.getElementById('cb-equipment-selected-0').checked=true;
		return;
	}
	
	if(!confirm("Any changes done to this row will be lost. Do you wish to continue ? ")){
		document.getElementById('cb-equipment-selected-'+rowNumberToDelete).checked=true;
		return ;
	}
	
	//Read all Equipment values 
	allElements = document.forms[0].elements;
	offset = 0;
	//alert("rowNumberToDelete "+ rowNumberToDelete);
	for(i=0; i<allElements.length && allElements[i] != null; i++){
		if(allElements[i].name.indexOf('eqp-') ==0){
			rowNumber=parseInt(allElements[i].name.substr(allElements[i].name.lastIndexOf("-")+1,allElements[i].name.length));						
			if(rowNumber != rowNumberToDelete){				
				elementName = allElements[i].name;				
				elementName = elementName.replace("-"+rowNumber,"-"+(rowNumber-offset));
				saveEquipmentInfo[elementName] = allElements[i].value;	
				//document.getElementById('shippingnotes').value=document.getElementById('shippingnotes').value+elementName+"\n"	;									
			}else{
				if(lastRowNumber != rowNumber){
					offset++;
				}
				
			}
			lastRowNumber = rowNumber;
		}
	}
	
	
	rowCounter = parseInt(document.getElementById('equipRowCount').value)-1;	
	document.getElementById('equipRowCount').value = 1;
	addToElement.innerHTML = "";
	//Rewrite Rows and skip removed row		
	for (n=1; n< rowCounter; n++){		
		addEquipmentRow(addToElement, rowHTML);		
		
	}
	//document.getElementById('shippingnotes').value=addToElement.innerHTML;
	k=0;
	//Fill in values skip removed row
	for(i=0; i<allElements.length && allElements[i] != null; i++){
		if(allElements[i].name.indexOf('eqp-') ==0){
			//rowNumber=parseInt(allElements[i].name.substr(allElements[i].name.lastIndexOf("-")+1,allElements[i].name.length));
			allElements[i].value = saveEquipmentInfo[allElements[i].name];
			//alert(allElements[i].name);
		}
	}	
}

function loadOwnership(selectObj){
	selectObj.options[0] =  new Option('','');
	selectObj.options[1] =  new Option('Proprietorship','Proprietorship');
	selectObj.options[2] =  new Option('Partnership','Partnership');
	selectObj.options[3] =  new Option('Corporation','Corporation');
	selectObj.options[4] =  new Option('LLP','LLP');
}
 
function submitLeaseInfo(form){
	if(form.lsd_lease_approval.checked ==true){
		if(!confirm("Do you wish to complete the lease approval stage ?")){
			form.lsd_lease_approval.checked =false;
			alert("The Lease Score Approval checkbox has been unchecked. \nCheck the box and resubmit if you wish to complete lease approval stage.");
			return false;		
		}			
	}
	return true;	
}


function markQualityCheck(form, path){
	assignedTo = form.ord_assigned_to.options[form.ord_assigned_to.selectedIndex].text;
	if(confirm("Would you like to complete the Documentation Checklist?")){
		openBrWindow(path+'document_checklist.php?qualityCheck=true','DocumentCheckList','width=700, height=500, scrollbars=1')
		return false;
	}
	if(confirm("Do you wish to assign it to '"+assignedTo+"' for further verification ?")){	
	//form.submit();
		return true;
	}
	return false;
}

function completeOrderVerification(form, path){
	assignedTo = form.ord_assigned_to.options[form.ord_assigned_to.selectedIndex].text;
	if(confirm("Would you like to view the Documentation Checklist before completing Verification ?")){
		openBrWindow(path+'document_checklist.php?verifyOrder=true','DocumentCheckList','width=700, height=500, scrollbars=1')
		return false;
	}
	if(confirm("Do you wish to assign it to '"+assignedTo+"' for further verification ?")){	
	//form.submit();
		return true;
	}
	return false;
}

function billingProvinceChanged(provinceObj, calculateTotals ){
	changeTimeZone('cli_timezone_name', 'cli_timezone','billingcountry', 'billingstate');
	taxes = getTaxData('billingcountry', 'billingstate');
	if(calculateTotals){
		gsthst = document.getElementById('gsthst');
		pst = document.getElementById('pst');
		grandtotal = document.getElementById('grandtotal');
		subtotal = document.getElementById('subtotal');
		
		if(isNaN(subtotal.value) || Trim(subtotal.value) == "")return taxes;
		//updateTotals(subtotal, gsthst, pst, grandtotal);		
		gsthst.value =  trimToDecimalPlaces(parseFloat(subtotal.value)*parseFloat(taxes['GST']) + parseFloat(subtotal.value)*parseFloat(taxes['HST']),NO_OF_DECIMAL_PLACES);
		pst.value = trimToDecimalPlaces(parseFloat(subtotal.value)*parseFloat(taxes['PST']), NO_OF_DECIMAL_PLACES);		
		grandtotal.value = trimToDecimalPlaces(parseFloat(subtotal.value) +parseFloat(gsthst.value) +parseFloat(pst.value), NO_OF_DECIMAL_PLACES);		
	}
	return taxes;
}

function modifyService(service){
	 
 	document.forms[0].selectedService.value=service;
	//alert(document.forms[0].selectedService.value);
	openBrWindow('cpos/popupwindow/add_services.php','AddServices',' width=390, height=610, menubar=false ');
}



function checkCardInfo(order_id, client_id, assigned_to){	
	
	if(confirm("Do you wish to view/modify any Card Related Info before proceeding ?")){
		document.forms[0].verifyCardInfo.value="true";
		assignValueTohidden(order_id, client_id, assigned_to);
	}else{
		document.forms[0].assignFor.value="assign_terminal";
		document.forms[0].order_id.value=order_id;
		document.forms[0].client_id.value=client_id;
		document.forms[0].salesagentid.value=assigned_to;
		openBrWindow('cpos/popupwindow/assign_order.php','LeaseInfo',' width=300, height=200, menubar=0,  toolbar=0, scrollbars=0 ');
//		document.forms[0].creditCardInfoCompleted.value="true";
//		document.forms[0].submit();
	}
}

function submitDocInfo(form){
	form.submit();
}