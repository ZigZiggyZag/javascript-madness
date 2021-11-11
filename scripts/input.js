var canvas = document.getElementById("gameCanvas");

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

export {mouseX, mouseY, inCanvas, up, dw, lf, rt};