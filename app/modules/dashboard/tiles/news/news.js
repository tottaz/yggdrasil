
// Part of Droptiles project.

function load_news(tile, div, params) {
    google.load("feeds", "1", {
        "callback": function () {
            var feed = new google.feeds.Feed(params.url);
            feed.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
            feed.setNumEntries(10);

            tile.slides.removeAll();

            feed.load(function (result) {
                tile.counter(result.feed.entries.length);
                //console.log(result);
                if (!result.error) {
                    for (var i = 0; i < result.feed.entries.length; i++) {
                        var entry = result.feed.entries[i];

                        var html = '<div class="news_item">' +
                                            '<a target="_blank" class="news_link" href="' + entry.link + '">' + entry.title + '</a>';


                        if (entry.xmlNode != null && entry.xmlNode.getElementsByTagNameNS) {
                            var thumbnails = entry.xmlNode.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "thumbnail");
                            var thumbnail = _.first(thumbnails);
                            if (thumbnail != null) {
                                var imageUrl = thumbnail.attributes["url"].value;
                                html += '<div class="news_thumbnail"><img src="' + imageUrl + '" /></div>';
                            }
                        }

                        html += '<p>' + _.string.escapeHTML(entry.contentSnippet || entry.content) + '</p>';
                        html += '</div>';

                        tile.slides.push(html);

                    }

                    if (tile.label() == "")
                        tile.label(result.feed.title);
                }
            });
        }});
}