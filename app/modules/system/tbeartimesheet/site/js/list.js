
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

window.addEvent('domready', function() {
        var titleBox = $('search');
        var keywdBox = $('keysrch');
        var locnBox = $('locsrch');
        titleString   =  '(eg., farmer)';
        keywdString   =  '(eg., tractor,sales)';
        locnString   =  '(eg., a city)';

        checkValue(titleBox, titleString);
        checkValue(keywdBox, keywdString);
        checkValue(locnBox, locnString);

        setEvents(titleBox, titleString);
        setEvents(keywdBox, keywdString);
        setEvents(locnBox, locnString);

        setckLdrs('filtrsubmt');

        if($('daterange')) setcnLdrs('daterange');
        if($('fcats')) setcnLdrs('fcats');
        if($('order_selct')) setcnLdrs('order_selct');
        if($('sort_selct')) setcnLdrs('sort_selct');
        if($('jall')) setckLdrs('jall');
        if($('tableView')) setckLdrs('tableView');
        if($('listView')) setckLdrs('listView');
});
    function setcnLdrs(id) {
      $(id).addEvent('change', function(){
            $('loadr').removeClass('hidel');
            $('filtrsubmt').setAttribute('value', '  Loading...  ');
        });
    }
    function setckLdrs(id) {
      $(id).addEvent('click', function(){
            $('loadr').removeClass('hidel');
            $('filtrsubmt').setAttribute('value', '  Loading...  ');
        });
    }
    function checkValue(el, str) {
       if(el.value == '' || el.value.length === 0) {
          el.setAttribute('value', str);
        }
        if (el.value.indexOf('(') === 0) {
             el.addClass('inputovr');
        } else el.removeClass('inputovr');
    }

    function setEvents(el, str) {
         el.addEvent('focus', function(){
           el.removeClass('inputovr');
           if(this.value.indexOf('(') === 0) this.setAttribute('value', '');
        });
        el.addEvent('blur', function(){
            if(!this.getAttribute('value')){
                this.setAttribute('value', str);
            }                       
            checkValue(el, str);
        });
    }
