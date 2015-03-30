(function(){
    var view = new window.WebServerMonitor.ViewModel(),
        requestChart,
        cpuChart,
        memoryChart;

    view.inherit(function(){
        var gaugesPalette,
            chartsPalette,
            fontColor,
            gridColor,
            bkgColor,
            app = window.WebServerMonitor.app,
            colors,
            fonts,
            allSeries = app.allSeries;

        return {
            applyTheme: function (theme, animation) {
                if (theme === 'dark') {
                    gaugesPalette = ['#7cd2c7', '#f9d191', '#f9d191', '#fd7888', '#8b98c2'];
                    chartsPalette = ['#58ffe8', '#5eceff', '#93a9ff'];
                    colors = {
                        fontColor:'#a7acbc',
                        gridColor:'#515873',
                        bkgColor: '#363E5B',
                        needle: '#ffffff',
                        shutter: {
                            color: '#363e5b',
                            opacity: 0.65
                        }
                    };
                    fonts = {
                        sliderMarker: {
                            color: '#43474b',
                            size: 11,
                            weight: 400
                        }
                    };
                } else {
                    gaugesPalette = ['#76c8bd', '#f7c676', '#f7c676', '#c5819a', '#96a3d4'];
                    chartsPalette = ['#76c8bd', '#75c0e0', '#c5cce7'];
                    colors = {
                        fontColor: '#7f7f7f',
                        gridColor: '#e9e9e9',
                        bkgColor: '#ffffff',
                        needle: '#43474b',
                        shutter: {
                            color: 'white',
                            opacity: 0.65
                        }
                    },
                    fonts = {
                        sliderMarker: {
                            color: 'white',
                            size: 11,
                            weight: 400
                        }

                    };
                }
                this.gaugeRequestsNumberOptions(app._createGaugeOptions(allSeries[36].y1,
                                                            [0, 50, 100, 150, 200],
                                                            [{
                                                                startValue: 0,
                                                                endValue: 48,
                                                                color: gaugesPalette[0]
                                                            }, {
                                                                startValue: 52,
                                                                endValue: 98,
                                                                color: gaugesPalette[1]
                                                            }, {
                                                                startValue: 102,
                                                                endValue: 148,
                                                                color: gaugesPalette[2]
                                                            }, {
                                                                startValue: 152,
                                                                endValue: 200,
                                                                color: gaugesPalette[3]
                                                            }],
                                                            colors));
                this.gaugeCPUOptions(app._createGaugeOptions(allSeries[36].y2,
                                                [0, 25, 50, 75, 100],
                                                [{
                                                    startValue: 0,
                                                    endValue: 24,
                                                    color: gaugesPalette[0]
                                                }, {
                                                    startValue: 26,
                                                    endValue: 49,
                                                    color: gaugesPalette[1]
                                                }, {
                                                    startValue: 51,
                                                    endValue: 74,
                                                    color: gaugesPalette[2]
                                                }, {
                                                    startValue: 76,
                                                    endValue: 100,
                                                    color: gaugesPalette[3]
                                                }],
                                                            colors));
                this.gaugeMemoryConsumptionOptions(app._createGaugeOptions(allSeries[36].y3,
                                                               [0, 250, 500, 750, 1000],
                                                               [{
                                                                   startValue: 0,
                                                                   endValue: 240,
                                                                   color: gaugesPalette[4]
                                                               }, {
                                                                   startValue: 260,
                                                                   endValue: 490,
                                                                   color: gaugesPalette[4]
                                                               }, {
                                                                   startValue: 510,
                                                                   endValue: 740,
                                                                   color: gaugesPalette[4]
                                                               }, {
                                                                   startValue: 760,
                                                                   endValue: 1000,
                                                                   color: gaugesPalette[4]
                                                               }],
                                                            colors));
                this.chartRequestsNumberOptions(app._createChartOptions(allSeries, 200, 'y1', chartsPalette[0], colors, animation));
                this.chartCPUOptions(app._createChartOptions(allSeries, 100, 'y2', chartsPalette[1], colors, animation));
                this.chartMemoryConsumptionOptions(app._createChartOptions(allSeries, 1000, 'y3', chartsPalette[2], colors, animation));
                $('#rangeSelectorContainer').empty();
                $('#rangeSelectorContainer').removeData();
                $('#rangeSelectorContainer').dxRangeSelector({
                    margin: {
                        bottom: 0,
                        left: 0,
                        top: 0,
                        right: 0
                    },
                    scale: {
                        showMinorTicks: true,
                        minorTickInterval: { hours: 4 },
                        majorTickInterval: { hours: 12 },
                        minRange: 'hour',
                        tick: {
                            color: colors.gridColor,
                            opacity: 1
                        },
                        label: {
                            font: {
                                color: colors.fontColor
                            }
                        }
                    },
                    dataSource: allSeries,
                    behavior: {
                        callSelectedRangeChanged: 'onMoving',
                        animationEnabled: false
                    },

                    sliderMarker: {
                        format: 'hour',
                        placeholderSize: {
                            width: 60
                        },
                        font: fonts.sliderMarker,
                        color: colors.needle
                    },
                    shutter: colors.shutter,
                    selectedRangeChanged: function (e) {
                        zoomChart(requestChart, e);
                        zoomChart(cpuChart, e);
                        zoomChart(memoryChart, e);
                    },
                    chart: {
                        palette: chartsPalette,
                        commonSeriesSettings: {
                            type: 'area',
                            argumentField: 'x'
                        },
                        topIndent: 0,
                        bottomIndent: 0,
                        valueAxis: {
                            min: 0
                        },
                        series: [{
                            valueField: 'y1'
                        }, {
                            valueField: 'y2'
                        }, {
                            valueField: 'y3'
                        }]
                    }
                });
            },
            requestsNumber: allSeries[36].y1,
            CPU: allSeries[36].y2,
            memoryConsumpiton: allSeries[36].y3,
            gaugeRequestsNumberOptions: ko.observable({}),
            gaugeCPUOptions: ko.observable({}),
            gaugeMemoryConsumptionOptions: ko.observable({}),
            chartRequestsNumberOptions: ko.observable({}),
            chartCPUOptions: ko.observable({}),
            chartMemoryConsumptionOptions: ko.observable({})
        }
    }());
    ko.applyBindings(view);

    requestChart = $('#RequestChartContainer').dxChart('instance');
    cpuChart = $('#CPUChartContainer').dxChart('instance');
    memoryChart = $('#memoryChartContainer').dxChart('instance');

    function zoomChart(chart, args) {
        clearTimeout(chart.zoomTimeout);
        chart.zoomTimeout = setTimeout(function () {
            chart.zoomArgument(args.startValue, args.endValue);
        }, 30);
    }
}());