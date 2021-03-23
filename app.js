// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
// set the dimensions and margins of the graph

var svgWidth = 1000;
var svgHeight = 700;

var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;



// set the ranges
var x = d3.scaleLinear().range([0, chartWidth]);
var y = d3.scaleLinear().range([chartHeight, 0]);

// define the line
var valueline = d3.line()
  .x(function(state) {
    return x(state.age);
  })
  .y(function(state) {
    return y(state.smokes);
  });

// append the svg obgect to the id of the page
// appends a 'group' element to 'svg'

// moves the 'group' element to the top left margin
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Get the data
d3.csv("data.csv").then(function(statsdata) {

  console.log(statsdata);

  // format the data
  statsdata.forEach(function(state) {
    state.age = +state.age;
    state.smokes = +state.smokes;
    state.abbr = state.abbr;
  });

  // Scale the range of the data
  x.domain(d3.extent(statsdata, function(state) {
    return state.age;
  }));
  y.domain([0, d3.max(statsdata, function(state) {
    return state.smokes;
  })]);

  // Add the valueline path.
  chartGroup.append("path")
    .data(statsdata)
    .attr("class", "line")
    .attr("d", valueline);

  // Add the scatterplot and make the state abbreviation appear on top
  var gdots = chartGroup.selectAll('dot')
    .data(statsdata)
    .enter().append("g")
    gdots.append('circle')
    .attr('fill', 'orange')
    .attr("r", 20)
    .attr("cx", function(state) {
      return x(state.age);
    })
    .attr("cy", function(state) {
      return y(state.smokes)
    })
    gdots.append("text")
      .text(function(state){return state.abbr})
      .attr("font-size",15)
      .attr("color", "black")
      .attr("x", function (state) {
        return x(state.age-0.098);
      })
      .attr("y", function (state) {
        return y(state.smokes-0.098);
      });



      // Add a tooltip
    var tooltip = d3.tip()
       .attr('class', 'tooltip')
       .offset([-10, 0])
       .style('border', '1px solid #fff')
       .style('box-shadow', '1px 1px 4px rgba(0,0,0,0.5)')
       .style('border-radius', 'none')
       .html(function(state) {
    return (`${state.abbr} <br> Age (median): ${state.age} <br> Smokes: ${state.smokes}%`) ;
  });

    chartGroup.call(tooltip);

    // Step 2: Create "mouseover" event listener to display tooltip
    gdots.on("mouseover", function(state){
      tooltip.show(state, this);
    })
       // Step 3: Create "mouseout" event listener to hide tooltip
    gdots.on("mouseout", function(state, index) {
         tooltip.hide(state);
       });



  // Add the X Axis
  chartGroup.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x))
    .call(g => g.append("text")
      .attr("x", chartWidth)
      .attr("y", margin.bottom - 20)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .attr('font-size', '14px')
      .text("Age (median)"));


  // Add the Y Axis
  chartGroup.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 20)
        .attr('transform', 'rotate(-90)')
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr('font-size', '14px')
        .text("Smokes %"));

      }).catch(function(error) {
        console.log(error);
      });
