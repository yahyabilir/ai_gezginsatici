var canvas, ctx;
var WIDTH, HEIGHT;
var points = [];
var running;
var canvasMinX, canvasMinY;
var doPreciseMutate;

var POPULATION_SIZE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;
var count;
var message="";

// Set initial temp
var temp = 10000;
// Cooling rate
var coolingRate = 0.003;

$(function() {
  init();
  initData();
  points = data25;
  $('#addRandom_btn').click(function() {
    addRandomPoints(50);
    $('#status').text("");
    running = false;
  });
  $('#start_btn').click(function() { 
    if(points.length >= 3) {
      initData();
      GAInitialize();
      running = true;	  
    } else {
      alert("add some more points to the map!");
    }
  });
  $('#clear_btn').click(function() {
    running === false;
    initData();
    points = new Array();
  });
  $('#stop_btn').click(function() {
    if(running === false && currentGeneration !== 0){
      if(best.length !== points.length) {
          initData();
          GAInitialize();
      }
      running = true;
    } else {
      running = false;
    }
  });
});
function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $('#canvas').width();
  HEIGHT = $('#canvas').height();
  setInterval(draw, 10);
  init_mouse();
}
function init_mouse() {
  $("canvas").click(function(evt) {
    if(!running) {
      canvasMinX = $("#canvas").offset().left;
      canvasMinY = $("#canvas").offset().top;
      $('#status').text("");

      x = evt.pageX - canvasMinX;
      y = evt.pageY - canvasMinY;
      points.push(new Point(x, y));
    }
  });
}
function initData() {
  running = false;
  POPULATION_SIZE = 10;
  CROSSOVER_PROBABILITY = 0.9;
  MUTATION_PROBABILITY  = 0.001;
  UNCHANGED_GENS = 0;
  mutationTimes = 0;
  doPreciseMutate = true;
  count = 100;

  bestValue = undefined;
  best = [];
  currentGeneration = 0;
  currentBest;
  population = []; //new Array(POPULATION_SIZE);
  values = new Array(POPULATION_SIZE);
  fitnessValues = new Array(POPULATION_SIZE);
  roulette = new Array(POPULATION_SIZE);
}
function addRandomPoints(number) {
  running = false;
  for(var i = 0; i<number; i++) {
    points.push(randomPoint());
  }
}
function drawCircle(point) {
  ctx.fillStyle   = '#000';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
function drawLines(array) {
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(points[array[0]].x, points[array[0]].y);
  for(var i=1; i<array.length; i++) {
    ctx.lineTo( points[array[i]].x, points[array[i]].y )
  }
  ctx.lineTo(points[array[0]].x, points[array[0]].y);

  ctx.stroke();
  ctx.closePath();
}
function draw() {
  if (running && count != 0){
  //if(running) {
    GANextGeneration();
	message = message + ";" + bestValue;
    $('#status').text("Haritada " + points.length + " adet şehir var. "
                      + currentGeneration + ". jenerasyon ile "
                      + mutationTimes + " adet mutasyon. Best value: "
                      + ~~(bestValue));
					  count --;
	$('#mesaj').text(message);				  
  } else {
    //$('#status').text("Haritada " + points.length + " adet şehir var. ")
  }
  clearCanvas();
  if (points.length > 0) {
    for(var i=0; i<points.length; i++) {
      drawCircle(points[i]);
    }
    if(best.length === points.length) {
      drawLines(best);
    }
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
