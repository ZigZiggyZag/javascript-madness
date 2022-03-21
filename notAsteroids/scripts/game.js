import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';
import {Ship} from './objects.js';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

var testShip = new Ship(canvas.width/2, canvas.height/2, 0, 10)

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    testShip.update();
    testShip.draw();

    ctx.fillStyle = 'white';
    ctx.fillText('X: ' + testShip.getX(), 5, 10);
    ctx.fillText('Y: ' + testShip.getY(), 5, 20);
}

setInterval(draw, 1000 / 60);