
//------------------------------------------------------//
//	Accordion navigation
//------------------------------------------------------//
function accordionNavigate(accordion, newIndex, posNeg) {
	//console.log('accordionNavigate()');
	//console.log('accordionNavigate() newIndex='+newIndex);
	//console.log('accordionNavigate() posNeg='+posNeg);
	if (typeof posNeg != "undefined") {
		//console.log('accordionNavigate() posNeg!=undefined');
		var curIndex = getAccordionIndex(accordion);
		if (posNeg == "+") {
			//console.log('accordionNavigate() posNeg == "+"');
			$(accordion).accordion("option", {active: curIndex + newIndex})
			window.location.hash = 'Accor' + (curIndex + newIndex);
		} else if (posNeg == "-") {
			//console.log('accordionNavigate() posNeg == "-"');
			$(accordion).accordion("option", {active: curIndex - newIndex})
			window.location.hash = 'Accor' + (curIndex - newIndex);
		}
	} else {
		$(accordion).accordion("option", {active: newIndex})
		window.location.hash = 'Accor' + newIndex;
	}
}//accordionNavigate()

function getAccordionContext(childElement) {
	//console.log('getAccordionContext()');
	return $(childElement).parents('.ui-accordion');
}//getAccordionContext()

function getAccordionIndex(accordion) {
	//console.log('getAccordionIndex()');
	return $(accordion).accordion( "option", "active" );
}//getAccordionIndex()
//------------------------------------------------------//

//------------------------------------------------------//
//	General form validation
//------------------------------------------------------//
function updateTips(o, t ) {
	var tips = $('<div class="validateTips">' + t + '</div>').insertAfter(o);
	tips.show( 'blind', {}, 500 );
}

function checkLength( o, n, min, max ) {
	if ( o.val().length > max || o.val().length < min ) {
		o.addClass( "ui-state-error" );
		o.focus();
		updateTips(o, "Length of " + n + " must be between " +
			min + " and " + max + "." );
		return false;
	} else {
		return true;
	}
}

var REGEX_PHONE = /[0-9\-\(\)\+\.]+/;
var REGEX_EMAIL = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
var REGEX_ZIPCODE = /[0-9\-]+/;

function checkRegexp( o, regexp, n ) {
	if ( !( regexp.test( o.val() ) ) ) {
		o.addClass( "ui-state-error" );
		o.focus();
		updateTips(o, n );
		return false;
	} else {
		return true;
	}
}

function checkSelect( o, invalidValue, n  ) {
	if (o.val() == invalidValue) {
		o.addClass( "ui-state-error" );
		o.focus();
		updateTips(o, n );
		return false;
	} else {
		return true;
	}
}
//------------------------------------------------------//
	
//------------------------------------------------------//
//	General functions
//------------------------------------------------------//
function user_Error_Modal(title, HTMLmessage, width, height) {
	var parentdialog = this;
	$(HTMLmessage).dialog({
		resizable: false,
		width:width,
		height:height,
		modal: true,
		title: title,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
				$( this ).dialog( "destroy" );
			}
		}
	});
} //user_Error_Modal()

function disableButtons(parentSelector, disable, buttontext) {
	//console.log('disableButtons()');
	if (typeof buttontext != "undefined") {
		var buttons = $(parentSelector).find('button:contains('+buttontext+')');
	} else {
		var buttons = $(parentSelector).find('button');
	}
	$(buttons).button({ disabled: disable });
}//disableButtons()

function disableButtonSiblings(self, disable, buttontext) {
	//console.log('disableButtonSiblings()');
	if (typeof buttontext != "undefined") {
		var buttons = $(self).parent().children('button:contains('+buttontext+')');
	} else {
		var buttons = $(self).parent().children('button');
	}
	$(buttons).button({ disabled: disable });
}//disableButtonSiblings()

function getDialogButtons(dialog, buttontext) {
	//console.log('getDialogButtons()');
	if (typeof buttontext != "undefined") {
		var buttons = $(dialog).siblings('.ui-dialog-buttonpane').find('button:contains('+buttontext+')');
	} else {
		var buttons = $(dialog).siblings('.ui-dialog-buttonpane').find('button');
	}
	return buttons;
}//getDialogButtons()

function addDialogButtonIcons(dialog, buttontext, icons) {
	//console.log('addDialogButtonIcons()');
	var buttons = getDialogButtons(dialog, buttontext);
	$(buttons).button( "option", { icons: icons } );
}//addDialogButtonIcons()

function disableDialogButtons(dialog, disable, buttontext) {
	var buttons = getDialogButtons(dialog, buttontext);
	$(buttons).button({ disabled: disable });
}//disableDialogButtons()

function getJSONViaAjax(requestUrl, requestData, callback) {
	//console.log('getJSONViaAjax('+requestUrl+','+requestData+')');
	$.ajax({
		url: requestUrl,
		data: requestData,
		type: 'POST',
		dataType: 'json',
		cache: false,
		beforeSend: function(jqXHR, settings) {
			//console.log('beforeSend');
		},
		success: function(data, textStatus, jqXHR) {
			//console.log('success');
			//console.log(data);
			//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			if (data.status == 0) {
				//console.log('data.status == 0');
				callback(true, data);
			} else if (data.status == -2) { //STATUS_NO_RECORDS
				//console.log('data.status == -2');
				callback(true, data);
			} else if (data.status == -1) {
				//console.log('data.status == -1');
				location.reload(true); //force logout
			} else {
				//console.log('data.status else');
				callback(false, null);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//console.log('error');
			//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			//console.log('errorThrown=' + errorThrown); //errorThrown = "Not Found" or "Internal Server Error."
			//console.log(jqXHR);
			callback(false, null);
		},
		complete: function(jqXHR, textStatus) {
			//console.log('complete');
			//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
		}
	});
}//getJSONViaAjax()
//------------------------------------------------------//