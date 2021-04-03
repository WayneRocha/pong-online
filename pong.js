const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const keyPressed = 
const gameMod = {
    'single-player': true,
    'multiplayer': false,
};
const physics = {
    playersVelocityY: 20,
    ballVelocityX: 5,
    ballVelocityY: 0,
};
const startScreen = {
    title: {
        x: (canvas.width / 2),
        y: (canvas.height / 4),
        text: 'PONG',
        fontStyle: 'bold 50px monospace'
    },
    options: {
        x: (canvas.width / 2),
        y: (canvas.height / 1.5),
        text: 'single player',
        fontStyle: '30px monospace',
        letterColor: 'black'
    },
    instruction: {
        x: (canvas.width / 2),
        y: (canvas.height / 1.1),
        text: 'press ENTER',
        fontStyle: '20px monospace'
    },
    draw() {
        context.textAlign = 'center';
        context.fillStyle = 'black';
        drawTexts(this.title);
        drawTexts(this.instruction);
        context.fillStyle = this.options.letterColor;
        drawTexts(this.options);

        function drawTexts(textObject) {
            context.font = textObject.fontStyle
            context.fillText(textObject.text, textObject.x, textObject.y);
        }
    }
};
const gameScreen = {
    player1: {
        x: canvas.width / 1.1,
        y: (canvas.height / 2) - (60 / 2),
        width: 15,
        height: 60
    },
    player2: {
        x: (canvas.width / 12) - (20 / 2),
        y: (canvas.height / 2) - (60 / 2),
        width: 15,
        height: 60,
        botPlayer() {
            let hitChange = 20;
            if (this.y > gameScreen.ball.y) {
                if (Math.floor(Math.random() * 101) + hitChange >= 100){
                    gameScreen.movePlayer(this, 'up');
                }
            } else if (this.y + this.height < gameScreen.ball.y) {
                if (Math.floor(Math.random() * 100) + hitChange >= 100){
                    gameScreen.movePlayer(this, 'down');
                }
            }
        }
    },
    ball: {
        x: (canvas.width / 2) - 15,
        y: (canvas.height / 2) - 15,
        scale: 15,
        setBallToDefault() {
            this.x = (canvas.width / 2) - this.scale;
            this.y = (canvas.height / 2) - this.scale;
        }
    },
    pontuation: {
        player1: 0,
        player2: 0,
        winnerPlayer: '',
        pontuationDetection() {
            let player1Point = gameScreen.ball.x + gameScreen.ball.scale < gameScreen.player2.x;
            let player2Point = gameScreen.ball.x > gameScreen.player1.x + gameScreen.player1.width;

            if (player1Point) {
                resetPlayersPositions();
                player1Turn();
                this.player1 += 1;
                gameScreen.ball.setBallToDefault();
            } else if (player2Point) {
                resetPlayersPositions();
                player2Turn();
                this.player2 += 1;
                gameScreen.ball.setBallToDefault();
            }
            if (this.player1 >= 10) {
                currentScreen = gameOverScreen;
                this.winnerPlayer = 'VOCÊ GANHOU!';
            }
            else if (this.player2 >= 10) {
                currentScreen = gameOverScreen;
                this.winnerPlayer = 'VOCÊ PERDEU!';
            }
            function player1Turn() {
                physics.ballVelocityX *= -1;
                physics.ballVelocityY = 0;
            }
            function player2Turn() {
                physics.ballVelocityX = Math.abs(physics.ballVelocityX);
                physics.ballVelocityY = 0;
            }
            function resetPlayersPositions() {
                gameScreen.player1.y = (canvas.height / 2) - (60 / 2);
                gameScreen.player2.y = (canvas.height / 2) - (60 / 2);
            }
        }
    },
    draw() {
        context.fillStyle = 'black';
        this.drawScreenDivision();
        this.drawPlayers();
        this.drawBall();
        this.drawScoreBoard();
    },
    drawScreenDivision() {
        let divisionsBarY = 0;
        let spaceBetween = 25;
        for (let i = 0; i <= 4; i++) {
            context.fillRect((canvas.width / 2) - 10, (divisionsBarY) - 10, 10, 40);
            divisionsBarY += (40 + spaceBetween);
        }
    },
    drawPlayers() {
        context.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
        context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
    },
    drawScoreBoard() {
        context.font = '50px monospace';
        context.fillText(this.pontuation.player1, canvas.width / 1.5, 50);
        context.fillText(this.pontuation.player2, canvas.width / 3, 50);
    },
    drawBall() {
        context.fillRect(this.ball.x, this.ball.y, this.ball.scale, this.ball.scale);
    },
    movePlayer(player, direction) {
        if (direction == 'up' && player.y > 0) player.y -= physics.playersVelocityY;
        else if (direction == 'down' && (player.y + player.height) < canvas.height) player.y += physics.playersVelocityY;
    },
    moveBall() {
        let player1Colision = ((this.ball.x + this.ball.scale) >= this.player1.x) &&
            ((this.ball.y + this.ball.scale) >= this.player1.y &&
                (this.ball.y) <= (this.player1.y + this.player1.height));
        let player2Colision = (this.ball.x <= (this.player2.x + this.player2.width) &&
            (this.ball.y + this.ball.scale) >= this.player2.y &&
                this.ball.y <= (this.player2.y + this.player2.height));
        let buttomColision = (this.ball.y + this.ball.scale) >= canvas.height;
        let topColision = this.ball.y <= 0;

        if (player1Colision) {
            physics.ballVelocityX *= -1;
            hitFactor();
        } else if (player2Colision) {
            physics.ballVelocityX = Math.abs(physics.ballVelocityX);
            hitFactor();
        }
        if (buttomColision) physics.ballVelocityY *= -1;
        else if (topColision) physics.ballVelocityY = Math.abs(physics.ballVelocityY);
        this.ball.x += physics.ballVelocityX;
        this.ball.y += physics.ballVelocityY;

        function hitFactor() {
            let racketColision = parseFloat(((gameScreen.ball.y + gameScreen.ball.scale / 2) - gameScreen.player1.y) / gameScreen.player1.height).toFixed(1);
            console.log(racketColision);
            if (racketColision > 0.5) {
                physics.ballVelocityY = Math.floor(Math.random() * (7.7 - 1.1) + 1.1);
            } else if (racketColision < 0.5 && racketColision > 0) {
                physics.ballVelocityY = Math.floor(Math.random() * 0.5) - 0.5;
            } else {
                physics.ballVelocityY = Math.floor(Math.random() * ((-7.7) - (-1.1)) + 1.1);
            }
        }
    }
};
const gameOverScreen = {
    returnInstruction: 'tecle ESC para voltar',
    drawExitButton: false,
    buttonColor: 'black',
    draw() {
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.font = 'bold 50px monospace';
        context.fillText(gameScreen.pontuation.winnerPlayer, canvas.width / 2, canvas.height - 175);
        if (this.drawExitButton){
            context.font = 'bold 40px monospace';
            context.fillText('VOLTAR', canvas.width / 2, canvas.height - 50);
        } else {
            context.font = 'bold 15px monospace';
            context.fillText(this.returnInstruction, canvas.width / 2, canvas.height - 50);
        }
    }
};
var currentScreen = startScreen;
function gameLoop() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    currentScreen.draw();

    if (currentScreen == gameScreen) {
        document.querySelector('body').style.overflowY = 'hidden';
        gameScreen.moveBall();
        gameScreen.pontuation.pontuationDetection();
        if (gameMod["single-player"]){
            gameScreen.player2.botPlayer();
        }
    }
    else if (currentScreen == gameOverScreen) {
        gameOverScreen.draw();
    }
    else {
        document.querySelector('body').style.overflowY = 'auto';
    }
    requestAnimationFrame(gameLoop);
}
function flashyText() {
    let count = 0;
    let timer = setInterval(function () {
        count++;
        if (count % 2 === 1) {
            startScreen.options.letterColor = 'white';
            gameOverScreen.buttonColor = 'white';
        } else {
            startScreen.options.letterColor = 'black';
            gameOverScreen.buttonColor = 'black';
        }
        if (currentScreen == gameScreen) clearInterval(timer);
    }, 500);
}
function ruffleBallInitialDirection() {
    Math.floor(Math.random() * 2) ? physics.ballVelocityX *= -1 : physics.ballVelocityX = Math.abs(physics.ballVelocityX);
}
function keyBoardHandler(event) {
    const acceptedKeys = {
        ARROWUP() {
            gameScreen.movePlayer(gameScreen.player1, 'up');
        },
        ARROWDOWN() {
            gameScreen.movePlayer(gameScreen.player1, 'down');
        },
        W() {
            if (gameMod["multiplayer"]) gameScreen.movePlayer(gameScreen.player2, 'up');
            else gameScreen.movePlayer(gameScreen.player1, 'up');
        },
        S() {
            if (gameMod["multiplayer"]) gameScreen.movePlayer(gameScreen.player2, 'down');
            else gameScreen.movePlayer(gameScreen.player1, 'down');
        },
        ENTER() {
            currentScreen = gameScreen;
        },
        ESCAPE() {
            currentScreen = startScreen;
            restartGame();
        }
    }
    if (acceptedKeys[event.key.toUpperCase()]) {
        let actionFunction = acceptedKeys[event.key.toUpperCase()];
        actionFunction();
    }
}
function touchHandler(event){
    console.log(event);
    currentScreen = gameScreen;
    if (currentScreen == gameOverScreen){
        restartGame();
        currentScreen = startScreen;
    }
}
function restartGame() {
    physics.playersVelocityY = 20;
    physics.ballVelocityX = 5;
    physics.ballVelocityY = 0;
    gameScreen.player1.x = canvas.width / 1.1;
    gameScreen.player1.y = (canvas.height / 2) - (60 / 2);
    gameScreen.player2.x = (canvas.width / 12) - (20 / 2);
    gameScreen.player2.y = (canvas.height / 2) - (60 / 2);
    gameScreen.ball.x = canvas.width / 2 - 15;
    gameScreen.ball.y = canvas.height / 2 - 15;
    gameScreen.pontuation.player1 = 0;
    gameScreen.pontuation.player2 = 0;
}
if (window.matchMedia('(pointer: coarse)').matches) {
    addInstructionImage();
    addTouchListners();
    changeInstructionsToATouchGame();
    
    function addInstructionImage(){
        document.getElementById('img_instructions').src = 'mobile_tutorial.gif';
    }
    function changeInstructionsToATouchGame(){
        startScreen.instruction.text = "clique em um modo de jogar";
        gameOverScreen.returnInstruction = 'clique na seta para voltar';
        gameOverScreen.drawExitButton = true;
    }
    function addTouchListners(){
        const canvas = document.querySelector('canvas');
        canvas.addEventListener('touchstart', (event) => touchHandler(event.touches));
        canvas.addEventListener('touchmove', (event) => touchHandler(event.touches));
        canvas.addEventListener('touchcancel', () => (console.clear()));
    }
} else {
    window.addEventListener('keydown', keyBoardHandler);
}
gameLoop();
ruffleBallInitialDirection();
flashyText();