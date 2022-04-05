import { mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt } from './input.js';
import { objectList, Ship, AsteroidGenerator, drawCursor } from './objects.js';
import { particleList } from './particle.js';
import { drawText } from './letters.js';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

ctx.lineWidth = 1.2;

var playerShip = new Ship(canvas.width/2, canvas.height/2, 270, 7.5);
var generator = new AsteroidGenerator(6, 30, 60, playerShip.getId());

var prev, curDelta;
var smoothDelta = 0;
const smoothingConstant = 0.2;

function draw(timestamp){
    if (prev === undefined) {
        prev = timestamp;
    }
    
    curDelta = timestamp - prev;

    smoothDelta = (smoothDelta * smoothingConstant) + (curDelta * (1 - smoothingConstant));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    generator.update();

    // Update all object logic
    for (var key in objectList) {
        if (typeof objectList[key].update !== 'undefined') {
            objectList[key].update(smoothDelta);
        }
    }

    // Draw all objects
    for (var key in objectList) {
        if (typeof objectList[key].draw !== 'undefined') {
            objectList[key].draw();
        }
    }

    for (var key in particleList) {
        particleList[key].update(smoothDelta);
    }

    for (var key in particleList) {
        particleList[key].draw();
    }

    drawCursor();

    ctx.fillStyle = 'white';
    ctx.fillText('Frametime: ' + Number.parseFloat(smoothDelta).toFixed(2), 10, 10);
    ctx.fillText('Number of Asteroids: ' + generator.getNumOfAsteroids(), 10, 20);

    prev = timestamp;
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);