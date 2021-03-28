// create empty nodes array
var nodes = {};

var width = 1200,
    height = 1200

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    //.gravity(0.1)
    .distance(100)
    .charge(-100)
    .size([width, height]);

d3.csv("PAIR.csv", function(error, links) {
	if (error) throw error;

	// compute nodes from links data
	links.forEach(function(link) {
	    link.source = nodes[link.source] ||
	        (nodes[link.source] = {name: link.source});
	    link.target = nodes[link.target] ||
	        (nodes[link.target] = {name: link.target});        
	});

	force.nodes(d3.values(nodes))
		.links(links)
	  	.start();

	var link = svg.selectAll(".link")
		.data(force.links())
		.enter()
		.append("line")
		.attr("class", "link");

	var node = svg.selectAll(".node")
		.data(force.nodes())
		.enter()
		.append("g")
		.attr("class", "node")
		.call(force.drag) 
		.on('dblclick', connectedNodes);

	node.append("image")
		.attr("xlink:href", function(d) { return "clothing_image/"+d.name+".jpg";})
		.attr("x", -8)
		.attr("y", -8)
		.attr("width", 40)
		.attr("height", 40);

	// node.append("text")
	//   .attr("dx", 12)
	//   .attr("dy", ".35em")
	//   .text(function(d) { return d.name });

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});

	//Toggle stores whether the highlighting is on
	var toggle = 0;

	//Create an array logging what is connected to what
	var linkedByIndex = {};
	for (i = 0; i < force.nodes().length; i++) {
	    linkedByIndex[i + "," + i] = 1;
	};

	force.links().forEach(function (d) {
	    linkedByIndex[d.source.index + "," + d.target.index] = 1;
	});

	//This function looks up whether a pair are neighbours
	function neighboring(a, b) {
	    return linkedByIndex[a.index + "," + b.index];
	}

	function connectedNodes() {
	    if (toggle == 0) {
	        //Reduce the opacity of all but the neighbouring nodes
	        d = d3.select(this).node().__data__;
	        node.style("opacity", function (o) {
	            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.05;
	        });
	        link.style("opacity", function (o) {
	            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.05;
	        });
	        //Reduce the op
	        toggle = 1;
	    } else {
	        //Put them back to opacity=1
	        node.style("opacity", 1);
	        link.style("opacity", 1);
	        toggle = 0;
	    }
	}



});



