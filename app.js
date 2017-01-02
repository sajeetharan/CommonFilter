// apps.js
// Exmaple by John Tomaselli for Greater Than Zero
// jrt@gtz.com
var app = angular.module('myApp', ['ui', 'ngGrid', 'charts.pie', 'ui.bootstrap']);
app.controller('MyCtrl', function($scope, limitToFilter, $rootScope) {
    $scope.name = 'DigIn Common Filter Demo';


    $scope.groupopt = [
        { order: 0, name: "By Dept", modelName: '' },
        { order: 1, name: "By Dept-Status", modelName: '' },
        { order: 2, name: "By Status-Dept", modelName: '' },
        { order: 3, name: "By Status", modelName: '' }
    ];
    $scope.groupoptct = 1;
    $scope.groupopt_counted = 0;

    /////////////////
    // $scope.pie.checked=1;// default [0].checked
    $scope.checkChange = function(pie) {

        if (pie.checked) {
            $scope.currentPie = pie;
        }
        $scope.selectedCount = 0;
        angular.forEach($scope.groupopt, function(c) {
            $scope.selectedCount += (c.checked ? 1 : 0);
        });
        console.log('p ', pie, $scope.selectedCount);
        var newdata = '';
        switch (pie.name) {
            case 'By Dept':
                newdata = _.countBy($scope.myData, function(currentObject) {
                    return currentObject.Dept;
                })
                $scope.chartTitle = 'Workers Comp By Dept';
                break;
            case "By Dept-Status":
                newdata = _.countBy($scope.myData, function(currentObject) {
                    return currentObject.Dept + '-' + currentObject.Status;
                })
                $scope.chartTitle = 'Workers Comp By Dept-Status';
                break;
            case "By Status-Dept":
                newdata = _.countBy($scope.myData, function(currentObject) {
                    return currentObject.Status + '-' + currentObject.Dept;
                })
                $scope.chartTitle = 'Workers Comp Status-Dept';
                break;
            case "By Status":
                newdata = _.countBy($scope.myData, function(currentObject) {
                    return currentObject.Status;
                })
                $scope.chartTitle = 'Workers Comp By Status';
                break;
            default:
                break;
        }

        var newdata2 = ''; // get all dept desciptions
        var newArray = []; // must push object to an array
        var sortedObject = _.sortBy(newdata, function(val, key, object) {
            newdata2 += key + ',';
            newArray.push([key, val]);
        });
        $scope.ideas = newArray;
        var newdata2 = newdata2.slice(0, newdata2.length - 1);
        $scope.limitedIdeas = limitToFilter($scope.ideas, newArray.length);
    }



    $scope.myData = largeLoad();
    // for dynamic app after getting data back on socket
    // $scope.setDepts = function (depts) {
    //        var newdata = '';
    //        _.each(depts, function (item) {
    //            newdata += item + ',';
    //        });
    //        $scope.alldepts = newdata.slice(0, newdata.length - 1);
    //    };


    //set the chart
    // idea is to match the array shown in changecols2
    var newdata = '';
    newdata = _.countBy($scope.myData, function(currentObject) {
        return currentObject.Dept;
    });
    var newdata2 = ''; // get all dept desciptions
    var newArray = []; // must push object to an array
    var sortedObject = _.sortBy(newdata, function(val, key, object) {
        newdata2 += key + ',';
        newArray.push([key, val]);
    });
    $scope.ideas = newArray;
    var newdata2 = newdata2.slice(0, newdata2.length - 1);
    $scope.limitedIdeas = limitToFilter($scope.ideas, newArray.length);
    $scope.chartTitle = 'Workers Comp by Depts: '; //+newdata2;

    $scope.$on('ngGridEventGroups', function(newGroups) {
        console.log('In event.', newGroups, newGroups.targetScope.columns);
        $scope.setChart(newGroups.targetScope.columns);
    });

    $scope.setChart = function(columns) {
        //        console.log('in chart')
        $scope.sortby = [];
        _.each(columns, function(item) {
            // newdata += item + ',';
            if (item.groupIndex > 0) {
                console.log('item', item.groupIndex, item.displayName, item)
                $scope.sortby[item.groupIndex] = item.displayName;
            }
        });
        var newdata = '';
        var newdataSO = '';
        //  $scope.sortby =sortby;
        console.log('sortby ', $scope.sortby, $scope.sortby.length - 1);
        if ($scope.sortby.length > 0) {
            _.each($scope.sortby, function(item) {
                    newdata += item + ',';
                    newdataSO += item + '-';

                })
                //console.log(' $scope.sortby[1] ', $scope.sortby[1]);//,sortby[1]);

            $scope.sortbydesc = newdata.slice(0, newdata.length - 1);
            console.log(' $scope.sor ', $scope.sortbydesc);
            $rootScope.highchartTitle = $scope.sortbydesc;
            newdataSO = newdataSO.slice(0, newdataSO.length - 1);
            // console.log('newdataSO ', newdataSO);
            newdata = '';
            newdata = _.countBy($scope.myData, function(currentObject) {
                switch ($scope.sortby.length - 1) {
                    case 1:
                        // must place variable in array
                        return currentObject[$scope.sortby[1]];
                        break;
                    case 2:
                        return currentObject[$scope.sortby[1]] + '-' + currentObject[$scope.sortby[2]];
                        break;
                    case 3:
                        return currentObject[$scope.sortby[1]] + '-' + currentObject[$scope.sortby[2]] + '-' + currentObject[$scope.sortby[3]];
                        break;
                    default:
                        return currentObject[$scope.sortby[1]] + '-' + currentObject[$scope.sortby[2]] + '-' + currentObject[$scope.sortby[3]];
                        break;
                }

            })

            console.log(' newdata ', newdata);

            $scope.chartTitle = 'Workers Comp ' + $scope.sortbydesc;
            //  $rootScope.highchartTitle =$scope.chartTitle;
            var newdata2 = ''; // get all dept desciptions
            var newArray = []; // must push object to an array
            var sortedObject = _.sortBy(newdata, function(val, key, object) {
                newdata2 += key + ',';
                newArray.push([key, val]);
            });
            $scope.ideas = newArray;
            var newdata2 = newdata2.slice(0, newdata2.length - 1);

            // highcharts
            $scope.limitedIdeas = limitToFilter($scope.ideas, newArray.length);

        }
    };


    $scope.gridOptions = {
        data: 'myData',
        multiSelect: false,
        // filterOptions: {filterText: 'filteringText', useExternalFilter: false},
        //  beforeSelectionChange: self.selectionchanging,
        //  columnDefs: 'myDefs2',
        //  selectedItems: $scope.selections,
        enableRowReordering: false,
        showGroupPanel: true,
        showColumnMenu: true,
        //groups: ['SeasonCode', 'Vendor']
        // enablePinning: true,
        maintainColumnRatios: false,
        groups: [],
        //plugins: [new ngGridCsvExportPlugin(csvOpts)],
        //plugins: [new ngGridCsvExportPlugin()],
        showFooter: true,
        enableColumnResize: true,
        enableColumnReordering: true
    };

});

angular.module('charts.pie', [])
    .directive('qnPiechart', [
        function() {
            return {
                require: '?ngModel',
                link: function(scope, element, attr, controller) {
                    var settings = {
                        is3D: true
                    };

                    var getOptions = function() {
                        return angular.extend({}, settings, scope.$eval(attr.qnPiechart));
                    };

                    // creates instance of datatable and adds columns from settings
                    var getDataTable = function() {
                        var columns = scope.$eval(attr.qnColumns);
                        var data = new google.visualization.DataTable();
                        angular.forEach(columns, function(column) {
                            data.addColumn(column.type, column.name);
                        });
                        return data;
                    };

                    var init = function() {
                        var options = getOptions();
                        if (controller) {

                            var drawChart = function() {
                                var data = getDataTable();
                                // set model
                                data.addRows(controller.$viewValue);

                                // Instantiate and draw our chart, passing in some options.
                                var pie = new google.visualization.PieChart(element[0]);
                                pie.draw(data, options);
                                //http://www.netmagazine.com/tutorials/create-beautiful-data-visualisations-svg-google-charts-api
                                $(window).smartresize(function() {
                                    pie.draw(data, options);
                                });
                            };


                            controller.$render = function() {
                                drawChart();
                            };
                        }

                        if (controller) {
                            // Force a render to override
                            controller.$render();
                        }
                    };

                    // Watch for changes to the directives options
                    scope.$watch(getOptions, init, true);
                    scope.$watch(getDataTable, init, true);
                }
            };
        }
    ])
    .directive('hcBar', function() {
        return {
            restrict: 'C',
            replace: true,
            scope: {
                items: '='
            },
            controller: function($scope, $element, $attrs) {
                console.log(2);

            },
            template: '<div id="container2" style="margin: 0 auto">not working</div>',
            link: function(scope, element, attrs) {
                console.log(3);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container2',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        // must change to dynamic
                        text: 'Work Comps by '
                            //scope.title
                    },
                    exporting: {
                        enabled: true
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage}% - {point.y}/{point.total}  </b>',
                        percentageDecimals: 1
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                percentageDecimals: 1,
                                formatter: function() {
                                    //return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                    //return '<b>' + this.point.name + '</b>: '  +Math.round(this.percentage)+ ' %';
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(1) + ' %';

                                }
                            }
                        }
                    },
                    series: [{
                        type: 'bar',
                        name: 'WorkerComp',
                        data: scope.items
                    }]
                });
                scope.$watch("items", function(newValue) {
                    chart.series[0].setData(newValue, true);

                }, true);

            }
        }
    })
    .directive('hcPie', function() {
        return {
            restrict: 'C',
            replace: true,
            scope: {
                items: '='
            },
            controller: function($scope, $element, $attrs) {
                console.log(2);

            },
            template: '<div id="container" style="margin: 0 auto">not working</div>',
            link: function(scope, element, attrs) {
                console.log(3);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        // must change to dynamic
                        text: 'Work Comps by '
                            //scope.title
                    },
                    exporting: {
                        enabled: true
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage}% - {point.y}/{point.total}  </b>',
                        percentageDecimals: 1
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                percentageDecimals: 1,
                                formatter: function() {
                                    //return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                    //return '<b>' + this.point.name + '</b>: '  +Math.round(this.percentage)+ ' %';
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(1) + ' %';

                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'WorkerComp',
                        data: scope.items
                    }]
                });
                scope.$watch("items", function(newValue) {
                    chart.series[0].setData(newValue, true);

                }, true);

            }
        }
    });