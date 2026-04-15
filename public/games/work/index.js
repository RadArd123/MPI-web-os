const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 576;

const gravity = 0.5;
let lastKey;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'

});

const shop = new Sprite({
    position: {
        x: 650,
        y: 160
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.5,
    frameMax: 6,
    
});

const player = new Fighter({
    position: {
        x: 150,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Kenji/Martial Hero/Sprites/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: {
        x:215,
        y:155
    },
    sprites:{
        idle:{
            imageSrc: './img/Kenji/Martial Hero/Sprites/Idle.png',
            frameMax: 8
        },
        run:{
            imageSrc: './img/Kenji/Martial Hero/Sprites/Run.png',
            frameMax: 8
        },
        jump:{
            imageSrc: './img/Kenji/Martial Hero/Sprites/Jump.png',
            frameMax: 2
        },
        fall:{
            imageSrc: './img/Kenji/Martial Hero/Sprites/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/Kenji/Martial Hero/Sprites/Attack1.png',
            frameMax: 6
            
        },
        takeHit: {
            imageSrc: './img/Kenji/Martial Hero/Sprites/Take Hit - white silhouette.png',
            frameMax: 4
            
        },
        death: {
            imageSrc: './img/Kenji/Martial Hero/Sprites/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
});


const enemy = new Fighter({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Mask/Martial Hero 2/Sprites/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: {
        x:215,
        y:170
    },
    sprites:{
        idle:{
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Idle.png',
            frameMax: 4
        },
        run:{
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Run.png',
            frameMax: 8
        },
        jump:{
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Jump.png',
            frameMax: 2
        },
        fall:{
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Attack1.png',
            frameMax: 4
            
        },
        takeHit:{
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Take hit.png',
            frameMax: 3
        },
        death: {
            imageSrc: './img/Mask/Martial Hero 2/Sprites/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -175,
            y: 50
        },
        width: 150,
        height: 50
    }
});

const keys = {
    
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
   
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();
    
    c.fillStyle = 'rgba(255, 255, 255, 0.05)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    keyControl();
    collision();

}
function keyControl() {

    player.velocity.x = 0;
    //moving
    if (keys.a.pressed && player.lastKey == "a") {
        player.velocity.x = -5;
       player.switchSprites('run');
    } else if (keys.d.pressed && player.lastKey == "d") {
        player.velocity.x = 5;
       player.switchSprites('run');
    }else{
        player.switchSprites('idle');
    }
    //jumping
    if(player.velocity.y < 0){
       player.switchSprites('jump');
    }else if(player.velocity.y > 0){
        player.switchSprites('fall');

    }
    
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprites('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprites('run');
    }else{
        enemy.switchSprites('idle');
    }
    if(enemy.velocity.y < 0){
        enemy.switchSprites('jump');
     }else if(enemy.velocity.y > 0){
         enemy.switchSprites('fall');
 
     }
    
}

function collision() {
   
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.frameCurrent === 4){
        enemy.takeHit();
        player.isAttacking =false;

       document.querySelector('#enemyHealth').style.width = enemy.health + "%";  
    }
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false;
    }

    if (rectangularCollision({
        rectangle1: enemy,    
        rectangle2: player
    }) && enemy.isAttacking && enemy.frameCurrent === 2){
        player.takeHit();
        enemy.isAttacking = false;
        
        document.querySelector('#playerHealth').style.width = player.health + "%";
    }
    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false;
    }

    if (enemy.health  <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId});
    }
    
  
}
animate();

window.addEventListener('keydown', (event) => {

    if (!player.dead) {
        
        switch (event.key) {
            case "w":
                player.velocity.y = -16;
                player.lastKey = 'w';
                break;
            case "d":
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                break;
            case " ":
                player.attack();
                break;
        }
    }

   
    if (!enemy.dead) {
       
        switch (event.key) {
            case "ArrowUp":
                enemy.velocity.y = -16;
                enemy.lastKey = 'ArrowUp';
                break;
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "l":
                enemy.attack(); 
                break;
        }
    }
    
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //pt player
        case "w":
            player.velocity.y = 0;
            break;
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        //pt enemy
        case "ArrowUp":
            enemy.velocity.y = 0;
            break; 
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;

    }

});
     