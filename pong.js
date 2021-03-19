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
            let errorChance = Math.floor(Math.random() * 20);
            let errorMargin = ((30 + errorChance) / 100) * gameScreen.ball.positionY
            if ((this.positionY + 60) >= gameScreen.ball.positionY + errorMargin){
                gameScreen.playerMoviment(this, true, false);
            } else if ((this.positionY) <= gameScreen.ball.positionY - errorMargin){
                gameScreen.playerMoviment(this, false, true);
            }
        }
    },
    ball: {
        positionX: (canvas.width / 2) - 15,
        positionY: (canvas.height / 2) - 15,
        width: 15,
        height: 15,
        setBallToDefault(){
            this.positionX = (canvas.width / 2) - this.width;
            this.positionY = (canvas.height / 2) - this.height;
        }
    },
    physics:{
        playersVelocityY: 10,
        ballVelocityX: 3,
        ballVelocityY: 0.5,
    },
    draw(){
        context.fillStyle = 'black';
        this.drawScreenDivision();
        this.drawPlayers();
        this.drawBall();
    },
    drawScreenDivision(){
        let divisionsBarY = 0;
        let spaceBetween = 25;
        for (let i = 0; i <= 4; i++){
            context.fillRect((canvas.width / 2) - 10, (divisionsBarY) - 10, 10, 40);
            divisionsBarY += (40 + spaceBetween);
        }
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
                player.positionY -= this.physics.playersVelocityY;
            }
        } else if(down) {
            if ((player.positionY + player.height) < canvas.height){
                player.positionY += this.physics.playersVelocityY;
            }
        }
    },
    ballMoviment(){
        let player1Colision = ((this.ball.positionX + this.ball.width) >= this.player1.positionX) && 
            ((this.ball.positionY + this.ball.height) >= this.player1.positionY && 
            (this.ball.positionY) <= (this.player1.positionY + this.player1.height));
        let player2Colision = (this.ball.positionX <= (this.player2.positionX + this.player2.width) &&
            (this.ball.positionY + this.ball.height) >= this.player2.positionY &&
            this.ball.positionY <= (this.player2.positionY + this.player2.height));
        let buttomColision = (this.ball.positionY + this.ball.height) >= canvas.height;
        let topColision = this.ball.positionY <= 0;

        if (player1Colision){
            console.log('player 1 colision');
            this.physics.ballVelocityX *= -1;
        } else if (player2Colision) {
            console.log('player 2 colision');
            this.physics.ballVelocityX = Math.abs(this.physics.ballVelocityX);
        }
        if(buttomColision){
            this.physics.ballVelocityY *= -1;
        } else if (topColision) {
            this.physics.ballVelocityY = Math.abs(this.physics.ballVelocityY);
        }
    
        this.ball.positionX += this.physics.ballVelocityX;
        this.ball.positionY += this.physics.ballVelocityY;
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
    if (currentScreen == gameScreen){
        gameScreen.ballMoviment();
    }
    keyController();

    function keyController(){
        if (currentScreen == gameScreen){
            if (gameMod["single-player"]){
                if (keyPressed.key == 38 || keyPressed.key == 87){
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
        else if (currentScreen == startScreen){
            if (keyPressed.key == 13) currentScreen = gameScreen;
        } 
    }
}


window.addEventListener('keydown', (e) => keyPressed.key = e.keyCode, true);
ruffleBallInitialDirection();
setInterval(() => gameLoop(), 16);
flashyText();

function flashyText(){
    let count = 0;
    let timer = setInterval(function(){
        count++;
        if(count % 2 === 1) {
            startScreen.option.letterColor = 'white';
        } else {
            startScreen.option.letterColor = 'black';
        }
        if (currentScreen == gameScreen) clearInterval(timer);
    }, 500);
}
function ruffleBallInitialDirection(){
    Math.floor(Math.random() * 2) ? gameScreen.physics.ballVelocityX *= -1 : gameScreen.physics.ballVelocityX = Math.abs(gameScreen.physics.ballVelocityX);
    Math.floor(Math.random() * 2) ? gameScreen.physics.ballVelocityY *= -1 : gameScreen.physics.ballVelocityY = Math.abs(gameScreen.physics.ballVelocityY);
    gameScreen.physics.ballVelocityY = Math.random() * 1.5;
};
