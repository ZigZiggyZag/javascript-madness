/** @type {HTMLCanvasElement} */
import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';
import { clamp, convertToRadians, convertToCartesian, addVelocities } from "./helpers.js";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
const defaultFriction = 1;

class Ship {
    constructor(x, y, angle, size) {
        this.x = x;
        this.y = y;
        this.angle = convertToRadians(angle);
        this.size = size
        this.acceleration = 0.1;
        this.velocity = [0, 0];
        this.maxVelocity = 5;
        this.friction = 1;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getVelocity() {
        return this.velocity;
    }

    update() {
        if (up || dw || lf || rt) {
            var upDown = (dw ? 1 : 0) - (up ? 1 : 0);
            var leftRight = (rt ? 1 : 0) - (lf ? 1 : 0);
            var direction = Math.atan2(upDown, leftRight);
            
            var result = addVelocities(this.velocity, [this.acceleration, direction]);

            this.velocity[0] = [Math.min(result[0], this.maxVelocity), result[1]];
        }
        else {
            this.velocity[0] *= this.friction/1;
            this.velocity[1] *= this.friction/1;
        }

        this.x += this.velocity[0]
        this.y += this.velocity[1]
    }

    draw() {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(
            this.x + this.size * Math.cos(this.angle),
            this.y + this.size * Math.sin(this.angle)
        );
        ctx.lineTo(
            this.x + this.size * Math.cos(this.angle + convertToRadians(130)),
            this.y + this.size * Math.sin(this.angle + convertToRadians(130))
        );
        ctx.lineTo(
            this.x + this.size * Math.cos(this.angle + convertToRadians(-130)),
            this.y + this.size * Math.sin(this.angle + convertToRadians(-130))
        );
        ctx.closePath();
        ctx.stroke();
    }
}

export {Ship}