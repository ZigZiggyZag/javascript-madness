/** @type {HTMLCanvasElement} */
import { ENABLE_CONSOLE_LOGGING, SHOW_BOUNDING_BOXES, SHOW_VELOCITY_VECTORS } from './flags.js';
import { mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt, fire1 } from './input.js';
import { printToConsole, generateId, clamp, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
const defaultFriction = 1;

var objectList = {};

class Object {
    constructor(x, y, parent, name) {
        if (name === undefined) {
            this.id = generateId();
            printToConsole('Object generated with id: ' + this.id);
        }
        else {
            this.id = name
        }

        this.parent = parent;
        this.x = x;
        this.y = y;

        objectList[this.id] = this;
    }

    wrap() {
        if (this.x < 0 - this.size) {this.x = canvas.width + this.size}
        else if (this.x > canvas.width + this.size) {this.x = 0 - this.size}

        if (this.y < 0 - this.size) {this.y = canvas.height + this.size}
        else if (this.y > canvas.height + this.size) {this.y = 0 - this.size}
    }

    checkCollision() {
        
    }

    deleteObject() {
        printToConsole('Deleting object with id: ' + this.id);
        delete objectList[this.id];
    }
}

class Laser extends Object {
    constructor(x, y, angle, size, color, parent, name) {
        super(x, y, parent, name);
        this.angle = angle;
        this.size = size;
        this.color = color;
        this.lifespan = 60;
        this.currentLife = 0;
        this.velocity = new Vector(10, this.angle);
    }

    update() {
        var cartesianVelocity = vectorToCartesian(this.velocity);
        this.x += cartesianVelocity[0];
        this.y += cartesianVelocity[1];
        this.currentLife++;

        if(this.currentLife >= this.lifespan) {
            if (this.parent != undefined && typeof objectList[this.parent].decreaseNumOfLasers() !== 'undefined') {
                objectList[this.parent].decreaseNumOfLasers();
            }
            this.deleteObject();
        }

        this.wrap();
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(
            this.x - this.size * Math.cos(this.angle),
            this.y - this.size * Math.sin(this.angle)
        );
        ctx.lineTo(
            this.x + this.size * Math.cos(this.angle),
            this.y + this.size * Math.sin(this.angle)
        );
        ctx.stroke();
    }
}

class Ship extends Object {

    constructor(x, y, angle, size, parent, name) {
        super(x, y, parent, name);
        this.angle = convertToRadians(angle);
        this.size = size
        this.acceleration = 0.1;
        this.angularAcceleration = 0.3;
        this.velocity = new Vector(0, this.angle);
        this.angularVelocity = 0;
        this.maxVelocity = 4;
        this.maxAngularVelocity = 3;
        this.friction = 1;
        this.reloading = false;
        this.fired = false;
        this.maxLasers = 3;
        this.numLasers = 0;
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

    decreaseNumOfLasers() {
        this.numLasers--;
    }

    fire() {
        if (fire1 && !this.fired && this.numLasers < this.maxLasers) {
            var offset = convertToCartesian(10, this.angle);
            new Laser(this.x + offset[0], this.y + offset[1], this.angle, 5, 'red', this.id);
            this.fired = true;
            this.numLasers++;
        }
        if (!fire1) {this.fired = false};
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

        this.fire();

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
        
        if (SHOW_VELOCITY_VECTORS) {
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

        if (SHOW_BOUNDING_BOXES) {
            ctx.strokeStyle = 'yellow';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class Asteroid extends Object {
    constructor(x, y, size, speed, parent, name) {
        super(x, y, parent, name);
        this.size = size;
        this.velocity = new Vector(speed, Math.random() * (2 * Math.PI));

        this.verticesNum = 9 + Math.round(Math.random() * 4);

        this.vertices = [];

        for (let i = 0; i < this.verticesNum; i++) {
            var magnitude = this.size + ((Math.random() * (this.size / 1.5)) - (this.size / 3))
            var angle = (((2 * Math.PI) / this.verticesNum) * i) + ((Math.random() * (Math.PI / 45)) + (Math.PI / 90))
            this.vertices.push(new Vector(magnitude, angle));
        }
    }

    update() {
        var cartesianVelocity = vectorToCartesian(this.velocity);
        this.x += cartesianVelocity[0];
        this.y += cartesianVelocity[1];

        this.wrap();
    }

    draw() {
        ctx.strokeStyle = 'white';

        ctx.beginPath();
        
        var cartesian = vectorToCartesian(this.vertices[0])
        ctx.moveTo(
            this.x + cartesian[0],
            this.y + cartesian[1]
        )

        for (let i = 1; i < this.verticesNum; i++) {
            cartesian = vectorToCartesian(this.vertices[i])
            ctx.lineTo(
                this.x + cartesian[0],
                this.y + cartesian[1]
            )
        }

        ctx.closePath();
        ctx.stroke();

        if (SHOW_BOUNDING_BOXES) {
            ctx.strokeStyle = 'yellow';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

export { objectList, Ship, Asteroid };