
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

window.addEvent('domready', function() {
        setckLdrs('applsubmt');
});
    function setckLdrs(id) {
      $(id).addEvent('click', function(e){
            e.preventDefault();
            this.disabled = 1;
            this.form.submit();
            $('loadr').removeClass('hidel');
            this.setStyles({'background':'#ccc',
            'color': '#ccc',
            'border-color': '#ddd'
            });
        });
    }