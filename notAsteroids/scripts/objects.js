/** @type {HTMLCanvasElement} */
import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';
import { clamp, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

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
        this.velocity = new Vector(0, this.angle);
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
            var accelerationVector = new Vector(this.acceleration, direction);

            var result = addVelocities(this.velocity, accelerationVector);
            result.setMagnitude(clamp(result.getMagnitude(), 0, this.maxVelocity))

            this.velocity = result;
        }
        else {
            this.velocity.setMagnitude = this.velocity.getMagnitude() * this.friction/1;
        }

        var cartesianVelocity = vectorToCartesian(this.velocity);

        this.x += cartesianVelocity[0]
        this.y += cartesianVelocity[1]
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
        
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        var velocityCartesian = convertToCartesian(this.velocity.getMagnitude() * 10, this.velocity.getAngle());
        ctx.lineTo(
            this.x + velocityCartesian[0],
            this.y + velocityCartesian[1]
        )
        ctx.stroke();
    }
}

export {Ship}