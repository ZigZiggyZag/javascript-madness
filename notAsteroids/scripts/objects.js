/** @type {HTMLCanvasElement} */
import { ENABLE_CONSOLE_LOGGING, SHOW_BOUNDING_BOXES, SHOW_VELOCITY_VECTORS } from './flags.js';
import { engineSound, laserSound, explosion1Sound, playerDeathSound } from './assets.js'
import { mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt, fire1, restart } from './input.js';
import { printToConsole, randBetweenValues, lerp, generateId, clamp, distanceBetweenPoints, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector } from "./helpers.js";
import { ParticleController, particleList } from './particle.js';
import { drawText } from './letters.js';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
const defaultFriction = 1;

var playerExplosion = new ParticleController("line", 2, 8, 1.5, 2.5, 10, 20, 'white');
var engineExhaust = new ParticleController("square", 0.8, 1.2, 0.1, 0.2, 100, 140, 'red');
var asteroidExplosion = new ParticleController("square", 1, 1, 0.25, 0.75, 80, 120, 'white');

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
        if (this.parent != undefined && typeof this.parent.decreaseNumOfLasers() !== 'undefined') {
            this.parent.decreaseNumOfLasers();
        }
        this.deleteObject()
    }

    update(delta) {
        var cartesianVelocity = vectorToCartesian(this.velocity);
        this.x += cartesianVelocity[0] * (delta / 1000);
        this.y += cartesianVelocity[1] * (delta / 1000);
        this.age += delta / 1000;

        if(this.age >= this.lifeSpan) {
            if (this.parent != undefined && typeof this.parent.decreaseNumOfLasers() !== 'undefined') {
                this.parent.decreaseNumOfLasers();
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
        this.acceleration = 250;
        this.angularAcceleration = 1750;
        this.velocity = new Vector(0, this.angle);
        this.angularVelocity = 0;
        this.maxVelocity = 250;
        this.maxAngularVelocity = 250;
        this.friction = 1;
        this.reloading = false;
        this.fired = false;
        this.maxLasers = 4;
        this.numLasers = 0;
        this.destroyed = false;
        this.respawnTime = 170;
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
            new Laser(this.x + offset[0], this.y + offset[1], this.angle, 5, 400, 1, 'red', this);
            this.fired = true;
            this.numLasers++;

            laserSound.play();
        }
        if (!fire1) {this.fired = false};
    }

    destroy() {
        playerExplosion.spawnParticles(this.x, this.y, this.size, 0, Math.PI * 2, 0, Math.PI * 2, 5);
        this.destroyed = true;
        engineSound.pause();
        playerDeathSound.play();
        this.respawnTimer = 0;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.angle = convertToRadians(270);
        this.angularVelocity = 0;
        this.velocity = new Vector(0, this.angle);
        this.parent.lives--;
    }

    update(delta) {
        if (!this.destroyed) {
            if (lf || rt) {
                var leftRight = (rt ? 1 : 0) - (lf ? 1 : 0);
                this.angularVelocity += (leftRight * this.angularAcceleration) * (delta / 1000);
                this.angularVelocity = clamp(this.angularVelocity, -this.maxAngularVelocity, this.maxAngularVelocity);
            }
            else {
                this.angularVelocity = this.angularVelocity * 1/1.2;
            }

            this.angle += convertToRadians(this.angularVelocity) * (delta / 1000);

            if (up) {
                let accelerationVector = new Vector(this.acceleration * (delta / 1000), this.angle);

                let result = addVelocities(this.velocity, accelerationVector);
                result.setMagnitude(clamp(result.getMagnitude(), 0, this.maxVelocity))

                let cartesian = convertToCartesian(5, this.angle + convertToRadians(180));
                engineExhaust.spawnParticles(this.x + cartesian[0], this.y + cartesian[1], 2, 0, 0, this.angle + Math.PI, this.angle + Math.PI, 1);

                this.velocity = result;

                if (!engineSound.playing()) {
                    engineSound.play();
                }
            }
            else {
                this.velocity.setMagnitude(this.velocity.getMagnitude() * 1/this.friction);
                engineSound.pause();
            }

            var cartesianVelocity = vectorToCartesian(this.velocity);

            this.x += cartesianVelocity[0] * (delta / 1000);
            this.y += cartesianVelocity[1] * (delta / 1000);
            
            var collidingObject = this.checkCollision();

            if (objectList[collidingObject] instanceof Asteroid || objectList[collidingObject] instanceof Laser) {
                objectList[collidingObject].destroy();
                this.destroy();
            }

            this.fire();
            this.wrap();
        }
        else {
            if (this.parent.lives > 0) {
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

        if (this.parent != undefined && typeof this.parent.increaseNumOfAsteroids() !== 'undefined') {
            this.parent.increaseNumOfAsteroids();
        }

        for (let i = 0; i < this.verticesNum; i++) {
            var magnitude = this.size + ((Math.random() * (this.size / 1.5)) - (this.size / 3))
            var angle = (((2 * Math.PI) / this.verticesNum) * i) + ((Math.random() * (Math.PI / 45)) + (Math.PI / 90))
            this.vertices.push(new Vector(magnitude, angle));
        }
    }

    destroy() {
        explosion1Sound.rate(Math.random() + 0.5);
        explosion1Sound.play()

        asteroidExplosion.spawnParticles(this.x, this.y, this.size, 0, 0, 0, Math.PI * 2, Math.floor(this.size / 2));

        if (this.asteroidIteration > 1) {
            new Asteroid(this.x, this.y, this.size/1.6, this.speed * 1.6, this.asteroidIteration - 1, this.parent);
            new Asteroid(this.x, this.y, this.size/1.6, this.speed * 1.6, this.asteroidIteration - 1, this.parent);
        }

        if (this.parent != undefined && typeof this.parent.decreaseNumOfAsteroids() !== 'undefined') {
            this.parent.decreaseNumOfAsteroids();
        }

        this.parent.updateScore(100 * this.asteroidIteration);

        this.deleteObject();
    }

    update(delta) {
        var cartesianVelocity = vectorToCartesian(this.velocity);
        this.x += cartesianVelocity[0] * (delta / 1000);
        this.y += cartesianVelocity[1] * (delta / 1000);

        this.wrap();
    }

    draw() {
        ctx.strokeStyle = 'lightgrey';

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
    constructor(startingAsteroids, asteroidSize, asteroidSpeed, playerObjectId, parent) {
        this.startingAsteroids = startingAsteroids;
        this.asteroidSize = asteroidSize;
        this.asteroidSpeed = asteroidSpeed;
        this.playerObjectId = playerObjectId;
        this.numOfAsteroids = 0;
        this.parent = parent;
    }

    generatePoint() {
        return [Math.random() * canvas.width, Math.random() * canvas.height];
    }

    increaseNumOfAsteroids() {
        this.numOfAsteroids++;
    }

    decreaseNumOfAsteroids() {
        this.numOfAsteroids--;
    }

    getNumOfAsteroids() {
        return this.numOfAsteroids;
    }

    updateScore(points) {
        this.parent.updateScore(points);
    }

    setPlayerId(id) {
        this.playerObjectId = id;
    }

    restart() {
        this.numOfAsteroids = 0;
    }

    spawnAsteroid() {
        do {
            var location = this.generatePoint();
        } while (distanceBetweenPoints(objectList[this.playerObjectId].x, objectList[this.playerObjectId].y, location[0], location[1]) < 4 * this.asteroidSize + objectList[this.playerObjectId].size);
        new Asteroid(location[0], location[1], this.asteroidSize, this.asteroidSpeed, 3, this);
    }

    update() {
        if (this.numOfAsteroids == 0) {
            while(this.numOfAsteroids < this.startingAsteroids) {
                this.spawnAsteroid();
            }
        }
    }
}

class GameController {
    constructor(lives, difficulty) {
        this.maxLives = lives
        this.lives = this.maxLives;
        this.difficulty = difficulty;
        this.score = 0;
        this.playerShip = new Ship(canvas.width/2, canvas.height/2, 270, 7.5, this);
        this.generator = new AsteroidGenerator(6, 30, 60, this.playerShip.getId(), this);
    }

    update() {
        this.generator.update();
        if (this.lives == 0 && restart) {
            this.lives = this.maxLives;
            this.score = 0;
            for (let key in objectList) {
                objectList[key].deleteObject();
            }
            for (let key in particleList) {
                particleList[key].destroy();
            }
            this.playerShip = new Ship(canvas.width/2, canvas.height/2, 270, 7.5, this);
            this.generator.setPlayerId(this.playerShip.getId());
            this.generator.restart();
        }
    }

    drawCursor() {
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

    updateScore(points) {
        this.score += points;
    }

    draw() {
        this.drawCursor();
        var lifeIconsX = 10
        var lifeIconsY = 10
        var angle = convertToRadians(270);
        for (let i = 0; i < this.lives; i++) {
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(
                lifeIconsX + this.playerShip.size * Math.cos(angle),
                lifeIconsY + this.playerShip.size * Math.sin(angle)
            );
            ctx.lineTo(
                lifeIconsX + this.playerShip.size * Math.cos(angle + convertToRadians(130)),
                lifeIconsY + this.playerShip.size * Math.sin(angle + convertToRadians(130))
            );
            ctx.lineTo(
                lifeIconsX + this.playerShip.size * Math.cos(angle + convertToRadians(-130)),
                lifeIconsY + this.playerShip.size * Math.sin(angle + convertToRadians(-130))
            );
            ctx.closePath();
            ctx.stroke();

            lifeIconsX += this.playerShip.size * 2  ;
        }

        drawText(canvas.width/2, 30, 20, 'white', "center", ("000000" + this.score).slice(-7));

        if (this.lives == 0) {
            drawText(canvas.width/2, canvas.height/2, 20, 'white', "center", "GAME OVER");
        }
    }
}

export { objectList, GameController };