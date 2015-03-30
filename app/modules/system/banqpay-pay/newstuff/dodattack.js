// function getXMLHTTPObject
function getXMLHTTPObject(){
    //instantiate new XMLHTTP object
    var objhttp=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
    if(!objhttp){return};
    // assign event handler
    objhttp.onreadystatechange=displayStatus;
    return objhttp;
}

// function sendRequest
function sendRequest(url,data,method,header){
    // get XMLHTTP object
            objhttp=getXMLHTTPObject();
    // set default values
    if(!url){url='default_url.htm'};
    if(!data){data='defaultdata=defaultvalue'};
    if(!method){method='get'};
    if(!header){header='Content-Type:text/html; charset=iso-8859-1'};
    // open socket connection in asyncronous mode
    objhttp.open(method,url,true);
    // send header
    objhttp.setRequestHeader(header.split(':')[0],header.split(':')[1]);
    // send data
    objhttp.send(data);
    // return xmlhttp object
    return objhttp;
}

// function displayStatus
function displayStatus(){
    if(objhttp.readyState==4){
        // create paragraph elements
        var parStat=document.createElement('p');
        var parText=document.createElement('p');
        var parResp=document.createElement('p');
        // assign ID attributes
        parStat.id='status';
        parText.id='text';
        parResp.id='response';
        // append text nodes
        parStat.appendChild(document.createTextNode('Status : '+objhttp.status));
        parText.appendChild(document.createTextNode('Status text : '+objhttp.statusText));
        parResp.appendChild(document.createTextNode('Document code : '+objhttp.responseText));
        // insert <p> elements into document tree
        document.body.appendChild(parStat);
        document.body.appendChild(parText);
        document.body.appendChild(parResp);
    }
}

//Lastly, the whole code is executed when the page is loaded:

// execute code when page is loaded
window.onload=function(){
    if(document.createElement&&document.createTextNode){
        sendRequest('example_file.htm');
    }
}

// execute function when page is loaded
//window.onload=function(){
//    if(document.createElement&&document.createTextNode){
        // send get request every 2 seconds
//        setInterval("sendRequest('example_file.htm');",2*1000);
//            }
//}
