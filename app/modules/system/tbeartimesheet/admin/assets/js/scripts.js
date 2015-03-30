function changeColor(id, spanId, color){
	document.getElementById(spanId+"_"+id).style.color = color;
}

function unColor(textareaName){
	var obj = document.getElementsByName(textareaName)[0];
	var par = obj.parentNode.parentNode.parentNode.parentNode;
	par.style.backgroundColor = 'transparent';
}

function countKey(obj, no, i, type, maxNum){
	if(type == "Words"){
		var myArray = no.split(',');
		var numar = maxNum - myArray.length;
	}
	else
	var numar = maxNum - no.length;
	document.getElementById("no_"+i).innerHTML = numar;
	if(numar < 0)
	changeColor(i, 'no', 'red')
	else changeColor(i, 'no', '#666666')
	var par = obj.parentNode.parentNode.parentNode.parentNode;
	if(numar != maxNum) {
		//var stil = document.styleSheets[0].cssRules['table.adminlist tbody tr td table.yellow td'];
		//document.styleSheets[0].cssRules[0].style.backgroundColor = 'transparent';
		par.style.backgroundColor='transparent';
	}
	else par.style.backgroundColor='#ffffcc';
}

//params: description text, article id, desc type, no. of words/chars
function countDesc(obj, dtext, id, type, maxNum){
	maxNum = parseInt(maxNum);
	if(type == "Words"){
		var words = dtext.split(/[^\w\d-]+/g);
		var len = words.length;
		for(var i=0; i<len; i++){
			if(!words[i]){
				words.splice(i,1);
				len--; break;
			}
		}
		var numar = maxNum - words.length;
	}
	else var numar = maxNum - dtext.length;
	//alert(maxNum+" "+dtext.length+" "+numar+" "+id)	
	document.getElementById("do_"+id).innerHTML = numar;
	if(numar < 0)
		changeColor(id, 'do', 'red')
	else changeColor(id, 'do', '#666666')
	var par = obj.parentNode.parentNode.parentNode.parentNode;
	
	if(dtext.length >0) {
		//var stil = document.styleSheets[0].cssRules['table.adminlist tbody tr td table.yellow td'];
		//document.styleSheets[0].cssRules[0].style.backgroundColor = 'transparent';
		par.style.backgroundColor='transparent';
	}
	else par.style.backgroundColor='#ffffcc';
}

function countTitle(obj, no, i, type, maxNum){
	if(type == "Words"){
		var myArray = no.split(' ');
		var numar = maxNum - myArray.length;
	}
	else
	var numar = maxNum - no.length;
	document.getElementById("go_"+i).innerHTML = numar;
	if(numar < 0)
	changeColor(i, 'go', 'red')
	else changeColor(i, 'go', '#666666')
	var par = obj.parentNode.parentNode.parentNode.parentNode;
	if(numar != maxNum) {
		//var stil = document.styleSheets[0].cssRules['table.adminlist tbody tr td table.yellow td'];
		//document.styleSheets[0].cssRules[0].style.backgroundColor = 'transparent';
		par.style.backgroundColor='transparent';
	}
	else par.style.backgroundColor='#ffffcc';
}

function showMenu(selected){
	switch(selected){
		case '':
		case 'articles':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
			document.adminForm.submit();
		break;
		
		case 'menuitems':
			$('menu_types').setStyle('display', 'block');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
		break;
		
		case 'mtree':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'block');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
		break;
		
		case 'sobi':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'block');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
		break;
		
		case 'magazine':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'block');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
		break;
		
		case 'digistore':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'block');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
		break;
		
		case 'newsportal':		
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'block');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'none');
		break;
		
		case 'k2':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'block');
			$('virtuemart').setStyle('display', 'none');
		break;
		case 'virtuemart':
			$('menu_types').setStyle('display', 'none');
			$('mtree').setStyle('display', 'none');
			$('sobi').setStyle('display', 'none');
			$('magazine').setStyle('display', 'none');
			$('digistore').setStyle('display', 'none');
			$('newsportal').setStyle('display', 'none');
			$('k2').setStyle('display', 'none');
			$('virtuemart').setStyle('display', 'block');
		break;
	}
}