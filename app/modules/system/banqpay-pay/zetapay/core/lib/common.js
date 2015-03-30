// Common javascript file 
// alert("hi");

// convert all characters to lowercase to simplify testing
    var agt=navigator.userAgent.toLowerCase();

    // *** BROWSER VERSION ***
    // Note: On IE5, these return 4, so use is_ie5up to detect IE5.
    var is_major = parseInt(navigator.appVersion);
    var is_minor = parseFloat(navigator.appVersion);

    // Note: Opera and WebTV spoof Navigator.  We do strict client detection.
    // If you want to allow spoofing, take out the tests for opera and webtv.
    var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1)
                && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1)
                && (agt.indexOf('webtv')==-1) && (agt.indexOf('hotjava')==-1));
    var is_nav2 = (is_nav && (is_major == 2));
    var is_nav3 = (is_nav && (is_major == 3));
    var is_nav4 = (is_nav && (is_major == 4));
    var is_nav4up = (is_nav && (is_major >= 4));
    var is_navonly      = (is_nav && ((agt.indexOf(";nav") != -1) ||
                          (agt.indexOf("; nav") != -1)) );
    var is_nav6 = (is_nav && (is_major == 5));
    var is_nav6up = (is_nav && (is_major >= 5));
    var is_gecko = (agt.indexOf('gecko') != -1);


    var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
    var is_ie3    = (is_ie && (is_major < 4));
    var is_ie4    = (is_ie && (is_major == 4) && (agt.indexOf("msie 4")!=-1) );
    var is_ie4up  = (is_ie && (is_major >= 4));
    var is_ie5    = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
    var is_ie5_5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.5") !=-1));
    var is_ie5up  = (is_ie && !is_ie3 && !is_ie4);
    var is_ie5_5up =(is_ie && !is_ie3 && !is_ie4 && !is_ie5);
    var is_ie6    = (is_ie && (is_major == 4) && (agt.indexOf("msie 6.")!=-1) );
    var is_ie6up  = (is_ie && !is_ie3 && !is_ie4 && !is_ie5 && !is_ie5_5);
 
    var is_opera = (agt.indexOf("opera") != -1);
    var is_opera2 = (agt.indexOf("opera 2") != -1 || agt.indexOf("opera/2") != -1);
    var is_opera3 = (agt.indexOf("opera 3") != -1 || agt.indexOf("opera/3") != -1);
    var is_opera4 = (agt.indexOf("opera 4") != -1 || agt.indexOf("opera/4") != -1);
    var is_opera5 = (agt.indexOf("opera 5") != -1 || agt.indexOf("opera/5") != -1);
    var is_opera5up = (is_opera && !is_opera2 && !is_opera3 && !is_opera4); 

var NO_OF_DECIMAL_PLACES = 2;

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
										//'own-ownershipsin-',
										'own-ownershipstreet-',
										'own-ownershipcity-',
										//'own-ownershipstate-',
										'own-ownershippostal-',
										'own-ownershipphone-'
										//,'own-ownershipcountry-'										
										);
var mandatoryEquipElements = new Array(
										'eqp-pod_product_id-'
										);										

function scrollHeader(e)
{	
	if(document.getElementById('gridHeader') != null){
		document.getElementById('gridHeader').scrollLeft = document.getElementById('result').scrollLeft;
	}
}	

function enableScroller(headerName, gridName){
		document.body.onmouseover = scrollHeader;
		//alert(document.getElementById(headerName));
		document.getElementById(headerName).onmousemove = scrollHeader;
		document.getElementById(headerName).onscroll = scrollHeader;
		document.getElementById(gridName).onmousemove = scrollHeader;
		document.getElementById(gridName).onscroll = scrollHeader;
		if(navigator.appName == 'Netscape')
				document.captureEvents(Event.MOUSEMOVE);		
	}


//select Canada
function loadDefaultCountry(country, province){
	countryCode = 'CA';
	if(document.getElementById(country).value =="" || document.getElementById(country).value ==countryCode){		
		document.getElementById(country).value=countryCode;		
	}
	
	if(document.getElementById(province).value ==""){
		loadProvinces(document.getElementById(province),countryCode);
	}
} 

function loadLeaseTypes(selectObj, emptyOption){
	selectObj.options.length =0;
	var p =0;
	if(emptyOption)selectObj.options[p++] = new Option('','');
	selectObj.options[p++] =new Option('12 Month Lease','12 Month Lease');
	selectObj.options[p++] =new Option('24 Month Lease','24 Month Lease');
	selectObj.options[p++] =new Option('36 Month Lease','36 Month Lease');
	selectObj.options[p++] =new Option('48 Month Lease','48 Month Lease');	
}

function loadProvinces(selectObj, selectedCountry, selectedProvince){	
		
		selectObj.options.length =0;
		
		 if(selectedCountry != null && selectedCountry.toUpperCase()=="CA"){	
			for(var i=0; i<provinceList.length;i++)
	    	 {  
			     var provinceSplitedValue=new String(provinceList[i]);
				 provinceSplitedValue=provinceSplitedValue.split(",")  ;
				 
		     	selectObj.options[i] = new Option(provinceSplitedValue[1],provinceSplitedValue[0]);
	   	     }
   	   	 }
   	   	 else
   	   	 {
	   	   	 selectObj.options[0] = new Option('Other','');
   	   	 }
		selectObj.value= selectedProvince;
		/*	
					
			selectObj.options[0] = new Option('','');
			selectObj.options[1] = new Option('Ontario','ON');
			selectObj.options[2] = new Option('Quebec','QC');
			selectObj.options[3] = new Option('Nova Scotia','NS');
			selectObj.options[4] = new Option('New Brunswick','NB');
			selectObj.options[5] = new Option('Manitoba','MB');
			selectObj.options[6] = new Option('British Columbia','BC');
			selectObj.options[7] = new Option('Prince Edward Island','PE');
			selectObj.options[8] = new Option('Saskatchewan','SK');
			selectObj.options[9] = new Option('Alberta','AB');
			selectObj.options[10] = new Option('Newfoundland and Labrador','NL');			
		*/
}

/**
This function loads the countries and the country codes into
the passed select box object.
*/


function loadCountries(selectObj){
	
	 selectObj.options.length =0;
     for(var i=0; i<countryList.length;i++)
     {  
	     var contryStringValue=new String(countryList[i]);
		countrySplitedValue=contryStringValue.split(",")  ;
		
     	selectObj.options[i] = new Option(countrySplitedValue[1],countrySplitedValue[0]);
     }
     selectObj.value='CA';
	
}

/**
This function loads the MONTHS and the MONTH codes into
the passed select box object.
*/
function loadMonths(selectObj)  {
        selectObj.options.length =0;
		selectObj.options[0] = new Option('','');
		selectObj.options[1] =new Option('January','01');
		selectObj.options[2] =new Option('February','02');
		selectObj.options[3] =new Option('March','03');
		selectObj.options[4] =new Option('April','04');
		selectObj.options[5] =new Option('May','05');
		selectObj.options[6] =new Option('June','06');
		selectObj.options[7] =new Option('July','07');
		selectObj.options[8] =new Option('August','08');
		selectObj.options[9] =new Option('September','09');
		selectObj.options[10] =new Option('October','10');
		selectObj.options[11] =new Option('November','11');
		selectObj.options[12] =new Option('December','12');
}

/**
This function loads the day of month and the day of month codes into
the passed select box object.
*/
function loadDayofMonth(selectObj)  {
            selectObj.options.length =0;
		selectObj.options[0] = new Option('','');
		selectObj.options[1] =new Option('01','01');
		selectObj.options[2] =new Option('02','02');
		selectObj.options[3] =new Option('03','03');
		selectObj.options[4] =new Option('04','04');
		selectObj.options[5] =new Option('05','05');
		selectObj.options[6] =new Option('06','06');
		selectObj.options[7] =new Option('07','07');
		selectObj.options[8] =new Option('08','08');
		selectObj.options[9] =new Option('09','09');
		selectObj.options[10] =new Option('10','10');
		selectObj.options[11] =new Option('11','11');
		selectObj.options[12] =new Option('12','12');
		selectObj.options[13] =new Option('13','13');
		selectObj.options[14] =new Option('14','14');
		selectObj.options[15] =new Option('15','15');
		selectObj.options[16] =new Option('16','16');
		selectObj.options[17] =new Option('17','17');
		selectObj.options[18] =new Option('18','18');
		selectObj.options[19] =new Option('19','19');
		selectObj.options[20] =new Option('20','20');
		selectObj.options[21] =new Option('21','21');
		selectObj.options[22] =new Option('22','22');
		selectObj.options[23] =new Option('23','23');
		selectObj.options[24] =new Option('24','24');
		selectObj.options[25] =new Option('25','25');
		selectObj.options[26] =new Option('26','26');
		selectObj.options[27] =new Option('27','27');
		selectObj.options[28] =new Option('28','28');
		selectObj.options[29] =new Option('29','29');
		selectObj.options[30] =new Option('30','30');
		selectObj.options[31] =new Option('31','31');
}

/**
This function loads the YEARS and the YEARS codes into
the passed select box object.
*/
function loadYears(selectObj, fromYear, toYear)  {          
     
            selectObj.options.length =0;
		selectObj.options[0] = new Option('','');	
		
            for(i=1; fromYear<=toYear; fromYear++){ 
                  selectObj.options[i] =new Option(fromYear, fromYear);
                  i++;
            }
            
            return; 	
		selectObj.options[1] =new Option('1997','1997');
		selectObj.options[2] =new Option('1998','1998');
		selectObj.options[3] =new Option('1999','1999');
		selectObj.options[4] =new Option('2000','2000');
		selectObj.options[5] =new Option('2001','2001');
		selectObj.options[6] =new Option('2002','2002');
		selectObj.options[7] =new Option('2003','2003');
		selectObj.options[8] =new Option('2004','2004');
		selectObj.options[9] =new Option('2005','2005');
		if(upToYear == null || upToYear <2006){
		    return;
		}
		selectObj.options[10] =new Option('2006','2006');
		selectObj.options[11] =new Option('2007','2007');
		selectObj.options[12] =new Option('2008','2008');
		selectObj.options[13] =new Option('2009','2009');
		selectObj.options[14] =new Option('2010','2010');

}

/**
This function loads the Hours and the Hours codes into
the passed select box object.
*/
function loadHours(selectObj){

            selectObj.options.length =0;
		selectObj.options[0] = new Option('','');
		selectObj.options[1] =new Option('00','00');
		selectObj.options[2] =new Option('01','01');
		selectObj.options[3] =new Option('02','02');
		selectObj.options[4] =new Option('03','03');
		selectObj.options[5] =new Option('04','04');
		selectObj.options[6] =new Option('05','05');
		selectObj.options[7] =new Option('06','06');
		selectObj.options[8] =new Option('07','07');
		selectObj.options[9] =new Option('08','08');
		selectObj.options[10] =new Option('09','09');
		selectObj.options[11] =new Option('10','10');
		selectObj.options[12] =new Option('11','11');
		selectObj.options[13] =new Option('12','12');
		selectObj.options[14] =new Option('13','13');
		selectObj.options[15] =new Option('14','14');
		selectObj.options[16] =new Option('15','15');
		selectObj.options[17] =new Option('16','16');
		selectObj.options[18] =new Option('17','17');
		selectObj.options[19] =new Option('18','18');
		selectObj.options[20] =new Option('19','19');
		selectObj.options[21] =new Option('20','20');
		selectObj.options[22] =new Option('21','21');
		selectObj.options[23] =new Option('22','22');
		selectObj.options[24] =new Option('23','23');

}

function loadMinutes(selectObj){

            selectObj.options.length =0;
		selectObj.options[0] = new Option('','');
		selectObj.options[1] =new Option('00','00');
		selectObj.options[2] =new Option('01','01');
		selectObj.options[3] =new Option('02','02');
		selectObj.options[4] =new Option('03','03');
		selectObj.options[5] =new Option('04','04');
		selectObj.options[6] =new Option('05','05');
		selectObj.options[7] =new Option('06','06');
		selectObj.options[8] =new Option('07','07');
		selectObj.options[9] =new Option('08','08');
		selectObj.options[10] =new Option('09','09');
		selectObj.options[11] =new Option('10','10');
		selectObj.options[12] =new Option('11','11');
		selectObj.options[13] =new Option('12','12');
		selectObj.options[14] =new Option('13','13');
		selectObj.options[15] =new Option('14','14');
		selectObj.options[16] =new Option('15','15');
		selectObj.options[17] =new Option('16','16');
		selectObj.options[18] =new Option('17','17');
		selectObj.options[19] =new Option('18','18');
		selectObj.options[20] =new Option('19','19');
		selectObj.options[21] =new Option('20','20');
		selectObj.options[22] =new Option('21','21');
		selectObj.options[23] =new Option('22','22');
		selectObj.options[24] =new Option('23','23');
		selectObj.options[25] =new Option('24','24');
		selectObj.options[26] =new Option('25','25');
		selectObj.options[27] =new Option('26','26');
		selectObj.options[28] =new Option('27','27');
		selectObj.options[29] =new Option('28','28');
		selectObj.options[30] =new Option('29','29');
		selectObj.options[31] =new Option('30','30');
		selectObj.options[32] =new Option('31','31');
		selectObj.options[33] =new Option('32','32');
		selectObj.options[34] =new Option('33','33');
		selectObj.options[35] =new Option('34','34');
		selectObj.options[36] =new Option('35','35');
		selectObj.options[37] =new Option('36','36');
		selectObj.options[38] =new Option('37','37');
		selectObj.options[39] =new Option('38','38');
		selectObj.options[40] =new Option('39','39');
		selectObj.options[41] =new Option('40','40');
		selectObj.options[42] =new Option('41','41');
		selectObj.options[43] =new Option('42','42');
		selectObj.options[44] =new Option('43','43');
		selectObj.options[45] =new Option('44','44');
		selectObj.options[46] =new Option('45','45');
		selectObj.options[47] =new Option('46','46');
		selectObj.options[48] =new Option('47','47');
		selectObj.options[49] =new Option('48','48');
		selectObj.options[50] =new Option('49','49');
		selectObj.options[51] =new Option('50','50');
		selectObj.options[52] =new Option('51','51');
		selectObj.options[53] =new Option('52','52');
		selectObj.options[54] =new Option('53','53');
		selectObj.options[55] =new Option('54','54');
		selectObj.options[56] =new Option('55','55');
		selectObj.options[57] =new Option('56','56');
		selectObj.options[58] =new Option('57','57');
		selectObj.options[59] =new Option('58','58');
		selectObj.options[60] =new Option('59','59');

}

function loadSeconds(selectObj){
      loadMinutes(selectObj);
}

function loadTimeZones(selectObj){
            selectObj.options.length =0;
		selectObj.options[0] = new Option('','');
        selectObj.options[1] =new Option('ACT','ACT');
		selectObj.options[2] =new Option('AET','AET');
		selectObj.options[3] =new Option('Africa/Abidjan','Africa/Abidjan');
		selectObj.options[4] =new Option('Africa/Accra','Africa/Accra');
		selectObj.options[5] =new Option('Africa/Addis_Ababa','Africa/Addis_Ababa');
		selectObj.options[6] =new Option('Africa/Algiers','Africa/Algiers');
		selectObj.options[7] =new Option('Africa/Asmera','Africa/Asmera');
		selectObj.options[8] =new Option('Africa/Bamako','Africa/Bamako');
		selectObj.options[9] =new Option('Africa/Bangui','Africa/Bangui');
		selectObj.options[10] =new Option('Africa/Banjul','Africa/Banjul');
		selectObj.options[11] =new Option('Africa/Bissau','Africa/Bissau');
		selectObj.options[12] =new Option('Africa/Blantyre','Africa/Blantyre');
		selectObj.options[13] =new Option('Africa/Brazzaville','Africa/Brazzaville');
		selectObj.options[14] =new Option('Africa/Bujumbura','Africa/Bujumbura');
		selectObj.options[15] =new Option('Africa/Cairo','Africa/Cairo');
		selectObj.options[16] =new Option('Africa/Casablanca','Africa/Casablanca');
		selectObj.options[17] =new Option('Africa/Ceuta','Africa/Ceuta');
		selectObj.options[18] =new Option('Africa/Conakry','Africa/Conakry');
		selectObj.options[19] =new Option('Africa/Dakar','Africa/Dakar');
		selectObj.options[20] =new Option('Africa/Dar_es_Salaam','Africa/Dar_es_Salaam');
		selectObj.options[21] =new Option('Africa/Djibouti','Africa/Djibouti');
		selectObj.options[22] =new Option('Africa/Douala','Africa/Douala');
		selectObj.options[23] =new Option('Africa/El_Aaiun','Africa/El_Aaiun');
		selectObj.options[24] =new Option('Africa/Freetown','Africa/Freetown');
		selectObj.options[25] =new Option('Africa/Gaborone','Africa/Gaborone');
		selectObj.options[26] =new Option('Africa/Harare','Africa/Harare');
		selectObj.options[27] =new Option('Africa/Johannesburg','Africa/Johannesburg');
		selectObj.options[28] =new Option('Africa/Kampala','Africa/Kampala');
		selectObj.options[29] =new Option('Africa/Khartoum','Africa/Khartoum');
		selectObj.options[30] =new Option('Africa/Kigali','Africa/Kigali');
		selectObj.options[31] =new Option('Africa/Kinshasa','Africa/Kinshasa');
		selectObj.options[32] =new Option('Africa/Lagos','Africa/Lagos');
		selectObj.options[33] =new Option('Africa/Libreville','Africa/Libreville');
		selectObj.options[34] =new Option('Africa/Lome','Africa/Lome');
		selectObj.options[35] =new Option('Africa/Luanda','Africa/Luanda');
		selectObj.options[36] =new Option('Africa/Lubumbashi','Africa/Lubumbashi');
		selectObj.options[37] =new Option('Africa/Lusaka','Africa/Lusaka');
		selectObj.options[38] =new Option('Africa/Malabo','Africa/Malabo');
		selectObj.options[39] =new Option('Africa/Maputo','Africa/Maputo');
		selectObj.options[40] =new Option('Africa/Maseru','Africa/Maseru');
		selectObj.options[41] =new Option('Africa/Mbabane','Africa/Mbabane');
		selectObj.options[42] =new Option('Africa/Mogadishu','Africa/Mogadishu');
		selectObj.options[43] =new Option('Africa/Monrovia','Africa/Monrovia');
		selectObj.options[44] =new Option('Africa/Nairobi','Africa/Nairobi');
		selectObj.options[45] =new Option('Africa/Ndjamena','Africa/Ndjamena');
		selectObj.options[46] =new Option('Africa/Niamey','Africa/Niamey');
		selectObj.options[47] =new Option('Africa/Nouakchott','Africa/Nouakchott');
		selectObj.options[48] =new Option('Africa/Ouagadougou','Africa/Ouagadougou');
		selectObj.options[49] =new Option('Africa/Porto-Novo','Africa/Porto-Novo');
		selectObj.options[50] =new Option('Africa/Sao_Tome','Africa/Sao_Tome');
		selectObj.options[51] =new Option('Africa/Timbuktu','Africa/Timbuktu');
		selectObj.options[52] =new Option('Africa/Tripoli','Africa/Tripoli');
		selectObj.options[53] =new Option('Africa/Tunis','Africa/Tunis');
		selectObj.options[54] =new Option('Africa/Windhoek','Africa/Windhoek');
		selectObj.options[55] =new Option('AGT','AGT');
		selectObj.options[56] =new Option('America/Adak','America/Adak');
		selectObj.options[57] =new Option('America/Anchorage','America/Anchorage');
		selectObj.options[58] =new Option('America/Anguilla','America/Anguilla');
		selectObj.options[59] =new Option('America/Antigua','America/Antigua');
		selectObj.options[60] =new Option('America/Araguaina','America/Araguaina');
		selectObj.options[61] =new Option('America/Aruba','America/Aruba');
		selectObj.options[62] =new Option('America/Asuncion','America/Asuncion');
		selectObj.options[63] =new Option('America/Atka','America/Atka');
		selectObj.options[64] =new Option('America/Barbados','America/Barbados');
		selectObj.options[65] =new Option('America/Belem','America/Belem');
		selectObj.options[66] =new Option('America/Belize','America/Belize');
		selectObj.options[67] =new Option('America/Boa_Vista','America/Boa_Vista');
		selectObj.options[68] =new Option('America/Bogota','America/Bogota');
		selectObj.options[69] =new Option('America/Boise','America/Boise');
		selectObj.options[70] =new Option('America/Buenos_Aires','America/Buenos_Aires');
		selectObj.options[71] =new Option('America/Cambridge_Bay','America/Cambridge_Bay');
		selectObj.options[72] =new Option('America/Cancun','America/Cancun');
		selectObj.options[73] =new Option('America/Caracas','America/Caracas');
		selectObj.options[74] =new Option('America/Catamarca','America/Catamarca');
		selectObj.options[75] =new Option('America/Cayenne','America/Cayenne');
		selectObj.options[76] =new Option('America/Cayman','America/Cayman');
		selectObj.options[77] =new Option('America/Chicago','America/Chicago');
		selectObj.options[78] =new Option('America/Chihuahua','America/Chihuahua');
		selectObj.options[79] =new Option('America/Cordoba','America/Cordoba');
		selectObj.options[80] =new Option('America/Costa_Rica','America/Costa_Rica');
		selectObj.options[81] =new Option('America/Cuiaba','America/Cuiaba');
		selectObj.options[82] =new Option('America/Curacao','America/Curacao');
		selectObj.options[83] =new Option('America/Danmarkshavn','America/Danmarkshavn');
		selectObj.options[84] =new Option('America/Dawson','America/Dawson');
		selectObj.options[85] =new Option('America/Dawson_Creek','America/Dawson_Creek');
		selectObj.options[86] =new Option('America/Denver','America/Denver');
		selectObj.options[87] =new Option('America/Detroit','America/Detroit');
		selectObj.options[88] =new Option('America/Dominica','America/Dominica');
		selectObj.options[89] =new Option('America/Edmonton','America/Edmonton');
		selectObj.options[90] =new Option('America/Eirunepe','America/Eirunepe');
		selectObj.options[91] =new Option('America/El_Salvador','America/El_Salvador');
		selectObj.options[92] =new Option('America/Ensenada','America/Ensenada');
		selectObj.options[93] =new Option('America/Fort_Wayne','America/Fort_Wayne');
		selectObj.options[94] =new Option('America/Fortaleza','America/Fortaleza');
		selectObj.options[95] =new Option('America/Glace_Bay','America/Glace_Bay');
		selectObj.options[96] =new Option('America/Godthab','America/Godthab');
		selectObj.options[97] =new Option('America/Goose_Bay','America/Goose_Bay');
		selectObj.options[98] =new Option('America/Grand_Turk','America/Grand_Turk');
		selectObj.options[99] =new Option('America/Grenada','America/Grenada');
		selectObj.options[100] =new Option('America/Guadeloupe','America/Guadeloupe');
		selectObj.options[101] =new Option('America/Guatemala','America/Guatemala');
		selectObj.options[102] =new Option('America/Guayaquil','America/Guayaquil');
		selectObj.options[103] =new Option('America/Guyana','America/Guyana');
		selectObj.options[104] =new Option('America/Halifax','America/Halifax');
		selectObj.options[105] =new Option('America/Havana','America/Havana');
		selectObj.options[106] =new Option('America/Hermosillo','America/Hermosillo');
		selectObj.options[107] =new Option('America/Indiana/Indianapolis','America/Indiana/Indianapolis');
		selectObj.options[108] =new Option('America/Indiana/Knox','America/Indiana/Knox');
		selectObj.options[109] =new Option('America/Indiana/Marengo','America/Indiana/Marengo');
		selectObj.options[110] =new Option('America/Indiana/Vevay','America/Indiana/Vevay');
		selectObj.options[111] =new Option('America/Indianapolis','America/Indianapolis');
		selectObj.options[112] =new Option('America/Inuvik','America/Inuvik');
		selectObj.options[113] =new Option('America/Iqaluit','America/Iqaluit');
		selectObj.options[114] =new Option('America/Jamaica','America/Jamaica');
		selectObj.options[115] =new Option('America/Jujuy','America/Jujuy');
		selectObj.options[116] =new Option('America/Juneau','America/Juneau');
		selectObj.options[117] =new Option('America/Kentucky/Louisville','America/Kentucky/Louisville');
		selectObj.options[118] =new Option('America/Kentucky/Monticello','America/Kentucky/Monticello');
		selectObj.options[119] =new Option('America/Knox_IN','America/Knox_IN');
		selectObj.options[120] =new Option('America/La_Paz','America/La_Paz');
		selectObj.options[121] =new Option('America/Lima','America/Lima');
		selectObj.options[122] =new Option('America/Los_Angeles','America/Los_Angeles');
		selectObj.options[123] =new Option('America/Louisville','America/Louisville');
		selectObj.options[124] =new Option('America/Maceio','America/Maceio');
		selectObj.options[125] =new Option('America/Managua','America/Managua');
		selectObj.options[126] =new Option('America/Manaus','America/Manaus');
		selectObj.options[127] =new Option('America/Martinique','America/Martinique');
		selectObj.options[128] =new Option('America/Mazatlan','America/Mazatlan');
		selectObj.options[129] =new Option('America/Mendoza','America/Mendoza');
		selectObj.options[130] =new Option('America/Menominee','America/Menominee');
		selectObj.options[131] =new Option('America/Merida','America/Merida');
		selectObj.options[132] =new Option('America/Mexico_City','America/Mexico_City');
		selectObj.options[133] =new Option('America/Miquelon','America/Miquelon');
		selectObj.options[134] =new Option('America/Monterrey','America/Monterrey');
		selectObj.options[135] =new Option('America/Montevideo','America/Montevideo');
		selectObj.options[136] =new Option('America/Montreal','America/Montreal');
		selectObj.options[137] =new Option('America/Montserrat','America/Montserrat');
		selectObj.options[138] =new Option('America/Nassau','America/Nassau');
		selectObj.options[139] =new Option('America/New_York','America/New_York');
		selectObj.options[140] =new Option('America/Nipigon','America/Nipigon');
		selectObj.options[141] =new Option('America/Nome','America/Nome');
		selectObj.options[142] =new Option('America/Noronha','America/Noronha');
		selectObj.options[143] =new Option('America/North_Dakota/Center','America/North_Dakota/Center');
		selectObj.options[144] =new Option('America/Panama','America/Panama');
		selectObj.options[145] =new Option('America/Pangnirtung','America/Pangnirtung');
		selectObj.options[146] =new Option('America/Paramaribo','America/Paramaribo');
		selectObj.options[147] =new Option('America/Phoenix','America/Phoenix');
		selectObj.options[148] =new Option('America/Port-au-Prince','America/Port-au-Prince');
		selectObj.options[149] =new Option('America/Port_of_Spain','America/Port_of_Spain');
		selectObj.options[150] =new Option('America/Porto_Acre','America/Porto_Acre');
		selectObj.options[151] =new Option('America/Porto_Velho','America/Porto_Velho');
		selectObj.options[152] =new Option('America/Puerto_Rico','America/Puerto_Rico');
		selectObj.options[153] =new Option('America/Rainy_River','America/Rainy_River');
		selectObj.options[154] =new Option('America/Rankin_Inlet','America/Rankin_Inlet');
		selectObj.options[155] =new Option('America/Recife','America/Recife');
		selectObj.options[156] =new Option('America/Regina','America/Regina');
		selectObj.options[157] =new Option('America/Rio_Branco','America/Rio_Branco');
		selectObj.options[158] =new Option('America/Rosario','America/Rosario');
		selectObj.options[159] =new Option('America/Santiago','America/Santiago');
		selectObj.options[160] =new Option('America/Santo_Domingo','America/Santo_Domingo');
		selectObj.options[161] =new Option('America/Sao_Paulo','America/Sao_Paulo');
		selectObj.options[162] =new Option('America/Scoresbysund','America/Scoresbysund');
		selectObj.options[163] =new Option('America/Shiprock','America/Shiprock');
		selectObj.options[164] =new Option('America/St_Johns','America/St_Johns');
		selectObj.options[165] =new Option('America/St_Kitts','America/St_Kitts');
		selectObj.options[166] =new Option('America/St_Lucia','America/St_Lucia');
		selectObj.options[167] =new Option('America/St_Thomas','America/St_Thomas');
		selectObj.options[168] =new Option('America/St_Vincent','America/St_Vincent');
		selectObj.options[169] =new Option('America/Swift_Current','America/Swift_Current');
		selectObj.options[170] =new Option('America/Tegucigalpa','America/Tegucigalpa');
		selectObj.options[171] =new Option('America/Thule','America/Thule');
		selectObj.options[172] =new Option('America/Thunder_Bay','America/Thunder_Bay');
		selectObj.options[173] =new Option('America/Tijuana','America/Tijuana');
		selectObj.options[174] =new Option('America/Tortola','America/Tortola');
		selectObj.options[175] =new Option('America/Vancouver','America/Vancouver');
		selectObj.options[176] =new Option('America/Virgin','America/Virgin');
		selectObj.options[177] =new Option('America/Whitehorse','America/Whitehorse');
		selectObj.options[178] =new Option('America/Winnipeg','America/Winnipeg');
		selectObj.options[179] =new Option('America/Yakutat','America/Yakutat');
		selectObj.options[180] =new Option('America/Yellowknife','America/Yellowknife');
		selectObj.options[181] =new Option('Antarctica/Casey','Antarctica/Casey');
		selectObj.options[182] =new Option('Antarctica/Davis','Antarctica/Davis');
		selectObj.options[183] =new Option('Antarctica/DumontDUrville','Antarctica/DumontDUrville');
		selectObj.options[184] =new Option('Antarctica/Mawson','Antarctica/Mawson');
		selectObj.options[185] =new Option('Antarctica/McMurdo','Antarctica/McMurdo');
		selectObj.options[186] =new Option('Antarctica/Palmer','Antarctica/Palmer');
		selectObj.options[187] =new Option('Antarctica/Rothera','Antarctica/Rothera');
		selectObj.options[188] =new Option('Antarctica/South_Pole','Antarctica/South_Pole');
		selectObj.options[189] =new Option('Antarctica/Syowa','Antarctica/Syowa');
		selectObj.options[190] =new Option('Antarctica/Vostok','Antarctica/Vostok');
		selectObj.options[191] =new Option('Arctic/Longyearbyen','Arctic/Longyearbyen');
		selectObj.options[192] =new Option('ART','ART');
		selectObj.options[193] =new Option('Asia/Aden','Asia/Aden');
		selectObj.options[194] =new Option('Asia/Almaty','Asia/Almaty');
		selectObj.options[195] =new Option('Asia/Amman','Asia/Amman');
		selectObj.options[196] =new Option('Asia/Anadyr','Asia/Anadyr');
		selectObj.options[197] =new Option('Asia/Aqtau','Asia/Aqtau');
		selectObj.options[198] =new Option('Asia/Aqtobe','Asia/Aqtobe');
		selectObj.options[199] =new Option('Asia/Ashgabat','Asia/Ashgabat');
		selectObj.options[200] =new Option('Asia/Ashkhabad','Asia/Ashkhabad');
		selectObj.options[201] =new Option('Asia/Baghdad','Asia/Baghdad');
		selectObj.options[202] =new Option('Asia/Bahrain','Asia/Bahrain');
		selectObj.options[203] =new Option('Asia/Baku','Asia/Baku');
		selectObj.options[204] =new Option('Asia/Bangkok','Asia/Bangkok');
		selectObj.options[205] =new Option('Asia/Beirut','Asia/Beirut');
		selectObj.options[206] =new Option('Asia/Bishkek','Asia/Bishkek');
		selectObj.options[207] =new Option('Asia/Brunei','Asia/Brunei');
		selectObj.options[208] =new Option('Asia/Calcutta','Asia/Calcutta');
		selectObj.options[209] =new Option('Asia/Choibalsan','Asia/Choibalsan');
		selectObj.options[210] =new Option('Asia/Chongqing','Asia/Chongqing');
		selectObj.options[211] =new Option('Asia/Chungking','Asia/Chungking');
		selectObj.options[212] =new Option('Asia/Colombo','Asia/Colombo');
		selectObj.options[213] =new Option('Asia/Dacca','Asia/Dacca');
		selectObj.options[214] =new Option('Asia/Damascus','Asia/Damascus');
		selectObj.options[215] =new Option('Asia/Dhaka','Asia/Dhaka');
		selectObj.options[216] =new Option('Asia/Dili','Asia/Dili');
		selectObj.options[217] =new Option('Asia/Dubai','Asia/Dubai');
		selectObj.options[218] =new Option('Asia/Dushanbe','Asia/Dushanbe');
		selectObj.options[219] =new Option('Asia/Gaza','Asia/Gaza');
		selectObj.options[220] =new Option('Asia/Harbin','Asia/Harbin');
		selectObj.options[221] =new Option('Asia/Hong_Kong','Asia/Hong_Kong');
		selectObj.options[222] =new Option('Asia/Hovd','Asia/Hovd');
		selectObj.options[223] =new Option('Asia/Irkutsk','Asia/Irkutsk');
		selectObj.options[224] =new Option('Asia/Istanbul','Asia/Istanbul');
		selectObj.options[225] =new Option('Asia/Jakarta','Asia/Jakarta');
		selectObj.options[226] =new Option('Asia/Jayapura','Asia/Jayapura');
		selectObj.options[227] =new Option('Asia/Jerusalem','Asia/Jerusalem');
		selectObj.options[228] =new Option('Asia/Kabul','Asia/Kabul');
		selectObj.options[229] =new Option('Asia/Kamchatka','Asia/Kamchatka');
		selectObj.options[230] =new Option('Asia/Karachi','Asia/Karachi');
		selectObj.options[231] =new Option('Asia/Kashgar','Asia/Kashgar');
		selectObj.options[232] =new Option('Asia/Katmandu','Asia/Katmandu');
		selectObj.options[233] =new Option('Asia/Krasnoyarsk','Asia/Krasnoyarsk');
		selectObj.options[234] =new Option('Asia/Kuala_Lumpur','Asia/Kuala_Lumpur');
		selectObj.options[235] =new Option('Asia/Kuching','Asia/Kuching');
		selectObj.options[236] =new Option('Asia/Kuwait','Asia/Kuwait');
		selectObj.options[237] =new Option('Asia/Macao','Asia/Macao');
		selectObj.options[238] =new Option('Asia/Macau','Asia/Macau');
		selectObj.options[239] =new Option('Asia/Magadan','Asia/Magadan');
		selectObj.options[240] =new Option('Asia/Makassar','Asia/Makassar');
		selectObj.options[241] =new Option('Asia/Manila','Asia/Manila');
		selectObj.options[242] =new Option('Asia/Muscat','Asia/Muscat');
		selectObj.options[243] =new Option('Asia/Nicosia','Asia/Nicosia');
		selectObj.options[244] =new Option('Asia/Novosibirsk','Asia/Novosibirsk');
		selectObj.options[245] =new Option('Asia/Omsk','Asia/Omsk');
		selectObj.options[246] =new Option('Asia/Oral','Asia/Oral');
		selectObj.options[247] =new Option('Asia/Phnom_Penh','Asia/Phnom_Penh');
		selectObj.options[248] =new Option('Asia/Pontianak','Asia/Pontianak');
		selectObj.options[249] =new Option('Asia/Pyongyang','Asia/Pyongyang');
		selectObj.options[250] =new Option('Asia/Qatar','Asia/Qatar');
		selectObj.options[251] =new Option('Asia/Qyzylorda','Asia/Qyzylorda');
		selectObj.options[252] =new Option('Asia/Rangoon','Asia/Rangoon');
		selectObj.options[253] =new Option('Asia/Riyadh','Asia/Riyadh');
		selectObj.options[254] =new Option('Asia/Riyadh87','Asia/Riyadh87');
		selectObj.options[255] =new Option('Asia/Riyadh88','Asia/Riyadh88');
		selectObj.options[256] =new Option('Asia/Riyadh89','Asia/Riyadh89');
		selectObj.options[257] =new Option('Asia/Saigon','Asia/Saigon');
		selectObj.options[258] =new Option('Asia/Sakhalin','Asia/Sakhalin');
		selectObj.options[259] =new Option('Asia/Samarkand','Asia/Samarkand');
		selectObj.options[260] =new Option('Asia/Seoul','Asia/Seoul');
		selectObj.options[261] =new Option('Asia/Shanghai','Asia/Shanghai');
		selectObj.options[262] =new Option('Asia/Singapore','Asia/Singapore');
		selectObj.options[263] =new Option('Asia/Taipei','Asia/Taipei');
		selectObj.options[264] =new Option('Asia/Tashkent','Asia/Tashkent');
		selectObj.options[265] =new Option('Asia/Tbilisi','Asia/Tbilisi');
		selectObj.options[266] =new Option('Asia/Tehran','Asia/Tehran');
		selectObj.options[267] =new Option('Asia/Tel_Aviv','Asia/Tel_Aviv');
		selectObj.options[268] =new Option('Asia/Thimbu','Asia/Thimbu');
		selectObj.options[269] =new Option('Asia/Thimphu','Asia/Thimphu');
		selectObj.options[270] =new Option('Asia/Tokyo','Asia/Tokyo');
		selectObj.options[271] =new Option('Asia/Ujung_Pandang','Asia/Ujung_Pandang');
		selectObj.options[272] =new Option('Asia/Ulaanbaatar','Asia/Ulaanbaatar');
		selectObj.options[273] =new Option('Asia/Ulan_Bator','Asia/Ulan_Bator');
		selectObj.options[274] =new Option('Asia/Urumqi','Asia/Urumqi');
		selectObj.options[275] =new Option('Asia/Vientiane','Asia/Vientiane');
		selectObj.options[276] =new Option('Asia/Vladivostok','Asia/Vladivostok');
		selectObj.options[277] =new Option('Asia/Yakutsk','Asia/Yakutsk');
		selectObj.options[278] =new Option('Asia/Yekaterinburg','Asia/Yekaterinburg');
		selectObj.options[279] =new Option('Asia/Yerevan','Asia/Yerevan');
		selectObj.options[280] =new Option('AST','AST');
		selectObj.options[281] =new Option('Atlantic/Azores','Atlantic/Azores');
		selectObj.options[282] =new Option('Atlantic/Bermuda','Atlantic/Bermuda');
		selectObj.options[283] =new Option('Atlantic/Canary','Atlantic/Canary');
		selectObj.options[284] =new Option('Atlantic/Cape_Verde','Atlantic/Cape_Verde');
		selectObj.options[285] =new Option('Atlantic/Faeroe','Atlantic/Faeroe');
		selectObj.options[286] =new Option('Atlantic/Jan_Mayen','Atlantic/Jan_Mayen');
		selectObj.options[287] =new Option('Atlantic/Madeira','Atlantic/Madeira');
		selectObj.options[288] =new Option('Atlantic/Reykjavik','Atlantic/Reykjavik');
		selectObj.options[289] =new Option('Atlantic/South_Georgia','Atlantic/South_Georgia');
		selectObj.options[290] =new Option('Atlantic/St_Helena','Atlantic/St_Helena');
		selectObj.options[291] =new Option('Atlantic/Stanley','Atlantic/Stanley');
		selectObj.options[292] =new Option('Australia/ACT','Australia/ACT');
		selectObj.options[293] =new Option('Australia/Adelaide','Australia/Adelaide');
		selectObj.options[294] =new Option('Australia/Brisbane','Australia/Brisbane');
		selectObj.options[295] =new Option('Australia/Broken_Hill','Australia/Broken_Hill');
		selectObj.options[296] =new Option('Australia/Canberra','Australia/Canberra');
		selectObj.options[297] =new Option('Australia/Darwin','Australia/Darwin');
		selectObj.options[298] =new Option('Australia/Hobart','Australia/Hobart');
		selectObj.options[299] =new Option('Australia/LHI','Australia/LHI');
		selectObj.options[300] =new Option('Australia/Lindeman','Australia/Lindeman');
		selectObj.options[301] =new Option('Australia/Lord_Howe','Australia/Lord_Howe');
		selectObj.options[302] =new Option('Australia/Melbourne','Australia/Melbourne');
		selectObj.options[303] =new Option('Australia/North','Australia/North');
		selectObj.options[304] =new Option('Australia/NSW','Australia/NSW');
		selectObj.options[305] =new Option('Australia/Perth','Australia/Perth');
		selectObj.options[306] =new Option('Australia/Queensland','Australia/Queensland');
		selectObj.options[307] =new Option('Australia/South','Australia/South');
		selectObj.options[308] =new Option('Australia/Sydney','Australia/Sydney');
		selectObj.options[309] =new Option('Australia/Tasmania','Australia/Tasmania');
		selectObj.options[310] =new Option('Australia/Victoria','Australia/Victoria');
		selectObj.options[311] =new Option('Australia/West','Australia/West');
		selectObj.options[312] =new Option('Australia/Yancowinna','Australia/Yancowinna');
		selectObj.options[313] =new Option('BET','BET');
		selectObj.options[314] =new Option('Brazil/Acre','Brazil/Acre');
		selectObj.options[315] =new Option('Brazil/DeNoronha','Brazil/DeNoronha');
		selectObj.options[316] =new Option('Brazil/East','Brazil/East');
		selectObj.options[317] =new Option('Brazil/West','Brazil/West');
		selectObj.options[318] =new Option('BST','BST');
		selectObj.options[319] =new Option('Canada/Atlantic','Canada/Atlantic');
		selectObj.options[320] =new Option('Canada/Central','Canada/Central');
		selectObj.options[321] =new Option('Canada/East-Saskatchewan','Canada/East-Saskatchewan');
		selectObj.options[322] =new Option('Canada/Eastern','Canada/Eastern');
		selectObj.options[323] =new Option('Canada/Mountain','Canada/Mountain');
		selectObj.options[324] =new Option('Canada/Newfoundland','Canada/Newfoundland');
		selectObj.options[325] =new Option('Canada/Pacific','Canada/Pacific');
		selectObj.options[326] =new Option('Canada/Saskatchewan','Canada/Saskatchewan');
		selectObj.options[327] =new Option('Canada/Yukon','Canada/Yukon');
		selectObj.options[328] =new Option('CAT','CAT');
		selectObj.options[329] =new Option('CET','CET');
		selectObj.options[330] =new Option('Chile/Continental','Chile/Continental');
		selectObj.options[331] =new Option('Chile/EasterIsland','Chile/EasterIsland');
		selectObj.options[332] =new Option('CNT','CNT');
		selectObj.options[333] =new Option('CST','CST');
		selectObj.options[334] =new Option('CST6CDT','CST6CDT');
		selectObj.options[335] =new Option('CTT','CTT');
		selectObj.options[336] =new Option('Cuba','Cuba');
		selectObj.options[337] =new Option('EAT','EAT');
		selectObj.options[338] =new Option('ECT','ECT');
		selectObj.options[339] =new Option('EET','EET');
		selectObj.options[340] =new Option('Egypt','Egypt');
		selectObj.options[341] =new Option('Eire','Eire');
		selectObj.options[342] =new Option('EST','EST');
		selectObj.options[343] =new Option('EST5EDT','EST5EDT');
		selectObj.options[344] =new Option('Etc/GMT','Etc/GMT');
		selectObj.options[345] =new Option('Etc/GMT+0','Etc/GMT+0');
		selectObj.options[346] =new Option('Etc/GMT+1','Etc/GMT+1');
		selectObj.options[347] =new Option('Etc/GMT+10','Etc/GMT+10');
		selectObj.options[348] =new Option('Etc/GMT+11','Etc/GMT+11');
		selectObj.options[349] =new Option('Etc/GMT+12','Etc/GMT+12');
		selectObj.options[350] =new Option('Etc/GMT+2','Etc/GMT+2');
		selectObj.options[351] =new Option('Etc/GMT+3','Etc/GMT+3');
		selectObj.options[352] =new Option('Etc/GMT+4','Etc/GMT+4');
		selectObj.options[353] =new Option('Etc/GMT+5','Etc/GMT+5');
		selectObj.options[354] =new Option('Etc/GMT+6','Etc/GMT+6');
		selectObj.options[355] =new Option('Etc/GMT+7','Etc/GMT+7');
		selectObj.options[356] =new Option('Etc/GMT+8','Etc/GMT+8');
		selectObj.options[357] =new Option('Etc/GMT+9','Etc/GMT+9');
		selectObj.options[358] =new Option('Etc/GMT-0','Etc/GMT-0');
		selectObj.options[359] =new Option('Etc/GMT-1','Etc/GMT-1');
		selectObj.options[360] =new Option('Etc/GMT-10','Etc/GMT-10');
		selectObj.options[361] =new Option('Etc/GMT-11','Etc/GMT-11');
		selectObj.options[362] =new Option('Etc/GMT-12','Etc/GMT-12');
		selectObj.options[363] =new Option('Etc/GMT-13','Etc/GMT-13');
		selectObj.options[364] =new Option('Etc/GMT-14','Etc/GMT-14');
		selectObj.options[365] =new Option('Etc/GMT-2','Etc/GMT-2');
		selectObj.options[366] =new Option('Etc/GMT-3','Etc/GMT-3');
		selectObj.options[367] =new Option('Etc/GMT-4','Etc/GMT-4');
		selectObj.options[368] =new Option('Etc/GMT-5','Etc/GMT-5');
		selectObj.options[369] =new Option('Etc/GMT-6','Etc/GMT-6');
		selectObj.options[370] =new Option('Etc/GMT-7','Etc/GMT-7');
		selectObj.options[371] =new Option('Etc/GMT-8','Etc/GMT-8');
		selectObj.options[372] =new Option('Etc/GMT-9','Etc/GMT-9');
		selectObj.options[373] =new Option('Etc/GMT0','Etc/GMT0');
		selectObj.options[374] =new Option('Etc/Greenwich','Etc/Greenwich');
		selectObj.options[375] =new Option('Etc/UCT','Etc/UCT');
		selectObj.options[376] =new Option('Etc/Universal','Etc/Universal');
		selectObj.options[377] =new Option('Etc/UTC','Etc/UTC');
		selectObj.options[378] =new Option('Etc/Zulu','Etc/Zulu');
		selectObj.options[379] =new Option('Europe/Amsterdam','Europe/Amsterdam');
		selectObj.options[380] =new Option('Europe/Andorra','Europe/Andorra');
		selectObj.options[381] =new Option('Europe/Athens','Europe/Athens');
		selectObj.options[382] =new Option('Europe/Belfast','Europe/Belfast');
		selectObj.options[383] =new Option('Europe/Belgrade','Europe/Belgrade');
		selectObj.options[384] =new Option('Europe/Berlin','Europe/Berlin');
		selectObj.options[385] =new Option('Europe/Bratislava','Europe/Bratislava');
		selectObj.options[386] =new Option('Europe/Brussels','Europe/Brussels');
		selectObj.options[387] =new Option('Europe/Bucharest','Europe/Bucharest');
		selectObj.options[388] =new Option('Europe/Budapest','Europe/Budapest');
		selectObj.options[389] =new Option('Europe/Chisinau','Europe/Chisinau');
		selectObj.options[390] =new Option('Europe/Copenhagen','Europe/Copenhagen');
		selectObj.options[391] =new Option('Europe/Dublin','Europe/Dublin');
		selectObj.options[392] =new Option('Europe/Gibraltar','Europe/Gibraltar');
		selectObj.options[393] =new Option('Europe/Helsinki','Europe/Helsinki');
		selectObj.options[394] =new Option('Europe/Istanbul','Europe/Istanbul');
		selectObj.options[395] =new Option('Europe/Kaliningrad','Europe/Kaliningrad');
		selectObj.options[396] =new Option('Europe/Kiev','Europe/Kiev');
		selectObj.options[397] =new Option('Europe/Lisbon','Europe/Lisbon');
		selectObj.options[398] =new Option('Europe/Ljubljana','Europe/Ljubljana');
		selectObj.options[399] =new Option('Europe/London','Europe/London');
		selectObj.options[400] =new Option('Europe/Luxembourg','Europe/Luxembourg');
		selectObj.options[401] =new Option('Europe/Madrid','Europe/Madrid');
		selectObj.options[402] =new Option('Europe/Malta','Europe/Malta');
		selectObj.options[403] =new Option('Europe/Minsk','Europe/Minsk');
		selectObj.options[404] =new Option('Europe/Monaco','Europe/Monaco');
		selectObj.options[405] =new Option('Europe/Moscow','Europe/Moscow');
		selectObj.options[406] =new Option('Europe/Nicosia','Europe/Nicosia');
		selectObj.options[407] =new Option('Europe/Oslo','Europe/Oslo');
		selectObj.options[408] =new Option('Europe/Paris','Europe/Paris');
		selectObj.options[409] =new Option('Europe/Prague','Europe/Prague');
		selectObj.options[410] =new Option('Europe/Riga','Europe/Riga');
		selectObj.options[411] =new Option('Europe/Rome','Europe/Rome');
		selectObj.options[412] =new Option('Europe/Samara','Europe/Samara');
		selectObj.options[413] =new Option('Europe/San_Marino','Europe/San_Marino');
		selectObj.options[414] =new Option('Europe/Sarajevo','Europe/Sarajevo');
		selectObj.options[415] =new Option('Europe/Simferopol','Europe/Simferopol');
		selectObj.options[416] =new Option('Europe/Skopje','Europe/Skopje');
		selectObj.options[417] =new Option('Europe/Sofia','Europe/Sofia');
		selectObj.options[418] =new Option('Europe/Stockholm','Europe/Stockholm');
		selectObj.options[419] =new Option('Europe/Tallinn','Europe/Tallinn');
		selectObj.options[420] =new Option('Europe/Tirane','Europe/Tirane');
		selectObj.options[421] =new Option('Europe/Tiraspol','Europe/Tiraspol');
		selectObj.options[422] =new Option('Europe/Uzhgorod','Europe/Uzhgorod');
		selectObj.options[423] =new Option('Europe/Vaduz','Europe/Vaduz');
		selectObj.options[424] =new Option('Europe/Vatican','Europe/Vatican');
		selectObj.options[425] =new Option('Europe/Vienna','Europe/Vienna');
		selectObj.options[426] =new Option('Europe/Vilnius','Europe/Vilnius');
		selectObj.options[427] =new Option('Europe/Warsaw','Europe/Warsaw');
		selectObj.options[428] =new Option('Europe/Zagreb','Europe/Zagreb');
		selectObj.options[429] =new Option('Europe/Zaporozhye','Europe/Zaporozhye');
		selectObj.options[430] =new Option('Europe/Zurich','Europe/Zurich');
		selectObj.options[431] =new Option('GB','GB');
		selectObj.options[432] =new Option('GB-Eire','GB-Eire');
		selectObj.options[433] =new Option('GMT','GMT');
		selectObj.options[434] =new Option('GMT0','GMT0');
		selectObj.options[435] =new Option('Greenwich','Greenwich');
		selectObj.options[436] =new Option('Hongkong','Hongkong');
		selectObj.options[437] =new Option('HST','HST');
		selectObj.options[438] =new Option('Iceland','Iceland');
		selectObj.options[439] =new Option('IET','IET');
		selectObj.options[440] =new Option('Indian/Antananarivo','Indian/Antananarivo');
		selectObj.options[441] =new Option('Indian/Chagos','Indian/Chagos');
		selectObj.options[442] =new Option('Indian/Christmas','Indian/Christmas');
		selectObj.options[443] =new Option('Indian/Cocos','Indian/Cocos');
		selectObj.options[444] =new Option('Indian/Comoro','Indian/Comoro');
		selectObj.options[445] =new Option('Indian/Kerguelen','Indian/Kerguelen');
		selectObj.options[446] =new Option('Indian/Mahe','Indian/Mahe');
		selectObj.options[447] =new Option('Indian/Maldives','Indian/Maldives');
		selectObj.options[448] =new Option('Indian/Mauritius','Indian/Mauritius');
		selectObj.options[449] =new Option('Indian/Mayotte','Indian/Mayotte');
		selectObj.options[450] =new Option('Indian/Reunion','Indian/Reunion');
		selectObj.options[451] =new Option('Iran','Iran');
		selectObj.options[452] =new Option('Israel','Israel');
		selectObj.options[453] =new Option('IST','IST');
		selectObj.options[454] =new Option('Jamaica','Jamaica');
		selectObj.options[455] =new Option('Japan','Japan');
		selectObj.options[456] =new Option('JST','JST');
		selectObj.options[457] =new Option('Kwajalein','Kwajalein');
		selectObj.options[458] =new Option('Libya','Libya');
		selectObj.options[459] =new Option('MET','MET');
		selectObj.options[460] =new Option('Mexico/BajaNorte','Mexico/BajaNorte');
		selectObj.options[461] =new Option('Mexico/BajaSur','Mexico/BajaSur');
		selectObj.options[462] =new Option('Mexico/General','Mexico/General');
		selectObj.options[463] =new Option('Mideast/Riyadh87','Mideast/Riyadh87');
		selectObj.options[464] =new Option('Mideast/Riyadh88','Mideast/Riyadh88');
		selectObj.options[465] =new Option('Mideast/Riyadh89','Mideast/Riyadh89');
		selectObj.options[466] =new Option('MIT','MIT');
		selectObj.options[467] =new Option('MST','MST');
		selectObj.options[468] =new Option('MST7MDT','MST7MDT');
		selectObj.options[469] =new Option('Navajo','Navajo');
		selectObj.options[470] =new Option('NET','NET');
		selectObj.options[471] =new Option('NST','NST');
		selectObj.options[472] =new Option('NZ','NZ');
		selectObj.options[473] =new Option('NZ-CHAT','NZ-CHAT');
		selectObj.options[474] =new Option('Pacific/Apia','Pacific/Apia');
		selectObj.options[475] =new Option('Pacific/Auckland','Pacific/Auckland');
		selectObj.options[476] =new Option('Pacific/Chatham','Pacific/Chatham');
		selectObj.options[477] =new Option('Pacific/Easter','Pacific/Easter');
		selectObj.options[478] =new Option('Pacific/Efate','Pacific/Efate');
		selectObj.options[479] =new Option('Pacific/Enderbury','Pacific/Enderbury');
		selectObj.options[480] =new Option('Pacific/Fakaofo','Pacific/Fakaofo');
		selectObj.options[481] =new Option('Pacific/Fiji','Pacific/Fiji');
		selectObj.options[482] =new Option('Pacific/Funafuti','Pacific/Funafuti');
		selectObj.options[483] =new Option('Pacific/Galapagos','Pacific/Galapagos');
		selectObj.options[484] =new Option('Pacific/Gambier','Pacific/Gambier');
		selectObj.options[485] =new Option('Pacific/Guadalcanal','Pacific/Guadalcanal');
		selectObj.options[486] =new Option('Pacific/Guam','Pacific/Guam');
		selectObj.options[487] =new Option('Pacific/Honolulu','Pacific/Honolulu');
		selectObj.options[488] =new Option('Pacific/Johnston','Pacific/Johnston');
		selectObj.options[489] =new Option('Pacific/Kiritimati','Pacific/Kiritimati');
		selectObj.options[490] =new Option('Pacific/Kosrae','Pacific/Kosrae');
		selectObj.options[491] =new Option('Pacific/Kwajalein','Pacific/Kwajalein');
		selectObj.options[492] =new Option('Pacific/Majuro','Pacific/Majuro');
		selectObj.options[493] =new Option('Pacific/Marquesas','Pacific/Marquesas');
		selectObj.options[494] =new Option('Pacific/Midway','Pacific/Midway');
		selectObj.options[495] =new Option('Pacific/Nauru','Pacific/Nauru');
		selectObj.options[496] =new Option('Pacific/Niue','Pacific/Niue');
		selectObj.options[497] =new Option('Pacific/Norfolk','Pacific/Norfolk');
		selectObj.options[498] =new Option('Pacific/Noumea','Pacific/Noumea');
		selectObj.options[499] =new Option('Pacific/Pago_Pago','Pacific/Pago_Pago');
		selectObj.options[500] =new Option('Pacific/Palau','Pacific/Palau');
		selectObj.options[501] =new Option('Pacific/Pitcairn','Pacific/Pitcairn');
		selectObj.options[502] =new Option('Pacific/Ponape','Pacific/Ponape');
		selectObj.options[503] =new Option('Pacific/Port_Moresby','Pacific/Port_Moresby');
		selectObj.options[504] =new Option('Pacific/Rarotonga','Pacific/Rarotonga');
		selectObj.options[505] =new Option('Pacific/Saipan','Pacific/Saipan');
		selectObj.options[506] =new Option('Pacific/Samoa','Pacific/Samoa');
		selectObj.options[507] =new Option('Pacific/Tahiti','Pacific/Tahiti');
		selectObj.options[508] =new Option('Pacific/Tarawa','Pacific/Tarawa');
		selectObj.options[509] =new Option('Pacific/Tongatapu','Pacific/Tongatapu');
		selectObj.options[510] =new Option('Pacific/Truk','Pacific/Truk');
		selectObj.options[511] =new Option('Pacific/Wake','Pacific/Wake');
		selectObj.options[512] =new Option('Pacific/Wallis','Pacific/Wallis');
		selectObj.options[513] =new Option('Pacific/Yap','Pacific/Yap');
		selectObj.options[514] =new Option('PLT','PLT');
		selectObj.options[515] =new Option('PNT','PNT');
		selectObj.options[516] =new Option('Poland','Poland');
		selectObj.options[517] =new Option('Portugal','Portugal');
		selectObj.options[518] =new Option('PRC','PRC');
		selectObj.options[519] =new Option('PRT','PRT');
		selectObj.options[520] =new Option('PST','PST');
		selectObj.options[521] =new Option('PST8PDT','PST8PDT');
		selectObj.options[522] =new Option('ROK','ROK');
		selectObj.options[523] =new Option('Singapore','Singapore');
		selectObj.options[524] =new Option('SST','SST');
		selectObj.options[525] =new Option('SystemV/AST4','SystemV/AST4');
		selectObj.options[526] =new Option('SystemV/AST4ADT','SystemV/AST4ADT');
		selectObj.options[527] =new Option('SystemV/CST6','SystemV/CST6');
		selectObj.options[528] =new Option('SystemV/CST6CDT','SystemV/CST6CDT');
		selectObj.options[529] =new Option('SystemV/EST5','SystemV/EST5');
		selectObj.options[530] =new Option('SystemV/EST5EDT','SystemV/EST5EDT');
		selectObj.options[531] =new Option('SystemV/HST10','SystemV/HST10');
		selectObj.options[532] =new Option('SystemV/MST7','SystemV/MST7');
		selectObj.options[533] =new Option('SystemV/MST7MDT','SystemV/MST7MDT');
		selectObj.options[534] =new Option('SystemV/PST8','SystemV/PST8');
		selectObj.options[535] =new Option('SystemV/PST8PDT','SystemV/PST8PDT');
		selectObj.options[536] =new Option('SystemV/YST9','SystemV/YST9');
		selectObj.options[537] =new Option('SystemV/YST9YDT','SystemV/YST9YDT');
		selectObj.options[538] =new Option('Turkey','Turkey');
		selectObj.options[539] =new Option('UCT','UCT');
		selectObj.options[540] =new Option('Universal','Universal');
		selectObj.options[541] =new Option('US/Alaska','US/Alaska');
		selectObj.options[542] =new Option('US/Aleutian','US/Aleutian');
		selectObj.options[543] =new Option('US/Arizona','US/Arizona');
		selectObj.options[544] =new Option('US/Central','US/Central');
		selectObj.options[545] =new Option('US/East-Indiana','US/East-Indiana');
		selectObj.options[546] =new Option('US/East-Indiana','US/Hawaii');
		selectObj.options[547] =new Option('US/Hawaii','US/Indiana-Starke');
		selectObj.options[548] =new Option('US/Indiana-Starke','US/Michigan');
		selectObj.options[549] =new Option('US/Michigan','US/Mountain');
		selectObj.options[550] =new Option('US/Mountain','US/Pacific');
		selectObj.options[551] =new Option('US/Pacific','US/Pacific-New');
		selectObj.options[552] =new Option('US/Pacific-New','US/Samoa');
		selectObj.options[553] =new Option('US/Samoa','UTC');
		selectObj.options[554] =new Option('UTC','VST');
		selectObj.options[555] =new Option('VST','W-SU');
		selectObj.options[556] =new Option('W-SU','WET');
		selectObj.options[557] =new Option('WET','Zulu');    
}


function selectCountryByName(selectObj, itemName){
	
	if( selectObj ==null || selectObj.options.length ==0 ){
		return;		
	}
	
	
	for (i= 0; i < selectObj.options.length; i++){			
		if(selectObj.options[i].text.toUpperCase().indexOf(itemName.toUpperCase()) >=0 ){
			selectObj.selectedIndex=i;
			break;
		}
	}
}

function selectCountryByCode(selectObj, itemCode){
	
	if( selectObj ==null || selectObj.options.length ==0 ){
		return;		
	}
	
	
	for (i= 0; i < selectObj.options.length; i++){			
		if(selectObj.options[i].value.toUpperCase().indexOf(itemCode.toUpperCase()) >=0 ){
			selectObj.selectedIndex=i;
			break;
		}
	}
}


function setPassword(textBox, password){
	textBox.value=calcMD5(password);

}

function checkPasswordNotNull(md5Str){	
	if(md5Str == calcMD5("")){
		alert("Please enter 'Current Password' to proceed.");
		return false;
	}
	
	return true;
}


function Trim(str){
	if(str.length < 1){
	return"";
	}

	str = RTrim(str);
	str = LTrim(str);
	if(str==""){
		return "";
	}else{
		return str;
	}
} 

function RTrim(str){
	var w_space = String.fromCharCode(32);
	var v_length = str.length;
	var strTemp = "";
	if(v_length < 0){
		return"";
	}
	var iTemp = v_length -1;

	while(iTemp > -1){
		if(str.charAt(iTemp) == w_space){
		}else{
			strTemp = str.substring(0,iTemp +1);
			break;
		}
		iTemp = iTemp-1;

	} 
	return strTemp;
} 

function LTrim(str){
	var w_space = String.fromCharCode(32);
	if(v_length < 1){
	return"";
	}
	var v_length = str.length;
	var strTemp = "";
	
	var iTemp = 0;
	
	while(iTemp < v_length){
		if(str.charAt(iTemp) == w_space){
		}else{
			strTemp = str.substring(iTemp,v_length);
			break;
		}
		iTemp = iTemp + 1;
	}
	return strTemp;
} 


function locationStreetType(selectObj)
{

    selectObj.options.length =0;
	selectObj.options[0] =new Option('','');
	selectObj.options[1] =new Option('AVENUE','AVE');
	selectObj.options[2] =new Option('ABBEY','ABBEY');
	selectObj.options[3] =new Option('ABBAYE','ABB');
	selectObj.options[4] =new Option('ACRES','ACRES');
	selectObj.options[5] =new Option('ALLEE','ALLEE');
	selectObj.options[6] =new Option('ALLEY','ALLEY');
	selectObj.options[7] =new Option('ANSE','ANSE');
	selectObj.options[8] =new Option('ATTERRISSAGE','ATTERR');
	selectObj.options[9] =new Option('AUTOROUTE','AUT');
	selectObj.options[10] =new Option('BOULEVARD','BLVD');
	selectObj.options[11] =new Option('BAIE','BAIE');
	selectObj.options[12] =new Option('BAISSIERE','BAISS');
	selectObj.options[13] =new Option('BAY','BAY');
	selectObj.options[14] =new Option('BEACH','BEACH');
	selectObj.options[15] =new Option('BELVEDERE','BELV');
	selectObj.options[16] =new Option('BEND','BEND');
	selectObj.options[17] =new Option('BOIS','BOIS');
	selectObj.options[18] =new Option('BOSQUET','BOSQ');
	selectObj.options[19] =new Option('BOUCLE','BOUCLE');
	selectObj.options[20] =new Option('BRETELLE','BRET');
	selectObj.options[21] =new Option('BY-PASS','BYPASS');
	selectObj.options[22] =new Option('BYWAY','BYWAY');
	selectObj.options[23] =new Option('CRESCENT','CRES');
	selectObj.options[24] =new Option('CENTRE','CTR');
	selectObj.options[25] =new Option('COURT','CRT');
	selectObj.options[26] =new Option('CAMPUS','CAMPUS');
	selectObj.options[27] =new Option('CAP','CAP');
	selectObj.options[28] =new Option('CAPE','CAPE');
	selectObj.options[29] =new Option('CARRE','CAR');
	selectObj.options[30] =new Option('CARREFOUR','CARREF');
	selectObj.options[31] =new Option('CAYE','CAYE');
	selectObj.options[32] =new Option('CERCLE','CERCLE');
	selectObj.options[33] =new Option('CHAMP','CHAMP');
	selectObj.options[34] =new Option('CHASE','CHASE');
	selectObj.options[35] =new Option('CHEMIN','CH');
	selectObj.options[36] =new Option('CHENAL','CHEN');
	selectObj.options[37] =new Option('CIRCLE','CIR');
	selectObj.options[38] =new Option('CIRCUIT','CIRCT');
	selectObj.options[39] =new Option('CLAIRIERE','CLAIR');
	selectObj.options[40] =new Option('CLOSE','CLOSE');
	selectObj.options[41] =new Option('COLLINE','COLL');
	selectObj.options[42] =new Option('COMMON','COMMON');
	selectObj.options[43] =new Option('COMMUN','COMMUN');
	selectObj.options[44] =new Option('CONCESSION','CONC');
	selectObj.options[45] =new Option('CORNERS','CRNRS');
	selectObj.options[46] =new Option('COTE','COTE');
	selectObj.options[47] =new Option('COUR','COUR');
	selectObj.options[48] =new Option('COURBE','COURBE');
	selectObj.options[49] =new Option('COVE','COVE');
	selectObj.options[50] =new Option('CRETE','CRETE');
	selectObj.options[51] =new Option('CRIQUE','CRIQ');
	selectObj.options[52] =new Option('CROISSANT','CROIS');
	selectObj.options[53] =new Option('CROSSING','CROSS');
	selectObj.options[54] =new Option('CUL-DE-SAC','CDS');
	selectObj.options[55] =new Option('DRIVE','DR');
	selectObj.options[56] =new Option('DALE','DALE');
	selectObj.options[57] =new Option('DEFILE','DEFILE');
	selectObj.options[58] =new Option('DELL','DELL');
	selectObj.options[59] =new Option('DEMITOUR','DEMITOUR');
	selectObj.options[60] =new Option('DEROUTEMENT','DER');
	selectObj.options[61] =new Option('DETOUR','DETOUR');
	selectObj.options[62] =new Option('DIVERSION','DIVERS');
	selectObj.options[63] =new Option('DOWNS','DOWNS');
	selectObj.options[64] =new Option('DEPRESSION','DEPR');
	selectObj.options[65] =new Option('DUNES','DUNES');
	selectObj.options[66] =new Option('ECHANGEUR','ECH');
	selectObj.options[67] =new Option('EMBRANCHEMENT','EMBR');
	selectObj.options[68] =new Option('END','END');
	selectObj.options[69] =new Option('ESPLANADE','ESPL');
	selectObj.options[70] =new Option('ESTATES','EST');
	selectObj.options[71] =new Option('EXPY','EXPRESSWAY');
	selectObj.options[72] =new Option('EXTEN','EXTENSION');
	selectObj.options[73] =new Option('FARM','FARM');
	selectObj.options[74] =new Option('FERME','FERME');
	selectObj.options[75] =new Option('FIELD','FIELD');
	selectObj.options[76] =new Option('FIN','FIN');
	selectObj.options[77] =new Option('FOREST','FOREST');
	selectObj.options[78] =new Option('FORET','FORET');
	selectObj.options[79] =new Option('FOURRE','FOURRE');
	selectObj.options[80] =new Option('FREEWAY','FWY');
	selectObj.options[81] =new Option('FRONT','FRONT');
	selectObj.options[82] =new Option('FRONTIERE','FRNTIE');
	selectObj.options[83] =new Option('GARDEN','GDNS');
	selectObj.options[84] =new Option('GATE','GATE');
	selectObj.options[85] =new Option('GLADE','GLADE');
	selectObj.options[86] =new Option('GLEN','GLEN');
	selectObj.options[87] =new Option('GREEN','GREEN');
	selectObj.options[88] =new Option('GRNDS','GROUNDS');
	selectObj.options[89] =new Option('GROVE','GROVE');
	selectObj.options[90] =new Option('HIGHWAY','HWY');
	selectObj.options[91] =new Option('HARBOUR','HARBR');
	selectObj.options[92] =new Option('HAVRE','HAVRE');
	selectObj.options[93] =new Option('HAUTES TERRES','HAUTTER');
	selectObj.options[94] =new Option('HAUTEUR','HAUTEUR');
	selectObj.options[95] =new Option('HEIGHTS','HTS');
	selectObj.options[96] =new Option('HIGHLANDS','HGHLDS');
	selectObj.options[97] =new Option('HILL','HILL');
	selectObj.options[98] =new Option('HOLLOW','HOLLOW');
	selectObj.options[99] =new Option('ILE','ILE');
	selectObj.options[100] =new Option('IMPASSE','IMP');
	selectObj.options[101] =new Option('INTERSECTION','INTERS');
	selectObj.options[102] =new Option('ISLAND','ISLAND');
	selectObj.options[103] =new Option('JARDIN','JARDIN');
	selectObj.options[104] =new Option('KEY','KEY');
	selectObj.options[105] =new Option('KNOLL','KNOLL');
	selectObj.options[106] =new Option('LANE','LANE');
	selectObj.options[107] =new Option('LABYRINTHE','LABYR');
	selectObj.options[108] =new Option('LANDING','LANDING');
	selectObj.options[109] =new Option('LIGNE','LIGNE');
	selectObj.options[110] =new Option('LIGNE DE CANTON','LIGDECAN');
	selectObj.options[111] =new Option('LIMITES','LIM');
	selectObj.options[112] =new Option('LIMITS','LMTS');
	selectObj.options[113] =new Option('LINE','LINE');
	selectObj.options[114] =new Option('LINK','LINK');
	selectObj.options[115] =new Option('LOOKOUT','LKOUT');
	selectObj.options[116] =new Option('LOOP','LOOP');
	selectObj.options[117] =new Option('LOTISSEMENT','LOT');
	selectObj.options[118] =new Option('MAIL','MAIL');
	selectObj.options[119] =new Option('MALL','MALL');
	selectObj.options[120] =new Option('MANOIR','MANOIR');
	selectObj.options[121] =new Option('MANOR','MANOR');
	selectObj.options[122] =new Option('MARECAGE','MARECAGE');
	selectObj.options[123] =new Option('MASSIF','MASSIF');
	selectObj.options[124] =new Option('MAZE','MAZE');
	selectObj.options[125] =new Option('MEADOW','MEADOW');
	selectObj.options[126] =new Option('MEWS','MEWS');
	selectObj.options[127] =new Option('MONT','MONT');
	selectObj.options[128] =new Option('MONTAGNE','MONTAG');
	selectObj.options[129] =new Option('MONTEE','MONTEE');
	selectObj.options[130] =new Option('MOOR','MOOR');
	selectObj.options[131] =new Option('MOUNT','MT');
	selectObj.options[132] =new Option('MOUNTAIN','MTN');
	selectObj.options[133] =new Option('ORCHARD','ORCH');
	selectObj.options[134] =new Option('PLACE','PL');
	selectObj.options[135] =new Option('PARADE','PARADE');
	selectObj.options[136] =new Option('PARC','PARC');
	selectObj.options[137] =new Option('PARK','PK');
	selectObj.options[138] =new Option('PARKWAY','PKY');
	selectObj.options[139] =new Option('PASSAGE','PASS');
	selectObj.options[140] =new Option('PATH','PATH');
	selectObj.options[141] =new Option('PATHWAY','PTWAY');
	selectObj.options[142] =new Option('PINES','PINES');
	selectObj.options[143] =new Option('PINS','PINS');
	selectObj.options[144] =new Option('PLAGE','PLAGE');
	selectObj.options[145] =new Option('PLATEAU','PLAT');
	selectObj.options[146] =new Option('PLAZA','PLAZA');
	selectObj.options[147] =new Option('POINT','PT');
	selectObj.options[148] =new Option('POINTE','POINTE');
	selectObj.options[149] =new Option('PORT','PORT');
	selectObj.options[150] =new Option('PORTE','PORTE');
	selectObj.options[151] =new Option('PRE','PRE');
	selectObj.options[152] =new Option('PRIVATE','PVT');
	selectObj.options[153] =new Option('PRIVE','PRIVE');
	selectObj.options[154] =new Option('PROLONGEMENT','PROL');
	selectObj.options[155] =new Option('PROMENADE','PR');
	selectObj.options[156] =new Option('QUAI','QUAI');
	selectObj.options[157] =new Option('QUAY','QUAY');
	selectObj.options[158] =new Option('ROAD','RD');
	selectObj.options[159] =new Option('RANDONNEE','RAND');
	selectObj.options[160] =new Option('RANG','RANG');
	selectObj.options[161] =new Option('RANGE','RG');
	selectObj.options[162] =new Option('RANGEE','RANGEE');
	selectObj.options[163] =new Option('RIDGE','RIDGE');
	selectObj.options[164] =new Option('RISE','RISE');
	selectObj.options[165] =new Option('ROND-POINT','RDPT');
	selectObj.options[166] =new Option('ROUTE','RTE');
	selectObj.options[167] =new Option('ROUTE EXPRESS','RTEEX');
	selectObj.options[168] =new Option('ROW','ROW');
	selectObj.options[169] =new Option('RUE','RUE');
	selectObj.options[170] =new Option('RUELLE','RLE');
	selectObj.options[171] =new Option('RUN','RUN');
	selectObj.options[172] =new Option('STREET','ST');
	selectObj.options[173] =new Option('SENTIER','SENT');
	selectObj.options[174] =new Option('SQUARE','SQ');
	selectObj.options[175] =new Option('SUBDIVISION','SUBDIV');
	selectObj.options[176] =new Option('TERRACE','TERR');
	selectObj.options[177] =new Option('TERRAIN COMMUNAL','TERRCOMM');
	selectObj.options[178] =new Option('TERRASSE','TSSE');
	selectObj.options[179] =new Option('TERRES','TERRES');
	selectObj.options[180] =new Option('THICKET','THICK');
	selectObj.options[181] =new Option('TOURS','TOURS');
	selectObj.options[182] =new Option('TOWERS','TOWERS');
	selectObj.options[183] =new Option('TOWNLINE','TLINE');
	selectObj.options[184] =new Option('TRAIL','TRAIL');
	selectObj.options[185] =new Option('TURNABOUT','TRNABT');
	selectObj.options[186] =new Option('VALE','VALE');
	selectObj.options[187] =new Option('VALLEE','VALLEE');
	selectObj.options[188] =new Option('VALLON','VALLON');
	selectObj.options[189] =new Option('VENELLE','VENELLE');
	selectObj.options[190] =new Option('VERGER','VERGER');
	selectObj.options[191] =new Option('VERT','VERT');
	selectObj.options[192] =new Option('VIA','VIA');
	selectObj.options[193] =new Option('VIEW','VIEW');
	selectObj.options[194] =new Option('VILLGE','VILLAGE');
	selectObj.options[195] =new Option('VISTA','VISTA');
	selectObj.options[196] =new Option('VOLE','VOLE');
	selectObj.options[197] =new Option('WALK','WALK');
	selectObj.options[198] =new Option('WAY','WAY');
	selectObj.options[199] =new Option('WHARF','WHARF');
	selectObj.options[200] =new Option('WOOD','WOOD');
	selectObj.options[201] =new Option('WYND','WYND');
}


 
function locationSuiteType(selectObj)
{
	selectObj.options[0] =new Option('','');
	selectObj.options[1] =new Option('APT.','APT');
	selectObj.options[2] =new Option('SUITE','SUITE');
	selectObj.options[3] =new Option('UNIT','UNIT');
	selectObj.options[4] =new Option('APPARTEMENT','APP');
	selectObj.options[5] =new Option('FLOOR','FLOOR');
	selectObj.options[6] =new Option('BUREAU','BUREAU');
	selectObj.options[7] =new Option('SERVICE','SERVICE');
}

function locationStreetDirection(selectObj)
{
	selectObj.options[0] =new Option('','');
	selectObj.options[1] =new Option('EAST','E');
	selectObj.options[2] =new Option('NORTH','N');
	selectObj.options[3] =new Option('NORTH EAST','NE');
	selectObj.options[4] =new Option('NORTH WEST','NW');
	selectObj.options[5] =new Option('SOUTH','S');
	selectObj.options[6] =new Option('SOUTH EAST','SE');
	selectObj.options[7] =new Option('SOUTH WEST','SW');
	selectObj.options[8] =new Option('WEST','W');
	selectObj.options[9] =new Option('EST','EST');
	selectObj.options[10] =new Option('NORD','NORD');
	selectObj.options[11] =new Option('NORD-EST','NORDE');
	selectObj.options[12] =new Option('NORD-OUEST','NORDO');
	selectObj.options[13] =new Option('OUEST','OUEST');
	selectObj.options[14] =new Option('SUD','SUD');
	selectObj.options[15] =new Option('SUD-EST','SUDE');
	selectObj.options[16] =new Option('SUD-OUEST','SUDO');
}

function prefix(selectObj)
{
	selectObj.options[0] =  new Option('MR.','MR.');
	selectObj.options[1] =  new Option('MRS.','MRS.');
	selectObj.options[2] =  new Option('MISS','MISS');
	selectObj.options[3] =  new Option('MS.','MS.');
	selectObj.options[4] =  new Option('DR.','DR.');
	selectObj.options[5] =  new Option('PROF.','PROF.');
	selectObj.options[6] =  new Option('M.','M.');
	selectObj.options[7] =  new Option('MME','MME');
	selectObj.options[8] =  new Option('MLLE','MLLE');
	selectObj.options[9] =  new Option('DR','DR');
	selectObj.options[10] =  new Option('PR','PR');
}

function state_prov(selectObj)
{
	var i=0;
	selectObj.options[i] =  new Option('','');i++;
	selectObj.options[i] =  new Option('AB','AB');i++;
	selectObj.options[i] =  new Option('BC','BC');i++;
	selectObj.options[i] =  new Option('MB','MB');i++;
	selectObj.options[i] =  new Option('NB','NB');i++;
	selectObj.options[i] =  new Option('NF','NF');i++;
	selectObj.options[i] =  new Option('NT','NT');i++;
	selectObj.options[i] =  new Option('NS','NS');i++;
	selectObj.options[i] =  new Option('ON','ON');i++;
	selectObj.options[i] =  new Option('PE','PE');i++;
	selectObj.options[i] =  new Option('QC','QC');i++;
	selectObj.options[i] =  new Option('SK','SK');i++;
	selectObj.options[i] =  new Option('YT','YT');i++;
	selectObj.options[i] =  new Option('AL','AL');i++;
	selectObj.options[i] =  new Option('AK','AK');i++;
	selectObj.options[i] =  new Option('AS','AS');i++;
	selectObj.options[i] =  new Option('AZ','AZ');i++;
	selectObj.options[i] =  new Option('AR','AR');i++;
	selectObj.options[i] =  new Option('CA','CA');i++;
	selectObj.options[i] =  new Option('CO','CO');i++;
	selectObj.options[i] =  new Option('CT','CT');i++;
	selectObj.options[i] =  new Option('DE','DE');i++;
	selectObj.options[i] =  new Option('DC','DC');i++;
	selectObj.options[i] =  new Option('FM','FM');i++;
	selectObj.options[i] =  new Option('FL','FL');i++;
	selectObj.options[i] =  new Option('GA','GA');i++;
	selectObj.options[i] =  new Option('GU','GU');i++;
	selectObj.options[i] =  new Option('HI','HI');i++;
	selectObj.options[i] =  new Option('ID','ID');i++;
	selectObj.options[i] =  new Option('IL','IL');i++;
	selectObj.options[i] =  new Option('IN','IN');i++;
	selectObj.options[i] =  new Option('IA','IA');i++;
	selectObj.options[i] =  new Option('KS','KS');i++;
	selectObj.options[i] =  new Option('KY','KY');i++;
	selectObj.options[i] =  new Option('LA','LA');i++;
	selectObj.options[i] =  new Option('ME','ME');i++;
	selectObj.options[i] =  new Option('MH','MH');i++;
	selectObj.options[i] =  new Option('MD','MD');i++;
	selectObj.options[i] =  new Option('MA','MA');i++;
	selectObj.options[i] =  new Option('MI','MI');i++;
	selectObj.options[i] =  new Option('MN','MN');i++;
	selectObj.options[i] =  new Option('MS','MS');i++;
	selectObj.options[i] =  new Option('MO','MO');i++;
	selectObj.options[i] =  new Option('MT','MT');i++;
	selectObj.options[i] =  new Option('NE','NE');i++;
	selectObj.options[i] =  new Option('NV','NV');i++;
	selectObj.options[i] =  new Option('NH','NH');i++;
	selectObj.options[i] =  new Option('NJ','NJ');i++;
	selectObj.options[i] =  new Option('NM','NM');i++;
	selectObj.options[i] =  new Option('NY','NY');i++;
	selectObj.options[i] =  new Option('NC','NC');i++;
	selectObj.options[i] =  new Option('ND','ND');i++;
	selectObj.options[i] =  new Option('MP','MP');i++;
	selectObj.options[i] =  new Option('OH','OH');i++;
	selectObj.options[i] =  new Option('OK','OK');i++;
	selectObj.options[i] =  new Option('OR','OR');i++;
	selectObj.options[i] =  new Option('PU','PU');i++;
	selectObj.options[i] =  new Option('PA','PA');i++;
	selectObj.options[i] =  new Option('PR','PR');i++;
	selectObj.options[i] =  new Option('RI','RI');i++;
	selectObj.options[i] =  new Option('SC','SC');i++;
	selectObj.options[i] =  new Option('SD','SD');i++;
	selectObj.options[i] =  new Option('TN','TN');i++;
	selectObj.options[i] =  new Option('TX','TX');i++;
	selectObj.options[i] =  new Option('UT','UT');i++;
	selectObj.options[i] =  new Option('VT','VT');i++;
	selectObj.options[i] =  new Option('VI','VI');i++;
	selectObj.options[i] =  new Option('VA','VA');i++;
	selectObj.options[i] =  new Option('WA','WA');i++;
	selectObj.options[i] =  new Option('WV','WV');i++;
	selectObj.options[i] =  new Option('WI','WI');i++;
	selectObj.options[i] =  new Option('WY','WY');i++;
}

function locationLanguage(selectObj)
{
	selectObj.options[0] =  new Option('','');
	selectObj.options[1] =  new Option('English','EN');
	selectObj.options[2] =  new Option('French','FR');
}

function disNoOfRecord(selectObj)
{
	selectObj.options[0] =  new Option('10','10');
	selectObj.options[1] =  new Option('20','20');
	selectObj.options[2] =  new Option('30','30');
	selectObj.options[3] =  new Option('40','40');
	selectObj.options[4] =  new Option('50','50');
	selectObj.options[5] =  new Option('60','60');
}

function selectComboValue(selectObj, itemName)
{
	if( selectObj ==null || selectObj.options.length ==0 )
	{
		return;		
	}
	
	for (i= 0; i < selectObj.options.length; i++){			
		if(selectObj.options[i].text.toUpperCase().indexOf(itemName.toUpperCase()) >=0 ){
			selectObj.selectedIndex=i;
			break;
		}
	}
}

var INP_TXT_FLD = 0;
var INP_SEL_FLD = 1;
var INP_BTN_FLD = 2;
var INP_TXT_AREA_FLD = 3;

function clearFormFields(form){
	if(confirm("Do you wish to clear the Form ?")){
		form.reset();
	}
}

function clearField(objField, fieldType){
	
	if(isDisabled(objField)){	
		return ;
	}
	
	switch(fieldType){
		case INP_TXT_FLD: 	objField.value="";return;
		case INP_TXT_AREA_FLD: 	objField.value="";return;
		case INP_SEL_FLD: 	objField.selectedIndex=0 ;return;
		case INP_BTN_FLD: 	return;
		default: 		objField.value="";return alert("error");
	}
	
}

function isDisabled(objField){
	return (objField.className.toUpperCase().indexOf("DISABLED")<0 ? false:true );
}

function getFieldType(objField){
	//alert(objField.toString());
	if(objField.toString().indexOf('HTMLSelectElement') >0){
		return INP_SEL_FLD;
	}
	if(objField.toString().indexOf('HTMLTextAreaElement') >0){
		return INP_TXT_AREA_FLD;
	}
	if(objField.toString().indexOf('HTMLInputElement') >0){
		if(objField.name.toString().toUpperCase().indexOf("BTN") == 0 ){
			return INP_BTN_FLD; 
		}else{
			return INP_TXT_FLD;
		}
	}
	if(objField.toString().indexOf('HTMLSelectElement') >0){
		return INP_SEL_FLD;
	}
	if(objField.toString().indexOf('HTMLSelectElement') >0){
		return INP_SEL_FLD;
	}

	return alert("error");
}

function errorIndicator(objField, errorMsg){
	objField.style.border = "solid";
	objField.style.borderWidth = "2px";
	objField.style.borderColor = "maroon";
	objField.title = errorMsg;
	if(objField.type.toLowerCase().indexOf("select") >=0){
		objField.style.backgroundColor="#CD5C5C";
		objField.style.color="white";		
	}	
	
	objField.onblur=function(){ removeErrorIndicator(this)};
}


function removeErrorIndicator(objField){

	objField.style.border = "solid";	
	
	objField.style.borderWidth 	="1px";
	objField.style.borderColor = "lightgrey";
	
	objField.style.borderLeftWidth	="2px";
	objField.style.borderTopWidth	="2px";
	objField.style.borderTopColor	="darkslategray";
	objField.style.borderLeftColor	="darkslategray";		
	objField.title = "";
	if(objField.type.toLowerCase().indexOf("select") >=0){
		objField.style.backgroundColor="white";
		objField.style.color="black";
	}
	objField.onblur=function(){};
}

function isBlank(field){
	if(field != null){
		return ( (Trim(field.value)).length == 0? true:false);
	}else{
		return alert('field is null');
	}
}

function openBrWindow(theURL,winName,features) 
{ 
	  window.open(theURL,winName,features);
}

function changeDisplay(theChecked,theWhat,val,notMatch,notMatch2) 
{ 

  var theNode; 
  var theDisplay; 

	if((notMatch!="" || notMatch2!="") && val!="")			//only one at a time will consider
	{
		notMatch="";
		notMatch2="";
	}

	if(notMatch=="" && notMatch2=="" && val!="")         //if user want the table/row is display in one case
	{	
		if (theChecked == val)		//val is matching criteria
			theDisplay = ""; 
		else 
			theDisplay = "none"; 
	}
	else                     //if user want the table is not display in one case
	{
		if (theChecked == notMatch || theChecked == notMatch2)		//val is matching criteria
			theDisplay = "none"; 
		else 
			theDisplay = ""; 
	}

	for (var i = 1;;i++) 
	{ 
		if (document.getElementById) 
		{ 
			theNode = document.getElementById(theWhat+i); 
			if (theNode == null) 
				return; 
		} 
	   theNode.style.display = theDisplay; 
    } 
} 

function toggleDisplay(condition){	
	if(condition){
		state = "";		
	}else{
		state = "none";
	}
	args = toggleDisplay.arguments;		
	len = toggleDisplay.arguments.length;		
	for(m=1; m<len; m++){ 
		args[m].style.display = state;
	}
}

var checkflag = false;
function checkall(doc)
{
	alert(doc);
	if (checkflag == false)
		checkflag=true;	
	else
	    checkflag=false;

		var len=doc.elements.length;
	
		for (i = 0; i < len; i++)
		{
			obj=doc.elements[i];
			if (obj.type == "checkbox")
				obj.checked = checkflag;
		}
		if (checkflag == false)
			doc.selectall.checked=false;
		else
			doc.selectall.checked=true;
}

function loadTelSysProviders(selectObj){
	if(selectObj == null)
		return;
	selectObj.options.length =0;			
	k=0;
	selectObj.options[k++] = new Option('','');
	selectObj.options[k++] = new Option('Bell Canada','Bell Canada');
	selectObj.options[k++] = new Option('Rogers','Rogers');
	selectObj.options[k++] = new Option('Telus','Telus');
}

function loadISPList(selectObj){
	if(selectObj == null)
		return;
	selectObj.options.length =0;			
	k=0;
	selectObj.options[k++] = new Option('','');
	selectObj.options[k++] = new Option('ISP A','ISP A');
	selectObj.options[k++] = new Option('ISP B','ISP B');
	selectObj.options[k++] = new Option('ISP C','ISP C');
}

function loadCellOperatorList(selectObj){
	if(selectObj == null)
		return;
	selectObj.options.length =0;			
	k=0;
	selectObj.options[k++] = new Option('','');
	selectObj.options[k++] = new Option('Bell Mobility','Bell Mobility');
	selectObj.options[k++] = new Option('Rogers','Rogers');
	selectObj.options[k++] = new Option('Telus','Telus');
}

function loadBankList(selectObj, accountType){	
	if(selectObj == null || accountType == null || accountType == "")
		return;
	accountType = accountType.toUpperCase();
	
	selectObj.options.length =0;			
	k=0;
	if(accountType == "VISA"){
		//Visa
		selectObj.options[k++] = new Option('','');
		selectObj.options[k++] = new Option('Toronto Dominion', 'TD');
		selectObj.options[k++] = new Option('Royal Bank', 'RB');
		selectObj.options[k++] = new Option('Bank of Nova Scotia', 'BNS');
		selectObj.options[k++] = new Option('CIBC','CIBC');
		selectObj.options[k++] = new Option('Desjardins', 'DESJ');
		selectObj.options[k++] = new Option('Van City Save','VANCTY');	
		selectObj.options[k++] = new Option('Citibank', 'CITIBK');
		selectObj.options[k++] = new Option('Hometrust','Hometrust');
	}else if(accountType == "MC"){
		//MC
		selectObj.options[k++] = new Option('Bank of Montreal', 'BMO');	
		selectObj.options[k++] = new Option('Canada Trust', 'CT');	
		selectObj.options[k++] = new Option('National Bank', 'NB');	
		selectObj.options[k++] = new Option('Hong Kong Bank', 'HKB');	
		selectObj.options[k++] = new Option('Citibank', 'CITIBK');	
		selectObj.options[k++] = new Option('FDMS','FDMS');	
		selectObj.options[k++] = new Option('Cuets', 'CUETS');	
		selectObj.options[k++] = new Option('Alberta Treasury', 'ATB');	
	}else if(accountType == "AMEX"){
		//AMEX
		selectObj.options[k++] = new Option('Amex', 'AMEX');	
	}else if(accountType == "DINERS"){
		//Diners
		selectObj.options[k++] = new Option("Diner's", 'Diners');	
	}else if(accountType == "LOYALTY"){	
		//Loyalty
		selectObj.options[k++] = new Option('Loyalty','Loyalty');	
	}else if(accountType == "DISCOVER"){	
		//Discover
		selectObj.options[k++] = new Option('Discover','Discover');
	}
}

function loadTCCCodes(selectObj){
	var i=0;
	for(code in tcc_code_list){
		selectObj.options[i++] =  new Option(tcc_code_list[code],code);
	}
	/*

	selectObj.options[0] =  new Option('','');
	selectObj.options[1] =  new Option('Retail','R');
	selectObj.options[2] =  new Option('Restaurant','F');
	selectObj.options[3] =  new Option('Hotel','H');
	selectObj.options[4] =  new Option('Cash Advance','C');
	selectObj.options[5] =  new Option('Special Markets','T');
	*/
}

function loadMCCCodes(selectObj){
	var i=0;
	for(code in mcc_code_list){
		selectObj.options[i++] =  new Option(mcc_code_list[code],code);
	}
	/*
	selectObj.options[i++] =  new Option('','');
	selectObj.options[i++] =  new Option('Limousines and Taxicabs','4121');
	selectObj.options[i++] =  new Option('Bus Lines','4131');
	selectObj.options[i++] =  new Option('Motor Freight Carriers, Trucking','4214');
	selectObj.options[i++] =  new Option('Courier Services Air and Ground, Freight Forwarders','4215');
	selectObj.options[i++] =  new Option('Public Warehousing','4225');
	selectObj.options[i++] =  new Option('Cruise Lines','4411');
	selectObj.options[i++] =  new Option('Boat Leases and Boat Rentals','4457');
	selectObj.options[i++] =  new Option('Marinas, Marine Service/Supplies','4668');
	selectObj.options[i++] =  new Option('Air Carriers, Airlines','4511');
	selectObj.options[i++] =  new Option('Airports, Airport Terminals, Flying Fields','4582');
	selectObj.options[i++] =  new Option('Travel Agencies and Tour Operators','4722');
	selectObj.options[i++] =  new Option('Bridge and Road Fees, Tolls','4784');
	selectObj.options[i++] =  new Option('Transportation Services (Not Elsewhere Classified)','4789');
	selectObj.options[i++] =  new Option('Automobile and Truck Dealers','5511');
	selectObj.options[i++] =  new Option('Automobile and Truck Dealers (Used Only) Sales','5521');					
	*/
}

/*
defaultTaxes = new Array();
defaultTaxes['GST'] = ".7";
defaultTaxes['PST'] = "0.0";
defaultTaxes['HST'] = ".15";

taxData = new Array();
taxData['CA'] = new Array();
taxData['CA']['AB'] = defaultTaxes;
taxData['CA']['BC'] = defaultTaxes;
taxData['CA']['MB'] = defaultTaxes;
taxData['CA']['NB'] = defaultTaxes;
taxData['CA']['NL'] = defaultTaxes;
taxData['CA']['NS'] = defaultTaxes;
taxData['CA']['PE'] = defaultTaxes;
taxData['CA']['QC'] = defaultTaxes;
taxData['CA']['SK'] = defaultTaxes;
//Ontario
taxData['CA']['ON'] = new Array();
taxData['CA']['ON']['GST'] = "0.07";
taxData['CA']['ON']['PST'] = "0.07";
taxData['CA']['ON']['HST'] = "0.15";
*/

function getTaxData(country, province){
	country = document.getElementById(country).value;
	province = document.getElementById(province).value;	
	//alert(country+" "+province);
	country = country==""?"CA":country;
	province = province==""?"ON":province;
	//alert(country+" "+province);
	//alert(country+" "+province);
	//alert(taxData["CA"]["NB"]);
	return tax_list[country][province];
	/**/
}

function getCREQFee(feetype)
{
	feeTypeSel= document.getElementById(feetype).value;
	return creq_fee_list[feeTypeSel];
}

function trimToDecimalPlaces(strFloat, n){
	strFloat = ""+strFloat;
	decPos = strFloat.indexOf(".");
	if(decPos <0) return strFloat+".00";
	else return strFloat.substr(0,decPos)+"."+(strFloat+"000").substr(decPos+1,n);
}

timeZones = new Array();
timeZones['CA'] = new Array();
timeZones['CA']['AB'] = new Array('-0700');
timeZones['CA']['BC'] = new Array('-0800');
timeZones['CA']['MB'] = new Array('-0600');
timeZones['CA']['NB'] = new Array('-0400');
timeZones['CA']['NL'] = new Array('-0330');
timeZones['CA']['NS'] = new Array('-0400');
timeZones['CA']['ON'] = new Array('-0500');
timeZones['CA']['PE'] = new Array('-0400');
timeZones['CA']['WQC']= new Array('-0500');
timeZones['CA']['EQC']= new Array('-0400');
timeZones['CA']['SK'] = new Array('-0600');

function renderTimeZonesCombo(name, className, timeZoneHolderName){
	return "<select name='"+name+"' id='"+name+"' class='"+className+"' onchange='javascript:setTimeZone(this.value, this, \""+timeZoneHolderName+"\")' ></select>";
}

function changeTimeZone(timeZone, timeZoneHolderName, country, province){	
	//alert(document.getElementById(country));
	country = document.getElementById(country).value;
	province = document.getElementById(province).value;		
	timeZoneObj= document.getElementById(timeZone);
		
	country = country==""?"CA":country;
	province = province=="QC"?"WQC":province;
	timeZoneName = country+"-"+province;
	//alert(timeZoneName+" "+timeZoneObj.name);

	setTimeZone(timeZoneName, timeZoneObj, timeZoneHolderName);
}

function setTimeZone(timeZoneName, timeZoneObj, timeZoneHolderName){
	pos = timeZoneName.indexOf("-");
	country = timeZoneName.substring(0,pos);
	timeZone = timeZoneName.substring(pos+1,timeZoneName.length);	
	timeZoneObj.value=timeZoneName;
	document.getElementById(timeZoneHolderName).value = timeZones[country][timeZone];
}

function defaultTimeZone(timeZone, timeZoneHolderName, country, province){
	changeTimeZone(timeZone, timeZoneHolderName, country, province);
}

function loadTimeZones(selectObj){
	var i=0;	
	selectObj.options[i++] =  new Option('','');
	selectObj.options[i++] =  new Option('Alberta','CA-AB');
	selectObj.options[i++] =  new Option('British Columbia','CA-BC');
	selectObj.options[i++] =  new Option('Manitoba','CA-MB');
	selectObj.options[i++] =  new Option('New Brunswick','CA-NB');
	selectObj.options[i++] =  new Option('Newfoundland and Labrador','CA-NL');
	selectObj.options[i++] =  new Option('Nova Scotia','CA-NS');
	selectObj.options[i++] =  new Option('Ontario','CA-ON');
	selectObj.options[i++] =  new Option('Prince Edward Island','CA-PE');
	selectObj.options[i++] =  new Option('Western Quebec','CA-WQC');
	selectObj.options[i++] =  new Option('Eastern Quebec','CA-EQC');
	selectObj.options[i++] =  new Option('Saskatchewan','CA-SK');	
	
	
}
function callCodeCombo(selectObj){
		selectObj.options.length =0;
		var i=0;
		selectObj.options[i++] = new Option('','');
		selectObj.options[i++] = new Option('Hardware Problem','Hardware Problem');
		selectObj.options[i++] = new Option('Balancing Inquiry','Balancing Inquiry');
		selectObj.options[i++] = new Option('Change of Address','Change of Address');
		selectObj.options[i++] = new Option('Paper Supplies','Paper Supplies');
		selectObj.options[i++] = new Option('Cancellation','Cancellation');
		selectObj.options[i++] = new Option('Additional Hardware','Additional Hardware');
		selectObj.options[i++] = new Option('Billing Inquiry','Billing Inquiry');
		selectObj.options[i++] = new Option('Miscellaneous','Miscellaneous');
}

function ticketStatusCombo(selectObj){
		selectObj.options.length =0;
		var i=0;
		selectObj.options[i++] = new Option('','');
		selectObj.options[i++] = new Option('Swapped','Swapped');
		selectObj.options[i++] = new Option('Pending','Pending');
		selectObj.options[i++] = new Option('Resolved','Resolved');
		selectObj.options[i++] = new Option('Open','Open');
}

function reportFaultCodeCombo(selectObj)
{
		var i=0;
		selectObj.options.length =0;
		selectObj.options[i++] = new Option('','');
		selectObj.options[i++] =  new Option('Upgrade Terminal','Upgrade Terminal');
		selectObj.options[i++] =  new Option('System Problem 97','System Problem 97');
		selectObj.options[i++] =  new Option('Missing Key(s)','Missing Key(s)');
		selectObj.options[i++] =  new Option('Screen Display Garbled','Screen Display Garbled');
		selectObj.options[i++] =  new Option('Broken/Cracked Case','Broken/Cracked Case');
		selectObj.options[i++] =  new Option('Batch Problem','Batch Problem');
		selectObj.options[i++] =  new Option('Keyboard Problem','Keyboard Problem');
		selectObj.options[i++] =  new Option('Cockroaches','Cockroaches');
		selectObj.options[i++] =  new Option('L.E.D. Display Malfunction','L.E.D. Display Malfunction');
		selectObj.options[i++] =  new Option('No Power','No Power');
		selectObj.options[i++] =  new Option('Wiring Problem','Wiring Problem');
		selectObj.options[i++] =  new Option('Circuit Board Malfunction','Circuit Board Malfunction');
		selectObj.options[i++] =  new Option('Volume Control','Volume Control');
		selectObj.options[i++] =  new Option('Power On/Off to Make Operationnal','Power On/Off to Make Operationnal');
		selectObj.options[i++] =  new Option('Electrical Cord Problem','Electrical Cord Problem');
		selectObj.options[i++] =  new Option('Stickey Keys','Stickey Keys');
		selectObj.options[i++] =  new Option('Keyboard Jam','Keyboard Jam');
		selectObj.options[i++] =  new Option('Card Reader Malfunction','Card Reader Malfunction');
		selectObj.options[i++] =  new Option('Cleaning of Device','Cleaning of Device');
		selectObj.options[i++] =  new Option('Liquid Spill','Liquid Spill');
		selectObj.options[i++] =  new Option('Language Switch Broken/Taltek','Language Switch Broken/Taltek');
		selectObj.options[i++] =  new Option('Merchant Damaged Device','Merchant Damaged Device');
		selectObj.options[i++] =  new Option('Smoke/Odor','Smoke/Odor');
		selectObj.options[i++] =  new Option('Stuck on Password','Stuck on Password');
		selectObj.options[i++] =  new Option('Code Corrupt','Code Corrupt');
		selectObj.options[i++] =  new Option('Cannot Initialized','Cannot Initialized');
		selectObj.options[i++] =  new Option('Unable to Access Storage Mode','Unable to Access Storage Mode');
		selectObj.options[i++] =  new Option('Epson Printer Paper Low Light','Epson Printer Paper Low Light');
		selectObj.options[i++] =  new Option('Telephone Problem','Telephone Problem');
		selectObj.options[i++] =  new Option('Telephone Number Deprogrammed','Telephone Number Deprogrammed');
		selectObj.options[i++] =  new Option('Green Busy Light Stays On','Green Busy Light Stays On');
		selectObj.options[i++] =  new Option('Autodial Malfunction','Autodial Malfunction');
		selectObj.options[i++] =  new Option('Unable to Clone','Unable to Clone');
		selectObj.options[i++] =  new Option('Reboot Required','Reboot Required');
		selectObj.options[i++] =  new Option('Macing Error','Macing Error');
		selectObj.options[i++] =  new Option('Printer Problem','Printer Problem');
		selectObj.options[i++] =  new Option('Pin Pad Display','Pin Pad Display');
		selectObj.options[i++] =  new Option('Pin Pad Dead','Pin Pad Dead');
		selectObj.options[i++] =  new Option('Terminal Dead','Terminal Dead');
		selectObj.options[i++] =  new Option('Stuck on Diagnostic','Stuck on Diagnostic');
		selectObj.options[i++] =  new Option('Upgrade Power Pack from 5 to 8 Pins','Upgrade Power Pack from 5 to 8 Pins');
		selectObj.options[i++] =  new Option('Pin Pad Key Problem','Pin Pad Key Problem');
		selectObj.options[i++] =  new Option('Returned to Head Office','Returned to Head Office');
		selectObj.options[i++] =  new Option('New Device Returned','New Device Returned');
		selectObj.options[i++] =  new Option('Hold for Destruction','Hold for Destruction');
		selectObj.options[i++] =  new Option('No Problem Found','No Problem Found');
		selectObj.options[i++] =  new Option('Bad Printer Cable','Bad Printer Cable');
		selectObj.options[i++] =  new Option('Power Pack Replaced','Power Pack Replaced');
		selectObj.options[i++] =  new Option('Cardle Cord Replaced','Cardle Cord Replaced');
		selectObj.options[i++] =  new Option('Telephone Jack Replaced','Telephone Jack Replaced');
		selectObj.options[i++] =  new Option('Handset Replaced','Handset Replaced');
		selectObj.options[i++] =  new Option('Parameters Not Entered or Incorrect','Parameters Not Entered or Incorrect');
		selectObj.options[i++] =  new Option('Improper Connections','Improper Connections');
		selectObj.options[i++] =  new Option('Improper Installation of Ribbon or Paper','Improper Installation of Ribbon or Paper');
		selectObj.options[i++] =  new Option('Missing Paper Spindle on Epson Printer','Missing Paper Spindle on Epson Printer');
		selectObj.options[i++] =  new Option('Communication Problem','Communication Problem');
		selectObj.options[i++] =  new Option('Administrative Card Unavailable','Administrative Card Unavailable');
		selectObj.options[i++] =  new Option('Incomplete New Installation','Incomplete New Installation');
		selectObj.options[i++] =  new Option('Merchant Training','Merchant Training');
		selectObj.options[i++] =  new Option('Service Call in Area B','Service Call in Area B');
		selectObj.options[i++] =  new Option('Equipment Damaged due to Thunderstorm','Equipment Damaged due to Thunderstorm');
		selectObj.options[i++] =  new Option('Call Cancelled','Call Cancelled');
		selectObj.options[i++] =  new Option('Brought Back from Repairs','Brought Back from Repairs');
		selectObj.options[i++] =  new Option('Device Sent to Eastern Visa','Device Sent to Eastern Visa');
		selectObj.options[i++] =  new Option('Device Sent to Center Visa','Device Sent to Center Visa');
		selectObj.options[i++] =  new Option('Device Sent to Western Visa','Device Sent to Western Visa');
		selectObj.options[i++] =  new Option('Device Discarded','Device Discarded');
		selectObj.options[i++] =  new Option('Incorrectly Entered Device Number','Incorrectly Entered Device Number');
		selectObj.options[i++] =  new Option('Device Stolen','Device Stolen');
		selectObj.options[i++] =  new Option('Device Lost','Device Lost');
		selectObj.options[i++] =  new Option('Returned to Vendor','Returned to Vendor');
}
/*function changeAll(which) 
{ 
	var all = [""]; 
	for (var i = 0; i< all.length; i++) 
	{ 
		changeDisplay(false,all[i]); 
		var element = all[i]; 
		if (document.forms[0].elements[element]) 
		{ 
			document.forms[0].elements[element].checked = false; 

		} 
	} 
} */
 
 //validate user for enter atleast one value 
/*function validateFormForOneEntry(doc)
{

	var len=doc.elements.length;
	var error=0;	
	
	for(var i=0;i< len ;i++)
	{
		if(doc.elements[i].type=='text')
		{
			if(doc.elements[i].value!="")
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
}*/
 /*
function createCountryCombo(doc,Cfieldname,STfieldname,defaultIndex)
{
//take the index value of combo
if(defaultIndex=='')
 index_no=Cfieldname.selectedIndex;
 else
{  
   index_no=defaultIndex;
   Cfieldname.selectedIndex=defaultIndex;
}
 // alert(index_no);

 if(index_no!=0)
 {
						//receive the finalstring from hidden field
	str=doc.hcountrystr.value;
	strValue=doc.hcountryvalue.value;
								// split the string each country with its state
	var contryString=new String(str);
	countrySplited=contryString.split("?")  ;

	str_name_fnl=countrySplited[index_no];
	strStateString=new String (str_name_fnl);
	str_Statecount=strStateString.split(".");
	
	//split the state 
	strState=new String (str_Statecount[1]);
	strState=strState.split(";");
	
    								//extract the country from the string
	/*------------------ 
	var contryStringValue=new String(strValue);
	countrySplitedValue=contryStringValue.split("?")  ;
	
	str_name_fnlValue=countrySplitedValue[index_no];
	strStateStringValue=new String (str_name_fnlValue);
	str_StatecountValue=strStateStringValue.split(".");
	
	//split the state 
	strStateValue=new String (str_StatecountValue[1]);
	strStateValue=strStateValue.split(";");
	
	/*------------------* 

	
	//calculate the length of the splited state

	len=strState.length;
 	 //clear the state combo
	var state_len=STfieldname.length; 

    for(i=state_len; i>=0 ;--i)
	{
		STfieldname.options[i]=null;
	}
							//draw the combo
	 if(strState[0]!="")
	 {    
		 for(i=0;i<len-1;i++)
		    STfieldname.options[i]=new Option(strState[i],strStateValue[i]);
	  }
	  else
	  {
			STfieldname.options[0]=new Option("Others"," ");
 	  }

  
 }//end of if
}
*/
mandatoryAcntElements = new Array(
										);

function submitChangeAcntInfo(form, password){
	//validateForm(form,);
	return checkPasswordNotNull(calcMD5(Trim(password) ))
}

function printInvoice(a)
{
	print();
}


function disableSelectBoxes(selectBoxArray){	
	for(id in selectBoxArray){		
		if(id.substring(0,4)=="own-" || id.substring(0,4)=="eqp-"){
			p=0;
			obj = document.getElementById(id+"-"+p);
			for( p=0; obj != null ; p++){
				obj = document.getElementById(id+"-"+p);
				for(subId in selectBoxArray[id]){
					subObj = document.getElementById(subId+"-"+p)
					if(subObj != null){
						selectedOption = subObj.options[obj.selectedIndex];
						subObj.options.length =0 ;
						subObj.options[0] = selectedOption;
					}					
				}
			} 
			continue; 
		} 
		obj = document.getElementById(id);
		if(obj == null) {alert(id);continue;}		 		
		selectedOption = obj.options[obj.selectedIndex];
		obj.options.length =0 ;
		obj.options[0] = selectedOption;	
    }	
	
}	



var communicationUserFields = new Array(
									"com_outside_line",
									"com_call_forwarding",
									"com_call_waiting");	
									
	var deliveryFields = new Array(
									"deliverytitle",
									"deliveryemail",
									"deliveryfirstname",
									"deliverylastname",
									"deliveryphonenumber",
									"deliveryfaxnumber",
									"deliverystreetname",
									"deliverycity",
									"deliverypostal",
									"deliverystate",
									"deliverysuiteno",
									"deliverystreetno",
									"deliveryboxno",
									"deliverycountry",
									"deliveryphoneextn"
								   );
var businessInfoArray= new Array(
									"ord_order_credit_id",
									"ord_assigned_to",
									"ord_prepared_by_id",
									"cli_business_text",									
									"cli_operating_text",
									"cli_yrs_in_business",
									"cli_sic",				
									"cli_mcc",
									"cli_tcc",					
									"cli_timezone",
									"cli_ownership",
									"billcnttitle",
									"billingfirstname",
									"billinglastname",									
									"billingphonenumber",
									"billingstreetname",
									"billingcity",
									"billingpostal",
									"billingstate",
									"billingcountry",
									"billingemail",
									"billingphoneextn",
									"billingfaxnumber",
									"billingsuiteno",
									"billingstreetno",
									"billingboxno"
								);
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
									"cli_business_text",									
									"cli_operating_text",
									"cli_yrs_in_business",
									"cli_sic",				
									"cli_mcc",
									"cli_tcc",					
									"cli_timezone",
									"cli_ownership",
									"billcnttitle",
									"billingfirstname",
									"billinglastname",									
									"billingphonenumber",
									"billingstreetname",
									"billingcity",
									"billingpostal",
									"billingstate",
									"billingstreetno",
									"billingcountry",
									"chk_delivery",
									"deliverytitle",
									"deliveryfirstname",
									"deliverylastname",
									"deliveryphonenumber",
									"deliverystreetname",
									"deliverystreetno",
									"deliverycity",
									"deliverypostal",
									"deliverystate",
									"deliverycountry",
									"creq_feetype"
										);


var makereadonyOwnerElements = new Array(
										'own-principalname-',
										'own-ownershiptitle-',
										'own-ownershippercent-',
										'own-ownershipsin-',
										'own-ownerdob-',
										'own-ownershipcity-',
										'own-ownershipstate-',
										'own-ownershippostal-',
										'own-ownershipphone-',
										'own-ownershipfaxnumber-',
										'own-ownershipcountry-',
										'own-ownershipstreet-',
										'own-ownershipstreetno-',
										'own-ownershipsuiteno-',
										'own-ownershipsuitetype-',
										'own-ownershipstreetdirection-',
										'own-ownershipstreettype-'
										);
										
var mandatoryOwnerElements = new Array(
										'own-principalname-',
										'own-ownershiptitle-',
										'own-ownershippercent-',
										'own-ownershipsin-',
										'own-ownerdob-',
										'own-ownershipcity-',
										'own-ownershipstate-',
										'own-ownershippostal-',
										'own-ownershipphone-',
										'own-ownershipstreetno-',
										'own-ownershipcountry-'
										);	
										
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
												
var terminalFeatureArray= new Array(
											  "phonecards",
											  "tipping",
											  "giftcards",
											  "empreports"
												);
var mandatoryEquipElements = new Array(
										'eqp-pod_product_id-'
										);			
										
						
																   								