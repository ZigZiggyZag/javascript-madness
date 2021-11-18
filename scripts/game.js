import {mouseX, mouseY, inCanvas, up, dw, lf, rt} from './input.js';
import { smileyFace, player, area1 } from './assets.js';

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var cX = 640 - canvas.width/2;
var cY = 640 - canvas.height/2;

function draw(e)
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(area1, 0 + cX, 0 + cY, canvas.width + cX, canvas.height + cY, 0, 0, canvas.width + cX, canvas.height + cY);

    context.drawImage(player, 0, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);

    context.fillText('X: ' + cX, 5, 10);
    context.fillText('Y: ' + cY, 5, 20);

    if (up && (cY > 0)) { cY -= 2 };
    if (dw && (cY < 1280 - canvas.height)) { cY += 2 };
    if (lf && (cX > 0)) { cX -= 2 };
    if (rt && (cX < 1280 - canvas.width)) { cX += 2 };
}

setInterval(draw, 10);