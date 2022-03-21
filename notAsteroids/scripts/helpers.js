function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function convertToRadians(degrees) {
    return degrees * Math.PI/180;
}
function convertToCartesian(magnitude, angle) {
    return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
}
0
function addVelocities(vector1, vector2) {
    var xComponent = (vector1[0] * Math.cos(vector1[1])) + (vector2[0] * Math.cos(vector2[1]));
    var yComponent = (vector1[0] * Math.sin(vector1[1])) + (vector2[0] * Math.sin(vector2[1]));

    return [Math.sqrt(Math.pow(xComponent, 2) + Math.pow(yComponent, 2)), Math.atan2(yComponent, xComponent)];
}

export {clamp, convertToRadians, convertToCartesian, addVelocities};