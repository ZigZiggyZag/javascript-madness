function convertToRadians(degrees) {
    return degrees * Math.PI/180;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

export {convertToRadians, clamp};