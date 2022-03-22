import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';
import {objectList, Ship} from './objects.js';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

new Ship(canvas.width/2, canvas.height/2, 0, 7.5)

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update all object logic
    for (var key in objectList) {
        if (typeof objectList[key].update !== 'undefined') {
            objectList[key].update();
        }
    }

    // Draw all objects
    for (var key in objectList) {
        if (typeof objectList[key].draw !== 'undefined') {
            objectList[key].draw();
        }
    }
    ctx.fillStyle = 'white';
    ctx.fillText('Number of Objects in objectList: ' + Object.keys(objectList).length, 10, 10);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);