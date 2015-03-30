    <div id="body" class="appstore unselectable ">
        <div id="navbar" class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <a class="pull-left" style="margin-top: 7px; margin-right: 5px;" href="Default.aspx">
                        <img src="../app/modules/dashboard/img/avatar474_2.gif" style="max-height: 16px;" />
                    </a>
                    <div class="nav-collapse">
                        <ul class="nav">
                            <li><a class="active" href="dashboard"><i class="icon-th-large"></i>Dashboard</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div id="content" style="visibility: hidden">
            <a class="backbutton" href="dashboard">
                <img src="../app/modules/dashboard/img/Left.png" />
            </a>
            <div id="start" data-bind="text: title"></div>
            
            <div id="metro-sections-container" class="metro">
                <div id="trash" class="trashcan">
                    <img src="../app/modules/dashboard/img/Trashcan.png" width="64" height="64" />
                </div>
                <div class="metro-sections" data-bind="foreach: sections">
                    <div class="metro-section" data-bind="attr: {id : uniqueId}">
                        <div class="metro-section-title" data-bind="{text: name}"></div>
                        <!-- ko foreach: sortedTiles -->
                            <div data-bind="attr: { id: uniqueId, 'class': tileClasses }">
                                <b class="check"></b>
                                <div data-bind="foreach: slides">
                                    <div class="tile-content-main">
                                        <div data-bind="html: $data">
                                        </div>
                                    </div>
                                </div>
                                <!-- ko if: label -->
                                <span class="tile-label" data-bind="html: label">Label</span>
                                <!-- /ko -->
                                <!-- ko if: counter -->
                                <span class="tile-counter" data-bind="html: counter">10</span>
                                <!-- /ko -->
                                <!-- ko if: subContent -->
                                <div data-bind="attr: { 'class': subContentClasses }, html: subContent">
                                    subContent
                                </div>
                                <!-- /ko -->
                            </div>
                        <!-- /ko -->
                    </div>

                </div>
            </div>
        </div>
    </div>
<script>
// The default tile setup offered to new users.

/*
    The root Model class that holds all the sections and tiles inside the sections.

    Params:
        title - Title for the Dashboard eg "Start"
        sections - An array of section models.
        user - Currently logged in user details, or anonymous.
        ui - UI configuration, defaults.
*/

var DashboardModel = function (title, sections, user, ui) {
    var self = this;

    this.appRunning = false;
    this.currentApp = "";
    this.user = ko.observable(user);
    this.title = ko.observable(title);
    this.sections = ko.observableArray(sections);

    // Get a section model.
    this.getSection = function (uniqueId) {
        return ko.utils.arrayFirst(self.sections(), function (section) {
            return section.uniqueId == uniqueId;
        });
    }

    // Get a tile no matter where it is
    this.getTile = function (id) {
        var foundTile = null;
        ko.utils.arrayFirst(self.sections(), function (section) {
            foundTile = ko.utils.arrayFirst(section.tiles(), function (item) {
                return item.uniqueId == id;
            });
            return foundTile != null;
        });
        return foundTile;
    }

    // Remove a tile no matter where it is.
    this.removeTile = function (id) {
        ko.utils.arrayForEach(self.sections(), function (section) {
            var tile = ko.utils.arrayFirst(section.tiles(), function (tile) {
                return tile.uniqueId == id;
            });
            if (tile) {
                section.tiles.remove(tile);
                return;
            }
        });
    }

    // Subscribe to changes in each section's tile collection
    this.subscribeToChange = function (callback) {
        self.sections.subscribe(function (sections) {
            ko.utils.arrayForEach(sections(), function (section) {
                section.tiles.subscribe(function (tiles) {
                    callback(section, tiles);
                });
            });
        });
        ko.utils.arrayForEach(self.sections(), function (section) {
            section.tiles.subscribe(function (tiles) {
                callback(section, tiles);
            });
        });
    }

    // Load sections and tiles from a serialized form. 
    this.loadSectionsFromString = function (tileSerialized, tileBuilder) {
        // Format: Section1~weather1,weather.youtube1,youtube|Section2~ie1,ie.

        var sections = ("" + tileSerialized).split("|");
        var sectionArray = [];

        _.each(sections, function (section) {
            var sectionName = _.string.strLeft(section, '~');

            var tiles = _.string.strRight(section, '~').split(".");

            var sectionTiles = [];

            var index = 0;
            _.each(tiles, function (tile) {
                if (tile.length > 0) {
                    var tileId = _.string.strLeft(tile, ",");
                    var tileName = _.string.strRight(tile, ",");

                    if (tileName.length > 0) {
                        var builder = tileBuilder[tileName];
                        if (builder == null) {
                            //console.log("No builder found for tile: " + tileName);
                        }
                        else {
                            var tileParams = builder(tileId);
                            var newTile = new Tile(tileParams, ui);
                            newTile.index = index++;
                            sectionTiles.push(newTile);
                        }
                    }
                }
            });

            var newSection = new Section({
                name: sectionName,
                tiles: sectionTiles
            }, self);
            sectionArray.push(newSection);

        });


        self.sections(sectionArray);
    }

    // Load sections and tiles from an object model.
    this.loadSections = function (sections, tileBuilder) {
        var sectionArray = [];

        _.each(sections, function (section) {
            var sectionTiles = [];

            var index = 0;
            _.each(section.tiles, function (tile) {
                var builder = window.TileBuilders[tile.name];
                var tileParams = builder(tile.id, tile.name, tile.data);
                var newTile = new Tile(tileParams, ui);
                newTile.index = index++;
                sectionTiles.push(newTile);
            });

            var newSection = new Section({
                name: section.title,
                tiles: sectionTiles
            }, self);
            sectionArray.push(newSection);

        });


        self.sections(sectionArray);
    }

    // Serialize sections and tiles in a string, handy to store in cookie.
    this.toSectionString = function () {
        // Format: Section1~weather1,weather.youtube1,youtube|Section2~ie1,ie.

        return ko.utils.arrayMap(self.sections(), function (section) {
            return section.name() + "~" +
                ko.utils.arrayMap(section.getTilesSorted(), function (tile) {
                    return tile.uniqueId + "," + tile.name;
                }).join(".");
        }).join("|");
    }

    
};

/*
    Represents a single Tile object model.
*/
var Tile = function (param, ui) {
    var self = this;

    this.uniqueId = param.uniqueId; // unique ID of a tile, Weather1, Weather2. Each instance must have unique ID.
    this.name = param.name; // unique name of a tile, eg Weather. 
    this.index = param.index || 0; // order of tile on the screen. Calculated at run time.
    this.size = param.size || ""; // Size of the tile. eg tile-double, tile-double-vertical
    this.color = param.color || ui.tile_color;  // Color of tile. eg bg-color-blue
    this.additionalClass = param.additionalClass || ""; // Some additional class if you want to pass to further customize the tile
    this.tileImage = param.tileImage || ""; // Tile background image that fills the tile.

    this.cssSrc = param.cssSrc || [];   // CSS files to load at runtime.
    this.scriptSrc = param.scriptSrc || []; // Javascript files to load at runtime.
    this.initFunc = param.initFunc || ""; // After loading javascript, which function to call.
    this.initParams = param.initParams || {}; // Parameters to pass to the initial function.
    this.slidesFrom = param.slidesFrom || []; // HTML pages to load and inject as slides inside the tiles that rotate.

    this.appTitle = param.appTitle || ""; // Title of the application when launched by clicking on tile.
    this.appUrl = param.appUrl || "";   // URL of the application to launch.
    this.appInNewWindow = param.appInNewWindow || false; // To load the app on new browser window outside the Dashboard.

    this.iconStyle = param.iconStyle || ui.tile_icon_size; // Tile icon size.
    this.iconAdditionalClass = param.iconAdditionalClass || ""; // Additional class for the tile icon.
    this.iconSrc = param.iconSrc || ui.tile_icon_src; // Icon url
    this.appIcon = param.appIcon || this.iconSrc; // Icon to show when full screen app being launched.

    this.label = ko.observable(param.label || ""); // Bottom left label 
    this.counter = ko.observable(param.counter || ""); // Bottom right counter
    this.subContent = ko.observable(param.subContent || ""); // Content that comes up when mouse hover
    this.subContentColor = param.subContentColor || ui.tile_subContent_color; // Color for content

    this.slides = ko.observableArray(param.slides || []); // Tile content that rotates. Collection of html strings.

    this.tileClasses = ko.computed(function () {
        return [ui.tile,
            this.size,
            this.color,
            this.additionalClass,
            (this.slides().length > 0 ? ui.tile_multi_content : "")].join(" ");
        ;
    }, this);

    this.hasIcon = ko.computed(function () {
        return this.iconSrc.length > 0;
    }, this);

    this.iconClasses = ko.computed(function () {
        return [this.iconStyle, this.iconAdditionalClass].join(" ");
    }, this);

    this.hasLabel = ko.computed(function () {
        return this.label().length > 0;
    }, this);

    this.hasCounter = ko.computed(function () {
        return this.counter().length > 0;
    }, this);

    this.hasSubContent = ko.computed(function () {
        return this.subContent().length > 0;
    }, this);

    this.subContentClasses = ko.computed(function () {
        return [ui.tile_content_sub, this.subContentColor].join(" ");
    }, this);

    this.init = function (div) {
        if ($(div).data("tile_initialized") !== true)
            $(div).data("tile_initialized", true);
        else
            return;

        // If tile has css to load, then load all CSS.
        if (_.isArray(self.cssSrc)) {
            var head = $('head');

            // This needs to be exactly like this to work in IE 8.
            _.each(self.cssSrc, function (url) {
                $("<link>")
                  .appendTo(head)
                  .attr({ type: 'text/css', rel: 'stylesheet' })
                  .attr('href', url);
            });
        }

        // If tile has a collection of html pages as slides, then load them
        // and inject them inside tile so that they rotate.
        if (!_.isEmpty(self.slidesFrom)) {
            $.get((_.isArray(self.slidesFrom) ? self.slidesFrom : [self.slidesFrom]),
                function (slides) {
                    _.each(slides, function (slide) {
                        self.slides.push(slide);
                    });

                    // After loading the htmls, load the JS so that they
                    // can use the html elements.
                    self.loadScripts(div);
                });
        }
        else {
            self.loadScripts(div);
        }
    }

    // Loads the javascripts on a tile dynamically. Called from .attach()
    this.loadScripts = function (div) {
        if (!_.isEmpty(self.scriptSrc)) {
            $.getScript(self.scriptSrc, function () {
                if (!_.isEmpty(self.initFunc)) {
                    var func = eval(self.initFunc);
                    if (_.isFunction(func))
                        func(self, div, self.initParams);
                    else {
                        //console.log("Not a function: " + self.initFunc);
                    }
                }
            })
        }
    }

    this.click = function () {
        
    }
};

/*
    Section holds a collection of tiles. Each group of tiles you see
    huddled together on screen, are sections.
*/
var Section = function (section) {
    var self = this;

    this.name = ko.observable(section.name); // Name of a section. Can be used to show some title over section.
    this.uniqueId = _.uniqueId('section_'); // Unique ID generated at runtime and stored on the section Div.

    this.tiles = ko.observableArray(section.tiles);
    
    // Returns tiles sorted by index
    this.getTilesSorted = function () {
        return self.tiles().sort(function (left, right) {
            return left.index == right.index ? 0 :
                (left.index < right.index ? -1 : 1)
        });
    }

    // Computed function to data-bind
    this.sortedTiles = ko.computed(this.getTilesSorted, this);

    // Get a tile inside the section
    this.getTile = function(uniqueId) {
        return ko.utils.arrayFirst(self.tiles(), function(tile) {
            return tile.uniqueId == uniqueId;
        });
    }

    // Add a new tile at the end of the section
    this.addTile = function (tile) {
        self.tiles.push(tile);
        _.defer(function () {
            tile.attach($('#' + tile.uniqueId));
        });
    }

    this.show = function () {
        var sectionDiv = $('#' + self.uniqueId);
        //$(window).animate({'scrollLeft': sectionDiv.offset().left});
        $(window).scrollLeft(sectionDiv.offset().left-100);
    }

};

window.AddWidgetsTiles = [
    {
        name: "Charts",
        tiles: [
           { id: "flickr", name:"flickr" }
        ]
    },
    {
        name: "Social",
        tiles: [
           { id: "twitter", name: "twitter" },
           { id: "facebook", name: "facebook" }
        ]
    },
    {
        name: "Media",
        tiles: [
           { id: "library", name: "library" },
           { id: "news", name: "news" },
           { id: "weather1", name: "weather" }
        ]
    }    
];


// Convert it to a serialized string
window.AddWidgetsTiles = _.map(window.AddWidgetsTiles, function (section) {
    return "" + section.name + "~" + (_.map(section.tiles, function (tile) {
        return "" + tile.id + "," + tile.name;
    })).join(".");
}).join("|");
        

// Definition of the tiles, their default values.
window.TileBuilders = {

    weather: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "weather",
            size: "tile-double tile-double-vertical",
            tileImage: '../app/modules/dashboard/img/AppStore/Weather.png',
            onClick: 'addTile("weather")'
        };
    },

    maps: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "maps"
        };
    },

    facebook: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "facebook"
        };
    },

    calendar: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "calendar"
        };
    },

    library: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "library",
            iconSrc: '../app/modules/dashboard/img/libraries.png',
            label: 'Library'
            
        };
    },

    skydrive: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "skydrive"
        };
    },

    flickr: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "flickr",
            size: 'tile-triple tile-triple-vertical',
            tileImage: '../app/modules/dashboard/img/AppStore/Flickr.png'
        };
    },

    email: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "email",
        };
    },

    youtube: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "youtube",
            tileImage: '../app/modules/dashboard/img/AppStore/YouTube.png'
        };
    },

    wikipedia: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "wikipedia",
            iconSrc: "../app/modules/dashboard/img/Wikipedia alt 1.png"
        };
    },


    news: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "news",
            size: "tile-double tile-double-vertical",
            tileImage: '../app/modules/dashboard/img/AppStore/News.png'
        };
    },

    feature: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "feature"   
        };
    },

    dynamicTile: function (uniqueId) {
        return {
            niqueId: uniqueId,
            name: "dynamicTile"            
        }
    },
    
    chart: function (uniqueId) {
        return {
            uniqueId: uniqueId,
            name: "chart",
            color: "bg-color-darkBlue",
            size: "tile-double",
            label: "Media Chart",
            cssSrc: ["../app/modules/dashboard/tiles/chart/style.css"],
            initFunc: "load_chart"            
        }
    },
};

// Configuration of UI elements on the Dashboard. This is used by the Core
// to find the UI elements on the screen and offer various dynamic behaviors.
// If you are building your own dashboard, make sure you put your own config.
var ui = {
	subcontent_height: 50,
	metro_sections_selector: '.metro-sections',
	metro_section_selector: '.metro-section',
	metro_section: 'metro-section',
	hover_metro_section: 'hover-metro-section',
	metro_section_overflow: 'metro-section-overflow',
	app_iframe_id: 'app_iframe',
	app_iframe_zindex: 60000,
	navbar: '#navbar',
	navbar_zindex: '60001',
	tile: 'tile',
	tile_content_main_selector: '.tile-content-main',
	tile_selector: '.tile',
	tile_color: 'bg-color-blue',
	tile_icon_size: 'tile-icon-large',
	tile_icon_src: 'app/modules/dashboard/img/update.png',
	tile_subContent_color: 'bg-color-blueDark',
	tile_multi_content_selector: '.tile-multi-content',
	tile_multi_content: 'tile-multi-content',
	tile_content_slide_delay: 10000,
	tile_content_sub_selector: '.tile-content-sub',
	tile_content_sub: 'tile-content-sub',
	trash: '#trash',
	position_cookie: 'tiles',
	splash_screen_zindex: 65000,
	splash_screen_icon_class: 'tile-icon-large',
	signin_splash_color: 'bg-color-green',
	signin_splash_icon: '../app/modules/dashboard/img/User No-Frame.png',
	settings_splash_color: 'bg-color-purple',
	settings_splash_icon: '../app/modules/dashboard/img/configure.png',
	appStore_splash_color: 'bg-color-blue',
	appStore_splash_icon: '../app/modules/dashboard/img/App Store.png',
};

// This is the viewModel for the App Widget. 
var viewModel = new DashboardModel("Widgets", [], window.currentUser, ui);

$(document).ready(function () {

// Hide the body area until it is fully loaded in order to prevent flickrs
$('#content').css('visibility', 'visible');

    // Initiate KnockoutJS binding which creates all the tiles and binds the whole
    // UI to viewModel.
    ko.applyBindings(viewModel);

    viewModel.loadSectionsFromString(window.AddWidgetsTiles, window.TileBuilders);

    createCookie("add", "");

    ko.utils.arrayForEach(viewModel.sections(), function(section) {
        ko.utils.arrayForEach(section.tiles(), function(tile) {
            var div = $('#' + tile.uniqueId);
            div.click(function () {
                if (div.toggleClass("selected").hasClass("selected")) {
                    div.tooltip({
                        title: 'The app is added. Go back to Dashboard',
                        trigger: 'manual',
                        location: 'top'
                    });

                    _.defer(function () {
                        div.tooltip('show');
                        _.delay(function () {
                            div.tooltip("hide");
                        }, 5000);
                    });
                }
                else {
                }

                var cookie = readCookie("add") + "";

                var tiles = cookie.split(",");
                if (_.contains(tiles, tile.name))
                    tiles = _.filter(tiles, function (t) { return t != tile.name; })
                else
                    tiles.push(tile.name);

                createCookie("add", tiles.join(","));

                return false;
            });
        });
    });

    // Mouse wheel behavior for side scrolling.
    $("body").on("mousewheel", function (event, delta, deltaX, deltaY) {
        window.scrollBy(-delta * 50, 0);
    });
    // Implement drag & scroll the window behavior
    if ($.browser.msie == null) {
        $('#body').kinetic({
            moved: function (settings) {
                if (!window.dragging) {
                    $(window).scrollLeft($(window).scrollLeft() + settings.scrollLeft);
                    $(window).scrollTop($(window).scrollTop() + settings.scrollTop);
                }
            }
        });
    }
});
</script>