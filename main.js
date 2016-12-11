

var canvas = document.getElementById("imgCanvas");
var numberOfPoints = document.getElementById("numberOfPoints");
var context = canvas.getContext("2d");
var points = [];

randomizePoints();

function clearCanvas() {
  points = [];
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLine(xPosition, dashed) {

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

function drawLineDistance(pointA, pointB) {
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

function drawCircle(pointA, minDistance) {
  context.beginPath();
  context.setLineDash([0, 0]);
  context.globalAlpha = 0.5;
  context.arc(pointA.x, pointA.y, minDistance, 0, 2 * Math.PI, false);
  context.fillStyle = 'green';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = '#000000';
  context.stroke();
  context.globalAlpha = 1.0;
}

function drawRectangle(separationPoint) {
  context.globalAlpha = 0.2;
  context.fillStyle="#FF0000";
  context.fillRect(0, 0, separationPoint, canvas.height);
  context.fillStyle="#0000FF";
  context.fillRect(separationPoint, 0, canvas.height, canvas.height);
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

function showValue(newValue) {
	document.getElementById("range").innerHTML = newValue;
}

function setMinDistance(value) {
  document.getElementById("disatnce").innerHTML = value;
}

function randomizePoints() {

  console.log("Randomize points");

  // Clear canvas and points
  clearCanvas();

  // Generate points, add them to points array and draw them
  for (var i = 0; i < numberOfPoints.value; i++) {
      var width = numberOfPoints.value + 1;
      var x = Math.floor(Math.random() * (canvas.width - 60) + 30);
      var y = Math.floor(Math.random() * (canvas.height - 60) + 30);
      drawPoint(x, y);
      points.push({"x": x, "y": y});
  }
}

function markLine(lineId) {
  for (var i = 0; i < 5; i++) {
    document.getElementById("1").className = "";
  }
  document.getElementById(lineId).className = "marked";
}

function startAnimation() {
  console.log("Start animation");
  if(points.length == 0) {
    alert("Please add points");
  }
  else {
    drawLine(250);
    drawRectangle(250);
    drawLineDistance(points[4], points[14]);
    drawCircle(points[10], 100);
    markLine("3");
    setMinDistance(betterSolutin());
  }
}

// Euclidian distance (L2 norm) between two points
function euclidianDistance(pointA, pointB) {
  return Math.sqrt(Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2));
}

// Trivial brute force solution in O(n^2)
function bruteForceSolutin(pointsArray) {
  var min = Number.MAX_VALUE;
  for(var i = 0; i < pointsArray.length; i++) {
    for(var j = i + 1; j < pointsArray.length; j++) {
      var dist = euclidianDistance(pointsArray[i], pointsArray[j]);
      if(dist < min) {
        min = dist;
      }
    }
  }
  return min;
}

// Function for sorting by X coordinate
function sortByX(a, b) {
  return a.x - b.x;
}

// Function for sorting by Y coordinate
function sortByY(a, b) {
  return a.y - b.y;
}

// Better solution using divide and conquer strategy in O(nlogn)
function betterSolutin() {

  var pointsSortedX = [], pointsSortedY = [];

  for (var i = 0; i < points.length; i++) {
      pointsSortedX.push(points[i]);
      pointsSortedY.push(points[i]);
  }

  pointsSortedX.sort(sortByX);
  pointsSortedY.sort(sortByY);

  return closestUtil(pointsSortedX, pointsSortedY, points.length);
}

function stripClosest(pointsInStrip, minDistance) {

  var min = minDistance;

  for (var i = 0; i < pointsInStrip.length; i++)
  {
    for(var j = i + 1; j < pointsInStrip.length &&
      (pointsInStrip[j].y - pointsInStrip[i].y) < min; j++) {
      var dist = euclidianDistance(pointsInStrip[i], pointsInStrip[j]);
      if(dist < min)
        min = dist;
    }
  }
  return min;
}


function closestUtil(pointsSortedX, pointsSortedY, size) {

  // If there are 2 or 3 points, then use brute force
  if (size <= 3)
      return bruteForceSolutin(pointsSortedX);

  // Find the middle point
  var mid = parseInt(size / 2);
  var stripLine = pointsSortedX[mid];

  var left = [], right = [];

  for(var i = 0; i < size; i++) {

    if(pointsSortedY[i].x <= stripLine.x) {
      left.push(pointsSortedY[i])
    }
    else {
      right.push(pointsSortedY[i])
    }
  }

  var dl = closestUtil(pointsSortedX, left, mid)
  var dr = closestUtil(pointsSortedX.splice(0, mid), left, size - mid - 1)

  var d = Math.min(dl, dr);

  var pointsInStrip = [];

  for (var i = 0; i < size; i++) {
    if(Math.abs(pointsSortedY[i].x - stripLine.x) < d)
      pointsInStrip.push(pointsSortedY[i]);
  }

  return Math.min(d, stripClosest(pointsInStrip, d));
}

window.draw = draw;
