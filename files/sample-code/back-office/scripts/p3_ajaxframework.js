function getXmlHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function getUrl(url, cb, clientauthkey) {
    var xmlhttp = getXmlHttp();
    xmlhttp.open("GET", url);
    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        cb(xmlhttp.status, 
            xmlhttp.getAllResponseHeaders(), 
            xmlhttp.responseText);
        }
    }
    xmlhttp.setrequestheader('CLIENTAUTHKEY',clientauthkey);
    xmlhttp.send(null);
}