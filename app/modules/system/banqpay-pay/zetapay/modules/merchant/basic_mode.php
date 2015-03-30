<table border="0" cellspacing="0" cellpadding="0" align=center width="100%" height="340">
<tr valign="top"><td>
<table border="0" cellspacing="0" cellpadding="0" align=left width="100%">
	<tr>
		<td class="subtitle" height="28">Virtual Terminal</td>
	</tr>
</table>
<form name="virtual" id="virtual" method="POST" action="index.jsp">
</td></tr>
<tr valign="top"><td>
<table width="100%" cellspacing="2" align=left cellpadding="1" class="outerTable">
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
    <td class="formField" style="padding-left:15px;">
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
     <td class="formFieldRequired" style="padding-left:15px;">
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
     <td class="formFieldRequired" >
      <span id="zipMandatoryIndicator">*</span>
      <input type="text" name="zip" id="zip" maxlength="10" class="inputShort" value="" tabindex="10" />
    </td>
  </tr>
</table>
</td></tr>
  <tr valign="top"><td>
  <div class="subTitle">Payment Information</div>
  <div class="heading">Credit Card<!--<img src="cpos/images/credit_on.jpg" vspace="0" hspace="0" border="0" />-->
  </div>
  <table width="100%" cellspacing="2" cellpadding="1" align=center class="outerTable">
    <tr >
      <td class="formLabel" >Account Number</td>
      <td class="formFieldRequired" colspan="3">
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
    </tr>
    <tr>
      <td class="formLabel">Merchant Transaction ID</td>
      <td class="formFieldRequired" colspan="3">
        <span class="required">*</span>
        <input type="text" name="merchantTransactionId" id="merchantTransactionId" value="" tabindex="38" maxlength="32" class="inputLong" />
      </td>
    </tr>
    <tr>
      <td class="formLabel" width="15%">Transaction Mode</td>
      <td class="formFieldRequired" width="35%">
        <span class="required">*</span>
        <select name="creditCardTransactionMode" id="creditCardTransactionMode" class="inputMed" tabindex="40">
          <option value="P" selected>P - Purchase</option>
          <option value="A" >A - Authorization</option>
          <option value="V" >V - AVS Check</option>
        </select>
      </td>
      <td class="formLabel" width="15%">Amount</td>
      <td class="formFieldRequired" width="35%">
        <span class="required">*</span>
        <input type="text" name="amount" id="amount" value="" maxlength="10" tabindex="39"  class="inputMed"  />
        <a style="color: red; font-size: 14; font-weight: bold;" href="javascript:openWindow('index.jsp?event=terminal.amount',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif" alt="Click for more information on entering an amount.">
        </a>
      </td>
    </tr>
    <tr>
      <td class="formLabel">Card Type</td>
      <td class="formFieldRequired">
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
      <td class="formFieldRequired" >
        <span class="required">*</span>
        <input type="text" name="creditCardNumber" id="creditCardNumber" value="" tabindex="42" maxlength="20" class="inputMed" />
        <a style="color: red; font-size: 14; font-weight: bold;" href="javascript:openWindow('index.jsp?event=terminal.card',500,150,false);">
          <img border="0" width="16" height="16" src="cpos/images/question.gif" alt="Click for more information on entering an amount.">
        </a>
      </td>

    </tr>
    <tr>
      <td class="formLabel">Card Expiry</td>
      <td class="formFieldRequired" >
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
<tr valign="top"><td >
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
</table>
<input type="hidden" name="paymentMethodIndicator" id="paymentMethodIndicator"
  value="CREDIT_CARD" />
<input type="hidden" name="paymentModeIndicator" id="paymentModeIndicator"
  value="BASIC" />
<input type="hidden" name="clientVersion" value="1.1">
<input type="hidden" name="event" id="event" value="" />
</form>

<?
