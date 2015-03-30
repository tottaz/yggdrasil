$(document).ready(function() {
    $('#theme').change(function() {
        $('link:last').attr('href', '../socialtimeline/css/timeline_' + $(this).val() + '.css?key=' + (new Date()).getTime());
    });

    $('#demo_type').change(function() {
        changeDemo(parseInt($(this).val(), 10));
    });
});



function changeDemo(type) {
    $('#timeline').remove();
    $('<div>').attr('id', 'timeline').appendTo($(document.body));

    var timeline_data = [];
    var options       = {};

    $('#timeline').addClass('demo' + type);

    switch (type) {
        case 1:
            timeline_data = [
                {
                    type:     'iframe',
                    date:     '2012-09-03',
                    title:    'Map',
                    width:    400,
                    height:   300,
                    url:      'https://maps.google.com.au/?ie=UTF8&amp;ll=-27.40739,153.002859&amp;spn=1.509276,2.515869&amp;t=v&amp;z=9&amp;output=embed'
                },
                {
                    type:     'iframe',
                    date:     '2012-08-12',
                    title:    'Video',
                    width:    400,
                    height:   300,
                    url:      'http://www.youtube.com/embed/0ZQBRsEyN1E?wmode=opaque' // http://player.vimeo.com/video/30491762?byline=0&amp;portrait=0
                },
                {
                    type:     'slider',
                    date:     '2011-12-16',
                    width:    400,
                    height:   150,
                    images:   ['images/group.jpg', 'images/old.jpg', 'images/win.jpg'],
                    speed:    5000
                },
                {
                    type:     'gallery',
                    date:     '2011-04-12',
                    title:    'Mini Gallery',
                    width:    400,
                    height:   150,
                    images:   ['images/rooney.jpg', 'images/tshirt.jpg', 'images/giggs.jpg', 'images/rio.jpg', 'images/paper.jpg']
                },
                {
                    type:     'blog_post',
                    date:     '2011-08-03',
                    title:    'Blog Post',
                    width:    400,
                    content:  '<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    image:    'images/rio.jpg',
                    readmore: 'http://www.manutd.com'
                },
                {
                    type:     'slider',
                    date:     '2010-12-16',
                    width:    400,
                    height:   200,
                    images:   ['images/ferguson.jpg', 'images/paper.jpg'],
                    speed:    5000
                },
                {
                    type:     'gallery',
                    date:     '2010-04-12',
                    title:    'Mini Gallery',
                    width:    400,
                    height:   150,
                    images:   ['images/stadium.jpg', 'images/rafel.jpg', 'images/logo.jpg', 'images/rvp.jpg']
                },
                {
                    type:     'blog_post',
                    date:     '2010-08-03',
                    title:    'Blog Post',
                    width:    400,
                    content:  '<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    image:    'images/evra.jpg',
                    readmore: 'http://www.manutd.com'
                }
            ];
            options       = {
                animation:   true,
                lightbox:    true,
                showYear:    true,
                allowDelete: true,
                columnMode:  'dual',
                order:       'desc'
            };
            break;
        case 2:
            timeline_data = [
                {
                    type:     'blog_post',
                    date:     '2011-09-03',
                    title:    'FA Cup',
                    width:    300,
                    content:  'The Reds go marching on in the FA Cup...',
                    image:    'images/facup.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-08-03',
                    title:    'Swansea',
                    width:    300,
                    content:  'Check out our exclusive video preview ahead of today\'s clash with Swansea <a href="http://bit.ly/Yz0bmZ" target="_blank">http://bit.ly</a>',
                    image:    'images/rio.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-07-15',
                    title:    'Manchester United VS Liverpool',
                    width:    300,
                    content:  'The Reds complete the double over Liverpool this season...',
                    image:    'images/evra.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-06-29',
                    title:    'Michael Carrick',
                    width:    300,
                    content:  'Last chance to win Michael Carrick\'s signed shirt from the Liverpool game!! Click this link to enter <a href="http://bit.ly/W03U8k" target="_blank">http://bit.ly</a>',
                    image:    'images/carric.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-04-02',
                    title:    'Match',
                    width:    300,
                    content:  '9 Premier League wins out of 10 this season at Old Trafford. What is your match of the season so far at the Theatre of Dreams?',
                    image:    'images/wigan.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-02-13',
                    title:    'Old Traffordt',
                    width:    300,
                    content:  'Check out our exclusive video preview ahead of today\'s clash with Swansea <a href="http://bit.ly/Yz0bmZ" target="_blank">http://bit.ly</a>',
                    image:    'images/home.jpg'
                }
            ];
            options       = {
                animation:   true,
                lightbox:    true,
                showYear:    false,
                allowDelete: false,
                columnMode:  'dual',
                order:       'desc'
            };
            break;
        case 3:
            timeline_data = [
                {
                    type:     'slider',
                    date:     '2011-12-16',
                    width:    400,
                    height:   150,
                    images:   ['images/group.jpg', 'images/old.jpg', 'images/win.jpg'],
                    speed:    5000
                },
                {
                    type:     'gallery',
                    date:     '2011-04-12',
                    title:    'Mini Gallery',
                    width:    300,
                    height:   100,
                    images:   ['images/rooney.jpg', 'images/tshirt.jpg', 'images/giggs.jpg', 'images/rio.jpg', 'images/paper.jpg']
                },
                {
                    type:     'blog_post',
                    date:     '2011-08-03',
                    title:    'Blog Post',
                    width:    200,
                    content:  '<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    image:    'images/rio.jpg',
                    readmore: 'http://www.manutd.com'
                },
                {
                    type:     'slider',
                    date:     '2010-12-16',
                    width:    400,
                    height:   200,
                    images:   ['images/ferguson.jpg', 'images/paper.jpg'],
                    speed:    5000
                },
                {
                    type:     'gallery',
                    date:     '2010-04-12',
                    title:    'Mini Gallery',
                    width:    200,
                    height:   150,
                    images:   ['images/stadium.jpg', 'images/rafel.jpg', 'images/logo.jpg', 'images/rvp.jpg']
                },
                {
                    type:     'blog_post',
                    date:     '2010-08-03',
                    title:    'Blog Post',
                    width:    400,
                    content:  '<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    image:    'images/evra.jpg',
                    readmore: 'http://www.manutd.com'
                }
            ];
            options       = {
                animation:   true,
                lightbox:    true,
                showYear:    false,
                allowDelete: false,
                columnMode:  'left',
                order:       'desc'
            };
            break;
        case 4:
            timeline_data = [
                {
                    type:     'slider',
                    date:     '2011-12-16',
                    width:    400,
                    height:   150,
                    images:   ['images/group.jpg', 'images/old.jpg', 'images/win.jpg'],
                    speed:    5000
                },
                {
                    type:     'gallery',
                    date:     '2011-04-12',
                    title:    'Mini Gallery',
                    width:    300,
                    height:   100,
                    images:   ['images/rooney.jpg', 'images/tshirt.jpg', 'images/giggs.jpg', 'images/rio.jpg', 'images/paper.jpg']
                },
                {
                    type:     'blog_post',
                    date:     '2011-08-03',
                    title:    'Blog Post',
                    width:    200,
                    content:  '<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    image:    'images/rio.jpg',
                    readmore: 'http://www.manutd.com'
                },
                {
                    type:     'slider',
                    date:     '2010-12-16',
                    width:    400,
                    height:   200,
                    images:   ['images/ferguson.jpg', 'images/paper.jpg'],
                    speed:    5000
                },
                {
                    type:     'gallery',
                    date:     '2010-04-12',
                    title:    'Mini Gallery',
                    width:    200,
                    height:   150,
                    images:   ['images/stadium.jpg', 'images/rafel.jpg', 'images/logo.jpg', 'images/rvp.jpg']
                },
                {
                    type:     'blog_post',
                    date:     '2010-08-03',
                    title:    'Blog Post',
                    width:    400,
                    content:  '<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    image:    'images/evra.jpg',
                    readmore: 'http://www.manutd.com'
                }
            ];
            options       = {
                animation:   true,
                lightbox:    true,
                showYear:    false,
                allowDelete: false,
                columnMode:  'right',
                order:       'desc'
            };
            break;
        case 5:
            timeline_data = [
                {
                    type:     'blog_post',
                    date:     '2012-09-03',
                    title:    'FA Cup',
                    width:    '90%',
                    content:  'The Reds go marching on in the FA Cup...',
                    image:    'images/facup.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-08-03',
                    title:    'Swansea',
                    width:    '90%',
                    content:  'Check out our exclusive video preview ahead of today\'s clash with Swansea <a href="http://bit.ly/Yz0bmZ" target="_blank">http://bit.ly/Yz0bmZ</a>',
                    image:    'images/rio.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-07-15',
                    title:    'Manchester United VS Liverpool',
                    width:    '90%',
                    content:  'The Reds complete the double over Liverpool this season...',
                    image:    'images/evra.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-06-29',
                    title:    'Michael Carrick',
                    width:    '90%',
                    content:  'Last chance to win Michael Carrick\'s signed shirt from the Liverpool game!! Click this link to enter <a href="http://bit.ly/W03U8k" target="_blank">http://bit.ly/W03U8k</a>',
                    image:    'images/carric.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2011-04-02',
                    title:    'Match',
                    width:    '90%',
                    content:  '9 Premier League wins out of 10 this season at Old Trafford. What is your match of the season so far at the Theatre of Dreams?',
                    image:    'images/wigan.jpg'
                },
                {
                    type:     'blog_post',
                    date:     '2010-02-13',
                    title:    'Old Traffordt',
                    width:    '90%',
                    content:  'Check out our exclusive video preview ahead of today\'s clash with Swansea <a href="http://bit.ly/Yz0bmZ" target="_blank">http://bit.ly/Yz0bmZ</a>',
                    image:    'images/home.jpg'
                }
            ];
            options       = {
                animation:   true,
                lightbox:    true,
                showYear:    true,
                allowDelete: false,
                columnMode:  'center',
                order:       'desc'
            };
            break;
    }

    var timeline = new Timeline($('#timeline'), timeline_data);
    timeline.setOptions(options);
    timeline.display();
}