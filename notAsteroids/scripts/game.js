import { objectList, GameController } from './objects.js';
import { particleList } from './particle.js';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

ctx.lineWidth = 1.2;

var prev, curDelta;
var smoothDelta = 0;
const smoothingConstant = 0.2;

var controller = new GameController(3, 5);

function draw(timestamp){
    if (prev === undefined) {
        prev = timestamp;
    }
    curDelta = timestamp - prev;
    smoothDelta = (smoothDelta * smoothingConstant) + (curDelta * (1 - smoothingConstant));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    controller.update();
    controller.draw();

    // Update all object logic
    for (let key in objectList) {
        if (typeof objectList[key].update !== 'undefined') {
            objectList[key].update(smoothDelta);
        }
    }

    // Draw all objects
    for (let key in objectList) {
        if (typeof objectList[key].draw !== 'undefined') {
            objectList[key].draw();
        }
    }

    // Update all particle positions
    for (let key in particleList) {
        particleList[key].update(smoothDelta);
    }

    // Draw all particles
    for (let key in particleList) {
        particleList[key].draw();
    }

    prev = timestamp;
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);