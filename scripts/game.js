var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height/2;

function getRandomSign()
{
    return Math.random() < 0.5 ? -1 : 1;
}

var dx = 2 * getRandomSign();
var dy = 2 * getRandomSign();

function draw()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI*2);
    context.fillStyle = "#FF0000";
    context.fill();
    context.closePath();

    dx = (x <= 5 || x >= canvas.width - 5) ? -dx : dx;
    dy = (y <= 5 || y >= canvas.height - 5) ? -dy: dy;

    x += dx;
    y += dy;
}

setInterval(draw, 10);