var dataset = [
	{ id:1, sales:20, year:"02"},
	{ id:2, sales:55, year:"03"},
	{ id:3, sales:40, year:"04"},
	{ id:4, sales:78, year:"05"},
	{ id:5, sales:61, year:"06"},
	{ id:6, sales:35, year:"07"},
	{ id:7, sales:80, year:"08"},
	{ id:8, sales:50, year:"09"},
	{ id:9, sales:65, year:"10"},
	{ id:10, sales:59, year:"11"}
];
var dataset_colors = [
	{ id:1, sales:20, year:"02", color: "#ee4339"},
	{ id:2, sales:55, year:"03", color: "#ee9336"},
	{ id:3, sales:40, year:"04", color: "#eed236"},
	{ id:4, sales:78, year:"05", color: "#d3ee36"},
	{ id:5, sales:61, year:"06", color: "#a7ee70"},
	{ id:6, sales:35, year:"07", color: "#58dccd"},
	{ id:7, sales:80, year:"08", color: "#36abee"},
	{ id:8, sales:50, year:"09", color: "#476cee"},
	{ id:9, sales:65, year:"10", color: "#a244ea"},
	{ id:10, sales:59, year:"11", color: "#e33fc7"}
];
var small_dataset = [
	{ sales:35, year:"07" },
	{ sales:50, year:"08" },
	{ sales:65, year:"09" },
	{ sales:30, year:"10" },
	{ sales:45, year:"11" }
];
var data_xml = "<data><item id='01'><sales>35</sales><year>'07</year></item><item id='11'><sales>50</sales><year>'08</year></item><item id='21'><sales>65</sales><year>'09</year></item><item id='31'><sales>30</sales><year>'10</year></item><item id='41'><sales>45</sales><year>'11</year></item></data>";

var scatter_dataset = [
	{ "b":"4", "a":4.7, type: "Type A" },
	{ "b":"3.5", "a":0.8, type: "Type B" },
	{ "b":"2.4", "a":1.1, type: "Type C" },
	{ "b":"5.1", "a":10.5, type: "Type A" },
	{ "b":"4.8", "a":9.1, type: "Type B" },
	{ "b":"5.9", "a":8.5, type: "Type A" },
	{ "b":"3.1", "a":7.7, type: "Type B" },
	{ "b":"4.5", "a":7.2, type: "Type B" },
	{ "b":"5.9", "a":12.9, type: "Type C" },
	{ "b":"2.8", "a":5.8, type: "Type B" },
    { "b":"3.7", "a":8.1, type: "Type C" },
    { "b":"5.5", "a":14.0, type: "Type A" },
    { "b":"4.1", "a":1.5, type: "Type A" },
    { "b":"4.2", "a":6.1, type: "Type B" },
	{ "b":"2.7", "a":1.9, type: "Type C" },
	{ "b":"3.1", "a":5.5, type: "Type A" },
	{ "b":"6.3", "a":12.1, type: "Type B" },
	{ "b":"4.9", "a":11.5, type: "Type C" },
	{ "b":"2.8", "a":2.7, type: "Type A" },
	{ "b":"5.5", "a":10.2, type: "Type B" },
	{ "b":"8.2", "a":21.5, type: "Type C" },
	{ "b":"7.2", "a":15.8, type: "Type A" },
    { "b":"3.9", "a":11.1, type: "Type B" },
    { "b":"6.5", "a":15.0 , type: "Type C" },
    { "b":"7.0", "a":16.1, type: "Type A" },
    { "b":"2.9", "a":5.2, type: "Type C" },
	{ "b":"7.4", "a":18.5, type: "Type C" },
	{ "b":"6.5", "a":17.8, type: "Type A" },
    { "b":"4.7", "a":7.1, type: "Type C" },
    { "b":"7.7", "a":17.0 , type: "Type B" },
    { "b":"8.3", "a":16.5, type: "Type C" },
    { "b":"3.9", "a":9.6, type: "Type A" },
    { "b":"8.4", "a":23.0 , type: "Type B" },
    { "b":"7.7", "a":18.1, type: "Type A" },
    { "b":"3.9", "a":7.2, type: "Type A" },
	{ "b":"7.4", "a":20.5, type: "Type B" },
	{ "b":"6.2", "a":15.8, type: "Type C" },
    { "b":"4.2", "a":9.1, type: "Type B" },
    { "b":"8.7", "a":19.2 , type: "Type A" }
];
var month_dataset = [
	{ sales:"20", month:"Jan", color: "#ee3639" },
	{ sales:"30", month:"Fen", color: "#ee9e36" },
	{ sales:"50", month:"Mar", color: "#eeea36" },
	{ sales:"40", month:"Apr", color: "#a9ee36" },
	{ sales:"70", month:"May", color: "#36d3ee" },
	{ sales:"80", month:"Jun", color: "#367fee" },
	{ sales:"60", month:"Jul", color: "#9b36ee" }
];
var companies=[
    { "companyA":"4.8", "companyB":"2.3", "month":"Jan" },
    { "companyA":"5.0", "companyB":"2.1", "month":"Feb" },
    { "companyA":"3.2", "companyB":"0.1", "month":"Mar" },
    { "companyA":"3.1", "companyB":"5.7", "month":"Apr" },
    { "companyA":"1.0", "companyB":"3.0", "month":"May" },
    { "companyA":"1.3", "companyB":"2.6", "month":"Jun" },
    { "companyA":"3.2", "companyB":"3.0", "month":"Jul" },
    { "companyA":"2.3", "companyB":"5.0", "month":"Aug" },
    { "companyA":"1.9", "companyB":"1.4", "month":"Sep" },
    { "companyA":"2.2", "companyB":"1.0", "month":"Oct" },
    { "companyA":"4.0", "companyB":"1.5", "month":"Nov" },
    { "companyA":"6.0", "companyB":"4.0", "month":"Dec" }

];

var multiple_dataset = [
	{ sales:"20", sales2:"35", sales3:"55", year:"02" },
	{ sales:"40", sales2:"24", sales3:"40", year:"03" },
	{ sales:"44", sales2:"20", sales3:"27", year:"04" },
	{ sales:"23", sales2:"50", sales3:"43", year:"05" },
	{ sales:"21", sales2:"36", sales3:"31", year:"06" },
	{ sales:"50", sales2:"40", sales3:"56", year:"07" },
	{ sales:"30", sales2:"65", sales3:"75", year:"08" },
	{ sales:"90", sales2:"62", sales3:"55", year:"09" },
	{ sales:"55", sales2:"40", sales3:"60", year:"10" },
	{ sales:"72", sales2:"45", sales3:"54", year:"11" }
];
