import { mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt } from './input.js';
import { objectList, Ship, AsteroidGenerator, drawCursor } from './objects.js';
import { particleList } from './particle.js';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

ctx.lineWidth = 1.2;

var playerShip = new Ship(canvas.width/2, canvas.height/2, 270, 7.5);
var generator = new AsteroidGenerator(6, 30, 1, playerShip.getId());

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    generator.update();

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

    for (var key in particleList) {
        particleList[key].update();
    }

    for (var key in particleList) {
        particleList[key].draw();
    }

    drawCursor();

    ctx.fillStyle = 'white';
    ctx.fillText('Number of Objects in objectList: ' + Object.keys(objectList).length, 10, 10);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);