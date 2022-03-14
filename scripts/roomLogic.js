import {mouseX, mouseY, mouseClick, inCanvas, up, dw, lf, rt} from './input.js';

function traversableRoom(roomId){
    context.drawImage(area1, 0 + cX, 0 + cY, canvas.width + cX, canvas.height + cY, 0, 0, canvas.width + cX, canvas.height + cY);

    // Basic walking animation
    if (up || dw || lf || rt){
        walkDistance++;
        if (walkDistance >= 20){
            walkFrame++;
            walkDistance = 0;
            if (walkFrame > 1){
                walkFrame = 0;
            }
        }

        switch(walkFrame){
            case 0:
                context.drawImage(player, 65, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
                break;
            case 1:
                context.drawImage(player, 128, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
                break;
            default:
                context.drawImage(player, 0, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
        }
    }
    else{
        context.drawImage(player, 0, 0, 64, 64, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
    }

    // Movement Input
    if (up && (cY > 0)) { cY -= 2 }
    if (dw && (cY < 1280 - canvas.height)) { cY += 2 }
    if (lf && (cX > 0)) { cX -= 2 }
    if (rt && (cX < 1280 - canvas.width)) { cX += 2 }
}

function staticRoom(roomId){

}

export function room(type, roomId)
{
    if (type == 0){
        traversableRoom(roomId);
    }
    else{
        staticRoom(roomId);
    }
}