function old_checkall(val) {
     	var field=val;
     	
     	if(document.adminForm.elements['general'].value==0) {
		
		for(i=0;i<=field;i++) {
			try {
			document.adminForm.elements["sec_field[]"][i].checked="checked";
			} catch(e){}
		}
		document.adminForm.elements['general'].value=1;
	} else {
		for(i=0;i<=field;i++){
			try {
			document.adminForm.elements["sec_field[]"][i].checked="";
			} catch(e){}
		}
		document.adminForm.elements['general'].value=0;
	}
}

function checkAll( n, fldName ) {
        	var f = document.adminForm;
        	var c = f.toggle.checked;
        	var n2 = 0;
        	for (i=0; i < n; i++) {
        		cb = eval( 'f.' + fldName + '' + i );
        		if (cb) {
        			cb.checked = c;
        			n2++;
        		}
        	}
        	if (c) {
        		document.adminForm.boxchecked.value = n2;
        	} else {
        		document.adminForm.boxchecked.value = 0;
        	}
        }

function checkAll2( n, fldName ) {
        	var f = document.adminForm;
        	var c = f.toggle2.checked;
        	var n2 = 0;
        	for (i=0; i < n; i++) {
        		cb = eval( 'f.' + fldName + '' + i );
        		if (cb) {
        			cb.checked = c;
        			n2++;
        		}
        	}
        	if (c) {
        		document.adminForm.boxchecked.value = n2;
        	} else {
        		document.adminForm.boxchecked.value = 0;
        	}
        }
        
        function checkAll3( n, fldName ) {
        	var f = document.adminForm;
        	var c = f.toggle3.checked;

            if(c){
                f.show_archive_sections.checked = 'checked';
                f.show_archive_categories.checked = 'checked';
                f.show_archive_authors.checked = 'checked';
                f.show_archive_days.checked = 'checked';
                f.show_archive_weeks.checked = 'checked';
                f.show_archive_months.checked = 'checked';
                f.show_archive_years.checked = 'checked';
            }else{
                f.show_archive_sections.checked = '';
                f.show_archive_categories.checked = '';
                f.show_archive_authors.checked = '';
                f.show_archive_days.checked = '';
                f.show_archive_weeks.checked = '';
                f.show_archive_months.checked = '';
                f.show_archive_years.checked = '';
            }
        }