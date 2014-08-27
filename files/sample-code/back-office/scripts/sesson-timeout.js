//iSessionTimeoutAlert and iSessionLogout are setup in parent ASP file.

setTimeout('sessionTimeoutAlert()', iSessionTimeoutAlert);
//setTimeout('sessionTimeoutLogout()', iSessionLogout);

function sessionTimeoutAlert() {
	if (confirm(sSessionTimeoutMessage)) {
		sessionTimeoutKeepAlive();
	} else {
		sessionTimeoutLogout();
	}
}

function sessionTimeoutLogout() {
	location.href = '/logout.asp';
}

function sessionTimeoutKeepAlive() {
	location.reload();
}