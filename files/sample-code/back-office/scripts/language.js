function languageMenuToggle() {
	alert('languageMenuToggle()');
}//languageMenuToggle()

function languageMenuOpen() {
	alert('languageMenuOpen()');
}//languageMenuOpen()

function languageDDLSelection(lLanguageIDCurrent) {
	//alert('languageDDLSelection()');
	
	//Get selected DDL value	
	var oLanguageSelector = document.getElementById('selLanguageSelector');
	var lLanguageID = oLanguageSelector.options[oLanguageSelector.selectedIndex].value;
	//alert(lLanguageID);
	
	//Check if current language is different then selected
	if (lLanguageID != lLanguageIDCurrent) {
		changeLanguage(lLanguageID)
	}
}//languageDDLSelection()

function changeLanguage(lLanguageID) {
	//alert('changeLanguage()');
	
	//Use AJAX to call an asp page to set new language value
	//alert('AJAX CALL');
	var xmlhttpLang = getXmlHttp();
	xmlhttpLang.open('GET', '/shared_libs/dp_language_selection.asp?lid=' + lLanguageID, true);
	xmlhttpLang.onreadystatechange = function() {
		if (xmlhttpLang.readyState == 4) {
			if (xmlhttpLang.status == 200) {
				if (xmlhttpLang.responseText == 'success') {
					//Reload page form the server
					//alert("Reload page");
					window.location.reload(true);				
				}
			}
		}
	}
	//xmlhttpLang.setrequestheader('CLIENTAUTHKEY',clientauthkey);
	xmlhttpLang.send(null);
}//changeLanguage()