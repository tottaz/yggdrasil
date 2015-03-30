
function createNewOrderSagent(form,moduletype){
	if(	!validateForm(form, mandatoryOrderFields)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;	
	}
	if( validateOwnerInfo(form) &&
		validateEquipmentInfo(form) &&
		validateBillingInfo(form)){
		
		  if(moduletype=="salesagent")
				form.action = "index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type=sagent_new_order"
		  else if(moduletype=="operation")		
				form.action = "index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type=oper_new_order"
		  else if(moduletype=="insidesale")		
				form.action = "index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type=insale_new_order"
				
			//form.submit();
		
		return true;		 	
	}

	return false;
}
function createNewChangeReqOrder(form,moduletype,file){
	if(	!validateForm(form, mandatoryOrderFields)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;	
	}
	if( validateOwnerInfo(form) &&
		validateEquipmentInfo(form) &&
		validateBillingInfo(form)){
		
		  if(moduletype=="salesagent")
				form.action = "index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type="+file;
		  else if(moduletype=="operation")		
				form.action = "index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type="+file;
		  else if(moduletype=="insidesale")		
				form.action = "index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type=insale_new_order"
		  if(moduletype=="sale")
				form.action = "index.php?directory=modules&subdirectory=sale&function=create_order&menu_type="+file;
//				alert(form.action);return false;
		  form.submit();
		
		return true;		 	
	}

	return false;
}

function updateOrderSagent(form,moduletype){

	if(	!validateForm(form, mandatoryOrderFields)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;	
	}
	if( validateOwnerInfo(form) &&
		validateEquipmentInfo(form) &&
		validateBillingInfo(form)){

//		if(!confirm("The information will be updated for the checked boxes only. Do you wish to continue ?"))
//				return false;
		if(moduletype=="salesagent")
		        form.action = "index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type=sagent_new_order"
	    else if(moduletype=="operation")		
				form.action = "index.php?directory=modules&subdirectory=operation&function=oper_order&menu_type=oper_new_order"
		else if(moduletype=="insidesale")		
				form.action = "index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type=insale_new_order"

		form.submit();
		return true;
	}
	return false;
}
function updateNewChangeReqOrder(form,moduletype,file){

	if(	!validateForm(form, mandatoryOrderFields)){
		alert("The marked fields are mandatory. Enter the required info to proceed.");
		return false;	
	}
	if( validateOwnerInfo(form) &&
		validateEquipmentInfo(form) &&
		validateBillingInfo(form)){
		 
//		if(!confirm("The information will be updated for the checked boxes only. Do you wish to continue ?"))
//				return false;
		if(moduletype=="salesagent")
		        form.action = "index.php?directory=modules&subdirectory=salesagent&function=sagent_order&menu_type="+file
	    else if(moduletype=="operation")		
				form.action = "index.php?directory=modules&subdirectory=operation&function=create_order&menu_type="+file
		else if(moduletype=="insidesale")		
				form.action = "index.php?directory=modules&subdirectory=insidesale&function=insale_create_order&menu_type="+file

		form.submit();
		return true;
	}
	return false;
}
/*function deleteProspect(form){
	status = confirm("The Lead will be permanently deleted.\nDo you wish to continue ?");
	if(status){	
		form.action="./index.php?directory=modules&subdirectory=salesagent&function=sagent_prospects&menu_type=prospect_detail";;
	}
	else
		return false;
}*/