import { printToConsole, randBetweenValues, lerp, generateId, clamp, distanceBetweenPoints, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height,);
var particles = {}

function drawPoint(x, y, color) {
    var index = (x + y * canvas.width) * 4;
    canvasData.data[index + 0] = color[0];
    canvasData.data[index + 1] = color[1];
    canvasData.data[index + 2] = color[2];
    canvasData.data[index + 3] = color[3];
}

function drawStar() {

}

function drawLine() {

}

function drawRectangle() {

}

function drawArc() {

}

function drawImage() {

}

class Particle {
    constructor(x, y, lifespan, colorArray, velocity, type, size, rotation, angularSpeed, image) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifespan = lifespan;
        this.rotation = rotation;
        this.angularSpeed = angularSpeed;
        var cartesianVelocity = vectorToCartesian(velocity);
        this.xSpeed = cartesianVelocity[1];
        this.ySpeed = cartesianVelocity[2];
        this.colorArray = colorArray;
        this.type = type;
        this.image = image;
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.rotation += this.angularSpeed;
    }

    draw() {
        switch(type) {
            case 0:
                drawPoint(this.x, this.y, this.colorArray[0]);
                break;
            default:
                printToConsole('Attempted to draw undefined particle type');
        }
    }
}

class ParticleSpawner {
    constructor(x, y, particle, number) {
        this.x = x;
        this.y = y;
        this.particle = particle;
        this.number = number;
    }

    spawnParticle() {
        for (let i = 0; i < this.number; i++) {
            new Particle
        }
    }
}