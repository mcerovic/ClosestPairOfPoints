// Canvas variables
var canvas;
var context;

// Animation variables
var currentAnimationStep = 0;
var maxAnimationSteps;
var animationInterval;
var animationList = [];

// Algorithm variables
var minimumDistance = 0;
var animationSpeed;
var points = [];

initialize();

/*
======================= UTILS =======================
*/

function clearPoints() {
    points = [];
}

function setMinDistance(value) {
    document.getElementById("disatnce").innerHTML = Math.round(value * 100) / 100
}

function initialize() {
    canvas = document.getElementById("imgCanvas");
    context = canvas.getContext("2d")
    // Disable step back and forward
    document.getElementById("stepBackButton").disabled = true;
    document.getElementById("stepForwardButton").disabled = true;
    // Default animation speed
    animationSpeed = document.getElementById("animationSpeed").value;
    document.getElementById("range").innerHTML = animationSpeed;
    // Set default draw
    window.draw = draw;
    // Randomize points on start
    randomizePoints();
}

/*
================== DRAWING FUNCTION ==================
*/

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLine(xPosition, dashed) {
    if(dashed) {
        context.setLineDash([5, 3]);
    } else {
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

function drawLeftRectangle(startPoint, separationPoint) {
    context.globalAlpha = 0.2;
    context.fillStyle="#FF0000";
    context.fillRect(startPoint, 0, Math.abs(separationPoint - startPoint), canvas.height);
    context.fillStyle="#000000";
    if(startPoint > 0) {
        context.fillRect(0, 0, startPoint, canvas.height);
    }
    context.globalAlpha = 1.0;
}

function drawRightRectangle(separationPoint, endPoint) {
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

function drawAllPoints() {
    for (var i = 0; i < points.length; i++) {
        drawPoint(points[i].x, points[i].y);
    }
}

function markLine(lineId) {

    for (var i = 1; i <= 19; i++) {
        document.getElementById(i).className = "";
    }

    if(lineId != 0) {
        document.getElementById(lineId).className = "marked";
    } else {
        document.getElementById("startButton").innerHTML = "Start animation";
        document.getElementById("stepBackButton").disabled = true;
        document.getElementById("stepForwardButton").disabled = true;
    }
}

/*
====================== ALGORITHM ======================
*/

function sortByX(a, b) {
    // Function for sorting by X coordinate

    return a.x - b.x;
}

function sortByY(a, b) {
    // Function for sorting by Y coordinate

    return a.y - b.y;
}

function euclidianDistance(pointA, pointB) {
    // Euclidian distance (L2 norm) between two points

    return Math.sqrt(Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2));
}

function closestPairUtil() {
    // Util for sorting and calling the main function

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

function closestPair(Px, Py) {
    // Solution using divide and conquer strategy in O(nlogn)

    // Array size
    var n = Py.length;

    // if N <= 3 then
    animationList.push({"func": ["markLine"], "param": [[1]]});

    // Brute force
    if (n <= 3) {
        animationList.push({"func": ["markLine"], "param": [[2]]});
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
    animationList.push({"func": ["markLine"], "param": [[3]]});

    // Find the middle point
    var mid = parseInt(n / 2);

    // Middle point
    // animationList.push({"func": ["markLine"], "param": [[4]]});
    var m = Px[mid];

    if(n > 3) {
        animationList.push({
            "func": ["markLine", "clearCanvas", "drawAllPoints", "drawLine"],
            "param": [[4], null, null, [m.x, false]]
        });
    }
    
    var Ly = [], Ry = [];
    animationList.push({"func": ["markLine"], "param": [[5]]});
    animationList.push({"func": ["markLine"], "param": [[6]]});
    for(var i = 0; i < n; i++) {
        if(Py[i].x <= m.x) {
            Ly.push(Py[i])
        }
        else {
            Ry.push(Py[i])
        }
    }

    // Left subset of points
    var Lx = Px.slice(0, mid + 1); // var Lx = Px.slice(0, mid);
    // animationList.push({"func": ["markLine"], "param": [[7]]});
    if(n > 3) {
        // Draw rectangle for left subset of points
        animationList.push({"func": ["markLine", "drawLeftRectangle"], "param": [[7], [Px[0].x, m.x]]});
    }

    // Right subset of points
    var Rx = Px.slice(mid); // var Rx = Px.slice(mid);
    // animationList.push({"func": ["markLine"], "param": [[8]]});
    if(n > 3) {
        // Draw rectangle for right subset of points
        animationList.push({"func": ["markLine", "drawRightRectangle"], "param": [[8], [m.x, Px[Px.length - 1].x]]});
    }

    // Call closest pair for the left side
    var dL = closestPair(Lx, Ly);

    // Animate closest pair for the left side
    animationList.push({
        "func": ["markLine", "clearCanvas", "drawAllPoints", "drawLineDistance", "drawLine", "drawLeftRectangle", "drawRightRectangle"],
        "param": [[9], null, null, [dL[1], dL[2]], [m.x, false], [Lx[0].x, m.x], [m.x, Px[Px.length - 1].x]]
    });

    // Call closest pair for the right side
    var dR = closestPair(Rx, Ry);

    // Animate closest pair for the right side
    animationList.push({
        "func": ["markLine", "clearCanvas", "drawAllPoints", "drawLineDistance", "drawLineDistance", "drawLine", "drawLeftRectangle", "drawRightRectangle"],
        "param": [[10], null, null, [dL[1], dL[2]], [dR[1], dR[2]], [m.x, false], [Lx[0].x, m.x], [m.x, Rx[Rx.length - 1].x]]
    });

    // Minimum from the left and the right side
    animationList.push({"func": ["markLine"], "param": [[11]]});
    var d_min = dL[0] < dR[0] ? dL : dR;

    // Points in strip
    animationList.push({"func": ["markLine"], "param": [[12]]});
    var pointsInStrip = [];
    for (var i = 0; i < n; i++) {
        if(Math.abs(Py[i].x - m.x) < d_min[0]) {
            pointsInStrip.push(Py[i]);
        }
    }

    animationList.push({"func": ["markLine"], "param": [[13]]});
    var s_min = d_min;

    // Calculate minimum distance in strip
    animationList.push({"func": ["markLine"], "param": [[14]]});

    // Draw strip lines
    animationList.push({
        "func": ["clearCanvas", "drawAllPoints", "drawLineDistance", "drawLine", "drawLeftRectangle", "drawRightRectangle", "drawLine", "drawLine"],
        "param": [null, null, [d_min[1], d_min[2]], [m.x, false], [Lx[0].x, m.x], [m.x, Rx[Rx.length - 1].x], [m.x - d_min[0], true], [m.x + d_min[0], true]]
    });

    for (var i = 0; i < pointsInStrip.length; i++) {

        animationList.push({"func": ["markLine"], "param": [[15]]});

        for(var j = i + 1; j < pointsInStrip.length && (pointsInStrip[j].y - pointsInStrip[i].y) < s_min[0]; j++) {

            animationList.push({"func": ["markLine"], "param": [[16]]});

            var dist = euclidianDistance(pointsInStrip[i], pointsInStrip[j]);

            animationList.push({"func": ["markLine"], "param": [[17]]});

            if(dist < s_min[0]) {
                animationList.push({"func": ["markLine"], "param": [[18]]});
                s_min = [dist, i, j];
            }
        }
    }

    // Return
    animationList.push({"func": ["markLine"], "param": [[19]]});

    return d_min < s_min ? d_min : s_min;
}

function pauseAnimation() {
    clearInterval(animationInterval);
}

function startAnimation() {

    maxAnimationSteps = animationList.length;

    animationInterval = setInterval(function() {

        // Current animation object
        var animationObject = animationList[currentAnimationStep];

        // Call all animation functions for the current object
        for (var i = 0; i < animationObject["func"].length; i++) {
            if(animationObject["param"][i] != null) {
                window[animationObject["func"][i]].apply(undefined, animationObject["param"][i]);
            } else {
                window[animationObject["func"][i]].apply(null, null);
            }
        }

        // Next animation step
        currentAnimationStep++;

        // Stop animation
        if(currentAnimationStep == maxAnimationSteps) {
            clearInterval(animationInterval);
            markLine(0);
            clearCanvas();
            drawAllPoints();
            drawLineDistance(minimumDistance[1], minimumDistance[2]);
            setMinDistance(minimumDistance[0]);
        }

    }, animationSpeed);
}

/*
======================= ONCLICK =======================
*/

function start() {

    var startButton = document.getElementById("startButton");

    if(points.length <= 1) {
        alert("Please add at least 2 points");
    }
    else {

        if(startButton.innerHTML.trim().localeCompare("Start animation") == 0) {
            startButton.innerHTML = "Pause animation";
            clearCanvas();
            drawAllPoints();
            minimumDistance = closestPairUtil();
            startAnimation();
        }
        else if(startButton.innerHTML.trim().localeCompare("Pause animation") == 0) {
            startButton.innerHTML = "Resume animation";
            document.getElementById("stepBackButton").disabled = false;
            document.getElementById("stepForwardButton").disabled = false;
            pauseAnimation();
        }
        else if(startButton.innerHTML.trim().localeCompare("Resume animation") == 0) {
            startButton.innerHTML = "Pause animation";
            document.getElementById("stepBackButton").disabled = true;
            document.getElementById("stepForwardButton").disabled = true;
            startAnimation();
        }
    }
}

function stepBack() {

    pauseAnimation();

    if(currentAnimationStep > 1) {
        // Previous animation step
        currentAnimationStep--;
        clearCanvas();
        drawAllPoints();
        // Animate everything until currentAnimationStep
        for (var i = 0; i < currentAnimationStep; i++) {
            // Current animation object
            var animationObject = animationList[i];
            // Call all animation functions for the current object
            for (var j = 0; j < animationObject["func"].length; j++) {
                if(animationObject["param"][j] != null) {
                    window[animationObject["func"][j]].apply(undefined, animationObject["param"][j]);
                } else {
                    window[animationObject["func"][j]].apply(null, null);
                }
            }
        }
    }
    else if(currentAnimationStep == 1){
        // Starting point
        markLine(0);
        currentAnimationStep = 0;
    }
}

function stepForward() {

    if(currentAnimationStep < maxAnimationSteps) {
        // Current animation object
        var animationObject = animationList[currentAnimationStep];
        // Call all animation functions for the current object
        for (var i = 0; i < animationObject["func"].length; i++) {
            if(animationObject["param"][i] != null) {
                window[animationObject["func"][i]].apply(undefined, animationObject["param"][i]);
            } else {
                window[animationObject["func"][i]].apply(null, null);
            }
        }
        // Previous animation step
        currentAnimationStep++;
    }
    else {
        // Finish animation
        clearInterval(animationInterval);
        markLine(0);
        clearCanvas();
        drawAllPoints();
        drawLineDistance(minimumDistance[1], minimumDistance[2]);
        setMinDistance(minimumDistance[0]);

        document.getElementById("startButton").innerHTML = "Start animation";
        document.getElementById("stepBackButton").disabled = true;
        document.getElementById("stepForwardButton").disabled = true;
    }
}

function clearPointsAndCanvas() {
    animationList = [];
    currentAnimationStep = 0;
    pauseAnimation();
    clearCanvas();
    clearPoints();
    markLine(0);
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

function setAnimationSpeed(value) {
    animationSpeed = value;
    document.getElementById("range").innerHTML = animationSpeed;
}
