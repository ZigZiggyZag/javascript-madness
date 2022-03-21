import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';
import { smileyFace, player, area1, cursor, cursorPressed } from './assets.js';

var canvas = document.getElementById("gameCanvas");
var collisionCanvas = document.createElement('canvas');
var context = canvas.getContext("2d");
var collisionContext = canvas.getContext("2d");

var cX = 640 - canvas.width/2;
var cY = 640 - canvas.height/2;

var walkDistance = 0;
var walkFrame = 0;

function draw(e)
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(area1, 0 + cX, 0 + cY, canvas.width + cX, canvas.height + cY, 0, 0, canvas.width + cX, canvas.height + cY);

    // Basic walking animation
    if (up || dw || lf || rt){
        walkDistance++;
        if (walkDistance >= 20){
            walkFrame++;
            walkDistance = 0;
            if (walkFrame > 1){
                walkFrame = 0;
            }
        }

        switch(walkFrame){
            case 0:
                context.drawImage(player, 65, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
                break;
            case 1:
                context.drawImage(player, 128, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
                break;
            default:
                context.drawImage(player, 0, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
        }
    }
    else{
        context.drawImage(player, 0, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
    }

    // Movement Input
    if (up && (cY > 0)) { cY -= 2 }
    if (dw && (cY < 1280 - canvas.height)) { cY += 2 }
    if (lf && (cX > 0)) { cX -= 2 }
    if (rt && (cX < 1280 - canvas.width)) { cX += 2 }
    
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