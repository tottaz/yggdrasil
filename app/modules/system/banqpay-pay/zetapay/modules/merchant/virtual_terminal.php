<table border="0" cellspacing="0" align='center' cellpadding="0" width="76%">
	<tr>
		<td class="subtitle" height="28">Virtual Terminal</td>
	</tr>
</table>
<script type="text/javascript">
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

</script>

<form name="virtual" id="virtual" method="POST" action="core/payment/cpos.php">





<table width="76%" cellspacing="2" align=center cellpadding="1" class="outerTable">
  <tr>
    <td class="formLabel" width="110">First Name</td>
    <td class="formFieldRequired" width="270">
      <span>&nbsp;&nbsp;</span>
      <input type="text" name="firstName" id="firstName" maxlength="25" class="inputMed" value="" tabindex="1" />
    </td>
    <td class="formLabel" width="110">No. & Street</td>
    <td class="formFieldRequired">
      <span>&nbsp;&nbsp;</span>
      <input type="text" name="address1" id="address1" size="50" class="inputLong" value="" tabindex="5" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Last Name</td>
    <td class="formFieldRequired">
      <span>&nbsp;&nbsp;</span>
      <input type="text" name="lastName" id="lastName" maxlength="25" class="inputMed" value="" tabindex="2" />
    </td>
    <td class="formLabel">Address (cont'd)</td>
    <td class="formField" style="padding-left:15px;">
      <input type="text" name="address2" id="address2" maxlength="50" class="inputLong" value="" tabindex="6" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Phone Number</td>
    <td class="formFieldRequired">
      <span>&nbsp;&nbsp;</span>
      <input type="text" name="phoneNumber" id="phoneNumber" maxlength="20" class="inputMed" value="" tabindex="3" />
    </td>
    <td class="formLabel">City</td>
    <td class="formFieldRequired">
      <span>&nbsp;&nbsp;</span>
      <input type="text" name="city" id="city" maxlength="25" class="inputLong" value="" tabindex="7" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Email</td>
    <td class="formFieldRequired">
      <span id="emailMandatoryIndicator">&nbsp;&nbsp;</span>
      <input type="text" name="emailAddress" id="emailAddress" maxlength="100" class="inputLong" value="" tabindex="4" />
    </td>
    <td class="formLabel">Province/State</td>
    <td class="formField" style="padding-left:15px;">
      <select name="state" id="state" class="inputMax" tabindex="8">
        <option value="" selected></option>

        	<option value="" selected></option>

      </select>
    </td>
  </tr>
  <tr>
    <td class="formLabel">&nbsp;</td>
    <td class="formField">&nbsp;</td>
    <td class="formLabel">Country</td>
    <td class="formFieldRequired">
      <span>&nbsp;&nbsp;</span>
      <select name="country" id="country" class="inputMax" onChange="onCountryChange()" tabindex="9">
        <option value="" selected></option>

          <option value="AF" >
          Afghanistan</option>

          <option value="AL" >
          Albania</option>

          <option value="DZ" >
          Algeria</option>

          <option value="AD" >
          Andorra</option>

          <option value="AO" >
          Angola</option>

          <option value="AI" >
          Anguilla</option>

          <option value="AQ" >
          Antarctica</option>

          <option value="AG" >
          Antigua and Barbuda</option>

          <option value="AR" >
          Argentina</option>

          <option value="AM" >
          Armenia</option>

          <option value="AW" >
          Aruba</option>

          <option value="AU" >
          Australia</option>

          <option value="AT" >
          Austria</option>

          <option value="AZ" >
          Azerbaijan</option>

          <option value="BS" >
          Bahamas, The</option>

          <option value="BH" >
          Bahrain</option>

          <option value="BD" >
          Bangladesh</option>

          <option value="BB" >
          Barbados</option>

          <option value="BY" >
          Belarus</option>

          <option value="BE" >
          Belgium</option>

          <option value="BZ" >
          Belize</option>

          <option value="BJ" >
          Benin</option>

          <option value="BM" >
          Bermuda</option>

          <option value="BT" >
          Bhutan</option>

          <option value="BO" >
          Bolivia</option>

          <option value="BA" >
          Bosnia and Herzegovina</option>

          <option value="BW" >
          Botswana</option>

          <option value="BV" >
          Bouvet Island</option>

          <option value="BR" >
          Brazil</option>

          <option value="IO" >
          British Indian Ocean Territory</option>

          <option value="VG" >
          British Virgin Islands</option>

          <option value="BN" >
          Brunei</option>

          <option value="BG" >
          Bulgaria</option>

          <option value="BF" >
          Burkina Faso</option>

          <option value="BI" >
          Burundi</option>

          <option value="KH" >
          Cambodia</option>

          <option value="CM" >
          Cameroon</option>

          <option value="CA" >
          Canada</option>

          <option value="CV" >
          Cape Verde</option>

          <option value="KY" >
          Cayman Islands</option>

          <option value="CF" >
          Central African Republic</option>

          <option value="TD" >
          Chad</option>

          <option value="CL" >
          Chile</option>

          <option value="CN" >
          China</option>

          <option value="CX" >
          Christmas Island</option>

          <option value="CC" >
          Cocos (Keeling) Islands</option>

          <option value="CO" >
          Colombia</option>

          <option value="KM" >
          Comoros</option>

          <option value="CG" >
          Congo</option>

          <option value="CK" >
          Cook Islands</option>

          <option value="CR" >
          Costa Rica</option>

          <option value="CI" >
          Cote d'Ivoire</option>

          <option value="HR" >
          Croatia</option>

          <option value="CU" >
          Cuba</option>

          <option value="CZ" >
          Czech Republic</option>

          <option value="DK" >
          Denmark</option>

          <option value="DJ" >
          Djibouti</option>

          <option value="DM" >
          Dominica</option>

          <option value="DO" >
          Dominican Republic</option>

          <option value="TP" >
          East Timor</option>

          <option value="EC" >
          Ecuador</option>

          <option value="EG" >
          Egypt</option>

          <option value="SV" >
          El Salvador</option>

          <option value="GQ" >
          Equatorial Guinea</option>

          <option value="ER" >
          Eritrea</option>

          <option value="EE" >
          Estonia</option>

          <option value="ET" >
          Ethiopia</option>

          <option value="FK" >
          Falkland Islands</option>

          <option value="FO" >
          Faroe Islands</option>

          <option value="FM" >
          Federated States of Micronesia</option>

          <option value="FJ" >
          Fiji</option>

          <option value="FI" >
          Finland</option>

          <option value="FR" >
          France</option>

          <option value="FX" >
          France metropolitan</option>

          <option value="GF" >
          French Guiana</option>

          <option value="PF" >
          French Polynesia</option>

          <option value="TF" >
          French Southern Territories</option>

          <option value="GA" >
          Gabon</option>

          <option value="GM" >
          Gambia</option>

          <option value="GE" >
          Georgia</option>

          <option value="DE" >
          Germany</option>

          <option value="GH" >
          Ghana</option>

          <option value="GI" >
          Gibraltar</option>

          <option value="GR" >
          Greece</option>

          <option value="GL" >
          Greenland</option>

          <option value="GD" >
          Grenada</option>

          <option value="GP" >
          Guadeloupe</option>

          <option value="GT" >
          Guatemala</option>

          <option value="GG" >
          Guernsey</option>

          <option value="GN" >
          Guinea</option>

          <option value="GW" >
          Guinea-Bissau</option>

          <option value="GY" >
          Guyana</option>

          <option value="HT" >
          Haiti</option>

          <option value="HM" >
          Heard and McDonald Islands</option>

          <option value="HN" >
          Honduras</option>

          <option value="HK" >
          Hong Kong</option>

          <option value="HU" >
          Hungary</option>

          <option value="IS" >
          Iceland</option>

          <option value="IN" >
          India</option>

          <option value="ID" >
          Indonesia</option>

          <option value="IR" >
          Iran</option>

          <option value="IQ" >
          Iraq</option>

          <option value="IE" >
          Ireland</option>

          <option value="IM" >
          Isle of Man</option>

          <option value="IL" >
          Israel</option>

          <option value="IT" >
          Italy</option>

          <option value="JM" >
          Jamaica</option>

          <option value="JP" >
          Japan</option>

          <option value="JE" >
          Jersey</option>

          <option value="JO" >
          Jordan</option>

          <option value="KZ" >
          Kazakhstan</option>

          <option value="KE" >
          Kenya</option>

          <option value="KI" >
          Kiribati</option>

          <option value="KP" >
          Korea , Democratic Peoples Republic of</option>

          <option value="KR" >
          Korea , Republic of</option>

          <option value="KW" >
          Kuwait</option>

          <option value="KG" >
          Kyrgyzstan</option>

          <option value="LA" >
          Laos</option>

          <option value="LV" >
          Latvia</option>

          <option value="LB" >
          Lebanon</option>

          <option value="LS" >
          Lesotho</option>

          <option value="LR" >
          Liberia</option>

          <option value="LY" >
          Libya</option>

          <option value="LI" >
          Liechtenstein</option>

          <option value="LT" >
          Lithuania</option>

          <option value="LU" >
          Luxembourg</option>

          <option value="MO" >
          Macau</option>

          <option value="MK" >
          Macedonia</option>

          <option value="MG" >
          Madagascar</option>

          <option value="MW" >
          Malawi</option>

          <option value="MY" >
          Malaysia</option>

          <option value="MV" >
          Maldives</option>

          <option value="ML" >
          Mali</option>

          <option value="MT" >
          Malta</option>

          <option value="MH" >
          Marshall Islands</option>

          <option value="MQ" >
          Martinique</option>

          <option value="MR" >
          Mauritania</option>

          <option value="MU" >
          Mauritius</option>

          <option value="YT" >
          Mayotte</option>

          <option value="MX" >
          Mexico</option>

          <option value="MD" >
          Moldova</option>

          <option value="MC" >
          Monaco</option>

          <option value="MN" >
          Mongolia</option>

          <option value="MS" >
          Montserrat</option>

          <option value="MA" >
          Morocco</option>

          <option value="MZ" >
          Mozambique</option>

          <option value="MM" >
          Myanmar (Burma)</option>

          <option value="NA" >
          Namibia</option>

          <option value="NR" >
          Nauru</option>

          <option value="NP" >
          Nepal</option>

          <option value="NL" >
          Netherlands</option>

          <option value="AN" >
          Netherlands Antilles</option>

          <option value="NC" >
          New Caledonia</option>

          <option value="NZ" >
          New Zealand</option>

          <option value="NI" >
          Nicaragua</option>

          <option value="NE" >
          Niger</option>

          <option value="NG" >
          Nigeria</option>

          <option value="NU" >
          Niue</option>

          <option value="NF" >
          Norfolk Island</option>

          <option value="NO" >
          Norway</option>

          <option value="OM" >
          Oman</option>

          <option value="PK" >
          Pakistan</option>

          <option value="PS" >
          Palestinian Territory, Occupied</option>

          <option value="PA" >
          Panama</option>

          <option value="PG" >
          Papua New Guinea</option>

          <option value="PY" >
          Paraguay</option>

          <option value="PE" >
          Peru</option>

          <option value="PH" >
          Philippines</option>

          <option value="PN" >
          Pitcairn Islands</option>

          <option value="PL" >
          Poland</option>

          <option value="PT" >
          Portugal</option>

          <option value="QA" >
          Qatar</option>

          <option value="CY" >
          Republic of Cyprus</option>

          <option value="RE" >
          Reunion</option>

          <option value="RO" >
          Romania</option>

          <option value="RU" >
          Russia</option>

          <option value="RW" >
          Rwanda</option>

          <option value="SH" >
          Saint Helena</option>

          <option value="PM" >
          Saint Pierre and Miquelon</option>

          <option value="WS" >
          Samoa</option>

          <option value="SM" >
          San Marino</option>

          <option value="ST" >
          Sao Tome and Principe</option>

          <option value="SA" >
          Saudi Arabia</option>

          <option value="SN" >
          Senegal</option>

          <option value="SC" >
          Seychelles</option>

          <option value="SL" >
          Sierra Leone</option>

          <option value="SG" >
          Singapore</option>

          <option value="SK" >
          Slovakia</option>

          <option value="SI" >
          Slovenia</option>

          <option value="SB" >
          Solomon Islands</option>

          <option value="SO" >
          Somalia</option>

          <option value="ZA" >
          South Africa</option>

          <option value="GS" >
          South Georgia and the South Sandwich Islands</option>

          <option value="ES" >
          Spain</option>

          <option value="LK" >
          Sri Lanka</option>

          <option value="KN" >
          St Kitts and Nevis</option>

          <option value="LC" >
          St Lucia</option>

          <option value="VC" >
          St Vincent and the Grenadines</option>

          <option value="SD" >
          Sudan</option>

          <option value="SR" >
          Suriname</option>

          <option value="SJ" >
          Svalbard and Jan Mayen Islands</option>

          <option value="SZ" >
          Swaziland</option>

          <option value="SE" >
          Sweden</option>

          <option value="CH" >
          Switzerland</option>

          <option value="SY" >
          Syria</option>

          <option value="TW" >
          Taiwan</option>

          <option value="TJ" >
          Tajikistan</option>

          <option value="TZ" >
          Tanzania</option>

          <option value="TH" >
          Thailand</option>

          <option value="TG" >
          Togo</option>

          <option value="TK" >
          Tokelau</option>

          <option value="TO" >
          Tonga</option>

          <option value="TT" >
          Trinidad and Tobago</option>

          <option value="TN" >
          Tunisia</option>

          <option value="TR" >
          Turkey</option>

          <option value="TM" >
          Turkmenistan</option>

          <option value="TC" >
          Turks and Caicos Islands</option>

          <option value="TV" >
          Tuvalu</option>

          <option value="UG" >
          Uganda</option>

          <option value="UA" >
          Ukraine</option>

          <option value="AE" >
          United Arab Emirates</option>

          <option value="GB" >
          United Kingdom</option>

          <option value="UM" >
          United States Minor Outlying Islands</option>

          <option value="US" >
          United States of America</option>

          <option value="UY" >
          Uruguay</option>

          <option value="UZ" >
          Uzbekistan</option>

          <option value="VU" >
          Vanuatu</option>

          <option value="VA" >
          Vatican City State (Holy See)</option>

          <option value="VE" >
          Venezuela</option>
          <option value="VN" >
          Vietnam</option>
          <option value="VG" >
          Virgin Islands (British)</option>
          <option value="WF" >
          Wallis and Futuna</option>
          <option value="EH" >
          Western Sahara</option>
          <option value="WS" >
          Western Samoa</option>
          <option value="YE" >
          Yemen</option>
          <option value="YU" >
          Yugoslavia</option>
          <option value="ZR" >
          Zaire</option>
          <option value="ZM" >
          Zambia</option>
          <option value="ZW" >
          Zimbabwe</option>

      </select>
    </td>
  </tr>
  <tr>
    <td class="formLabel">&nbsp;</td>
    <td class="formField">&nbsp;</td>
    <td class="formLabel">Postal/Zip Code</td>
    <td class="formFieldRequired">
      <span id="zipMandatoryIndicator">*</span>
      <input type="text" name="zip" id="zip" maxlength="10" class="inputShort" value="" tabindex="10" />
    </td>
  </tr>
</table>

  <table width="76%" cellspacing="2" align=center cellpadding="1" class="outerTable">
  <tr>
  <div class="heading" width="76%">Payment Information</div>
  <div>
  <img src="cpos/images/credit_on.jpg" vspace="0" hspace="0" border="0" />
  </div>
  </tr>
    <tr>
      <td class="formLabel" style="width:160px;">Account Number</td>
      <td class="formFieldRequired" colspan="3">
            <span class="required">*</span>
                  <select name="merchantAccountNumber" id="merchantAccountNumber" onChange="onAccountChange()" tabindex="37">
                <option value="99993986"  selected>
                  99993986 - Sample Merchant
                </option>
            </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Merchant Transaction ID</td>
      <td class="formFieldRequired" colspan="3">
        <span class="required">*</span>
        <input type="text" name="merchantTransactionId" id="merchantTransactionId" value="" tabindex="38" maxlength="32" class="inputLong" />
      </td>
    </tr>
    <tr>
      <td class="formLabel">Amount</td>
      <td class="formFieldRequired" colspan="3">
        <span class="required">*</span>
        <input type="text" name="amount" id="amount" value="" maxlength="10" tabindex="39" class="inputShort" />
        <a style="color: red; font-size: 14; font-weight: bold;" href="javascript:openWindow('virtual.php?event=terminal.amount',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif" alt="Click for more information on entering an amount.">
        </a>
      </td>
    </tr>
    <tr>
      <td class="formLabel" style="width:140px;">Transaction Mode</td>
      <td colspan="3" class="formFieldRequired">
        <span class="required">*</span>
        <select name="creditCardTransactionMode" id="creditCardTransactionMode" class="inputMed" tabindex="40">
          <option value="P" selected>P - Purchase</option>
          <option value="A" >A - Authorization</option>
          <option value="V" >V - AVS Check</option>
        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Card Type</td>
      <td colspan="3" class="formFieldRequired">
        <span class="required">*</span>
        <select name="creditCardType" id="creditCardType" class="inputMed" tabindex="41" onChange="javascript:flagMandatoryParameter();">

          <option value="VI" selected>Visa</option>
          <option value="MC" >MasterCard</option>
          <option value="AM" >American Express</option>
          <option value="DC" >Diners Club </option>
          <option value="DI" >Discover</option>
          <option value="JC" >JCB</option>
        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Card Number</td>
      <td class="formFieldRequired" colspan="3">
        <span class="required">*</span>
        <input type="text" name="creditCardNumber" id="creditCardNumber" value="" tabindex="42" maxlength="20" class="inputMed" />
        <a style="color: red; font-size: 14; font-weight: bold;" href="javascript:openWindow('virtual_terminal?event=terminal.card',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif" alt="Click for more information on entering an amount.">
        </a>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Card Expiry</td>
      <td class="formFieldRequired" colspan="3">
        <span class="required">*</span>
        <input type="text" name="creditCardExpiry" id="creditCardExpiry" value="" tabindex="43" maxlength="5" style="width:35px;" /> &nbsp;(format MM/YY)
      </td>
    </tr>
    <tr>
      <td class="formLabel">CVD Indicator</td>
      <td colspan="3" class="formField" style="padding-left:15px;">
        <select name="creditCardCVDIndicator" id="creditCardCVDIndicator" class="inputMed" tabindex="44">
          <option value="0" selected>0 - Not Provided</option>
          <option value="1" >1 - Provided</option>
          <option value="2" >2 - Illegible</option>
          <option value="3" >3 - No Imprint</option>
        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">CVD Value</td>
      <td class="formField" colspan="3" style="padding-left:15px;">
        <input type="text" maxlength="4" name="creditCardCVDValue"
          id="creditCardCVDValue"
          value=""
          tabindex="45" style="width:30px;" />
      </td>
    </tr>
    <tr>
      <td class="formLabel">Issue Number</td>
      <td class="formField" colspan="3" style="padding-left:15px;">
        <input type="text" maxlength="2" name="creditCardIssueNumber"
          disabled="true" id="creditCardIssueNumber"
          value=""
          tabindex="46" style="width:20px;" />
        <a style="color: red; font-size: 14; font-weight: bold;"
          href="javascript:openWindow('virtual_terminal.php?event=terminal.issue',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif"
            alt="Click for more information on entering an amount.">
        </a>
      </td>
    </tr>
  </table>
<table border="0" width="76%" align=center cellpadding="0" cellspacing="0">
  <tr>
    <td align="left" style="padding-left:7px;"><span class="required">*</span> denotes a required field</td>
    <td height="35" align="right">
            <input type="reset" name="resetButton"
              value="Reset Form" tabindex="59">&nbsp;
            <input type="button" name="processButton" value="Process Transaction"
              onClick="this.value='Processing...';this.disabled=true;document.virtual.event.value='terminal.process';document.virtual.submit();"
              tabindex="60"
              style="padding-left:5px; padding-right:5px; padding-bottom:2px; padding-top:2px;">
    </td>
  </tr>
</table>
<input type="hidden" name="paymentMethodIndicator" id="paymentMethodIndicator"
  value="CREDIT_CARD" />
<input type="hidden" name="paymentModeIndicator" id="paymentModeIndicator"
  value="BASIC" />
<input type="hidden" name="clientVersion" value="1.1">
<input type="hidden" name="event" id="event" value="" />
</form>

<!-- % if (!paymentMethodIndicator.equals("CREDIT_CARD") ) { % -->
<!--	<script language="JavaScript"> -->
    <!-- //
      var orderDateTimeCal = new calendar2(document.forms['virtual'].elements['directDebitOrderDateAndTime']);
      orderDateTimeCal.year_scroll = true;
      orderDateTimeCal.time_comp = true;
    //-->
  </script>
<!-- %}% -->
<?