//This file should contain all the javascript for the various temporay save
//sections of the system

/*
 ############################################# IMPORTANT #########################################################
#                                                                                                                 #
#  The name of the window that you open up must be called tempSave.  The reason is that just in case you open the #
#  window when the user's session has expired we don't want the little window  to stay open.  In the file         #
#  /apachelibs/TicketMaster.pm there is some js that will close the login screen if the window's name is tempSave #
#                                                                                                                 #
###################################################################################################################

*/



//This function is for removing temporary save files
//this is for any of the temp save sections that are just basic
function defaultTempSave()
{
var question ="You are about to cancel any changes you may have made.  Would you like to proceed with the cancellation?";

var tempForm = document.tempSave;
var check = tempForm.check.value;
var tempFiles = tempForm.temporaryFiles.value;
var ask = tempForm.ask.value;
var lockFile = tempForm.lockFile.value;
//alert("Check:"+check+"TempFiles:"+tempFiles+"LockFile:"+lockFile);
        //if we don't even bother to check for tempfiles or if we check and
        //there are some temp files
        if(check == "no" || (check == "yes" && tempFiles == "yes"))
        {
		if(ask == "no")
		{
		  submitTemp(tempForm,'/work/ord/ord_delttemp.pl');
		 // window.setTimeout('return true',1000);
		  return true;
		}
                else if (confirm(question))
                {
		submitTemp(tempForm,'/work/ord/ord_delttemp.pl');
                return true;
		//window.setTimeout('return true',1000);
                }
                else
                {
                  //the user has selected cancel so return false so the calling
                  //function will do nothing
                  return false;

                }
        }
	else if(lockFile == "yes")
	{//else we have no temp files but we have a lock file
	 //submitTemp(tempForm,'/work/ord/ord_delttemp.pl');
	 submitTemp(tempForm,'/work/ord/ord_dellock.pl');
	  //alert("LockFile:"+lockFile);
	 //window.setTimeout('return true',1000);
	 return true;
	}
        //we check and there are no tempfiles
        else
        {
          return true;
        }

}

//this function takes the form so submit and where to submit it
function submitTemp(form,where)
{
  //setting up our form so it will post to the window we open
  form.target="tempSaveIframe";
  form.method="POST";
  form.action=where;
  //this is the javascript we want the window to perform
  //form.jsFunc.value = "window.close()";
  //open our window....but keep it small
  //var tmpSave = window.open('','tempSave',"width=1,height=1,toolbar=no, status=no, scrollbars=no, resizable=no, menubar=no, history=no");
  form.submit();
  //shiftTo(tmpSave,0,0);
  //window.focus();
  //trying to send the window to the bottom
  //tmpSave.blur();
}




//This function is for the temporary save in the order system
function orderTempSave()
{
var question ="You are about to cancel any changes you may have made.  Would you like to proceed with the cancellation?";

var tempForm = document.tempSave;
var ask = tempForm.ask.value;
	
	if(ask == "no")
	{
	   submitTemp(tempForm);
           return true;
	}
	else if (confirm(question)) 
	{
		submitTemp(tempForm);
		return true;
	}
	else
	{
	  //the user has selected cancel so return false so the calling
	  //function will do nothing
	  return false;

	}


}



