import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';
import { smileyFace, player, area1, cursor, cursorPressed } from './assets.js';

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var cX = 640 - canvas.width/2;
var cY = 640 - canvas.height/2;

var walkDistance = 0;
var walkFrame = 0;

function draw(e)
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (mouseClick)
    {
        context.drawImage(cursorPressed, mouseX, mouseY);
    }
    else
    {
        context.drawImage(cursor, mouseX, mouseY);
    }

    context.fillText('X: ' + cX, 5, 10);
    context.fillText('Y: ' + cY, 5, 20);

    if ((cX > 300 && cX < 500) && (cY < 20))
    {
        context.fillText('Press [E] to battle!', 5, 30);
    }
}

setInterval(draw, 10);