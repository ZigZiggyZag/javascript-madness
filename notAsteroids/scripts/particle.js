import { printToConsole, randBetweenValues, lerp, generateId, clamp, distanceBetweenPoints, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height,);

var particleList = {};

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

class Particle {
    constructor(x, y, lifespan, speed, color, type, size, rotation, direction) {
        this.x = x;
        this.y = y;
        var velocityCartesian = convertToCartesian(speed, direction);
        this.xSpeed = velocityCartesian[0];
        this.ySpeed = velocityCartesian[1];
        this.lifespan = lifespan;
        this.angle = rotation;
        this.color = color;
        this.type = type;
        this.size = size;
        this.age = 0;
        this.destroyed = false;

        this.id = generateId();
        particleList[this.id] = this;
    }

    destroy() {
        delete particleList[this.id];
    }

    update(delta) {
        this.x += this.xSpeed * (delta / 1000);
        this.y += this.ySpeed * (delta / 1000);
        this.age += delta / 1000;
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
    constructor(type, minSize, maxSize, minLifespan, maxLifespan, minSpeed, maxSpeed, color) {
        this.type = type;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.minLifespan = minLifespan;
        this.maxLifespan = maxLifespan;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.density = 0;
        this.spawnTime = 0;
        this.spawnTimer = 0;
    }

    spawnParticles(x, y, radius, minRotation, maxRotation, minDirection, maxDirection, number) {
        for (let i = 0; i < number; i++) {
            let lifespan = randBetweenValues(this.minLifespan, this.maxLifespan);
            let size = randBetweenValues(Math.max(this.minSize, 0), this.maxSize);
            let speed = randBetweenValues(this.minSpeed, this.maxSpeed);
            let rotation = randBetweenValues(minRotation, maxRotation);
            let direction = randBetweenValues(minDirection, maxDirection);
            let coords = randomInCircle(x, y, radius);
            new Particle(coords[0], coords[1], lifespan, speed, this.color, this.type, size, rotation, direction);
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
    //             let lifespan = randBetweenValues(this.lifespan - this.lifespanMargin, this.lifespan + this.lifespanMargin);
    //             let size = randBetweenValues(Math.max(this.size - this.sizeMargin, 0), this.size + this.sizeMargin);
    //             let coords = randomInCircle(this.x, this.y, this.radius);
    //             new Particle(coords[0], coords[1], lifespan, this.speed, 0, this.color, this.type, size, Math.random() * Math.PI * 2);
    //         }
    //     }
    // }
}

export { ParticleController, particleList }