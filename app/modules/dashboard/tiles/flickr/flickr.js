/// <reference path="../../js/Underscore.js" />
/// <reference path="../../js/jquery-1.7.2.min.js" />
// Copyright 2012 Omar AL Zabir
// Part of Droptiles project.



function flickr_load(tile, div) {
    var url = "http://ycpi.api.flickr.com/services/feeds/groups_pool.gne?id=60125064@N00&format=json&jsoncallback=?&test=" + (new Date().getDate());
    
    $.getJSON(url, function (data) {        
        var ctr = 0;
        $.each(data.items.reverse(), function (i, item) {
            var sourceSquare = item.media.m;
            var sourceOrig = (item.media.m).replace("_m.jpg", ".jpg");

            var htmlString = '<div class="flickr_item">' 
                //+ '<a target="_blank" href="' + sourceOrig + '" class="link" title="' + item.title + '">';
            htmlString += '<img title="' + item.title +
                '" src="' + sourceSquare + '" ';
            htmlString += 'alt="' + item.title +
                '" />';
            htmlString += '</a>'
                + '<div class="flickr_title">' + item.title + '</div>' +
                '</div>';

            tile.slides.push(htmlString);

            ctr = ctr + 1;
            
        });

        tile.counter(ctr);
    });
    
}

