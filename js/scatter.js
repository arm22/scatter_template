var data;
var xScale, yScale;

d3.csv('data/data.csv', function(error, dat) {
  // Data from http://data.worldbank.org/indicator/SP.DYN.LE00.IN
  data = dat.filter(function(d){return d['1960'] != ''})

  // SVG to work with
  var svg = d3.select('#vis')
    .append('svg')
    .attr('height', 400)
    .attr('width', 400)

  // Margin: how much space to leave in the SVG, above and below the charting area
  var margin = {
    left:50, 
    bottom:100, 
    top:50, 
    right:50,
  }

  var height = 400 - margin.bottom - margin.top 
  var width = 400 - margin.left - margin.right
  // G for the chart markers to be in (i.e., circles)
  var g = svg.append('g')
            .attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
            .attr('height', height)
            .attr('width', width)
  // Write a function to set your scales
  var setScales = function() {
    var xMax =d3.max(data, function(d){return d['1960']})*1.05
    var xMin =d3.min(data, function(d){return d['1960']})*.95
    var yMin =d3.min(data, function(d){return d['2012']})*.9
    var yMax =d3.max(data, function(d){return d['2012']})*1.05
    xScale  = d3.scale.linear().range([0, width]).domain([xMin, xMax])
    yScale = d3.scale.linear().range([height, 0]).domain([yMin, yMax])
  }

  // Write a function to define the positioning of your circles
  var circleFunc = function(circle) {
      circle.attr('r', 10)
            .attr('fill', 'blue')
            .attr('cx', function(d) { return xScale(d['1960'])})
            .attr('cy', function(d) { return yScale(d['2012'])})
            .attr('title', function(d) {return d['Country Name']})
            .style('opacity', .3)
  }



  // Write a reusable drawing function for circles
  var draw = function(data) {
      // Set Scales
      setScales()
      // Bind self.settings.data
      var circles = g.selectAll('circle').data(data)
    
      // Enter new elements
      circles.enter().append('circle').call(circleFunc)
    
      // Exit elements that may have left
      circles.exit().remove()
    
      // Transition all circles to new dself.settings.data
      g.selectAll('circle').transition().duration(1500).call(circleFunc)  
  }

  // Pass data to your drawing function
  draw(data)

  // Define x axis
  var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient('bottom')

  // Define y axis
  var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient('left')

  // Append x axis
  svg.append('g').call(xAxis)
      .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
      .attr('class', 'axis')
  
  // Append y axis
  svg.append('g')
    .attr('class', 'axis').call(yAxis)
      .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')


  // Add tooltip    
  $("circle").tooltip({
      'container': 'body',
      'placement': 'bottom'
  }); 

})

