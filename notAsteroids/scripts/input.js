var canvas = document.getElementById("gameCanvas");

var up = false;
var dw = false;
var lf = false;
var rt = false;
var fire1 = false;
var fire2 = false;
var dash = false;
var restart = false;

var mouseX = 0;
var mouseY = 0;
var mouseClick = false;
var inCanvas = true;

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("mousemove", getMouseXY);
document.addEventListener("mousedown", setMouseDown);
document.addEventListener("mouseup", setMouseUp);

function handleKeyDown(e)
{
    if(e.key == "w") { up = true };
    if(e.key == "s") { dw = true };
    if(e.key == "a") { lf = true };
    if(e.key == "d") { rt = true };
    if(e.key == "r") { restart = true };
    if(e.key == " ") { fire1 = true};
}

function handleKeyUp(e)
{
    if(e.key == "w") { up = false };
    if(e.key == "s") { dw = false };
    if(e.key == "a") { lf = false };
    if(e.key == "d") { rt = false };
    if(e.key == "r") { restart = false };
    if(e.key == " ") { fire1 = false};
}

function getMouseXY(e)
{
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    inCanvas = (e.clientX > rect.left && e.clientX < rect.right) && 
                (e.clientY > rect.top && e.clientY < rect.bottom)
}

function setMouseDown(e)
{
    mouseClick = true;
}

function setMouseUp(e)
{
    mouseClick = false;
}

export {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt, fire1, restart};