/** @type {HTMLCanvasElement} */
import { ENABLE_CONSOLE_LOGGING, SHOW_BOUNDING_BOXES, SHOW_VELOCITY_VECTORS } from './flags.js';
import { engineSound, laserSound, explosion1Sound, playerDeathSound } from './assets.js'
import { mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt, fire1 } from './input.js';
import { printToConsole, randBetweenValues, lerp, generateId, clamp, distanceBetweenPoints, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
const defaultFriction = 1;

var objectList = {};

class Object {
    constructor(x, y, size, parent, name) {
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
        this.size = size;

        objectList[this.id] = this;
    }

    getId() {
        return this.id;
    }

    wrap() {
        if (this.x < 0 - this.size) {this.x = canvas.width + this.size}
        else if (this.x > canvas.width + this.size) {this.x = 0 - this.size}

        if (this.y < 0 - this.size) {this.y = canvas.height + this.size}
        else if (this.y > canvas.height + this.size) {this.y = 0 - this.size}
    }

    checkCollision() {
        for (var key in objectList) {
            if (key !== this.id) {
                if (distanceBetweenPoints(this.x, this.y, objectList[key].x, objectList[key].y) < this.size + objectList[key].size) {
                    return key;
                }
            }
        }
    }

    deleteObject() {
        printToConsole('Deleting object with id: ' + this.id);
        delete objectList[this.id];
    }
}

class Laser extends Object {
    constructor(x, y, angle, size, speed, lifeSpan, color, parent, name) {
        super(x, y, size, parent, name);
        this.angle = angle;
        this.color = color;
        this.lifeSpan = lifeSpan;
        this.age = 0;
        this.velocity = new Vector(speed, this.angle);
    }

    destroy() {
        if (this.parent != undefined && typeof objectList[this.parent].decreaseNumOfLasers() !== 'undefined') {
            objectList[this.parent].decreaseNumOfLasers();
        }
        this.deleteObject()
    }

    update() {
        var cartesianVelocity = vectorToCartesian(this.velocity);
        this.x += cartesianVelocity[0];
        this.y += cartesianVelocity[1];
        this.age++;

        if(this.age >= this.lifeSpan) {
            if (this.parent != undefined && typeof objectList[this.parent].decreaseNumOfLasers() !== 'undefined') {
                objectList[this.parent].decreaseNumOfLasers();
            }
            this.deleteObject();
        }

        var collidingObject = this.checkCollision();

        if (objectList[collidingObject] instanceof Asteroid) {
            objectList[collidingObject].destroy();
            this.destroy();
        }

        this.wrap();
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(
            this.x - (this.size * 1.5) * Math.cos(this.angle),
            this.y - (this.size * 1.5) * Math.sin(this.angle)
        );
        ctx.lineTo(
            this.x + (this.size * 1.5) * Math.cos(this.angle),
            this.y + (this.size * 1.5) * Math.sin(this.angle)
        );
        ctx.stroke();

        if (SHOW_BOUNDING_BOXES) {
            var collidingObject = this.checkCollision();

            if (objectList[collidingObject] instanceof Asteroid) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                ctx.strokeStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
}

class Ship extends Object {

    constructor(x, y, angle, size, parent, name) {
        super(x, y, size, parent, name);
        this.angle = convertToRadians(angle);
        this.acceleration = 0.1;
        this.angularAcceleration = 0.5;
        this.velocity = new Vector(0, this.angle);
        this.angularVelocity = 0;
        this.maxVelocity = 4;
        this.maxAngularVelocity = 4;
        this.friction = 1;
        this.reloading = false;
        this.fired = false;
        this.lives = 3;
        this.maxLasers = 4;
        this.numLasers = 0;
        this.destroyed = false;
        this.respawnTime = 60;
        this.respawnTimer = 0;
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
            var offset = convertToCartesian(20, this.angle);
            new Laser(this.x + offset[0], this.y + offset[1], this.angle, 5, 8, 80, 'red', this.id);
            this.fired = true;
            this.numLasers++;

            laserSound.play();
        }
        if (!fire1) {this.fired = false};
    }

    destroy() {
        this.destroyed = true;
        engineSound.pause();
        playerDeathSound.play();
        this.respawnTimer = 0;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.angle = convertToRadians(270);
        this.angularVelocity = 0;
        this.velocity = new Vector(0, this.angle);
    }

    update() {
        if (!this.destroyed) {
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

                if (!engineSound.playing()) {
                    engineSound.play();
                }
            }
            else {
                this.velocity.setMagnitude = this.velocity.getMagnitude() * 1/this.friction;
                engineSound.pause();
            }

            var cartesianVelocity = vectorToCartesian(this.velocity);

            this.x += cartesianVelocity[0]
            this.y += cartesianVelocity[1]
            
            var collidingObject = this.checkCollision();

            if (objectList[collidingObject] instanceof Asteroid || objectList[collidingObject] instanceof Laser) {
                objectList[collidingObject].destroy();
                this.destroy();
            }

            this.fire();
            this.wrap();
        }
        else {
            this.respawnTimer++;
            if (this.respawnTimer >= this.respawnTime) {
                var collidingObject = this.checkCollision();
                if (objectList[collidingObject] instanceof Asteroid || objectList[collidingObject] instanceof Laser) {
                    this.respawnTimer = 0;
                }
                else {
                    this.destroyed = false;
                }
            }
        }
    }

    draw() {
        if (!this.destroyed) {
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
        }

        if (SHOW_BOUNDING_BOXES) {
            var collidingObject = this.checkCollision();

            if (objectList[collidingObject] instanceof Asteroid) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                ctx.strokeStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
}

class Asteroid extends Object {
    constructor(x, y, size, speed, asteroidIteration, parent, name) {
        super(x, y, size, parent, name);
        this.speed = speed;
        this.asteroidIteration = asteroidIteration;

        this.velocity = new Vector(this.speed, Math.random() * (2 * Math.PI));

        this.verticesNum = 9 + Math.round(Math.random() * 4);

        this.vertices = [];

        for (let i = 0; i < this.verticesNum; i++) {
            var magnitude = this.size + ((Math.random() * (this.size / 1.5)) - (this.size / 3))
            var angle = (((2 * Math.PI) / this.verticesNum) * i) + ((Math.random() * (Math.PI / 45)) + (Math.PI / 90))
            this.vertices.push(new Vector(magnitude, angle));
        }
    }

    destroy() {
        explosion1Sound.rate(Math.random() + 0.5);
        explosion1Sound.play()

        if (this.asteroidIteration > 1) {
            new Asteroid(this.x, this.y, this.size/1.6, this.speed * 1.6, this.asteroidIteration - 1);
            new Asteroid(this.x, this.y, this.size/1.6, this.speed * 1.6, this.asteroidIteration - 1);
        }
        this.deleteObject();
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

class AsteroidGenerator {
    constructor(startingAsteroids, asteroidSize, asteroidSpeed, playerObjectId) {
        this.startingAsteroids = startingAsteroids;
        this.asteroidSize = asteroidSize;
        this.asteroidSpeed = asteroidSpeed;
        this.playerObjectId = playerObjectId;
        this.numOfAsteroids = 0;

        while(this.numOfAsteroids < this.startingAsteroids) {
            this.spawnAsteroid();
        }
    }

    generatePoint() {
        return [Math.random() * canvas.width, Math.random() * canvas.height];
    }

    spawnAsteroid() {
        do {
            var location = this.generatePoint();
        } while (distanceBetweenPoints(objectList[this.playerObjectId].x, objectList[this.playerObjectId].y, location[0], location[1]) < 4 * this.asteroidSize + objectList[this.playerObjectId].size);
        new Asteroid(location[0], location[1], this.asteroidSize, this.asteroidSpeed, 3);
        this.numOfAsteroids++;
    }
}

function drawCursor() {
    ctx.strokeStyle = 'gray';
    ctx.beginPath();

    var angle = convertToRadians(45);

    ctx.moveTo(
        mouseX,
        mouseY
    );
    ctx.lineTo(
        mouseX + 10 * Math.cos(angle + convertToRadians(20)),
        mouseY + 10 * Math.sin(angle + convertToRadians(20))
    );
    ctx.lineTo(
        mouseX + 10 * Math.cos(angle + convertToRadians(-20)),
        mouseY + 10 * Math.sin(angle + convertToRadians(-20))
    );
    ctx.closePath();
    ctx.stroke();
}

export { objectList, Ship, AsteroidGenerator, drawCursor };