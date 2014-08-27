//----------------------------------------
//Handle <select> onChange event
window.addEvent('domready', function() {
    $('frmCtrlDataSelect').addEvent('change', function(e) {
        new Event(e).stop(); //required to prevent control's normal event from firing  
        getPageData($('frmHdnDistID').value,this.value);
    });
});
//----------------------------------------

//----------------------------------------
//Handle form submit
//Get Contact Label data in the form of a JSON string
//and handle diplay logic for saving, saved and error messages
window.addEvent('domready', function() {
	$('frmPageForm').addEvent('submit', function(e) {
		e.stop(); //Prevents the default submit event from loading a new page.
		//----------------------------------------
		//Setup TODO's for form.send() command
		this.set('send', {
		    onComplete: function(response) { 
			    fadeElement('saving',1,0,500,500); //fade out
				enableForm(700);
			    if (response.indexOf('detail') >= 0) {
				//Response looks valid
			    	fadeElement('saved',0,1,1000,500); //fade in
					fadeElement('saved',1,0,500,1500); //fade out
					(function() { populateFormValues(response); }).delay(700);
					(function() { postSubmitDisplayUpdate(); }).delay(700);
				} else {
				//Response looks invalid
			    	fadeElement('error',0,1,1000,500); //fade in
					fadeElement('error',1,0,500,5000); //fade out
				}
		    },
		    onRequest: function(){
				hideAllStatusMessages();
    	        fadeElement('saving',0,1,100,0); //fade in
    	        disableForm(0);
		    }
		});
		//----------------------------------------
		
		//----------------------------------------
		//Validate form
		if (validateUserForm(this,pageFormFields)) {
		    this.send();
		}
		//----------------------------------------
	});	
});
//----------------------------------------

//----------------------------------------
//Handle Delete link click
window.addEvent('domready', function() {
	$('frmCmdDelete').addEvent('click', function(e) {
		e.stop(); //Prevents the default link event from loading a new page.
		if ($('frmHdnIsDefault').value != 1) {
		//Not default Contact Label
		    if (confirm('You are about to delete this contact label. This cannot be undone. Press OK to continue.')) {
	            var req = new Request({
	                method: 'get',
		            url: '/services/simplesamplesystem/getdata/personalize_contactlabels.asp?a=' + $('frmHdnDistID').value + '&b=' + $('frmHdnPrimaryID').value + '&c=d',
		            onRequest: function(){
						hideAllStatusMessages();
						fadeElement('saving',0,1,100,0); //fade in
    	                disableForm(0);
		            },
		            onSuccess: function(response) {
						fadeElement('saving',1,0,500,0); //fade out
						if (response.indexOf('detail') >= 0) {
						//Response looks valid
							enableForm(700);
							updateSelectAfterDisable();
							(function() {populateFormValues(response); }).delay(700);
							showDelayedAlert('Delete successful. Your default label has been loaded.',700); //todo: replace with on-page status indicators
						} else {
						//Response looks invalid
							fadeElement('error',0,1,500,500); //fade in
							//fadeElement('error',1,0,500,5000); //fade out
							enableForm(700);
							//(function() { $('frmCtrlDataSelect').disabled = false; }).delay(700);
							//updateSelectAfterDisable();
							//getPageData($('frmHdnDistID').value,"-1"); //load default
						}
		            },
					onFailure: function(xhr) {
						fadeElement('saving',1,0,500,400); //fade out
						fadeElement('error',0,1,500,500); //fade in
						//fadeElement('error',1,0,500,5000); //fade out
						enableForm(700);
						//(function() { $('frmCtrlDataSelect').disabled = false; }).delay(700);
						//updateSelectAfterDisable();
						//getPageData($('frmHdnDistID').value,"-1"); //load default
					}
	            });
		        req.send();
		    }
		} else {
		//Default Contact Label
		    alert('Sorry, you cannot delete your default contact label.');
		}
	});	
});
//----------------------------------------

//----------------------------------------
//Handle Add/Cancel link click
window.addEvent('domready', function() {
	$('frmCmdAdd').addEvent('click', function(e) {
		e.stop(); //Prevents the default link event from loading a new page.
		//creating new label, or canceling new label action?
		if($('frmCmdAdd').innerHTML.substring(0,3).toUpperCase() == "CAN") {
		//cancel add new label
		    getPageData($('frmHdnDistID').value,"-1"); //reload default label
		    $('frmCmdAdd').innerHTML = "Add new contact label";
		    $('frmCmdSubmit').value = "Update";
		    //$('frmCtrlDataSelect').disabled = false;
		    (function() { $('frmCtrlDataSelect').disabled = false; }).delay(700);
		    $('frmCmdDelete').setStyle('visibility','visible');
		} else {
		//add new label
			hideAllStatusMessages();
            enableForm(0);
		    $('frmCtrlDataSelect').options[0].selected = true; //Select default Contact Label
		    $('frmCmdAdd').innerHTML = "Cancel add new label...";
		    $('frmCmdSubmit').value = "Add";
            clearFormFields();
            $('frmCtrlDataSelect').disabled = true;
            $('frmCmdDelete').setStyle('visibility','hidden');
		}
	});
});
//----------------------------------------

//----------------------------------------
//Get Contact Label data in the form of a JSON string
//and handle display logic for loading & failure messages
function getPageData(distid,uniqueid) {
    var req = new Request({
        method: 'get',
	    url: '/services/simplesamplesystem/getdata/personalize_contactlabels.asp?a=' + distid + '&b=' + uniqueid,
	    onRequest: function(){
			hideAllStatusMessages();
			fadeElement('loading',0,1,100,0); //fade in
	        disableForm(0);
	    },
	    onSuccess: function(response) {
		    fadeElement('loading',1,0,500,400); //fade out
		    if (response.indexOf('detail') >= 0) {
		    //Response looks valid
				enableForm(700);
				$('frmHdnPrimaryID').value = $('frmCtrlDataSelect').value; //record current selection ID for loaded results
				(function() {populateFormValues(response); }).delay(700);
			} else {
			//Response looks invalid
				fadeElement('fail',0,1,500,400); //fade in
				//fadeElement('fail',1,0,500,5000); //fade out
				//enableForm(700);
				(function() { $('frmCtrlDataSelect').disabled = false; }).delay(700);
			}
	    },
	    onFailure: function(xhr) {
	        fadeElement('loading',1,0,500,400); //fade out
	        fadeElement('fail',0,1,500,400); //fade in
	        //fadeElement('fail',1,0,500,5000); //fade out
	        //enableForm(700);
	        (function() { $('frmCtrlDataSelect').disabled = false; }).delay(700);
	    }
    });
	req.send();
}
//----------------------------------------

//----------------------------------------
//Handle text updates to UI depending on Add/Update mode.
//detect add/update and insert new select-option when add event occurs
function postSubmitDisplayUpdate() {
    var osel = $('frmCtrlDataSelect');
    if($('frmCmdSubmit').value.substring(0,3).toUpperCase() == "ADD") {
    //Add event
	    $('frmCmdAdd').innerHTML = "Add new contact label";
	    $('frmCmdSubmit').value = "Update";
	    $('frmCmdDelete').setStyle('visibility','visible');
	    
	    //----------------------------------------
	    //add the new select option
        var newselopt = document.createElement('option');
        newselopt.text = $('frm_CL_Name').value;
        newselopt.value = $('frmHdnPrimaryID').value;
        try {
            osel.add(newselopt, null); // standards compliant; doesn't work in IE
        }
        catch(ex) {
            osel.add(newselopt); // IE only
        }
        //----------------------------------------
        
	    osel.disabled = false;
        osel.options[(osel.options.length-1)].selected = true; //select newly-added option
    } else {
    //standard update event
		//need to update the labelname in the select (in case it was updated)
        osel.options[osel.selectedIndex].text = $('frm_CL_Name').value;
    }
}
//----------------------------------------

//----------------------------------------
//Prepare form for new label editing
function clearFormFields() {
    $('frm_CL_Name').value = "";
    $('frm_CL_Line1').value = "";
    $('frm_CL_Line2').value = "";
    $('frm_CL_Line3').value = "";
    $('frm_CL_Line4').value = "";
    $('frmHdnPrimaryID').value = "-1";
    $('frmHdnIsDefault').value = "0";
    $('frm_CL_Name').disabled = false;
}
//----------------------------------------

//----------------------------------------
//Remove deleted current Contact Lable from list
//and select default Contact Label
function updateSelectAfterDisable() {
    var osel = $('frmCtrlDataSelect');
    osel.remove(osel.selectedIndex);
    osel.options[0].selected = true;
}
//----------------------------------------

//----------------------------------------
//Write JSON response properties to form fields
function populateFormValues(resptxt) {
    var json = eval('(' + resptxt + ')');
    $('frm_CL_Name').value = json.detail.labelname;
    
    //Line1
    if (json.detail.textline1 == null || json.detail.textline1 == '') {
		$('frm_CL_Line1').value = '';
	} else {
		$('frm_CL_Line1').value = json.detail.textline1;
	}
	
	//Line2
    if (json.detail.textline2 == null || json.detail.textline2 == '') {
		$('frm_CL_Line2').value = '';
	} else {
		$('frm_CL_Line2').value = json.detail.textline2;
    }
    
    //Line3
    if (json.detail.textline3 == null || json.detail.textline3 == '') {
		$('frm_CL_Line3').value = '';
	} else {
		$('frm_CL_Line3').value = json.detail.textline3;
    }
    
    //Line4
    if (json.detail.textline4 == null || json.detail.textline4 == '') {
		$('frm_CL_Line4').value = '';
	} else {
		$('frm_CL_Line4').value = json.detail.textline4;
    }
    
    $('frmHdnPrimaryID').value = json.detail.contactlabelid;
    $('frmHdnIsDefault').value = json.detail.defaultflag;
    if (json.detail.defaultflag == 0) {
        $('frm_CL_Name').disabled = false;
    } else {
        $('frm_CL_Name').disabled = true;
    }
}
//----------------------------------------

//----------------------------------------
function hideAllStatusMessages() {
	fadeElement('loading',0,0,0,0); //fade out
	fadeElement('success',0,0,0,0); //fade out
	fadeElement('fail',0,0,0,0); //fade out
	fadeElement('saving',0,0,0,0); //fade out
	fadeElement('saved',0,0,0,0); //fade out
	fadeElement('error',0,0,0,0); //fade out
}
//----------------------------------------

//----------------------------------------
// SHOW/HIDE DIV BLOCK
function HideDivContent(d) {
    if(d.length < 1) { return; }
    document.getElementById(d).style.display = "none";
}
function ShowDivContent(d) {
    if(d.length < 1) { return; }
    document.getElementById(d).style.display = "block";
}
function ReverseDivContentDisplay(d) {
    if(d.length < 1) { return; }
    if(document.getElementById(d).style.display == "none") { document.getElementById(d).style.display = "block"; }
    else { document.getElementById(d).style.display = "none"; }
}
//----------------------------------------

//----------------------------------------
//Handle element fade animations
function fadeElement(el,fadestart,fadeend,fadeduration,rundelay) {
    (function() {
        var morphElement = $(el);
        var morphObject = new Fx.Morph(morphElement, {duration: fadeduration});
        morphObject.set({'opacity':fadestart});
        morphObject.start({'opacity':fadeend});
    }).delay(rundelay);
}
//----------------------------------------

//----------------------------------------
//Disable form fields
function disableForm(actiondelay, sFormID) {
	if (typeof sFormID != 'undefined') {
	//handle optional sFormID and only apply to child elements of sFormID
		(function() {$$('#' + sFormID + ' input','#' + sFormID + ' select','#' + sFormID + ' textarea').setProperty('disabled','true');}).delay(actiondelay);
	} else {
		(function() {$$('input','select','textarea').setProperty('disabled','true');}).delay(actiondelay);
	}
}
//----------------------------------------

//----------------------------------------
//Enable form fields
function enableForm(actiondelay, sFormID) {
	if (typeof sFormID != 'undefined') {
	//handle optional sFormID and only apply to child elements of sFormID
		(function() {$$('#' + sFormID + ' input','#' + sFormID + ' select','#' + sFormID + ' textarea').removeProperty('disabled');}).delay(actiondelay);
	} else {
		(function() {$$('input','select','textarea').removeProperty('disabled');}).delay(actiondelay);
	}
}
//----------------------------------------

//----------------------------------------
//Displays a message to the user with a delay
function showDelayedAlert(msgtxt,actiondelay) {
    (function () { alert(msgtxt); }).delay(actiondelay);
}
//----------------------------------------

//----------------------------------------
//Returns value of checked radio input
function GetRadioValueByName(sName) {
	var sReturnValue;
	$$(document.getElementsByName(sName)).each(function(el){
		if (el.checked == true) {
			sReturnValue = el.value;
		}
	});
	return sReturnValue;
}//GetRadioValueByName()
//----------------------------------------

//----------------------------------------
//Checks if input date has expired
function CheckCardExpirationDate(iYear,iMonth) {
	iMonth = iMonth - 1	//JS Months: 0 = Jan, 1 = Mar, ... Dec = 11
	var bReturn;
	var dtExpirationDate = new Date();
	dtExpirationDate.setFullYear(iYear,iMonth,1) //First day of Expiration month
	var dtToday = new Date();
	dtToday.setDate(1); //First day of month
	if (dtExpirationDate >= dtToday) {
	//this month or future date
		bReturn = true;
	}
	return bReturn;
}//CheckCardExpirationDate()
//----------------------------------------

//----------------------------------------
//Checks to see if given value has data.
function IsNullOrEmpty(sValue, sReplaceValue) {
	if (sValue == null || sValue == '') {
		return sReplaceValue;
	} else {
		return sValue;
	}
}//IsNullOrEmpty()
//----------------------------------------

//----------------------------------------
//Removes all validation items
function RemoveDynamicValidation(colfields, arrIndex) {
	for (var idx = arrIndex.length-1; idx >= 0; idx--) { //loop backwards, n to 0.
		colfields.remove(arrIndex[idx]);
	}
}//RemoveSharedBillingValidation()
//----------------------------------------

