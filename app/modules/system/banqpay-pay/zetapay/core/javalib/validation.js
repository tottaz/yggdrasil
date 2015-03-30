
//-------------------------------------------------------------------
// isBlank(value)
//   Returns true if value only contains spaces
//-------------------------------------------------------------------
function isBlank(val){
	if(val==null){return true;}
	for(var i=0;i<val.length;i++) {
		if ((val.charAt(i)!=' ')&&(val.charAt(i)!="\t")&&
				(val.charAt(i)!="\n")&&(val.charAt(i)!="\r")){
				return false;
		}
	}
	return true;
}

//-------------------------------------------------------------------
// isInteger(value)
//   Returns true if value contains all digits
//-------------------------------------------------------------------
function isInteger(val){
	if (isBlank(val)){return false;}
	for(var i=0;i<val.length;i++){
		if(!isDigit(val.charAt(i))){return false;}
		}
	return true;
}	

//-------------------------------------------------------------------
// isDigit(value)
//   Returns true if value is a 1-character digit
//-------------------------------------------------------------------
function isDigit(num) {
	if (num.length>1){return false;}
	var string="1234567890";
	if (string.indexOf(num)!=-1){return true;}
	return false;
}

function isEmpty(str){
	return (Trim(str).length==0);
}

// returns true if the string is a valid email ID
function isEmail(str){
  if(isEmpty(str)) return false;
  var re = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i
  return re.test(str);
}

// returns true if the string only contains characters A-Z or a-z
function isAlphaStrict(str){
    if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (!(	(str.charAt(i)>='a' && str.charAt(i)<='z') ||  
				(str.charAt(i)>='A' && str.charAt(i)<='Z'))  
				){
				
				alert("Please Enter Characters Only");
				return false;
		}
	}
	return true; 

}

// returns true if the string only contains characters A-Z or a-z
function isAlphaSpace(str){
    if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (!(	 str.charAt(i)==' ' || 
				(str.charAt(i)>='a' && str.charAt(i)<='z') ||  
				(str.charAt(i)>='A' && str.charAt(i)<='Z'))  
				){
				alert("Please Enter Characters Only");
				return false;
		}
	}
	return true; 

}

// returns true if the string only contains characters 0-9
function isNumericStrict(str){

    if(str==null){return true;}
	//alert(str)
	for(var i=0;i<str.length;i++) {
	 	if (   !((str.charAt(i)>=0 && str.charAt(i)<=9) )  
 	 		){
 	 			alert("Please Enter Numeric Value Only");
				return false;
		}
	}
	return true; 

}

// returns true if the string only contains characters 0-9
function isNumericSpace(str){
    if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (   !(str.charAt(i)==' ' || 			
				(str.charAt(i)>='0' && str.charAt(i)<='9') )  
				){
				alert("Please Enter Numeric Value Only");
				return false;
		}
	}
	return true; 
}

// returns true if the string only contains characters 0-9
function isDecimal(str){
    if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (   !(str.charAt(i)=='.' || 			
				(str.charAt(i)>='0' && str.charAt(i)<='9') )  
				){
				return false;
		}
	}
	return true; 
}

// returns true if the string only contains characters A-Z, a-z or 0-9
function isAlphaNumericStrict(str){ 
    if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (!(	(str.charAt(i)>='a' && str.charAt(i)<='z') ||  
				(str.charAt(i)>='A' && str.charAt(i)<='Z') ||  
				(str.charAt(i)>='0' && str.charAt(i)<='9') )  
				){
				return false;
		}
	}
	return true; 
}

// returns true if the string only contains characters A-Z, a-z or 0-9
function isSpecialAlphaNumeric(str){  
  if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (!(str.charAt(i)==' ' || 
				str.charAt(i)=='\'' ||
				str.charAt(i)=='"' ||
				str.charAt(i)=='*' ||
				str.charAt(i)=='&' ||				
				(str.charAt(i)>='a' && str.charAt(i)<='z') ||  
				(str.charAt(i)>='A' && str.charAt(i)<='Z') ||  
				(str.charAt(i)>='0' && str.charAt(i)<='9') )  
				){
				return false;
		}
	}
	return true; 
}

// returns true if the string only contains characters A-Z, a-z, 0-9, &,",',<space>
function isAlphaNumericSpace(str){
	if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (!(str.charAt(i)==' ' || 
				(str.charAt(i)>='a' && str.charAt(i)<='z') ||  
				(str.charAt(i)>='A' && str.charAt(i)<='Z') ||  
				(str.charAt(i)>='0' && str.charAt(i)<='9') )  
				){
				return false;
		}
	}
	return true; 
}

function validateForm(formObj, elementsToCheck){	
	var formValid = true;
	var flag=0;
	 
	for(x=0; x < elementsToCheck.length; x++){		
		element = formObj.elements[elementsToCheck[x]];
		
		if(element != null)
		{	
	 		if(element.type=="checkbox" && element.name=="chk_delivery" && element.checked==false)
			{
				 flag=1;  //if chk_delivery is true then we will not check the delivery Form
				
			}
			 
			if(flag!=1)
			{
				if(isBlank(element.value)){				
					formValid = false;				
					errorIndicator(element, "Please enter a non-blank value in this field.");				
				}else{				
					removeErrorIndicator(element);	
			}//end if
		  }
		}
	}
	
	return formValid;
}

function checkEmailFormat(inpObj){
	if(Trim(inpObj.value).length!= 0 && !isEmail(inpObj.value)){
		alert("Please enter email according to the format xyz@abc.com or clear the box to proceed.");
		inpObj.focus();
	}
}

function isPhone(str){
	if(str==null){return true;}
	for(var i=0;i<str.length;i++) {
		if (!(str.charAt(i)==' ' || 
				str.charAt(i)=='-' ||						
				(str.charAt(i)>='0' && str.charAt(i)<='9') )  
				){
				return false;
		}
	}
	return true; 
}

function validateValue(fieldObj, event, validationCode){	
	oldValue = fieldObj.value;
	if(is_nav){
		fnKey = (event.charCode==0?true:false);		
		newValue= oldValue+String.fromCharCode(event.which);
	}else{
		fnKey = false;
		newValue= oldValue+String.fromCharCode(event.keyCode);
	}

	if(fnKey){				
	 	 return true;
	}	

	if( fieldObj.readOnly){
		fieldObj.value = oldValue;
		return false;
	}
	
	
 	var failed = true; 	
	
	if(validationCode == 'ANS'){					
			failed = !isAlphaNumericSpace(newValue);		
//			fieldObj.onblur=function(){this.value= this.value.replace(/^A-Za-z0-9 /g, "")};
	}else if(validationCode == 'AS'){					
			failed = !isAlphaSpace(newValue);		
	}else if(validationCode == 'NS'){					
			failed = !isNumericSpace(newValue);					
	}else if(validationCode == 'A'){					
			failed = !isAlphaStrict(newValue);		
	}else if(validationCode == 'N'){						
			failed = !isNumericStrict(newValue);		
	//		fieldObj.onblur=function(){this.value= this.value.replace(/^A-Za-z0-9 /g, "")};
	}else if(validationCode == 'PHONE'){					
			failed = !isPhone(newValue);		
	}else if(validationCode == 'ND'){					
			failed = !isDecimal(newValue);		
	}else if(validationCode == 'AN'){					
			failed = !isAlphaNumericStrict(newValue);		
	}	
	//alert(failed+"<>"+oldValue);
	fieldObj.value=(failed?oldValue:newValue);

	
	return false;
}
function chkSearchOrdervalidation(formname)
{
    var len=formname.elements.length;
   	var error=0;	
	 
	 
	for(var i=0;i< len ;i++)
	{	 
		if(formname.elements[i].type=='text' || formname.elements[i].type=='select-one')
		{
			if(formname.elements[i].value!="")
				return true;
			else
				error=1;
		}
	}
	if(error==1)
	{ 
		alert("Please Enter Alteast One Seach Criteria") ;
		return false;
	}
	return false;
} 

  
