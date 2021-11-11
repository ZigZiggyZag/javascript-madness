import {mouseX, mouseY, inCanvas, up, dw, lf, rt} from './input.js';
import { smileyFace } from './assets.js';

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height/2;

var cX = canvas.width/2;
var cY = canvas.height/2;

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

    drawCircle(cX, cY, 10, "#FF0000")

    if (up) { cY -= 2 };
    if (dw) { cY += 2 };
    if (lf) { cX -= 2 };
    if (rt) { cX += 2 };
}

setInterval(draw, 10);