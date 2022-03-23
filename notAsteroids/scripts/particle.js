import { printToConsole, randBetweenValues, generateId, clamp, distanceBetweenPoints, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

var particles = {}

class Particle {
    constructor(x, y, lifespan, minSize, maxSize, minSpeed, maxSpeed, minDirection, maxDirection, minRotSpeed, maxRotSpeed) {
        this.x = x;
        this.y = y;
        this.lifespan = lifespan;
        this.size = randBetweenValues(minSize, maxSize);
        this.rotation = randBetweenValues(minRotSpeed, maxRotSpeed);
        this.velocity = new Vector(randBetweenValues(minSpeed, maxSpeed), randBetweenValues(minDirection, maxDirection));
    }
}