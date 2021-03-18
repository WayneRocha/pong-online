const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const whiteScreen = {
    width: canvas.width,
    height: canvas.height,
    color: 'white',
    draw(){
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.width, this.height);
    }
};
const startScreen = {
    title: {
        positionX: (canvas.width / 2),
        positionY: (canvas.height / 4),
        text: 'PONG',
        fontStyle: 'bold 50px monospace'
    },
    option: {
        positionX: (canvas.width / 2),
        positionY: (canvas.height / 1.5),
        text: 'single player',
        fontStyle: '30px monospace',
        letterColor: 'black'
    },
    instruction: {
        positionX: (canvas.width / 2),
        positionY: (canvas.height / 1.1),
        text: 'press START',
        fontStyle: '15px monospace'
    },
    draw(){
        context.textAlign = 'center';
        context.fillStyle = 'black';
        drawTexts(this.title);
        drawTexts(this.instruction);
        context.fillStyle = this.option.letterColor;
        drawTexts(this.option);

        function drawTexts(textObject){
            context.font = textObject.fontStyle
            context.fillText(
                textObject.text,
                textObject.positionX,
                textObject.positionY);
        }
    }
}
const gameScreen = {
    player1: {
        positionX: canvas.width / 1.1,
        positionY: (canvas.height / 2) - (60 / 2),
        width: 20,
        height: 60
    },
    player2: {
        positionX: (canvas.width / 12) - (20 / 2),
        positionY: (canvas.height / 2) - (60 / 2),
        width: 20,
        height: 60,
        bot(){
            let errorChance = Math.random() * 20;
            let errorMargin = ((30 + errorChance) / 100) * gameScreen.ball.positionY
            if ((this.positionY + 60) >= gameScreen.ball.positionY + errorMargin){
                gameScreen.playerMoviment(this, true, false);
            } else if ((this.positionY) <= gameScreen.ball.positionY - errorMargin){
                gameScreen.playerMoviment(this, false, true);
            }
        }
    },
    ball: {
        positionX: (canvas.width / 2) - 20,
        positionY: (canvas.height / 2) - 20,
        width: 15,
        height: 15
    },
    physics:{
        playersVelocity: 10,
        ballVelocity: 20
    },
    draw(){
        context.fillStyle = 'black';
        this.drawPlayers();
        this.drawBall();
    },
    drawPlayers(){
        context.fillRect(
            this.player1.positionX,
            this.player1.positionY,
            this.player1.width,
            this.player1.height);
        context.fillRect(
            this.player2.positionX,
            this.player2.positionY,
            this.player2.width,
            this.player2.height);
    },
    drawBall(){
        context.fillRect(
            this.ball.positionX,
            this.ball.positionY,
            this.ball.width,
            this.ball.height);   
    },
    playerMoviment(player, up, down){
        if (up){
            if (player.positionY > 0){
                player.positionY -= this.physics.playersVelocity;
            }
        } else if(down) {
            if ((player.positionY + player.height) < canvas.height){
                player.positionY += this.physics.playersVelocity;
            }
        }
    }
}
let currentScreen = startScreen;
const keyPressed = {
    key: undefined
}
const gameMod = {
    'single-player': true,
    'multiplayer': false,
    'multiplayer-online': false
}
function gameLoop(){
    whiteScreen.draw();
    currentScreen.draw();
    if (gameMod["single-player"]){
        if (keyPressed.key == 13){
            currentScreen = gameScreen;
        }
        else if (keyPressed.key == 38 || keyPressed.key == 87){
            gameScreen.playerMoviment(gameScreen.player1, true, false);
        }
        else if (keyPressed.key == 40 || keyPressed.key == 83){
            gameScreen.playerMoviment(gameScreen.player1, false, true);
        }
        else if (keyPressed.key == 27){
            currentScreen = startScreen;
        }
        keyPressed.key = undefined;
        gameScreen.player2.bot();
    } else if (gameMod["multiplayer"]){
        switch (keyPressed.key){
            case 13:
                currentScreen = gameScreen;
                break;
            case 38:
                gameScreen.playerMoviment(gameScreen.player1, true, false);
                break;
            case 40:
                gameScreen.playerMoviment(gameScreen.player1, false, true);
                break;
            case 87:
                gameScreen.playerMoviment(gameScreen.player2, true, false);
                break;
            case 83:
                gameScreen.playerMoviment(gameScreen.player2, false, true);
                break;
            case 27:
                currentScreen = startScreen;
                break;
        }
        keyPressed.key = undefined;
    } else if (gameMod["multiplayer-online"]){
        //other keyboards commands
    }
    
}


window.addEventListener('keydown', function(e){
    keyPressed.key = e.keyCode;
}, true);
setInterval(() => gameLoop(), 10);
flashyText();

function flashyText(){
    let count = 10;
    timer = setInterval(function(){
        count++;
        if(count % 2 === 1) {
            startScreen.option.letterColor = 'white';
        } else {
            startScreen.option.letterColor = 'black';
        }
    }, 500);
}
