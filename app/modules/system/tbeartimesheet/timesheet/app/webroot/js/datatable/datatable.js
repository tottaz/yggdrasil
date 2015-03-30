Event.observe(window, 'load', function(){
    $$('table.data tr').each(function(e, i){
        Event.observe(e, 'mouseover', function(){
            e.addClassName('over');
        });
        Event.observe(e, 'mouseout', function(){
            e.removeClassName('over');
        });
        Event.observe(e, 'click', function(){
            if(e.hasClassName('click')){
                e.removeClassName('click');
            } else {
                e.addClassName('click');
            }
        });
    });
});
