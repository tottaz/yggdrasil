function sitemapGenerate(SitemapFrequency, SitemapModification, SitemapPriority,SitemapNew) {
	xml=buildXmlHttp();
	xml.onreadystatechange=function() {
		if(xml.readyState==4) {
			if(xml.responseText != 'finish') {
				document.getElementById('sitemap').innerHTML=xml.responseText;
				xml.open('GET','index.php?option=com_tbearseo&task=sitemapGenerate&controller=sitemap&SitemapFrequency=' + SitemapFrequency + '&SitemapModification=' + SitemapModification + '&SitemapPriority=' + SitemapPriority + '&randomTime=' + Math.random(), true);
				xml.send(null);
			} else {
				document.location.reload();
			}
		}
    }
	xml.open('GET','index.php?option=com_tbearseo&task=sitemapGenerate&controller=sitemap&SitemapFrequency=' + SitemapFrequency + '&SitemapModification=' + SitemapModification + '&SitemapPriority=' + SitemapPriority + '&SitemapNew=' + SitemapNew + '&randomTime=' + Math.random(), true);
	xml.send(null);
}

function refreshKeyword(root,cid) {
	xml=buildXmlHttp();
	xml.onreadystatechange=function() {
		if(xml.readyState==4) {
			params = unserialize(xml.responseText);
			if(params['position']>100) params['position'] = '&gt; 100';
			document.getElementById('KeywordId' + cid).innerHTML=params['position'];
			document.getElementById('DateKeywordId' + cid).innerHTML=params['date_refreshed'];
			document.getElementById('KeywordId' + cid).className = params['color'];
		}
    }
	xml.open('GET','index.php?option=com_tbearseo&task=refreshkeyword&controller=keywords&cid=' + cid + '&randomTime=' + Math.random(), true);
	xml.send(null);
	
	document.getElementById('KeywordId' + cid).innerHTML='...';
	document.getElementById('DateKeywordId' + cid).innerHTML='...';
	document.getElementById('KeywordId' + cid).className = 'colornone';
}

function refreshCompetitor(root,cid) {
	xml=buildXmlHttp();
	xml.onreadystatechange=function() {
		if(xml.readyState==4) {
		    params=xml.responseText;
			params = params.split("\n");
			
			document.getElementById('PageRankId' + cid).innerHTML=params[0];
			document.getElementById('PageAlexaRankId' + cid).innerHTML=params[1];
			document.getElementById('PageTehnoratiRankId' + cid).innerHTML=params[2];
			document.getElementById('GooglePagesId' + cid).innerHTML=params[3];
			document.getElementById('YahooPagesId' + cid).innerHTML=params[4];
			document.getElementById('BingPagesId' + cid).innerHTML=params[5];
			document.getElementById('GoogleBacklinksId' + cid).innerHTML=params[6];
			document.getElementById('YahooBacklinksId' + cid).innerHTML=params[7];
			document.getElementById('BingBacklinksId' + cid).innerHTML=params[8];
			document.getElementById('DateCompetitorId' + cid).innerHTML=params[9];
			
			document.getElementById('PageRankId' + cid).className=params[10];
			document.getElementById('PageAlexaRankId' + cid).className=params[11];
			document.getElementById('GooglePagesId' + cid).className=params[12];
			document.getElementById('YahooPagesId' + cid).className=params[13];
			document.getElementById('BingPagesId' + cid).className=params[14];
			document.getElementById('GoogleBacklinksId' + cid).className=params[15];
			document.getElementById('YahooBacklinksId' + cid).className=params[16];
			document.getElementById('BingBacklinksId' + cid).className=params[17];
			document.getElementById('PageTehnoratiRankId' + cid).className=params[18];
		}
    }
	
	xml.open('GET','index.php?option=com_tbearseo&task=refreshCompetitor&controller=competitors&cid=' + cid + '&randomTime=' + Math.random(), true);
	xml.send(null);
	
	document.getElementById('PageRankId' + cid).innerHTML='...';
	document.getElementById('PageAlexaRankId' + cid).innerHTML='...';
	document.getElementById('GooglePagesId' + cid).innerHTML='...';
	document.getElementById('YahooPagesId' + cid).innerHTML='...';
	document.getElementById('BingPagesId' + cid).innerHTML='...';
	document.getElementById('GoogleBacklinksId' + cid).innerHTML='...';
	document.getElementById('YahooBacklinksId' + cid).innerHTML='...';
	document.getElementById('BingBacklinksId' + cid).innerHTML='...';
	document.getElementById('PageTehnoratiRankId' + cid).innerHTML='...';
	document.getElementById('DateCompetitorId' + cid).innerHTML='...';
	document.getElementById('PageRankId' + cid).className='colornone';
	document.getElementById('PageAlexaRankId' + cid).className='colornone';
	document.getElementById('GooglePagesId' + cid).className='colornone';
	document.getElementById('YahooPagesId' + cid).className='colornone';
	document.getElementById('BingPagesId' + cid).className='colornone';
	document.getElementById('GoogleBacklinksId' + cid).className='colornone';
	document.getElementById('YahooBacklinksId' + cid).className='colornone';
	document.getElementById('BingBacklinksId' + cid).className='colornone';
	document.getElementById('PageTehnoratiRankId' + cid).className='colornone';
}

function crawl(start,idPage) {
	xml=buildXmlHttp();
	xml.onreadystatechange=function() {
		if(xml.readyState==4) {
			params = xml.responseText;
			params = params.split("\n");
			if(idPage!=0) {
				switch(params[7]) {
					case (params[7]>=33 && params[7] < 66) : color = 'Orange'; break;
					case (params[7]>=0 && params[7] < 33) : color = 'Red'; break;
					case -1 : color = 'Gray';break;
					default: color = 'Green';
				}
				
				document.getElementById('DatePageId'+idPage).innerHTML=params[4];
				document.getElementById('PageTitle'+idPage).innerHTML=params[5];
				document.getElementById('pageGrade'+idPage).innerHTML=params[7] + '%';
				document.getElementById('pageGrade'+idPage).style.width=params[7] + 'px';
				document.getElementById('pageGrade'+idPage).className='pageGrade'+color;
			} 
			else
				if(params.length>0 && document.getElementById('CrawlerPaused').value != 'paused' && params[0] != 'Finished') {
					
					document.getElementById('PageURL').innerHTML=params[0];
					document.getElementById('PageLevel').innerHTML=params[1];
					document.getElementById('PagesScanned').innerHTML=params[2];
					document.getElementById('PagesLeft').innerHTML=params[3];
					document.getElementById('TotalPages').innerHTML=params[6];
					
					crawl(0,0);
				} else {
					document.getElementById('PageURL').innerHTML = 'Finished';
					document.getElementById('PageLevel').innerHTML='';
					document.getElementById('PagesScanned').innerHTML='';
					document.getElementById('PagesLeft').innerHTML='';
					document.getElementById('TotalPages').innerHTML='';
				}
		}
    }
	if(idPage!=0)
		document.getElementById('DatePageId'+idPage).innerHTML = 'Processing...'
	
	xml.open('GET','index.php?option=com_tbearseo&task=crawl&controller=crawler&start=' + start +'&idPage='+ idPage + '&randomTime=' + Math.random(),true);
	xml.send(null);
}

function buildXmlHttp() {
	var xmlHttp;
	try {
		xmlHttp=new XMLHttpRequest();
	}
	catch (e) {
		try {
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {
			try {
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	return xmlHttp;
}


function unserialize(data){
    // http://kevin.vanzonneveld.net
    // +     original by: Arpad Ray (mailto:arpad@php.net)
    // +     improved by: Pedro Tainha (http://www.pedrotainha.com)
    // +     bugfixed by: dptr1988
    // +      revised by: d3x
    // +     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +        input by: Brett Zamir (http://brett-zamir.me)
    // +     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     improved by: Chris
    // +     improved by: James
    // %            note: We feel the main purpose of this function should be to ease the transport of data between php & js
    // %            note: Aiming for PHP-compatibility, we have to translate objects to arrays
    // *       example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}');
    // *       returns 1: ['Kevin', 'van', 'Zonneveld']
    // *       example 2: unserialize('a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}');
    // *       returns 2: {firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'}
 
    var error = function (type, msg, filename, line){throw new this.window[type](msg, filename, line);};
    var read_until = function (data, offset, stopchr){
        var buf = [];
        var chr = data.slice(offset, offset + 1);
        var i = 2;
        while (chr != stopchr) {
            if ((i+offset) > data.length) {
                error('Error', 'Invalid');
            }
            buf.push(chr);
            chr = data.slice(offset + (i - 1),offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };
    var read_chrs = function (data, offset, length){
        var buf;
 
        buf = [];
        for(var i = 0;i < length;i++){
            var chr = data.slice(offset + (i - 1),offset + i);
            buf.push(chr);
        }
        return [buf.length, buf.join('')];
    };
    var _unserialize = function (data, offset){
        var readdata;
        var readData;
        var chrs = 0;
        var ccount;
        var stringlength;
        var keyandchrs;
        var keys;
 
        if(!offset) {offset = 0;}
        var dtype = (data.slice(offset, offset + 1)).toLowerCase();
 
        var dataoffset = offset + 2;
        var typeconvert = new Function('x', 'return x');
 
        switch(dtype){
            case 'i':
                typeconvert = function (x) {return parseInt(x, 10);};
                readData = read_until(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
            break;
            case 'b':
                typeconvert = function (x) {return parseInt(x, 10) !== 0;};
                readData = read_until(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
            break;
            case 'd':
                typeconvert = function (x) {return parseFloat(x);};
                readData = read_until(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
            break;
            case 'n':
                readdata = null;
            break;
            case 's':
                ccount = read_until(data, dataoffset, ':');
                chrs = ccount[0];
                stringlength = ccount[1];
                dataoffset += chrs + 2;
 
                readData = read_chrs(data, dataoffset+1, parseInt(stringlength, 10));
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 2;
                if(chrs != parseInt(stringlength, 10) && chrs != readdata.length){
                    error('SyntaxError', 'String length mismatch');
                }
            break;
            case 'a':
                readdata = {};
 
                keyandchrs = read_until(data, dataoffset, ':');
                chrs = keyandchrs[0];
                keys = keyandchrs[1];
                dataoffset += chrs + 2;
 
                for(var i = 0;i < parseInt(keys, 10);i++){
                    var kprops = _unserialize(data, dataoffset);
                    var kchrs = kprops[1];
                    var key = kprops[2];
                    dataoffset += kchrs;
 
                    var vprops = _unserialize(data, dataoffset);
                    var vchrs = vprops[1];
                    var value = vprops[2];
                    dataoffset += vchrs;
 
                    readdata[key] = value;
                }
 
                dataoffset += 1;
            break;
            default:
                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
            break;
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)];
    };
    
    return _unserialize((data+''), 0)[2];
}