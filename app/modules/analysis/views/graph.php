

<script type="text/rocketscript" data-rocketsrc="http://d3js.org/d3.v2.js"></script>

  <div id="container">
    <b>Click on countries or graph points to interact</b><p>
    The graph to the right shows how people in different countries used the web in 2009. The columns represent how many people partook in the activity:
    <p> Social - Social networking<br>
    Photos - Upload Photos<br>
    Blog - Write a Blog<br>
    Videos - Upload Videos<br>
    Mblog - Use a microblog<br>
  </div>
  <div id="graph">
    <div id="ctitle">
      Country&nbsp;&nbsp;(%online)
    </div>
    <div id="buttons">
    <div class="mx-button">
    <input type="radio" name="mx" id="button1" checked>
    <label for="button1" unselectable>Online Population</label>
    </div>
    <div class="mx-button">
    <input type="radio" name="mx" id="button2">
    <label for="button2" unselectable>Total Population</label>
    </div>
    <div class="mx-button">
    <input type="radio" name="mx" id="button3">
    <label for="button3" unselectable>Absolute</label>
    </div>
    </form>
    </div>
    <div id="viz"></div>
  </div>
<script type="text/rocketscript">

var graf = d3.select("#viz")
.append("svg")
.attr("width", "100%")
.attr("height", "100%")    
.append("g")
.attr("transform", "translate(100,30)");

var col = d3.scale.category10();

var objs = ["social","photos", "blog", "videos", "mblog"];

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, 400]);

 var xdata  = d3.scale.ordinal()
      .domain(objs)
      .rangeBands([0, 400]);

var y = d3.scale.linear()
    .domain([0.7, 0])
    .range([0, "70%"]);

var ypop = d3.scale.log()
    .domain([300000000, 300000])
    .range([0, "70%"]);

d3.csv("inf.csv", function(csv) {
  var node = graf
  .selectAll("circle")
  .data(csv)
  .enter();
 
graf.selectAll("line")
   .data(x.ticks(4))
   .enter().append("line")
     .attr("x1", function(d){return x(d)-40; })
     .attr("x2", function(d){return x(d)-40; })
     .attr("y1", 0)
     .attr("y2", "70%")
     .style("stroke", "#ccc");
node.append("text")
  .attr("class", function(d) {return "ia " + d.country;})
  .attr("fill", "black")
  .attr("opacity", "0.3")
  .attr("x", "440")
  .attr("y", function(d,i) {return i*27+50})
  .attr("text-anchor", "middle")
  .text(function(d) {return d.country});
node.append("rect")
  .attr("fill", "gray")
  .attr("x", "490")
  .attr("y", function(d,i) {return i*27+40})
  .attr("width",function(d){return d.online*50})
  .attr("class","ia")
  .attr("height",12);

node.append("rect")
  .attr("fill", "gray")
  .attr("x", function(d) {return 490+d.online*50;})
  .attr("y", function(d,i) {return i*27+40})
  .attr("width", function(d){return 50*(1-d.online)})
  .attr("height",12);

  node.append("text")
    .attr("class", function(d) {return "ia label "+d.country + " " + objs[Math.round(d.blog*100)%4]})
    .attr("x", function(d) {return xdata(objs[Math.round(d.blog*100)%4])+25})
    .attr("y", function(d){return y(d[objs[Math.round(d.blog*100)%4]]+25);})
    .text(function(d) {return d.country})
    .style("opacity", 0)
    .style("font-size", 14)
    .style("fill", "black");

objs.forEach(function(obj,i){
  node
  .append("circle")
  .style("fill", "gray")
  .attr("cx", function(d) {return xdata(obj)})
  .attr("cy", function(d){return y(d[obj]);})
  .attr("id", function(d){return obj})
  .attr("class", function(d) {return "ia " + d.country +" " + obj;});
  


  graf.append("text")
  .attr("class", "rule3")
  .attr("fill", "Black")
  .attr("x", xdata(obj))
  .attr("y", "75%")
  .attr("text-anchor", "middle")
  .text(obj.charAt(0).toUpperCase() + obj.slice(1));
});

var filterAbs = function(d,obj,y){return y(d[obj]*d.population*d.online)};

var filterTotal= function(d,obj,y){return y(d[obj]*d.online)};

var filterOnline= function(d,obj,y){return y(d[obj])};

var rescale = function(d, fil,y) {
    objs.forEach(function(obj,i){
      graf
      .selectAll("."+obj)
      .transition()
      .duration(1000)
      .attr("y", function(d,i){return fil(d,obj,y)})
      .attr("cy", function(d,i){return fil(d,obj,y)});
});
}

d3.select("#button3")  
  .on("click", function(d) {
    rescale(d, filterAbs, ypop);
    yTicks(ypop, "s");
  });

d3.select("#button1")  
  .on("click", function(d) {
    rescale(d, filterOnline, y);
    yTicks(y, "%");
  });

d3.select("#button2")  
  .on("click", function(d) {
    rescale(d, filterTotal, y);
    yTicks(y, "%");
  });


graf.selectAll("circle")
  .attr("r", 20)
  .style("opacity", 0.3);

var updateCountries = function(countryStack)
{
  graf.selectAll(".ia")
    .transition()
    .duration(1000)
    .style("opacity", 0.3)
    .style("fill", "gray")
    .attr("r", 8);
  
  graf.selectAll("text.label")
    .transition()
    .duration(1000)
    .style("opacity", 0);
  

  countryStack.forEach(function(country, i) {
    var d = graf.selectAll("circle." + country);
    graf.selectAll(".ia")
      .filter(function (e) {return country == e.country})
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .style("fill", function() {return col(i)})
      .attr("r", 20);
   });
};
var countryStack = ["Japan","India", "Australia"];
updateCountries(countryStack);

graf.selectAll(".ia")  
  .on("click", function(d) {
  if(!countryStack.some(function(e,i) {return d.country==e})) {
    countryStack.push(d.country);
    } else {
     countryStack = countryStack.filter(function(e,i){
       return d.country != e
     });
    }
  updateCountries(countryStack);
  });

yTicks(y, "%");

});
var yTicks = function(y, format) {
graf.selectAll(".rule2")
  .remove();

var arr = y.ticks(5);
//thin out log scales
if (arr.length > 8)
{
  arr = arr.filter(function(d, i) {return i%2});
};
  
graf.selectAll(".rule2")
  .data(arr)
  .enter().append("text")
  .attr("class", "rule2")
  .attr("x", -75)
  .attr("y", y)
  .attr("dy", -3)
  .style("fill", "black")
  .attr("text-anchor", "middle")
  .text(d3.format(format));
}

</script>