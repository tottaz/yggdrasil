<table border="0" cellspacing="0" align=center cellpadding="0" width="100%" height="320" >
<tr valign="top"><td width="100%">
<table border="0" cellspacing="0" cellpadding="0" width="100%">
  <tr>
	<td class="subtitle" height="28">Virtual Terminal</td>
  </tr>
</table>
</td></tr>
<tr valign="top"><td>
<form name="virtual" id="virtual" method="POST" action="">
<table width="100%" cellspacing="2" cellpadding="1" class="outerTable">
  <tr>
    <td class="formLabel" width="15%">First Name</td>
   <td class="formFieldRequired" width="35%" style="padding-left:15px;">
      <input type="text" name="firstName" id="firstName" maxlength="25" class="inputMed" value="" tabindex="1" />
    </td>
    <td class="formLabel" width="15%">No. & Street</td>
   <td class="formFieldRequired" width="35%" style="padding-left:15px;">
      <input type="text" name="address1" id="address1" size="50" class="inputLong" value="" tabindex="5" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Last Name</td>
    <td class="formFieldRequired" style="padding-left:15px;">
      <input type="text" name="lastName" id="lastName" maxlength="25" class="inputMed" value="" tabindex="2" />
    </td>
    <td class="formLabel">Address (cont'd)</td>
    <td class="formFieldRequired" style="padding-left:15px;">
      <input type="text" name="address2" id="address2" maxlength="50" class="inputLong" value="" tabindex="6" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Phone Number</td>
    <td class="formFieldRequired" style="padding-left:15px;">
      <input type="text" name="phoneNumber" id="phoneNumber" maxlength="20" class="inputMed" value="" tabindex="3" />
    </td>
    <td class="formLabel">City</td>
    <td class="formFieldRequired" style="padding-left:15px;">
      <input type="text" name="city" id="city" maxlength="25" class="inputLong" value="" tabindex="7" />
    </td>
  </tr>
  <tr>
    <td class="formLabel">Email</td>
    <td class="formFieldRequired" style="padding-left:15px;">
      <input type="text" name="emailAddress" id="emailAddress" maxlength="100" class="inputLong" value="" tabindex="4" />
    </td>
    <td class="formLabel">Province/State</td>
    <td class="formField" style="padding-left:15px;">
      <select name="state" id="state" class="inputLong" tabindex="8">
        <option value="" selected></option>

        	<option value="" selected></option>

      </select>
    </td>
  </tr>
  <tr>
    <td class="formLabel">Country</td>
    <td class="formFieldRequired" style="padding-left:15px;">
      <select name="country" id="country" class="inputLong" onChange="onCountryChange()" tabindex="9">
      </select>
      <script>
            loadCountries(document.getElementById('country'));
      </script>
    </td>
    <td class="formLabel">Postal/Zip Code</td>
    <td class="formFieldRequired" style=" padding-left: 4px">
      <span id="zipMandatoryIndicator">*</span>
      <input type="text" name="zip" id="zip" maxlength="10" class="inputShort" value="" tabindex="10" />
    </td>
  </tr>
</table>
</td></tr>
<tr align="left" valign="top"><td>
  <div class="heading">Shipping Address & Contact Information</div>

  <table width="100%" cellspacing="2" cellpadding="1" class="outerTable">
    <tr>
      <td class="formLabel" width="15%">First Name</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <input type="text" name="shippingFirstName" id="shippingFirstName" maxlength="25" class="inputMed" value="" tabindex="11" />
      </td>
      <td class="formLabel" width="15%">No. & Street</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <input type="text" name="shippingAddress1" id="shippingAddress1" size="30" class="inputLong" value="" tabindex="16" />
      </td>
    </tr>
    <tr>
      <td class="formLabel">Last Name</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="shippingLastName" id="shippingLastName" maxlength="25" class="inputMed" value="" tabindex="12" />
      </td>
      <td class="formLabel">City</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="shippingCity" id="shippingCity" maxlength="25" class="inputMed" value="" tabindex="17" />
      </td>
    </tr>
    <tr>
      <td class="formLabel">Email</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="shippingEmailAddress" id="shippingEmailAddress" maxlength="100" class="inputLong" value="" tabindex="13" />
      </td>
      <td class="formLabel">Province/State</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <select name="shippingState" id="shippingState" class="inputLong" tabindex="18">
          <option value="" selected></option>

          		<option value="" selected></option>

        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Ship Method</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <select name="shippingMethod" id="shippingMethod" class="inputLong" tabindex="14">
          <option value="" selected></option>
          <option value="N">Next Day / Overnight</option>
          <option value="T">Two Day Service</option>
          <option value="C">Lowest Cost</option>
          <option value="O">Other</option>
        </select>
      </td>
      <td class="formLabel">Country</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <select name="shippingCountry" id="shippingCountry" class="inputLong" tabindex="19" onChange="onShippingCountryChange()">
        <script>
            loadCountries(document.getElementById('shippingCountry'));
        </script>
        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Carrier</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <select name="shippingCarrier" id="shippingCarrier" tabindex="15" class="inputMed">
          <option value="" selected></option>
          <option value="F">Fedex</option>
          <option value="P">USPS</option>
          <option value="U">UPS</option>
          <option value="L">Purolator</option>
          <option value="G">Greyhound</option>
          <option value="D">DHL</option>
          <option value="O">Other</option>
        </select>
      </td>
      <td class="formLabel">Postal/Zip Code</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="shippingZip" id="shippingZip" maxlength="10" class="inputShort" tabindex="20" value=""/>
      </td>
    </tr>
  </table>
</td></tr>
<tr valign="top"><td>
  <div class="heading">Product & Additional Transaction Information</div>
  <table width="100%" cellspacing="2" cellpadding="1" class="outerTable">
    <tr>
      <td class="formLabel" width="15%">Product Type</td>
     <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <select name="productType" id="productType" class="inputLong" tabindex="21">
          <option value="" selected></option>
          <option value="P">Physical Goods</option>
          <option value="D">Digital Goods / Subscription Registration</option>
          <option value="C">Digital Content</option>
          <option value="G">Gift Certificate / Digital Cash</option>
          <option value="S">Shareware</option>
          <option value="M">Digital & Physical</option>
          <option value="R">Subscription Renewal</option>
        </select>
      </td>
      <td class="formLabel" width="15%">Payment Method</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <select name="transactionPaymentMethod" tabindex="23" class="inputLong">
          <option value="">Not Specified</option>
          <option value="O">Card # Provided Online</option>
          <option value="V">Card # Provided by Phone</option>
          <option value="P">Card Present</option>
        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Product Code</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="productCode" id="productCode" value="" class="inputMed" tabindex="22" />
      </td>
      <td class="formLabel">Transaction Category</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <select name="transactionCategory" tabindex="24">
          <option value="">Not Specified</option>
          <option value="I">Internet</option>
          <option value="P">Card Present</option>
          <option value="T">MOTO</option>
        </select>
      </td>
    </tr>
  </table>
</td></tr>
<tr valign="top"><td>

  <div class="heading">Customer Information</div>

  <table width="100%" cellspacing="2" cellpadding="1" class="outerTable">
    <tr>
      <td class="formLabel" width="15%">ID</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%"><input type="text" name="customerIdNumber" id="customerIdNumber" value="" tabindex="25" /></td>
      <td class="formLabel" width="15%">Previous Customer</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <select name="isPreviousCustomer" id="isPreviousCustomer" tabindex="28">
          <option value="N">No</option>
          <option value="Y">Yes</option>
        </select>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Work Phone</td>
      <td class="formFieldRequired" style="padding-left:15px;"><input type="text" name="customerWorkPhone" id="customerWorkPhone" value="" tabindex="26" /></td>
      <td class="formLabel">Account Open Date</td>
      <td class="formFieldRequired" style="padding-left:15px;"><input type="text" name="customerAccountOpenDate" id="customerAccountOpenDate" maxlength="8" value="" tabindex="29" /> (YYYYMMDD)</td>
    </tr>
    <tr>
      <td class="formLabel">IP Address</td>
      <td class="formFieldRequired" style="padding-left:15px;"><input type="text" name="customerIpAddress" id="customerIpAddress" value="" tabindex="27" /></td>
      <td class="formLabel">&nbsp;</td>
      <td class="formField">&nbsp;</td>
    </tr>
  </table>
 </td></tr>
<tr valign="top"><td>
  <div class="heading">Merchant Information</div>
  <table width="100%" cellspacing="2" cellpadding="1" class="outerTable">
    <tr>
      <td class="formLabel" width="15%">SIC</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <input type="text" name="merchantSic" id="merchantSic" value="" tabindex="30" class="inputShort" />
      </td>
      <td class="formLabel" width="15%">User Data 04</td>
      <td class="formFieldRequired" style="padding-left:15px;" width="35%">
        <input type="text" name="merchantUserData04" id="merchantUserData04" value="" tabindex="33" class="inputLong" />
      </td>
    </tr>
    <tr>
      <td class="formLabel">Country</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <select name="merchantCountry" id="merchantCountry" class="inputLong" tabindex="31">
         <script>
            loadCountries(document.getElementById('merchantCountry'));
        </script>
        </select>
      </td>
      <td class="formLabel">User Data 05</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="merchantUserData05" id="merchantUserData05" value="" tabindex="34" class="inputLong" />
      </td>
    </tr>
    <tr>
      <td class="formLabel">Postal/Zip Code</td>
      <td class="formFieldRequired" style="padding-left:15px;">
        <input type="text" name="merchantZip" id="merchantZip" value="" tabindex="32" class="inputMed" />
      </td>
      <td class="formLabel">User Data 06</td>
      <td class="formField" style="padding-left:15px;">
        <input type="text" name="merchantUserData06" id="merchantUserData06" value="" tabindex="35" class="inputLong" />
      </td>
    </tr>
  </table>
</td></tr>
<tr valign="top"><td><br />
  <div class="subTitle">Payment Information</div>
  <div class="heading">Credit Card<!--<img src="cpos/images/credit_on.jpg" vspace="0" hspace="0" border="0" />-->
  </div>
  <table width="100%" cellspacing="2" cellpadding="1" align=center class="outerTable">
    <tr >
      <td class="formLabel" width="15%">Account Number</td>
      <td class="formFieldRequired" width="35%" style=" padding-left: 4px">
            <span class="required">*</span>
                  <select name="merchantAccountNumber" id="merchantAccountNumber" onChange="onAccountChange()" tabindex="37">
                <option value="99993986"  selected>
                  99993986 - ePaymentsnews-CAD
                </option>
                <option value="99993987" >
                  99993987 - ePaymentsnews-USD
                </option>
            </select>
      </td>
      <td class="formLabel" width="15%">Merchant Transaction ID</td>
	  <td class="formFieldRequired" width="35%" style=" padding-left: 4px">
	  	<span class="required">*</span>
	    <input type="text" name="merchantTransactionId" id="merchantTransactionId" value="" tabindex="38" maxlength="32" class="inputLong" />
	   </td>

    </tr>
    <tr>
      <td class="formLabel" width="15%">Transaction Mode</td>
      <td class="formFieldRequired" width="35%"  style=" padding-left: 4px">
        <span class="required">*</span>
        <select name="creditCardTransactionMode" id="creditCardTransactionMode" class="inputMed" tabindex="40">
          <option value="P" selected>P - Purchase</option>
          <option value="A" >A - Authorization</option>
          <option value="V" >V - AVS Check</option>
        </select>
      </td>
      <td class="formLabel" width="15%">Amount</td>
      <td class="formFieldRequired" width="35%"  style=" padding-left: 4px">
        <span class="required">*</span>
        <input type="text" name="amount" id="amount" value="" maxlength="10" tabindex="39"  class="inputMed"  />
        <a style="color: red; font-size: 14; font-weight: bold;" href="javascript:openWindow('index.jsp?event=terminal.amount',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif" alt="Click for more information on entering an amount.">
        </a>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Card Type</td>
      <td class="formFieldRequired"  style=" padding-left: 4px">
        <span class="required">*</span>
        <select name="creditCardType" id="creditCardType" class="inputMed" tabindex="41" onChange="javascript:flagMandatoryParameter();">

          <option value="VI" selected>Visa</option>
          <option value="MC" >MasterCard</option>
          <option value="AM" >American Express</option>
          <option value="DC" >Diners Club </option>
          <option value="DI" >Discover</option>
          <option value="FP" >FirePay</option>
          <option value="JC" >JCB</option>
          <option value="LA" >Laser</option>
          <option value="MD" >Maestro</option>
          <option value="SW" >Switch</option>
          <option value="SO" >Solo</option>
          <option value="VD" >Visa Delta</option>
          <option value="VE" >Visa Electron</option>
        </select>
      </td>
      <td class="formLabel">Card Number</td>
      <td class="formFieldRequired"  style=" padding-left: 4px">
        <span class="required">*</span>
        <input type="text" name="creditCardNumber" id="creditCardNumber" value="" tabindex="42" maxlength="20" class="inputMed" />
        <a style="color: red; font-size: 14; font-weight: bold;" href="javascript:openWindow('index.jsp?event=terminal.card',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif" alt="Click for more information on entering an amount.">
        </a>
      </td>

    </tr>
    <tr>
      <td class="formLabel">Card Expiry</td>
      <td class="formFieldRequired"  style=" padding-left: 4px">
        <span class="required">*</span>
        <input type="text" name="creditCardExpiry" id="creditCardExpiry" value="" tabindex="43" maxlength="5"  class="inputMed"  /> &nbsp;(format MM/YY)
      </td>
      <td class="formLabel">CVD Indicator</td>
      <td class="formField" style="padding-left:15px;">
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
      <td class="formField" style="padding-left:15px;">
        <input type="text" maxlength="4" name="creditCardCVDValue"
          id="creditCardCVDValue"
          value=""
          tabindex="45" style="width:30px;" />
      </td>
      <td class="formLabel">Issue Number</td>
      <td class="formField" style="padding-left:15px;">
        <input type="text" maxlength="2" name="creditCardIssueNumber"
          disabled="true" id="creditCardIssueNumber"
          value=""
          tabindex="46" style="width:20px;" />
        <a style="color: red; font-size: 14; font-weight: bold;"
          href="javascript:openWindow('index.jsp?event=terminal.issue',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif"
            alt="Click for more information on entering an amount.">
        </a>
      </td>
    </tr>
  </table>
</td></tr>
<tr valign="top"><td>

<table border="0" width="100%" cellpadding="0" cellspacing="0">
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
</td></tr>
<tr valign="top"><td>

<input type="hidden" name="paymentMethodIndicator" id="paymentMethodIndicator"
  value="CREDIT_CARD" />
<input type="hidden" name="paymentModeIndicator" id="paymentModeIndicator"
  value="ADVANCED" />
<input type="hidden" name="clientVersion" value="1.1">
<input type="hidden" name="event" id="event" value="" />
</form>
</td></tr>
</table>

