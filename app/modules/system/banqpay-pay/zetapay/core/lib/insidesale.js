function processInsideSaleLead(form, currDate, CALLBACK){	
	
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
	
	form.action="./index.php?directory=modules&subdirectory=insidesale&function=insale_assigned_leads&menu_type=insale_assigned_leads#leadSummary";

	return true
}
 

function goToInsideSaleLeadDetails(form, leadId){	
	form.elements['cpos_leads_master-clm_lead_id'].value = leadId;
	form.action = "./index.php?directory=modules&subdirectory=insidesale&function=insale_search_leads&menu_type=insale_lead_details";
	form.method="POST";	
	form.submit();
	return ;
}

 


function deleteInsideSaleLead(form,leadFunction,leadMenuType ){	 
	status = confirm("The Lead will be permanently deleted.\nDo you wish to continue ?");
	if(status){	
		form.action="./index.php?directory=modules&subdirectory=insidesale&function="+leadFunction+"&menu_type="+leadMenuType;
	}
	return status;
}
