import { printToConsole, randBetweenValues, lerp, generateId, clamp, distanceBetweenPoints, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height,);

function randomInCircle(x, y, radius) {
    var randAngle = Math.random() * Math.PI * 2;
    var coords = convertToCartesian(Math.random() * radius, randAngle);
    return [coords[0] + x, coords[1] + y]
}

function drawStar() {

}

function drawLine(x, y, size, angle, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(
        x - size * Math.cos(angle),
        y - size * Math.sin(angle)
    );
    ctx.lineTo(
        x + size * Math.cos(angle),
        y + size * Math.sin(angle)
    );
    ctx.stroke();
}

function drawSquare(x, y, size, color) {
    ctx.strokeStyle = color;
    ctx.strokeRect(x - size/2, y - size/2, size/2, size/2);
}

function drawArc() {

}

function drawImage() {

}

class particleList {
    constructor() {
        this.shiftNumber = 0;
        this.particles = [];
    }

    shift() {
        this.shiftNumber++;
    }

    push(element) {
        this.particles.push(element);
    }

    getParticles(){
        while (this.shiftNumber > 0) {
            this.particles.shift();
            this.shiftNumber--;
        }
        return this.particles;
    }
}

var particles = new particleList();

class Particle {
    constructor(x, y, lifespan, speed, color, type, size, rotation) {
        this.x = x;
        this.y = y;
        var velocityCartesian = convertToCartesian(speed, Math.random() * 2 * Math.PI);
        this.xSpeed = velocityCartesian[0];
        this.ySpeed = velocityCartesian[1];
        this.lifespan = lifespan;
        this.angle = rotation;
        this.color = color;
        this.type = type;
        this.size = size;
        this.age = 0;
        this.destroyed = false;

        particles.push(this);
    }

    destroy() {
        particles.shift();
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age++;
        if (this.age >= this.lifespan) {
            this.destroy();
            this.destroyed = true;
        }
    }

    draw() {
        if (!this.destroyed) {
            switch(this.type) {
                case 'line':
                    drawLine(this.x, this.y, this.size, this.angle, this.color);
                break;
                case 'square':
                    drawSquare(this.x, this.y, this.size, this.color);
                break;
                default:
                    printToConsole("Unknown Particle Type");
            }
        }
    }
}

class ParticleController {
    constructor(type, size, sizeMargin, lifespan, lifespanMargin, speed, speedMargin, color) {
        this.type = type;
        this.size = size;
        this.sizeMargin = sizeMargin;
        this.lifespan = lifespan;
        this.lifespanMargin = lifespanMargin;
        this.speed = speed;
        this.speedMargin = speedMargin;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.density = 0;
        this.spawnTime = 0;
        this.spawnTimer = 0;
    }

    spawnParticles(x, y, radius, number) {
        for (let i = 0; i < number; i++) {
            var lifespan = randBetweenValues(this.lifespan - this.lifespanMargin, this.lifespan + this.lifespanMargin);
            var size = randBetweenValues(Math.max(this.size - this.sizeMargin, 0), this.size + this.sizeMargin);
            var speed = randBetweenValues(this.speed - this.speedMargin, this.speed + this.speedMargin);
            var coords = randomInCircle(x, y, radius);
            new Particle(coords[0], coords[1], lifespan, speed, this.color, this.type, size, Math.random() * Math.PI * 2);
        }
    }

    // set(x, y) {
    //     this.x = x;
    //     this.y = y;
    // }

    // setDensity(density) {
    //     this.density = density;
    //     this.spawnTime = 1/density;
    //     this.spawnTimer = 0;
    // }

    // update() {
    //     this.spawnTimer++;
    //     if (this.spawnTimer >= this.spawnTime) {
    //         this.spawnTimer = 0;
    //         for (let i = 0; i < Math.ceil(this.density); i++) {
    //             var lifespan = randBetweenValues(this.lifespan - this.lifespanMargin, this.lifespan + this.lifespanMargin);
    //             var size = randBetweenValues(Math.max(this.size - this.sizeMargin, 0), this.size + this.sizeMargin);
    //             var coords = randomInCircle(this.x, this.y, this.radius);
    //             new Particle(coords[0], coords[1], lifespan, this.speed, 0, this.color, this.type, size, Math.random() * Math.PI * 2);
    //         }
    //     }
    // }
}

export { ParticleController, particles }