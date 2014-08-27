$(function() {
	//------------------------------------------------------//
	//	Accordion setup
	//------------------------------------------------------//
	var ACCORDIAN_INDEX_REDEEM_FUNDRAISING_KIT = 0
	var ACCORDIAN_INDEX_REGISTER_ORGANIZATION = 1
	var ACCORDIAN_INDEX_CAMPAIGN_PARTICIPANTS = 2
	var ACCORDIAN_INDEX_FINAL_REVIEW = 3

	$( "#Campaign_Management_Accordion" ).accordion({
		header: '.bar',
		event: 'click', //click removed after init to prevent click navigation.
		icons: { 
			'header': 'ui-icon-circle-triangle-e', 
			'headerSelected': 'ui-icon-circle-triangle-s'
		},
		clearStyle: true,
		animated: 'swing',
		autoHeight:false,
		collapsible: true,
		active: 0, //DEBUG use 0 normaly
		//active: false, //start closed
		//navigation: true,
		create: function(event, ui) {
			//console.log('create:');
			//console.log(event);
			//accordionNavigate(this, 0);
		},
		changestart: function(event, ui) {
			//console.log('changestart:');
			//console.log(ui);
			if (ui.options.active == ACCORDIAN_INDEX_CAMPAIGN_PARTICIPANTS) {
				UpdateParticipantsTableRows();
			} else {
				if (Participants_DataTables) {
					Participants_DataTables.fnClearTable(); //Nuke existing rows.
				}
			}

			if (ui.options.active == ACCORDIAN_INDEX_FINAL_REVIEW) {
				UpdateReview();
			} else {
				ClearReview();
			}
		},
		change: function(event, ui) {
			//console.log('change:');
			//console.log(ui);
		}
	});

	//prevent user nav.
	$(".manual_navigation .bar").unbind("click").css('cursor', 'default');
	//------------------------------------------------------//

	//------------------------------------------------------//
	//	Accordion navigation
	//------------------------------------------------------//
	$('.accordion_navigation .Prev_button').button({
		icons: {primary: "ui-icon-carat-1-w"}
	});

	$('.accordion_navigation')
		.delegate('.Prev_button', 'click', function(eventObject) {
			//eventObject.preventDefault();  // prevent the default action, e.g., following a link
			
			var accordion = getAccordionContext(this);
			var active = getAccordionIndex(accordion);
			
			if (active == ACCORDIAN_INDEX_CAMPAIGN_PARTICIPANTS || active == ACCORDIAN_INDEX_FINAL_REVIEW) { //Participants or Finalize
				accordionNavigate(accordion, 1, '-');
			} else {
				$( "<div><p>Are you sure you want to navigate away from this step? If you've changed any data, it may not be saved if you continue.</p></div>" ).dialog({
					resizable: false,
					width:320,
					height:190,
					modal: true,
					title: 'Possible Data Loss',
					buttons: {
						"Continue": function() {
							$( this ).dialog( "close" );
							accordionNavigate(accordion, 1, '-');
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					},
					close: function(event, ui) {
						$( this ).dialog( "destroy" );
					},
					open: function(event, ui) {
						addDialogButtonIcons(this, 'Continue', {primary:'ui-icon-carat-1-w'});
						addDialogButtonIcons(this, 'Cancel', {primary:'ui-icon-cancel'});
					}
				});
			}
	});

	$('.accordion_navigation .Next_button').button({
		icons: {secondary: "ui-icon-carat-1-e"}
	});

	$('.accordion_navigation')
		.delegate('.Next_button', 'click', function(eventObject) {
			//eventObject.preventDefault();  // prevent the default action, e.g., following a link
			
			var accordion = getAccordionContext(this);
			var active = getAccordionIndex(accordion);
			
			if (active == ACCORDIAN_INDEX_REDEEM_FUNDRAISING_KIT) {//Redeem Fundraising Kit
				if (validate_RedeemFundraisingKit_form()) {
					fundraisingKitRedeem(this, function(result) {
						if (result) {
							accordionNavigate(accordion, 1, '+');
						} else {
							user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
						}
					});
				}
			} else if (active == ACCORDIAN_INDEX_REGISTER_ORGANIZATION) {//Register Organization
				if (validate_RegisterOrganization_form()) {
					organizationAddUpdate(this, function(result) {
						if (result) {
							accordionNavigate(accordion, 1, '+');
						} else {
							user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
						}
					});
				}
			} else if (active == ACCORDIAN_INDEX_CAMPAIGN_PARTICIPANTS) {//Campaign Participants
				if (validate_Participants_Form()) {
					accordionNavigate(accordion, 1, '+');
				} else {
					user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
				}
			}
	});
	//------------------------------------------------------//
	
	//------------------------------------------------------//
	//	Redeem Fundraising Kit
	//------------------------------------------------------//
	function validate_RedeemFundraisingKit_form() {
		return true; //debug
	}//validate_RedeemFundraisingKit_form()

	function fundraisingKitRedeem(button, callback) {
		$('#RegisterOrganization_OrderID').val('-5555555'); //debug
		callback(true); //debug
	}//fundraisingKitRedeem()
	//------------------------------------------------------//

	//------------------------------------------------------//
	//	Register Organization
	//------------------------------------------------------//
	var RegisterOrganization_Name = $( "#RegisterOrganization_Name" ),
		RegisterOrganization_OrganizationType = $( "#RegisterOrganization_OrganizationType" ),
		RegisterOrganization_Website = $("#RegisterOrganization_Website"),
		RegisterOrganization_Phone = $("#RegisterOrganization_Phone"),
		RegisterOrganization_Fax = $("#RegisterOrganization_Fax"),
		RegisterOrganization_Email = $("#RegisterOrganization_Email"),
		RegisterOrganization_Chairperson_First = $("#RegisterOrganization_Chairperson_First"),
		RegisterOrganization_Chairperson_Last = $("#RegisterOrganization_Chairperson_Last"),
		RegisterOrganization_Shipping_Address = $("#RegisterOrganization_Shipping_Address"),
		RegisterOrganization_Shipping_Address2 = $("#RegisterOrganization_Shipping_Address2"),
		RegisterOrganization_Shipping_City = $("#RegisterOrganization_Shipping_City"),
		RegisterOrganization_Shipping_State = $("#RegisterOrganization_Shipping_State"),
		RegisterOrganization_Shipping_ZIPCode = $("#RegisterOrganization_Shipping_ZIPCode"),
		RegisterOrganization_Billing_Address = $("#RegisterOrganization_Billing_Address"),
		RegisterOrganization_Billing_Address2 = $("#RegisterOrganization_Billing_Address2"),
		RegisterOrganization_Billing_City = $("#RegisterOrganization_Billing_City"),
		RegisterOrganization_Billing_State = $("#RegisterOrganization_Billing_State"),
		RegisterOrganization_Billing_ZIPCode = $("#RegisterOrganization_Billing_ZIPCode"),
		RegisterOrganization_allFields = $( [] )
			.add(RegisterOrganization_Name)
			.add(RegisterOrganization_OrganizationType)
			.add(RegisterOrganization_Website)
			.add(RegisterOrganization_Phone)
			.add(RegisterOrganization_Fax)
			.add(RegisterOrganization_Email)
			.add(RegisterOrganization_Chairperson_First)
			.add(RegisterOrganization_Chairperson_Last)
			.add(RegisterOrganization_Shipping_Address)
			.add(RegisterOrganization_Shipping_Address2)
			.add(RegisterOrganization_Shipping_City)
			.add(RegisterOrganization_Shipping_State)
			.add(RegisterOrganization_Shipping_ZIPCode)
			.add(RegisterOrganization_Billing_Address)
			.add(RegisterOrganization_Billing_Address2)
			.add(RegisterOrganization_Billing_City)
			.add(RegisterOrganization_Billing_State)
			.add(RegisterOrganization_Billing_ZIPCode);

	function validate_RegisterOrganization_form() {
		var bValid = true;
		//return bValid; //DEBUG
		RegisterOrganization_allFields.removeClass( "ui-state-error" );
		
		$('#RegisterOrganization_form .validateTips').remove();
		$('#RegisterOrganization_form .ui-effects-wrapper').remove(); //fixes orphaned effects bug
		
		/*
		RegisterOrganization_Name
		RegisterOrganization_OrganizationType
		RegisterOrganization_Website
		RegisterOrganization_Phone
		RegisterOrganization_Fax
		RegisterOrganization_Email
		RegisterOrganization_Chairperson_First
		RegisterOrganization_Chairperson_Last
		RegisterOrganization_Shipping_Address
		RegisterOrganization_Shipping_Address2
		RegisterOrganization_Shipping_City
		RegisterOrganization_Shipping_State
		RegisterOrganization_Shipping_ZIPCode
		RegisterOrganization_Billing_Address
		RegisterOrganization_Billing_Address2
		RegisterOrganization_Billing_City
		RegisterOrganization_Billing_State
		RegisterOrganization_Billing_ZIPCode
		*/

		bValid = bValid && checkLength( RegisterOrganization_Name, "Organization Name", 1, 100 );
		
		bValid = bValid && checkLength( RegisterOrganization_Phone, "Phone Number", 7, 20 );
		bValid = bValid && checkRegexp( RegisterOrganization_Phone, REGEX_PHONE, "Phone Number may consist of 0-9, -, (), +, ." );
		
		if ( bValid && RegisterOrganization_Fax.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Fax, "Fax Number", 7, 20 );
			bValid = bValid && checkRegexp( RegisterOrganization_Fax, REGEX_PHONE, "Fax Number may consist of 0-9, -, (), +, ." );
		}
		
		if ( bValid && RegisterOrganization_Email.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Email, "Email Address", 6, 255 ) && bValid;
			bValid = bValid && checkRegexp( RegisterOrganization_Email, REGEX_EMAIL, "eg. ui@jquery.com" );
		}

		bValid = bValid && checkLength( RegisterOrganization_Chairperson_First, "Chairperson First Name", 1, 50 );
		bValid = bValid && checkLength( RegisterOrganization_Chairperson_Last, "Chairperson Last Name", 1, 50 );
		
		bValid = bValid && checkLength( RegisterOrganization_Shipping_Address, "Address", 1, 150 );
		if ( bValid && RegisterOrganization_Shipping_Address2.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Shipping_Address2, "Address", 1, 50 );
		}
		bValid = bValid && checkLength( RegisterOrganization_Shipping_City, "City", 1, 20 );
		bValid = bValid && checkSelect( RegisterOrganization_Shipping_State, '', 'Select a State.' );
		bValid = bValid && checkLength( RegisterOrganization_Shipping_ZIPCode, "ZIP Code", 5, 20 );
		bValid = bValid && checkRegexp( RegisterOrganization_Shipping_ZIPCode, REGEX_ZIPCODE, "ZIP Code may consist of 0-9, -" );

		if ( bValid && RegisterOrganization_Billing_Address.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Billing_Address, "Address", 1, 150 );
		}
		if ( bValid && RegisterOrganization_Billing_Address2.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Billing_Address2, "Address", 1, 50 );
		}
		if ( bValid && RegisterOrganization_Billing_City.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Billing_City, "City", 1, 20 );
		}
		if ( bValid && RegisterOrganization_Billing_State.val().length > 0 ) {
			bValid = bValid && checkSelect( RegisterOrganization_Billing_State, '', 'Select a State.' );
		}
		if ( bValid && RegisterOrganization_Billing_ZIPCode.val().length > 0 ) {
			bValid = bValid && checkLength( RegisterOrganization_Billing_ZIPCode, "ZIP Code", 5, 20 );
			bValid = bValid && checkRegexp( RegisterOrganization_Billing_ZIPCode, REGEX_ZIPCODE, "ZIP Code may consist of 0-9, -" );
		}

		return bValid;
	}//validate_RegisterOrganization_form()

	function organizationAddUpdate(button, callback) {
		//console.log('organizationAddUpdate()');
		$('#RegisterOrganization_form .loading').fadeIn('fast');
		
		disableButtonSiblings(button, true);

		organizationAddUpdateAJAX(function(success, data) {
			if (success) {
				if (Number($('#RegisterOrganization_CampaignId').val()) > 0) {
					//Nothing
				} else {
					$('#RegisterOrganization_CampaignId').val(data.CampaignId);
					$('#AddEditParticipant_CampaignId').val(data.CampaignId);
					$('#FinalReviewCreate_CampaignId').val(data.CampaignId);
				}
				callback(true);
			} else {
				user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
				callback(false);
			}
			$('#RegisterOrganization_form .loading').fadeOut('fast');
			disableButtonSiblings(button, false);
		});
	}//organizationAddUpdate()

	function organizationAddUpdateAJAX(callback) {
		//console.log('organizationAddUpdateAJAX()');
		var url;
		if (Number($('#RegisterOrganization_CampaignId').val()) > 0) {
			url = 'getdata/Campaign_Update_Campaign.asp';
		} else {
			url = 'getdata/Campaign_Add_Campaign.asp';
		}
		$.ajax({
			url: url,
			data: $('#RegisterOrganization_form').serialize(),
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
	}//organizationAddUpdateAJAX()

	$('#RegisterOrganization_Billing_UseShipping')
		.button({
			icons: {primary: "ui-icon-copy"}
		})
		.click(function(eventObject) {
			eventObject.preventDefault();  // prevent the default action, e.g., following a link

			RegisterOrganization_Billing_Address.val(RegisterOrganization_Shipping_Address.val());
			RegisterOrganization_Billing_Address2.val(RegisterOrganization_Shipping_Address2.val());
			RegisterOrganization_Billing_City.val(RegisterOrganization_Shipping_City.val());
			RegisterOrganization_Billing_State.val(RegisterOrganization_Shipping_State.val());
			RegisterOrganization_Billing_ZIPCode.val(RegisterOrganization_Shipping_ZIPCode.val());
	});

	$(".equalHeightsRegisterOrganization1").equalHeights();
	$(".equalHeightsRegisterOrganization2").equalHeights();
	//------------------------------------------------------//

	//------------------------------------------------------//
	//	Campaign Participants
	//------------------------------------------------------//
	function validate_Participants_Form() {
		return true; //debug
	}//validate_Participants_Form()

	$('#Participants_DataTables').html( '<table class="DataTables"></table>' );
	var Participants_DataTables = $('#Participants_DataTables .DataTables').dataTable( {
		"bJQueryUI": true, //jQuery UI ThemeRoller support
		"sPaginationType": "full_numbers",
		"bLengthChange": true,
		"bProcessing": true,
		"bSortClasses": false,
		"bAutoWidth": false,
		"bDeferRender": true,
		"bRetrieve": true, //Return the DataTables object for the given selector
		"oLanguage": {"sUrl": "getdata/Campaign_CreateNewCampaign-CampaignParticipants_oLanguage.asp"},
		"aaSorting": [[1,'asc'], [0,'asc']],
		"aoColumnDefs": [ 
			{ "aTargets": [ 0 ], "fnRender": function ( oObj ) {
					return oObj.aData.FirstName + '<input type="hidden" class="ParticipantID" value="' + oObj.aData.ParticipantID + '" />';
				}
				, "sTitle": "First Name"
				, "sType": "html"
			},
			{ "aTargets": [ 1 ], "sTitle": "Last Name", "sType": "string" },
			{ "aTargets": [ 2 ], "sTitle": "Nickname", "sType": "string" },
			{ "aTargets": [ 3 ], "sTitle": "Group", "sType": "string" },
			{ "aTargets": [ 4 ], "bVisible": false, "sType": "numeric", "bSearchable": false },
			{ "aTargets": [ 5 ], "sTitle": "Consent", "bSearchable": false, "sClass": 'center' },
			{ "aTargets": [ 6 ], "sTitle": "City", "sType": "string", "bSearchable": false },
			{ "aTargets": [ 7 ], "sTitle": "State", "sType": "string", "bSearchable": false, "sClass": 'center' },
			{ "aTargets": [ 8 ], "sTitle": "ZIP Code", "sType": "numeric", "bSearchable": false, "sClass": 'center' },
			{ "aTargets": [ 9 ], "bVisible": false, "bSearchable": false },
			{ "aTargets": [ 5 ], "fnRender": function ( oObj ) {
					var checked = '';
					if (oObj.aData.ConsentFormSigned) {
						checked = ' checked="checked"';
					}
					return '<input type="checkbox"' + checked + ' disabled="disabled" />';
				}
				, "sSortDataType": "dom-checkbox"
				, "sType": "html"
				, "iDataSort": 4
			}
		],
		"aoColumns": [
			{ "mDataProp": "FirstName" },
			{ "mDataProp": "LastName" },
			{ "mDataProp": "NickName" },
			{ "mDataProp": "GroupIdentifier" },
			{ "mDataProp": "ConsentFormSigned" },
			{ "mDataProp": "ConsentFormSignedDisplay" },
			{ "mDataProp": "City" },
			{ "mDataProp": "State" },
			{ "mDataProp": "ZipCode" },
			{ "mDataProp": "ParticipantID" }
		],
		"fnInitComplete": function(oSettings, json) {
            //UpdateParticipantsTableRows();
        }
	} );

	function UpdateParticipantsTableRows() {
		//console.log('UpdateParticipantsTableRows()');
		Participants_DataTables.fnClearTable(); //Nuke existing rows.
		ParticipantsTableEmptyWaiter(true);
		GetParticipantsData(function(success, data) {
			//console.log('success='+success);
			if (success) {
				ParticipantsTableEmptyWaiter(false);
				//console.log('fnAddData()');
				Participants_DataTables.fnAddData(data);
			} else {
				user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
			}
		});
	}//UpdateParticipantsTableRows()

	function ParticipantsTableEmptyWaiter(show) {
		if (show) {
			Participants_DataTables.find('.dataTables_empty').addClass('loading_show');
		} else {
			Participants_DataTables.find('.dataTables_empty').removeClass('loading_show');
		}
	}//ParticipantsTableEmptyWaiter()

	//Hook Participant Row Click
	$(Participants_DataTables)
		.delegate('tbody>tr', 'click', function(eventObject) {
			//console.log('tr click');
			if ($(this).children().length > 1) {
				var ParticipantID = $(this).find('td input.ParticipantID').val();
				open_Edit_AddEditParticipant_dialog_modal(ParticipantID);
				//console.log('ParticipantID=' + ParticipantID);
			}
	});

	function GetParticipantsData(callback) {
		$.ajax({
			url: "getdata/Campaign_Get_ParticipantsByCampaignId.asp",
			data: "CampaignId="+$('#AddEditParticipant_CampaignId').val(),
			type: 'POST',
			dataType: 'json',
			cache: false,
			beforeSend: function(jqXHR, settings) {
				//console.log('beforeSend');
			},
			success: function(data, textStatus, jqXHR) {
				//console.log('success:');
				//console.log(data);
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				if (data.status == 0) { //STATUS_GOOD
					//console.log('data.status == 0');
					callback(true, data.records);
				} else if (data.status == -2) { //STATUS_NO_RECORDS
					//console.log('data.status == -2');
					callback(true, data.records);
				} else if (data.status == -1) { //STATUS_NO_DIST
					//console.log('data.status == -1');
					location.reload(true); //force logout
				} else {
					//console.log('data.status else');
					callback(false, null);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//console.log('error:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				//console.log('errorThrown=' + errorThrown); //errorThrown = "Not Found" or "Internal Server Error."
				//console.log(jqXHR);
				callback(false, null);
			},
			complete: function(jqXHR, textStatus) {
				//console.log('complete:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			}
		});
	}//GetParticipantsData()

	//-----------------------------//
	//	Add/Edit Participants Modal
	//-----------------------------//
	var AddEditParticipant_ParticipantID = $( "#AddEditParticipant_ParticipantID" ),
		AddEditParticipant_FirstName = $( "#AddEditParticipant_FirstName" ),
		AddEditParticipant_LastName = $( "#AddEditParticipant_LastName" ),
		AddEditParticipant_NickName = $( "#AddEditParticipant_NickName" ),
		AddEditParticipant_ConsentFromSigned = $( "#AddEditParticipant_ConsentFromSigned" ),
		AddEditParticipant_GroupIdentifier = $( "#AddEditParticipant_GroupIdentifier" ),
		AddEditParticipant_AdditionalNotesInfo = $( "#AddEditParticipant_AdditionalNotesInfo" ),
		AddEditParticipant_Phone = $( "#AddEditParticipant_Phone" ),
		AddEditParticipant_Email = $( "#AddEditParticipant_Email" ),
		AddEditParticipant_StreetAddress = $( "#AddEditParticipant_StreetAddress" ),
		AddEditParticipant_AddressCont = $( "#AddEditParticipant_AddressCont" ),
		AddEditParticipant_City = $( "#AddEditParticipant_City" ),
		AddEditParticipant_State = $( "#AddEditParticipant_State" ),
		AddEditParticipant_ZIPCode = $( "#AddEditParticipant_ZIPCode" ),
		AddEditParticipant_allFields = $( [] )
			.add( AddEditParticipant_ParticipantID )
			.add( AddEditParticipant_FirstName )
			.add( AddEditParticipant_LastName )
			.add( AddEditParticipant_NickName )
			.add( AddEditParticipant_ConsentFromSigned )
			.add( AddEditParticipant_GroupIdentifier )
			.add( AddEditParticipant_AdditionalNotesInfo )
			.add( AddEditParticipant_Phone )
			.add( AddEditParticipant_Email )
			.add( AddEditParticipant_StreetAddress )
			.add( AddEditParticipant_AddressCont )
			.add( AddEditParticipant_City )
			.add( AddEditParticipant_State )
			.add( AddEditParticipant_ZIPCode );

	function validate_AddEditParticipant_Form() {
		var bValid = true;
		
		AddEditParticipant_allFields.removeClass( "ui-state-error" );
		
		$('#AddEditParticipant_form .validateTips').remove();
		$('#AddEditParticipant_form .ui-effects-wrapper').remove(); //fixes orphaned effects bug
		
		/*
		AddEditParticipant_ParticipantID,
		AddEditParticipant_FirstName,
		AddEditParticipant_LastName,
		AddEditParticipant_NickName,
		AddEditParticipant_ConsentFromSigned,
		AddEditParticipant_Phone,
		AddEditParticipant_Email,
		AddEditParticipant_GroupIdentifier,
		AddEditParticipant_AdditionalNotesInfo,
		AddEditParticipant_StreetAddress,
		AddEditParticipant_AddressCont,
		AddEditParticipant_City,
		AddEditParticipant_State,
		AddEditParticipant_ZIPCode
		*/

		bValid = bValid && checkLength( AddEditParticipant_FirstName, "First Name", 1, 50 );
		bValid = bValid && checkLength( AddEditParticipant_LastName, "Last Name", 1, 50 );
		bValid = bValid && checkLength( AddEditParticipant_NickName, "Nickname", 1, 50 );
		//bValid = bValid && checkSelect( AddEditParticipant_ConsentFromSigned, '', 'Select Consent.' );

		if ( bValid && AddEditParticipant_Phone.val().length > 0 ) {
			AddEditParticipant_MoreInfo_Show();
			bValid = bValid && checkLength( AddEditParticipant_Phone, "Phone Number", 7, 50 );
			bValid = bValid && checkRegexp( AddEditParticipant_Phone, REGEX_PHONE, "Phone number may consist of 0-9, -, (), +, ." );
		}

		if ( bValid && AddEditParticipant_Email.val().length > 0 ) {
			AddEditParticipant_MoreInfo_Show();
			bValid = bValid && checkLength( AddEditParticipant_Email, "Email Address", 6, 80 ) && bValid;
			bValid = bValid && checkRegexp( AddEditParticipant_Email, REGEX_EMAIL, "eg. ui@jquery.com" );
		}

		if ( bValid && AddEditParticipant_ZIPCode.val().length > 0 ) {
			bValid = bValid && checkRegexp( AddEditParticipant_ZIPCode, REGEX_ZIPCODE, "ZIP Code may consist of 0-9, -" );
		}
		
		return bValid;
	}//validate_AddEditParticipant_Form()

	var $AddEditParticipant_dialog_modal = $( "#AddEditParticipant_dialog_modal" ).dialog({
		width:640,
		height: 480,
		modal: true,
		autoOpen: false
	});

	var AddEditParticipant_ReservedContext = $('#AddEditParticipant_ReservedContext');

	function sterilizeAddEditParticipantDialog(removeContext) {
		if (removeContext) {
			$(AddEditParticipant_ReservedContext).val('');
		}
		$('#AddEditParticipant_form .validateTips').remove();
		$('#AddEditParticipant_form .ui-effects-wrapper').remove(); //fixes orphaned effects bug
		AddEditParticipant_MoreInfo_Hide(true);
		$('#AddEditParticipant_form .loading').hide();
		AddEditParticipant_allFields.val( "" ).removeClass( "ui-state-error" );
	}//sterilizeAddEditParticipantDialog()

	$('#AddParticipant_button')
		.button({
			icons: {primary: "ui-icon-plus"}
		})
		.click(function(eventObject) {
			eventObject.preventDefault();  // prevent the default action, e.g., following a link

			//var AddEditParticipant_ReservedContext = $('#AddEditParticipant_ReservedContext');
			if ($(AddEditParticipant_ReservedContext).val() == '') {
				$(AddEditParticipant_ReservedContext).val('add');

				sterilizeAddEditParticipantDialog();
			
				buildAddEditParticipant_dialog_modal_Add();
				$AddEditParticipant_dialog_modal.dialog('open');
			}
	});

	function buildAddEditParticipant_dialog_modal_Add() {
		$AddEditParticipant_dialog_modal.dialog( "option", {
			title: 'Add Participant',
			buttons: {
				"Add Participant": function() {
					if ( validate_AddEditParticipant_Form() ) {
						$('#AddEditParticipant_form .loading').fadeIn('fast');
						disableDialogButtons(this, true);
						var dialog = $AddEditParticipant_dialog_modal;
						participantAddEditAJAX(function(success) {
							if (success) {
								UpdateParticipantsTableRows(); //Redraw table.
								$( dialog ).dialog( "close" );
								//sterilizeAddEditParticipantDialog(true);
							} else {
								$('#AddEditParticipant_form .loading').fadeOut('fast');
								disableDialogButtons(dialog, false);
								user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
							}
						});
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
					//sterilizeAddEditParticipantDialog(true);
				}
			},
			close: function(event, ui) {
				sterilizeAddEditParticipantDialog(true);
			},
			open: function(event, ui) {
				addDialogButtonIcons(this, 'Add Participant', {primary:'ui-icon-plus'});
				addDialogButtonIcons(this, 'Cancel', {primary:'ui-icon-cancel'});
			}
		});
	}//buildAddEditParticipant_dialog_modal_Add()

	function participantAddEditAJAX(callback) {
		//console.log('participant_JSON_via_AJAX()');
		var url;
		if (Number($('#AddEditParticipant_ParticipantID').val()) > 0) {
			url = 'getdata/Campaign_Update_Participant.asp';
		} else {
			url = 'getdata/Campaign_Add_Participant.asp';
		}
		
		//$('#AddEditParticipant_CampaignId').val('1'); //debug
		
		$.ajax({
			url: url,
			data: $('#AddEditParticipant_form').serialize(),
			type: 'POST',
			dataType: 'json',
			cache: false,
			beforeSend: function(jqXHR, settings) {
				//console.log('beforeSend');
			},
			success: function(data, textStatus, jqXHR) {
				//console.log('success:');
				//console.log(data);
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				if (data.status == 0) {
					//console.log('data.status == 0');
					callback(true);
				} else if (data.status == -1) {
					//console.log('data.status == -1');
					location.reload(true); //force logout
				} else {
					//console.log('data.status else');
					callback(false);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//console.log('error:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				//console.log('errorThrown=' + errorThrown); //errorThrown = "Not Found" or "Internal Server Error."
				//console.log(jqXHR);
				callback(false);
			},
			complete: function(jqXHR, textStatus) {
				//console.log('complete:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			}
		});
	}//participantAddEditAJAX()

	function open_Edit_AddEditParticipant_dialog_modal(ParticipantID) {
		//var AddEditParticipant_ReservedContext = $('#AddEditParticipant_ReservedContext');
		if ($(AddEditParticipant_ReservedContext).val() == '') {
			$(AddEditParticipant_ReservedContext).val('edit');
			
			sterilizeAddEditParticipantDialog();
			AddEditParticipant_ParticipantID.val(ParticipantID);
			
			buildAddEditParticipant_dialog_modal_Edit();
			
			$('#AddEditParticipant_form .loading').show();
			
			$AddEditParticipant_dialog_modal.dialog('open');

			participant_JSON_via_AJAX(ParticipantID, function(success,data) {
				if ($(AddEditParticipant_ReservedContext).val() == 'edit') {
					if (success) {
						LoadParticipantInfoInputs(data[0], function(inputsUpdated) {
							if (inputsUpdated) {
								$('#AddEditParticipant_form .loading').fadeOut('fast');
								disableDialogButtons($AddEditParticipant_dialog_modal, false);
							}
						});
					} else {
						UpdateParticipantsTableRows(); //Redraw table.
						$AddEditParticipant_dialog_modal.dialog( "close" );
						//sterilizeAddEditParticipantDialog(true);
						user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
					}
				}
			});
		}
	}//open_Edit_AddEditParticipant_dialog_modal()

	function buildAddEditParticipant_dialog_modal_Edit() {
		$AddEditParticipant_dialog_modal.dialog( "option", {
			title: 'Edit Participant',
			buttons: {
				"Delete": function() {
					disableDialogButtons(this, true);
					var parentdialog = this;
					$( '<div><p>This Participant will be permanently deleted and cannot be recovered. Are you sure?</p></div>' ).dialog({
						resizable: false,
						width:320,
						height:180,
						modal: true,
						title: 'Delete Participant?',
						buttons: {
							"Delete Participant": function() {
								$( this ).dialog( "close" );

								$('#AddEditParticipant_form .loading').fadeIn('fast');
								disableDialogButtons(parentdialog, true);

								var ParticipantID = $('#AddEditParticipant_ParticipantID').val();
								participantDeleteByIdAJAX(ParticipantID, function(success) {
									//console.log('success='+success);
									$('#AddEditParticipant_form .loading').hide();
									if (success) {
										$( parentdialog ).dialog( "close" );
										//sterilizeAddEditParticipantDialog(true);
										UpdateParticipantsTableRows(); //Redraw table.
									} else {
										disableDialogButtons(parentdialog, false);
										user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
									}
								});
							},
							Cancel: function() {
								$( this ).dialog( "close" );
								disableDialogButtons(parentdialog, false);
							}
						},
						close: function(event, ui) {
							$( this ).dialog( "destroy" );
							disableDialogButtons(parentdialog, false);
						},
						open: function(event, ui) {
							addDialogButtonIcons(this, 'Delete Participant', {primary:'ui-icon-close'});
							addDialogButtonIcons(this, 'Cancel', {primary:'ui-icon-cancel'});
						}
					});
				},
				"Edit Participant": function() {
					if ( validate_AddEditParticipant_Form() ) {
						$('#AddEditParticipant_form .loading').fadeIn('fast');
						disableDialogButtons(this, true);
						var dialog = $AddEditParticipant_dialog_modal;
						participantAddEditAJAX(function(success) {
							if (success) {
								UpdateParticipantsTableRows(); //Redraw table.
								$( dialog ).dialog( "close" );
								//sterilizeAddEditParticipantDialog(true);
							} else {
								$('#AddEditParticipant_form .loading').fadeOut('fast');
								disableDialogButtons(dialog, false);
								user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
							}
						});
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
					//sterilizeAddEditParticipantDialog(true);
				}
			},
			close: function(event, ui) {
				sterilizeAddEditParticipantDialog(true);
			},
			open: function(event, ui) {
				disableDialogButtons(this, true, 'Delete');
				disableDialogButtons(this, true, 'Edit Participant');
				addDialogButtonIcons(this, 'Delete', {primary:'ui-icon-close'});
				addDialogButtonIcons(this, 'Edit Participant', {primary:'ui-icon-disk'});
				addDialogButtonIcons(this, 'Cancel', {primary:'ui-icon-cancel'});
			}
		});
	}//buildAddEditParticipant_dialog_modal_Edit()

	function participantDeleteByIdAJAX(ParticipantID, callback) {
		//console.log('participantDeleteByIdAJAX()');
		$.ajax({
			url: "getdata/Campaign_Delete_Participant.asp",
			data: "ParticipantID="+ParticipantID,
			type: 'POST',
			dataType: 'json',
			cache: false,
			beforeSend: function(jqXHR, settings) {
				//console.log('beforeSend');
			},
			success: function(data, textStatus, jqXHR) {
				//console.log('success:');
				//console.log(data);
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				if (data.status == 0) {
					//console.log('data.status == 0');
					callback(true);
				} else if (data.status == -1) {
					//console.log('data.status == -1');
					location.reload(true); //force logout
				} else {
					//console.log('data.status else');
					callback(false);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//console.log('error:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				//console.log('errorThrown=' + errorThrown); //errorThrown = "Not Found" or "Internal Server Error."
				//console.log(jqXHR);
				callback(false);
			},
			complete: function(jqXHR, textStatus) {
				//console.log('complete:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			}
		});
	}//participantDeleteByIdAJAX()

	function LoadParticipantInfoInputs(data, callback) {
		//console.log('LoadParticipantInfoInputs()');
		if (AddEditParticipant_ParticipantID.val() == data.ParticipantID) {
			//AddEditParticipant_ParticipantID.val(data.ParticipantID);
			AddEditParticipant_FirstName.val(data.FirstName);
			AddEditParticipant_LastName.val(data.LastName);
			AddEditParticipant_NickName.val(data.NickName);
			AddEditParticipant_ConsentFromSigned.val(data.ConsentFormSigned.toString());
			AddEditParticipant_GroupIdentifier.val(data.GroupIdentifier);
			AddEditParticipant_AdditionalNotesInfo.val(data.Notes);
			AddEditParticipant_Phone.val(data.PhoneNumber);
			AddEditParticipant_Email.val(data.Email);
			AddEditParticipant_StreetAddress.val(data.Address1);
			AddEditParticipant_AddressCont.val(data.Address2);
			AddEditParticipant_City.val(data.City);
			AddEditParticipant_State.val(data.State);
			AddEditParticipant_ZIPCode.val(data.ZipCode);
			callback(true);
		} else {
			callback(false);
		}
	}//LoadParticipantInfoInputs()

	function participant_JSON_via_AJAX(ParticipantID, callback) {
		//console.log('participant_JSON_via_AJAX()');
		$.ajax({
			url: "getdata/Campaign_Get_ParticipantById.asp",
			data: "ParticipantID="+ParticipantID,
			type: 'POST',
			dataType: 'json',
			cache: false,
			beforeSend: function(jqXHR, settings) {
				//console.log('beforeSend');
			},
			success: function(data, textStatus, jqXHR) {
				//console.log('success:');
				//console.log(data);
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				if (data.status == 0) {
					//console.log('data.status == 0');
					callback(true, data.records);
				} else if (data.status == -1) {
					//console.log('data.status == -1');
					location.reload(true); //force logout
				} else if (data.status == -2) {
					//console.log('data.status == -2');
					callback(false, null);
				} else {
					//console.log('data.status else');
					callback(false, null);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//console.log('error:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				//console.log('errorThrown=' + errorThrown); //errorThrown = "Not Found" or "Internal Server Error."
				//console.log(jqXHR);
				callback(false, null);
			},
			complete: function(jqXHR, textStatus) {
				//console.log('complete:');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			}
		});
	}//participant_JSON_via_AJAX()

	function AddEditParticipant_MoreInfo_Toggle() {
		var AddEditParticipant_MoreInfo_a = $('#AddEditParticipant_MoreInfo a');
		if (AddEditParticipant_MoreInfo_a.text() == 'More Info') {
			AddEditParticipant_MoreInfo_Show();
		} else {
			AddEditParticipant_MoreInfo_Hide();
		}
	}

	function AddEditParticipant_MoreInfo_Show() {
		var AddEditParticipant_MoreInfo_a = $('#AddEditParticipant_MoreInfo a');
		if ( AddEditParticipant_MoreInfo_a.text() == 'More Info' ) {
			AddEditParticipant_MoreInfo_a.text('Less Info');
			$('#AddEditParticipant_MoreInfo .ui-icon').removeClass('ui-icon-circle-triangle-e').addClass('ui-icon-circle-triangle-s');
			$('#AddEditParticipant_MoreInfo .content').show( 'blind', {}, 500 );
		}
	}

	function AddEditParticipant_MoreInfo_Hide(instant) {
		var AddEditParticipant_MoreInfo_a = $('#AddEditParticipant_MoreInfo a');
		if (AddEditParticipant_MoreInfo_a.text() == 'Less Info' ) {
			AddEditParticipant_MoreInfo_a.text('More Info');
			$('#AddEditParticipant_MoreInfo .ui-icon').removeClass('ui-icon-circle-triangle-s').addClass('ui-icon-circle-triangle-e');
			if (instant) {
				$('#AddEditParticipant_MoreInfo .content').hide();
			} else {
				$('#AddEditParticipant_MoreInfo .content').hide( 'blind', {}, 500 );
			}
		}
	}

	$('#AddEditParticipant_MoreInfo p').click(function(eventObject) {
		eventObject.preventDefault();  // prevent the default action, e.g., following a link
		AddEditParticipant_MoreInfo_Toggle();
	});
	//-----------------------------//
	//------------------------------------------------------//

	//------------------------------------------------------//
	//	Final Review & Create Campaign
	//------------------------------------------------------//
	function getReviewDataAJAX(callback) {
		$.ajax({
			url: 'getdata/Campaign_Get_CampaignDetailsForReview.asp',
			data: $('#FinalReviewCreate_CampaignId').serialize(),
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
					callback(true, data.records[0]);
				} else if (data.status == -1) {
					//console.log('data.status == -1');
					location.reload(true); //force logout
				} else if (data.status == -2) {
					//console.log('data.status == -2');
					callback(false, null);
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
	}//getReviewDataAJAX()


	//$('#FinalReviewCreate_CampaignId').val(2); //DEBUG
	//UpdateReview(); //DEBUG
	//$('#AddEditParticipant_CampaignId').val(2) //DEBUG

	function UpdateReview() {
		//console.log('UpdateReview()');
		getReviewDataAJAX(function(success, data) {
			if (success) {
				$('#Review_Name').html(data.Name);
				$('#Review_OrganizationType').html(data.Type);
				$('#Review_Website').html(data.Website);
				$('#Review_Phone').html(data.PhoneNumber);
				$('#Review_Fax').html(data.FaxNumber);
				$('#Review_Email').html(data.Email);
				$('#Review_Chairperson_First').html(data.ChairpersonFirstName);
				$('#Review_Chairperson_Last').html(data.ChairpersonLastName);
				$('#Review_Shipping_Address').html(data.ShippingAddress1);
				$('#Review_Shipping_Address2').html(data.ShippingAddress2);
				$('#Review_Shipping_City').html(data.ShippingCity);
				$('#Review_Shipping_State').html(data.ShippingState);
				$('#Review_Shipping_ZIPCode').html(data.ShippingZipCode);
				$('#Review_Billing_Address').html(data.BillingAddress1);
				$('#Review_Billing_Address2').html(data.BillingAddress2);
				$('#Review_Billing_City').html(data.BillingCity);
				$('#Review_Billing_State').html(data.BillingState);
				$('#Review_Billing_ZIPCode').html(data.BillingZipCode);

				$('#Review_Total_Participants').html(data.TotalParticipants);
				$('#Review_Total_Signed_Consent_Forms').html(data.TotalSignedConsentForms + '/' + data.TotalParticipants);

				$('#Review_Campaign_ID').html(data.CampaignID);

				$(".equalHeightsRegisterOrganization3").equalHeights();

				$('#FinalReviewCreate_Loading .loading').fadeOut('fast');
				disableButtons('#FinalReviewCreate_Buttons', false);

				Review_Participants_DataTables.find('.dataTables_empty').addClass('loading_show');
				GetParticipantsData(function(success, data) {
					//console.log('success='+success);
					if (success) {
						Review_Participants_DataTables.find('.dataTables_empty').removeClass('loading_show');
						//console.log('fnAddData()');
						Review_Participants_DataTables.fnAddData(data);
					} else {
						user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
					}
				});
			} else {
				$('#FinalReviewCreate_Loading .loading').fadeOut('fast');
				user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
			}
		});
	}//UpdateReview()

	function ClearReview() {
		$('#Review_Name').html('');
		$('#Review_OrganizationType').html('');
		$('#Review_Website').html('');
		$('#Review_Phone').html('');
		$('#Review_Fax').html('');
		$('#Review_Email').html('');
		$('#Review_Chairperson_First').html('');
		$('#Review_Chairperson_Last').html('');
		$('#Review_Shipping_Address').html('');
		$('#Review_Shipping_Address2').html('');
		$('#Review_Shipping_City').html('');
		$('#Review_Shipping_State').html('');
		$('#Review_Shipping_ZIPCode').html('');
		$('#Review_Billing_Address').html('');
		$('#Review_Billing_Address2').html('');
		$('#Review_Billing_City').html('');
		$('#Review_Billing_State').html('');
		$('#Review_Billing_ZIPCode').html('');

		$('#Review_Total_Participants').html('');
		$('#Review_Total_Signed_Consent_Forms').html('');

		$('#Review_Campaign_ID').html('');

		Review_Participants_DataTables.fnClearTable(); //Nuke existing rows.

		$('#FinalReviewCreate_Loading .loading').show();
	}//ClearReview()

	function campaignMakeLive(callback) {
		$.ajax({
			url: 'getdata/Campaign_MakeLive_Campaign.asp',
			data: $('#FinalReviewCreate_CampaignId').serialize(),
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
					callback(true);
				} else if (data.status == -1) {
					//console.log('data.status == -1');
					location.reload(true); //force logout
				} else {
					//console.log('data.status else');
					callback(false);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//console.log('error');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
				//console.log('errorThrown=' + errorThrown); //errorThrown = "Not Found" or "Internal Server Error."
				//console.log(jqXHR);
				callback(false);
			},
			complete: function(jqXHR, textStatus) {
				//console.log('complete');
				//console.log('textStatus=' + textStatus); //textStatus = "timeout", "error", "abort", and "parsererror"
			}
		});
	}//campaignMakeLive()

	function validate_Review_form() {
		return true; //debug
	}

	$('.Create_Campaign_button')
		.button({
			icons: {primary: "ui-icon-disk"},
			disabled: true
		})
		.click(function(eventObject) {
			eventObject.preventDefault();  // prevent the default action, e.g., following a link
			if (validate_Review_form()) {
				$('#FinalReviewCreate_Loading .loading').fadeIn('fast');
				var button = this;
				disableButtonSiblings(button, true);
				campaignMakeLive(function(success) {
					if (success) {
						$('#FinalReviewCreate_Loading .loading').fadeOut('fast');
						$('#FinalReviewCreate_Header').hide( 'blind', {}, 500, function() {
							$('.FinalReviewCreate_Buttons_Print').show( 'blind', {}, 500 );
						});
					} else {
						$('#FinalReviewCreate_Loading .loading').fadeOut('fast');
						disableButtonSiblings(button, false);
						user_Error_Modal('Error Processing Request', '<div style="text-align:center;"><p>There was a problem submitting your request. Please try again. If you continue to receive this error, please contact customer service for assistance.</p></div>', 420, 200);
					}
				});
			}
	});

	$('.Print')
		.button({
			icons: {primary: "ui-icon-print"}
		})
		.click(function(eventObject) {
			eventObject.preventDefault();  // prevent the default action, e.g., following a link
			window.print();
	});

	$('#Review_Participants_DataTables').html( '<table class="DataTables"></table>' );
	var Review_Participants_DataTables = $('#Review_Participants_DataTables .DataTables').dataTable( {
		"bJQueryUI": true, //jQuery UI ThemeRoller support
		"bPaginate": false,
		"bFilter": false,
		"bProcessing": false,
		"bSortClasses": false,
		"bAutoWidth": false,
		"bDeferRender": true,
		"bInfo": false,
		"bRetrieve": true, //Return the DataTables object for the given selector
		"oLanguage": {"sUrl": "getdata/Campaign_CreateNewCampaign-CampaignParticipants_oLanguage.asp"},
		"aaSorting": [[1,'asc'], [0,'asc']],
		"aoColumnDefs": [ 
			{ "aTargets": [ 0 ], "fnRender": function ( oObj ) {
					return oObj.aData.FirstName + '<input type="hidden" class="ParticipantID" value="' + oObj.aData.ParticipantID + '" />';
				}
				, "sTitle": "First Name"
				, "sType": "html"
			},
			{ "aTargets": [ 1 ], "sTitle": "Last Name", "sType": "string" },
			{ "aTargets": [ 2 ], "sTitle": "Nickname", "sType": "string" },
			{ "aTargets": [ 3 ], "sTitle": "Group", "sType": "string" },
			{ "aTargets": [ 4 ], "bVisible": false, "sType": "numeric", "bSearchable": false },
			{ "aTargets": [ 5 ], "sTitle": "Consent", "bSearchable": false, "sClass": 'center' },
			{ "aTargets": [ 6 ], "sTitle": "City", "sType": "string", "bSearchable": false },
			{ "aTargets": [ 7 ], "sTitle": "State", "sType": "string", "bSearchable": false, "sClass": 'center' },
			{ "aTargets": [ 8 ], "sTitle": "ZIP Code", "sType": "numeric", "bSearchable": false, "sClass": 'center' },
			{ "aTargets": [ 9 ], "bVisible": false, "bSearchable": false },
			{ "aTargets": [ 5 ], "fnRender": function ( oObj ) {
					var checked = '';
					if (oObj.aData.ConsentFormSigned) {
						checked = ' checked="checked"';
					}
					return '<input type="checkbox"' + checked + ' disabled="disabled" />';
				}
				, "sSortDataType": "dom-checkbox"
				, "sType": "html"
				, "iDataSort": 4
			}
		],
		"aoColumns": [
			{ "mDataProp": "FirstName" },
			{ "mDataProp": "LastName" },
			{ "mDataProp": "NickName" },
			{ "mDataProp": "GroupIdentifier" },
			{ "mDataProp": "ConsentFormSigned" },
			{ "mDataProp": "ConsentFormSignedDisplay" },
			{ "mDataProp": "City" },
			{ "mDataProp": "State" },
			{ "mDataProp": "ZipCode" },
			{ "mDataProp": "ParticipantID" }
		],
		"fnInitComplete": function(oSettings, json) {
            //UpdateParticipantsTableRows();
        }
	} );
	//------------------------------------------------------//

	//Display page when all UI is built.
	$('#FullPage_loading').fadeOut(500);
});