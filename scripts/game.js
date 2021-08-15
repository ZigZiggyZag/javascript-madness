var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height/2;

var up = false;
var dw = false;
var lf = false;
var rt = false;

var mouseX = 0;
var mouseY = 0;

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("mousemove", getMouseXY);

function handleKeyDown(e)
{
    if(e.key == "w") { up = true };
    if(e.key == "s") { dw = true };
    if(e.key == "a") { lf = true };
    if(e.key == "d") { rt = true };
}

function handleKeyUp(e)
{
    if(e.key == "w") { up = false };
    if(e.key == "s") { dw = false };
    if(e.key == "a") { lf = false };
    if(e.key == "d") { rt = false };
}

function getMouseXY(e)
{
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}

function getRandomSign()
{
    return Math.random() < 0.5 ? -1 : 1;
}

function drawCircle(x, y, radius, color)
{
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function draw()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    x = mouseX;
    y = mouseY;

    drawCircle(x, y, 10, "#FF0000")

    //if (up) { y -= 2 };
    //if (dw) { y += 2 };
    //if (lf) { x -= 2 };
    //if (rt) { x += 2 };
}

setInterval(draw, 10);