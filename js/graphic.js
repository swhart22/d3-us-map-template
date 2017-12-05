//NBC OTS COLOR PALLETTE
var colors = {"red": {"001": "#6D2415","002": "#A23623","003": "#D8472A","004": "#E27660","005": "#EBA295","006": "#F3D0CA"
   },"blue": {"001": "#28566F","002": "#3E7FA5","003": "#53A9DC","004": "#80BEE4","005": "#A8D4EE","006": "#D2E8F5"},
   "green": {"001": "#4A5E40","002": "#6E8E5E","003": "#D8472A","004": "#91BC7F","005": "#C9DDBE","006": "#E2EDDE"},"purple": {"001": "#35203B","002": "#503058","003": "#6A4177","004": "#8D7097","005": "#B49FB9","006": "#DACFDD"},"yellow": {"001": "#776428","002": "#B19330","003": "#EEC535","004": "#F3D469","005": "#F7E299","006": "#FAF0CD"},"black": {"001": "#000000","002": "#4D4D4D","003": "#807F7F","004": "#C0C0C0","005": "#DBDBDA","006": "#F7F7F7"}};

//GRAB WIDTH AND HEIGHT FROM DIV IN INDEX.HTML
var width = parseInt(d3.select('#container').style('width')),
	height = parseInt(d3.select('#container').style('height'));

//CREATE SVG
var svg = d3.select('#container').append('svg')
	.attr('width',width)
	.attr('height',height);

//CREATE GRAPHIC MARGINS
var margin = {top: 20, right: 10, bottom: 20, left: 50},
	chartHeight = height - margin.top - margin.bottom,
	chartWidth = width - margin.left - margin.right;

//GRAPHED DATA GOES IN THIS G IN SVG
var g = svg.append('g')
	.attr('class','g-graphic')
	.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

var dFile = 'vecs.csv';

//LOAD DATASET(S)
d3.queue()
	.defer(d3.json, './data/us-topo.json')
	.defer(d3.csv, './data/for-graphic/' + dFile)
	.await(render);


//DO EVERYTHING IN RENDER FUNCTION, CALL ON RESIZE IF YOU WANT PAGE RESPONSIVE
function render(error, us, data){
	if (error) throw error;
	console.log(us);
	console.log(data);

	var projection = d3.geoAlbersUsa()
			.fitSize([width,height],topojson.feature(us, us.objects.counties));

	var path = d3.geoPath()
		.projection(projection);

	svg.selectAll('.base')
		.data(topojson.feature(us, us.objects.counties).features)
		.enter()
		.append('path')
		.attr('class','base-county')
		.attr('d',path)
		.attr('fill', colors['black']['005']);

	svg.append('path')
		.datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; }))
		.attr('class','border')
		.attr('d', path)
		.attr('fill','none')
		.style('stroke','#fff')
		.style('stroke-width',.5);

	svg.append("path")
		.datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a['properties']['STATEFP'] !== b['properties']['STATEFP']; }))
		.attr('class','states')
		.attr('d',path)
		.style('fill','none')
		.style('stroke-linejoin','round')
		.style('stroke',colors['black']['004'])
		.style('stroke-width',1.5);

	svg.append("path")
		.datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a === b; }))
		.attr("class", "intl-borders")
		.attr("d", path)
		.style('stroke-width',2)
		.style('stroke',colors['black']['004'])
		.style('stroke-linejoin','round')
		.style('fill','none');
}