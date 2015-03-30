(function () {
    window.WebServerMonitor = window.WebServerMonitor || {};

    window.WebServerMonitor.ViewModel = function (action) {
        var themes = ['light', 'dark'],
            themeIndex = (function () {
                var themeName = window.location.href.match(/[?&]theme=([^&$]*)/);
                themeName = themeName && themeName.length > 1 ? themeName[1] : themes[1];
                return !Boolean($.inArray(themeName, themes));
            })();

        action = (action || "admin/dashboard") + "?theme=";

        this.toggleTheme = function (index) {
            themeIndex = !themeIndex;
            var curTheme = themes[~~(themeIndex)];
            $('body').removeClass().addClass(curTheme);
            this.applyTheme(curTheme, false);
        }

        this.goto = function () {
            window.location = action + themes[~~themeIndex];
        }

        this.applyTheme = $.noop;
        this.inherit = function (otherModel) {
            var darkPalette = ['#46508c', '#556fa6', '#5d8dbc', '#62b7db', '#70cdd6', '#8ccebb'],
                lightPalette = ['#737db5', '#7e93bf', '#8bafd2', '#90cce6', '#70cdd6', '#bae3d7'];
            DevExpress.viz.core.registerPalette('Dark Palette', darkPalette);
            DevExpress.viz.core.registerPalette('Light Palette', lightPalette);
            $.extend(true, this, otherModel);
            this.applyTheme(themes[~~(themeIndex)], true);
        }
        this.toggleTheme();
    }
    
    window.WebServerMonitor.app = {};

    (function (app) {
        var i,
            j,
            random = Math.random,
            round = Math.round,
            tmpArray = [],
            countriesList = ['China', 'USA', 'Russia', 'Canada', 'Japan', 'Others'],
            months = [],
            days = [],
            hours = [24],
            date = new Date(),
            baseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7, 4, 0);
        app.arrayForBarChart = [];
        app.arrayForLineChart = [];
        app.arrayForStackedBar = [];

        var findHoursValue = function () {
            var hoursValue = [],
                k;
            for (k = 0; k < 6; k++) {
                hoursValue.push(~~(180 * random()));
            }
            return hoursValue;
        }

        var findDayValue = function () {
            var dayValue = [],
                k;
            for (k = 0; k < 6; k++) {
                dayValue.push(~~(600 * random() + 200));
            }
            return dayValue;
        }

        for (var j = 1; j < 7; j++) {
            hours[j] = (baseDate.getHours());
            baseDate.setHours(baseDate.getHours() + 4);
        }

        for (var j = 0; j < 6; j++) {
            months[j] = baseDate.getMonth() + 1;
            days[j] = baseDate.getDate();
            baseDate.setDate(baseDate.getDate() + 1);
        }

        tmpArray = $.map(countriesList, function (country) {
            return {
                country: country,
                value: findDayValue(),
                days: days,
                hours: hours,
                months: months,
                hoursValue: findHoursValue()
            }
        });

        app.arrayForBarChart = $.map(tmpArray, function (item) {
            return {
                country: item.country,
                value: item.value[tmpArray[0].value.length - 1]
            };
        });

        app.arrayForLineChart = (function () {
            var date = new Date(),
                lineChartData = [];
            date.setDate(date.getDate() + 1);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);

            lineChartData.push({
                hour: date,
                y1: 0,
                y2: 0,
                y3: 0,
                y4: 0,
                y5: 0,
                y6: 0
            });
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 4, 0);
            for (var i = 1; i < 6; i++) {
                lineChartData.push({
                    hour: date,
                    y1: lineChartData[i - 1].y1 + ~~((app.arrayForBarChart[0].value / 10) + random() * 50),
                    y2: lineChartData[i - 1].y2 + ~~((app.arrayForBarChart[1].value / 10) + random() * 50),
                    y4: lineChartData[i - 1].y3 + ~~((app.arrayForBarChart[2].value / 10) + random() * 50),
                    y4: lineChartData[i - 1].y4 + ~~((app.arrayForBarChart[3].value / 10) + random() * 50),
                    y5: lineChartData[i - 1].y5 + ~~((app.arrayForBarChart[4].value / 10) + random() * 50),
                    y6: lineChartData[i - 1].y6 + ~~((app.arrayForBarChart[5].value / 10) + random() * 50)
                });
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 4, 0);
            }

            return lineChartData;
        })();

        app.arrayForStackedBar = (function (arr) {
            var data = [],
                dataItem,
                sum = [0, 0, 0, 0, 0, 0],
                i,
                j;

            for (i = 0; i < 6; i++) {
                for (j = 0; j < 6; j++) {
                    sum[i] += arr[j].value[i];
                }
            }
            for (i = 0; i < 6; i++) {
                data[i] = {
                    day: arr[0].days[i] + '/' + arr[0].months[i],
                    y1: round((arr[0].value[i] / sum[i]) * 100),
                    y2: round((arr[1].value[i] / sum[i]) * 100),
                    y3: round((arr[2].value[i] / sum[i]) * 100),
                    y4: round((arr[3].value[i] / sum[i]) * 100),
                    y5: round((arr[4].value[i] / sum[i]) * 100),
                    y6: 0
                };

                dataItem = data[i];

                dataItem.y6 = 100 - (dataItem.y1 + dataItem.y2 + dataItem.y3 + dataItem.y4 + dataItem.y5);
            }

            return data;
        })(tmpArray);

        var findRandomValue = function () {
            var randomArray = [],
                timeNow = new Date();
            timeNow.setDate(timeNow.getDate() - 3);
            timeNow.setHours(12);
            timeNow.setMinutes(0);
            for (var i = 0; i < 37; i++) {
                randomArray.push({
                    x: new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), timeNow.getHours()),
                    y1: ~~(Math.random() * 200),
                    y2: ~~(Math.random() * 100),
                    y3: ~~(Math.random() * 1000)
                });
                timeNow.setHours(timeNow.getHours() + 2);
            }
            return randomArray;
        }

        app.allSeries = findRandomValue();

        app._createGaugeOptions = function (gaugeValue, ticks, gaugeRanges, colors) {
            var gaugeOptions = {
                size: {
                    width: 210,
                    height: 175
                },
                margin: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                },
                containerBackgroundColor: colors.bkgColor,
                spindle: {
                    color: colors.needle
                },
                scale: {
                    startValue: gaugeRanges[0].startValue,
                    endValue: gaugeRanges[3].endValue,
                    majorTick: {
                        showCalculatedTicks: false,
                        color: 'none',
                        customTickValues: ticks
                    },
                    label: {
                        font: {
                            color: colors.fontColor
                        },
                        indentFromTick: 8
                    }
                },
                rangeContainer: {
                    width: 3,
                    ranges: gaugeRanges,
                    backgroundColor: 'none'
                },
                needles: [
                       {
                           offset: 5,
                           indentFromCenter: 7,
                           value: gaugeValue,
                           color:colors.needle
                       }],
                markers: [],
                preset: 'preset1'
            };
            return gaugeOptions;
        };

        app._createChartOptions = function (allSeries, maxValue, chartField, chartColor, colors, animation) {
            var chartOptions = {
                commonAxisSettings: {
                    grid: {
                        color: colors.gridColor,
                        opacity:1
                    },
                    label: {
                        font: {
                            color: colors.fontColor
                        }
                    }
                },
                margin: {
                    top: 5,
                    bottom: 5,
                    right: 36
                },
                argumentAxis: {
                    valueMarginsEnabled: false,
                    label: { format: 'hour' },
                    grid: { visible: true }
                },
                animation: animation,
                commonPaneSettings: {
                    border: {
                        visible: true,
                        color: colors.gridColor,
                        opacity:1
                    }
                },
                legend: { visible: false },
                dataSource: allSeries,
                valueAxis: {
                    placeholderSize: 60,
                    valueMarginsEnabled: false,
                    min: 0
                },
                series: [
                    {
                        argumentField: 'x',
                        valueField: chartField,
                        type: 'area',
                        point: { visible: false },
                        color: chartColor,
                        style: { opacity: 0.38 }
                    }]
            }
            return chartOptions;
        };
    }(window.WebServerMonitor.app));
}());
