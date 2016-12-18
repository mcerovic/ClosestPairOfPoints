var canvas = document.getElementById("imgCanvas");
var context = canvas.getContext("2d");

// var points = [{'x': 2, 'y': 3}, {'x': 12, 'y': 30}, {'x': 40, 'y': 50}, {'x': 5, 'y': 1}, {'x': 12 ,'y': 10}, {'x': 3, 'y': 4}];
var points = [];

randomizePoints();

function clearPointsAndCanvas() {
  clearCanvas();
  clearPoints();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearPoints() {
  points = [];
}

function drawLine(args) {
  xPosition = args[0];
  dashed = args[1];
  if(dashed) {
    context.setLineDash([5, 3]);
  }
  else {
    context.setLineDash([0, 0]);
  }
  context.beginPath();
  context.moveTo(xPosition + 0.5, 0);
  context.lineTo(xPosition + 0.5, canvas.height);
  context.stroke();
}

function drawLineDistance(args) {
  pointA = args[0];
  pointB = args[1];
  context.setLineDash([5, 3]);
  context.beginPath();
  context.moveTo(pointA.x + 0.5, pointA.y + 0.5);
  context.lineTo(pointB.x + 0.5, pointB.y + 0.5);
  context.stroke();
  context.beginPath();
  context.fillStyle = "#000000";
  context.arc(pointA.x, pointA.y, 4, 0, 2 * Math.PI);
  context.arc(pointB.x, pointB.y, 4, 0, 2 * Math.PI);
  context.fill();
  context.beginPath();
  context.fillStyle = "#00FF00";
  context.arc(pointA.x, pointA.y, 3, 0, 2 * Math.PI);
  context.arc(pointB.x, pointB.y, 3, 0, 2 * Math.PI);
  context.fill();
}

function drawLeftRectangle(args) {
  startPoint = args[0];
  separationPoint = args[1];
  context.globalAlpha = 0.2;
  context.fillStyle="#FF0000";
  context.fillRect(startPoint, 0, Math.abs(separationPoint - startPoint), canvas.height);
  context.fillStyle="#000000";
  if(startPoint > 0) {
    context.fillRect(0, 0, startPoint, canvas.height);
  }
  context.globalAlpha = 1.0;
}

function drawRightRectangle(args) {
  separationPoint = args[0];
  endPoint = args[1];
  context.globalAlpha = 0.2;
  context.fillStyle="#0000FF";
  context.fillRect(separationPoint, 0, Math.abs(endPoint - separationPoint), canvas.height);
  context.fillStyle="#000000";
  if(endPoint < canvas.width) {
    context.fillRect(endPoint, 0, canvas.width, canvas.height);
  }
  context.globalAlpha = 1.0;
}

function draw(e) {
  var pos = getMousePos(canvas, e);
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
  points.push({"x": pos.x, "y": pos.y});
  context.fill();
}

window.draw = draw;

function drawPoint(x, y) {
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(x, y, 2, 0, 2 * Math.PI);
  context.fill();
}

function getMousePos(canvas, evt) {

  var rect = canvas.getBoundingClientRect();

  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Default animation speed
var animationSpeed = document.getElementById("animationSpeed").value;
document.getElementById("range").innerHTML = animationSpeed;

// Set value for range
function setAnimationSpeed(value) {
  animationSpeed = value;
	document.getElementById("range").innerHTML = animationSpeed;
}

// Set minimum distance at
function setMinDistance(value) {
  document.getElementById("disatnce").innerHTML = value;
}

function drawAllPoints() {
  for (var i = 0; i < points.length; i++) {
    drawPoint(points[i].x, points[i].y);
  }
}

function randomizePoints() {
  var numberOfPoints = document.getElementById("numberOfPoints");
  // Clear canvas and points
  clearPointsAndCanvas();
  // Generate points, add them to points array and draw them
  for (var i = 0; i < numberOfPoints.value; i++) {
      var width = numberOfPoints.value + 1;
      var x = Math.floor(Math.random() * (canvas.width - 60) + 30);
      var y = Math.floor(Math.random() * (canvas.height - 60) + 30);
      points.push({"x": x, "y": y});
  }
  drawAllPoints();
}

function markLine(lineId) {
  for (var i = 1; i <= 19; i++) {
    document.getElementById(i).className = "";
  }
  document.getElementById(lineId).className = "marked";
}

var algorithmAnimationCount = 1;
var pseudoCodeCount = 1;
var minimumDistance = 0;

function animatePseudoCode(func, param) {
  setTimeout(function() {
    func(param);
  }, pseudoCodeCount * animationSpeed);
  pseudoCodeCount++;
}

var x = true;

function animateAlgorithm(func, param) {
  param = param || null;
  if(x == true) {
    setTimeout(function() {
      if(param != null)
        func(param);
      else
        func();
    }, algorithmAnimationCount * animationSpeed);
  }
}


/*
  ================== ALGORITHM ==================
*/


// Function for sorting by X coordinate
function sortByX(a, b) {
  return a.x - b.x;
}

// Function for sorting by Y coordinate
function sortByY(a, b) {
  return a.y - b.y;
}

// Euclidian distance (L2 norm) between two points
function euclidianDistance(pointA, pointB) {
  return Math.sqrt(Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2));
}

// Util for sorting and calling the main function
function closestPairUtil() {

  var Px = [], Py = [];

  // Add points in two array
  for (var i = 0; i < points.length; i++) {
      Px.push(points[i]);
      Py.push(points[i]);
  }

  // Sort by X coordinate
  Px.sort(sortByX);

  // Sort by Y coordinate
  Py.sort(sortByY);

  // Call the main function
  return closestPair(Px, Py);
}

// Solution using divide and conquer strategy in O(nlogn)
function closestPair(Px, Py) {

  // Array size
  var n = Py.length;

  // if N <= 3 then
  animatePseudoCode(markLine, 1);
  if (n <= 3) {
    animatePseudoCode(markLine, 2);
    var min = Number.MAX_VALUE;
    var min_i, min_j;
    for(var i = 0; i < Px.length; i++) {
      for(var j = i + 1; j < Px.length; j++) {
        var dist = euclidianDistance(Px[i], Px[j]);
        if(dist < min) {
          min = dist;
          min_i = i;
          min_j = j;
        }
      }
    }
    return [min, Px[min_i], Px[min_j]];
  }

  // else
  animatePseudoCode(markLine, 3);

  // Find the middle point
  var mid = parseInt(n / 2);

  // Middle point
  animatePseudoCode(markLine, 4);
  var m = Px[mid];

  if(n > 3) {
    algorithmAnimationCount = pseudoCodeCount - 1;
    animateAlgorithm(clearCanvas);
    animateAlgorithm(drawAllPoints);
    animateAlgorithm(drawLine, [m.x, false]);
  }

  var Ly = [], Ry = [];
  animatePseudoCode(markLine, 5);
  animatePseudoCode(markLine, 6);

  for(var i = 0; i < n; i++)
    if(Py[i].x <= m.x)
      Ly.push(Py[i])
    else
      Ry.push(Py[i])

  // Left subset of points
  animatePseudoCode(markLine, 7);
  if(n > 3) {
    algorithmAnimationCount = pseudoCodeCount - 1;
    animateAlgorithm(drawLeftRectangle, [Px[0].x, m.x]);
  }
  var Lx = Px.slice(0, mid + 1); // var Lx = Px.slice(0, mid);

  // Right subset of points
  animatePseudoCode(markLine, 8);
  if(n > 3) {
    algorithmAnimationCount = pseudoCodeCount - 1;
    animateAlgorithm(drawRightRectangle, [m.x, Px[Px.length - 1].x]);
  }
  var Rx = Px.slice(mid); // var Rx = Px.slice(mid);

  // Call closest pair for the left side
  animatePseudoCode(markLine, 9);
  var dL = closestPair(Lx, Ly);
  algorithmAnimationCount = pseudoCodeCount - 1;
  animateAlgorithm(clearCanvas);
  animateAlgorithm(drawAllPoints);
  animateAlgorithm(drawLineDistance, [dL[1], dL[2]]);
  animateAlgorithm(drawLine, [m.x, false]);
  animateAlgorithm(drawLeftRectangle, [Lx[0].x, m.x]);
  animateAlgorithm(drawRightRectangle, [m.x, Px[Px.length - 1].x]);

  // Call closest pair for the right side
  animatePseudoCode(markLine, 10);
  var dR = closestPair(Rx, Ry);

  algorithmAnimationCount = pseudoCodeCount - 1;
  animateAlgorithm(clearCanvas);
  animateAlgorithm(drawAllPoints);
  animateAlgorithm(drawLineDistance, [dL[1], dL[2]]);
  animateAlgorithm(drawLineDistance, [dR[1], dR[2]]);
  animateAlgorithm(drawLine, [m.x, false]);
  animateAlgorithm(drawLeftRectangle, [Lx[0].x, m.x]);
  animateAlgorithm(drawRightRectangle, [m.x, Rx[Rx.length - 1].x]);

  // Minimum from the left and the right side
  animatePseudoCode(markLine, 11);
  // var d_min = Math.min(dL, dR);
  var d_min = dL[0] < dR[0] ? dL : dR;
  algorithmAnimationCount = pseudoCodeCount - 1;
  animateAlgorithm(clearCanvas);
  animateAlgorithm(drawAllPoints);
  animateAlgorithm(drawLineDistance, [d_min[1], d_min[2]]);
  animateAlgorithm(drawLine, [m.x, false]);
  animateAlgorithm(drawLeftRectangle, [Lx[0].x, m.x]);
  animateAlgorithm(drawRightRectangle, [m.x, Rx[Rx.length - 1].x]);


  // Points in strip
  animatePseudoCode(markLine, 12);
  var pointsInStrip = [];
  for (var i = 0; i < n; i++)
    if(Math.abs(Py[i].x - m.x) < d_min[0])
      pointsInStrip.push(Py[i]);

  animatePseudoCode(markLine, 13);
  var s_min = d_min;

  // Calculate minimum distance in strip
  animatePseudoCode(markLine, 14);
  for (var i = 0; i < pointsInStrip.length; i++) {
    animatePseudoCode(markLine, 15);
    for(var j = i + 1; j < pointsInStrip.length && (pointsInStrip[j].y - pointsInStrip[i].y) < s_min[0]; j++) {
      animatePseudoCode(markLine, 16);
      var dist = euclidianDistance(pointsInStrip[i], pointsInStrip[j]);
      animatePseudoCode(markLine, 17);
      if(dist < s_min[0]) {
        animatePseudoCode(markLine, 18);
        s_min = [dist, i, j];
      }
    }
  }

  animatePseudoCode(markLine, 19);
  // return Math.min(s_min, d_min);
  return d_min < s_min ? d_min : s_min;
}

function startAnimation() {

  var name = document.getElementById("startStopButton").innerHTML;

  if(name.trim().localeCompare("Start animation") == 0)
  {
    if(points.length <= 1) {
      alert("Please add at least 2 points");
    }
    else {
      document.getElementById("startStopButton").innerHTML = "Pause animation";
      minimumDistance = closestPairUtil();
      setMinDistance(minimumDistance[0]);
      algorithmAnimationCount = pseudoCodeCount - 1;
      animateAlgorithm(clearCanvas);
      animateAlgorithm(drawAllPoints);
      animateAlgorithm(drawLineDistance, [minimumDistance[1], minimumDistance[2]])
      
      var min = Number.MAX_VALUE;
      for(var i = 0; i < points.length; i++) {
        for(var j = i + 1; j < points.length; j++) {
          var dist = euclidianDistance(points[i], points[j]);
          if(dist < min) {
            min = dist;
          }
        }
      }
      console.log("Brute force : " + min);
    }
  }
  else {
    document.getElementById("startStopButton").innerHTML = "Start animation";
    x = false;
  }
}
