class Vector {
    constructor(magnitude, angle) {
        this.magnitude = magnitude;
        this.angle = angle;
    }

    getMagnitude(magnitude) {
        return this.magnitude;
    }

    getAngle(magnitude) {
        return this.angle;
    }

    setMagnitude(magnitude) {
        this.magnitude = magnitude;
    }

    setAngle(angle) {
        this.angle = angle;
    }
}

/**
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum the value will reach
 * @param {number} max - The maximum the value will reach
 * @returns {number} - The value clamped between the min and max
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

/**
 * @param {number} degrees - Degrees
 * @returns {number} Radians 
 */
function convertToRadians(degrees) {
    return degrees * Math.PI/180;
}

/**
 * @param {Vector} vector - A vector object (defined in helpers.js)
 * @returns {number[]} [x, y]
 */
function vectorToCartesian(vector) {
    return [vector.magnitude * Math.cos(vector.angle), vector.magnitude * Math.sin(vector.angle)];
}

/**
 * @param {number} magnitude - The magnitude of the vector
 * @param {number} angle - The angle of the vector
 * @returns {number[]} [x, y]
 */
 function convertToCartesian(magnitude, angle) {
    return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
}

/**
 * @param {number[]} coordinates - Cartesian coordinates
 * @returns {Vector} Polar Coordinates
 */
function convertToPolar(coordinates) {
    return new Vector(Math.sqrt(Math.pow(coordinates[0], 2) + Math.pow(coordinates[1], 2)), Math.atan2(coordinates[1], coordinates[0]))
}

/**
 * @param {Vector} vector1 - The first vector to add
 * @param {Vector} vector2 - The second vector to add
 * @returns {Vector} The sum of vector1 and vector 2
 */
function addVelocities(vector1, vector2) {
    var vector1Cartesian = vectorToCartesian(vector1);
    var vector2Cartesian = vectorToCartesian(vector2);

    var vectorSum = [vector1Cartesian[0] + vector2Cartesian[0], vector1Cartesian[1] + vector2Cartesian[1]];

    return convertToPolar(vectorSum);
}

export {clamp, convertToRadians, vectorToCartesian, convertToCartesian, convertToPolar, addVelocities, Vector};