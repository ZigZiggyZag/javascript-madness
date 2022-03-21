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
        this.angularAcceleration = 0.3;
        this.velocity = new Vector(0, this.angle);
        this.angularVelocity = 0;
        this.maxVelocity = 6;
        this.maxAngularVelocity = 3;
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

    wrap() {
        if (this.x < 0 - this.size) {this.x = canvas.width + this.size}
        else if (this.x > canvas.width + this.size) {this.x = 0 - this.size}

        if (this.y < 0 - this.size) {this.y = canvas.height + this.size}
        else if (this.y > canvas.height + this.size) {this.y = 0 - this.size}
    }

    update() {
        if (lf || rt) {
            var leftRight = (rt ? 1 : 0) - (lf ? 1 : 0);
            this.angularVelocity += leftRight * this.angularAcceleration;
            this.angularVelocity = clamp(this.angularVelocity, -this.maxAngularVelocity, this.maxAngularVelocity);
        }
        else {
            this.angularVelocity = this.angularVelocity * 1/1.2;
        }

        this.angle += convertToRadians(this.angularVelocity);

        if (up) {
            var accelerationVector = new Vector(this.acceleration, this.angle);

            var result = addVelocities(this.velocity, accelerationVector);
            result.setMagnitude(clamp(result.getMagnitude(), 0, this.maxVelocity))

            this.velocity = result;
        }
        else {
            this.velocity.setMagnitude = this.velocity.getMagnitude() * 1/this.friction;
        }

        var cartesianVelocity = vectorToCartesian(this.velocity);

        this.x += cartesianVelocity[0]
        this.y += cartesianVelocity[1]

        this.wrap();
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