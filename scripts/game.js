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
var inCanvas = true;

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
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    inCanvas = (e.clientX > rect.left && e.clientX < rect.right) && 
                (e.clientY > rect.top && e.clientY < rect.bottom)
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

var smileyFace = new Image();
smileyFace.src = 'assets/SmileyFace.png';
smileyFace.alt = 'smiley face';

function draw(e)
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    if(inCanvas)
    {
        x = mouseX - (smileyFace.width / 2);
        y = mouseY - (smileyFace.height / 2);
    }

    context.drawImage(smileyFace, x, y);

    context.fillText('X: ' + mouseX, 5, 10);
    context.fillText('Y: ' + mouseY, 5, 20);

    //drawCircle(x, y, 10, "#FF0000")

    //if (up) { y -= 2 };
    //if (dw) { y += 2 };
    //if (lf) { x -= 2 };
    //if (rt) { x += 2 };
}

setInterval(draw, 10);