const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gameMod = {
    'singleplayer': true,
    'multiplayer': false,
};
const physics = {
    playersVelocityY: 7,
    ballVelocityX: 7,
    ballVelocityY: 0,
};
const startScreen = {
    title: {
        x: (canvas.width / 2),
        y: (canvas.height / 4),
        text: 'PONG',
        fontStyle: 'bold 50px monospace'
    },
    options: [
        {
            x: (canvas.width / 2),
            y: (canvas.height / 1.8),
            text: 'single player',
            fontStyle: '30px monospace',
            letterColor: 'black'
        },
        {
            x: (canvas.width / 2),
            y: (canvas.height / 1.4),
            text: 'multiplayer',
            fontStyle: '30px monospace',
            letterColor: 'black'
        }
    ],
    instruction: {
        x: (canvas.width / 2),
        y: (canvas.height / 1.1),
        text: 'escolha como quer jogar',
        fontStyle: '20px monospace'
    },
    draw() {
        context.textAlign = 'center';
        context.fillStyle = 'black';
        drawTexts(this.title);
        drawTexts(this.instruction);
        context.fillStyle = this.options[0].letterColor;
        drawTexts(this.options[0]);
        context.fillStyle = this.options[1].letterColor;
        drawTexts(this.options[1]);

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
        botHitChance: 20,
        botPlayer() {
            if (this.y > gameScreen.ball.y) {
                if (Math.floor(Math.random() * 101) + this.botHitChance >= 100) {
                    gameScreen.movePlayer(this, 'up');
                }
            } else if (this.y + this.height < gameScreen.ball.y) {
                if (Math.floor(Math.random() * 100) + this.botHitChance >= 100) {
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
                if (gameMod.singleplayer) {
                    playSound('yourPoint');
                } else {
                    playSound('point');
                }
                this.player1 += 1;
                gameScreen.ball.setBallToDefault();
            } else if (player2Point) {
                resetPlayersPositions();
                player2Turn();
                if (gameMod.singleplayer) {
                    playSound('oponnentPoint');
                } else {
                    playSound('point');
                }
                this.player2 += 1;
                gameScreen.ball.setBallToDefault();
            }
            if (this.player1 >= 10) {
                currentScreen = gameOverScreen;
                if (gameMod.singleplayer) {
                    this.winnerPlayer = 'VOCÊ GANHOU!';
                } else {
                    this.winnerPlayer = 'player 1 GANHOU!';
                }
                playSound('win');
            }
            else if (this.player2 >= 10) {
                currentScreen = gameOverScreen;
                if (gameMod.singleplayer) {
                    this.winnerPlayer = 'VOCÊ PERDEU!';
                    playSound('lose');
                } else {
                    this.winnerPlayer = 'player 2 GANHOU!';
                }
            }
            function player1Turn() {
                physics.ballVelocityX = Math.abs(physics.ballVelocityX);
                physics.ballVelocityY = 0;
            }
            function player2Turn() {
                physics.ballVelocityX *= -1;
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
        this.drawNames();
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
    drawNames() {
        context.font = '20px monospace';
        context.fillText('player 2', canvas.width / 6, 30);
        context.fillText('player 1', canvas.width / 1.2, 30);
    },
    drawBall() {
        context.fillRect(this.ball.x, this.ball.y, this.ball.scale, this.ball.scale);
    },
    movePlayer(player, direction) {
        if (direction == 'up' && player.y > 0) {
            player.y -= physics.playersVelocityY;
        }
        else if (direction == 'down' && (player.y + player.height) < canvas.height) {
            player.y += physics.playersVelocityY;
        }
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
            playSound('menu', 0.1);
            physics.ballVelocityX *= -1;
            hitFactor();
        } else if (player2Colision) {
            playSound('menu', 0.1);
            physics.ballVelocityX = Math.abs(physics.ballVelocityX);
            hitFactor();
        }
        if (buttomColision) {
            physics.ballVelocityY *= -1;
        } else if (topColision) {
            physics.ballVelocityY = Math.abs(physics.ballVelocityY);
        }
        this.ball.x += physics.ballVelocityX;
        this.ball.y += physics.ballVelocityY;

        function hitFactor() {
            let racketColision = parseFloat(((gameScreen.ball.y + gameScreen.ball.scale / 2) - gameScreen.player1.y) / gameScreen.player1.height).toFixed(1);
            if (racketColision > 0.5) {
                physics.ballVelocityY = Math.floor(Math.random() * (7.7 - 1.1) + 1.1);
            } else if (racketColision < 0.5 && racketColision > 0) {
                physics.ballVelocityY = Math.floor(Math.random() * (0.5 - (-0.5)) + (-0.5));
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
        if (this.drawExitButton) {
            context.fillStyle = this.buttonColor;
            context.font = 'bold 40px monospace';
            context.fillText('VOLTAR', canvas.width / 2, canvas.height - 50);
        } else {
            context.font = 'bold 15px monospace';
            context.fillText(this.returnInstruction, canvas.width / 2, canvas.height - 50);
        }
    }
};
const sounds = {
    menu: new Audio('sfx/menu.wav'),
    start: new Audio('sfx/start.wav'),
    win: new Audio('sfx/win.wav'),
    lose: new Audio('sfx/lose.wav'),
    point: new Audio('sfx/point.wav'),
    yourPoint: new Audio('sfx/point+.wav'),
    oponnentPoint: new Audio('sfx/point-.wav'),
};
var currentScreen = startScreen;
var selectedOption = 0;
var KeyPressed;

function gameLoop() {
    keyBoardHandler(KeyPressed);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    currentScreen.draw();
    if (currentScreen == gameScreen) {
        gameScreen.moveBall();
        gameScreen.pontuation.pontuationDetection();
        if (gameMod.singleplayer) {
            gameScreen.player2.botPlayer();
        }
    }
    else if (currentScreen == gameOverScreen) {
        gameOverScreen.draw();
    }
    requestAnimationFrame(gameLoop);
}
function restartGame() {
    physics.playersVelocityY = 7;
    physics.ballVelocityX = 7;
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
function keyBoardHandler(key) {
    const acceptedKeys = {
        ARROWUP() {
            gameScreen.movePlayer(gameScreen.player1, 'up');
            updateSelectedOption('up');
        },
        ARROWDOWN() {
            gameScreen.movePlayer(gameScreen.player1, 'down');
            updateSelectedOption('down');
        },
        W() {
            if (gameMod["multiplayer"]) {
                gameScreen.movePlayer(gameScreen.player2, 'up');
            } else {
                gameScreen.movePlayer(gameScreen.player1, 'up');
            }
            updateSelectedOption('up');
        },
        S() {
            if (gameMod["multiplayer"]) {
                gameScreen.movePlayer(gameScreen.player2, 'down');
            } else {
                gameScreen.movePlayer(gameScreen.player1, 'down');
            }
            updateSelectedOption('down');
        },
        ENTER() {
            if (currentScreen == startScreen) {
                playSound('start');
            }
            currentScreen = gameScreen;
        },
        ESCAPE() {
            currentScreen = startScreen;
            playSound('menu');
            restartGame();
        }
    };
    if (acceptedKeys[key]) {
        let actionFunction = acceptedKeys[key];
        actionFunction();
    }
    function updateSelectedOption(arrow) {
        if (currentScreen != startScreen) return;
        if (arrow == 'up' && selectedOption == 1) {
            playSound("menu");
            selectedOption = 0;
            gameMod.singleplayer = true;
            gameMod.multiplayer = false;
        } else if (arrow == 'down' && selectedOption == 0) {
            playSound("menu");
            selectedOption = 1;
            gameMod.singleplayer = false;
            gameMod.multiplayer = true;
        }
    }
}
function touchHandler(event) {
    let errorMarginX = innerWidth / 13
    let errorMarginY = innerHeight / 9.3;
    for (const evento of event) {
        let x = Math.floor(evento.clientX - canvas.offsetLeft + errorMarginX);
        let y = Math.floor(evento.clientY - canvas.offsetTop + errorMarginY);
        if (currentScreen == startScreen) {
            let singleplayerSelected = (x >= 200 && x <= 380) && (y >= 150 && y <= 175);
            let multiplayerSelected = (x >= 200 && x <= 380) && (y >= 200 && y <= 225);
            if (singleplayerSelected) {
                gameMod.singleplayer = true;
                gameMod.multiplayer = false;
                gameScreen.player2.botHitChance = 40;
                currentScreen = gameScreen;
                playSound('start');
            } else if (multiplayerSelected) {
                gameMod.singleplayer = false;
                gameMod.multiplayer = true;
                currentScreen = gameScreen;
                playSound('start');
            }
        } else if (currentScreen == gameScreen) {
            if (gameMod.singleplayer){
                if (y - gameScreen.player1.height > 0 && y < canvas.height){
                    gameScreen.player1.y = y - gameScreen.player1.height;
                }
            } else {
                if (x >= canvas.width / 2){
                    if (y - gameScreen.player1.height > 0 && y < canvas.height){
                        gameScreen.player1.y = y - gameScreen.player1.height;
                    }
                } else {
                    if (y - gameScreen.player2.height > 0 && y < canvas.height){
                        gameScreen.player2.y = y - gameScreen.player2.height;
                    }
                }
            }
        } else if (currentScreen == gameOverScreen) {
            let comeBack = (x >= 240 && x <= 380) && (y >= 210 && y <= 240);
            if (comeBack) {
                restartGame();
                currentScreen = startScreen;
            }
        }
    }
}
function ruffleBallInitialDirection() {
    !!Math.floor(Math.random() * 2) ? physics.ballVelocityX *= -1 : physics.ballVelocityX = Math.abs(physics.ballVelocityX);
}
function flashyText() {
    let count = 0;
    setInterval(function () {
        count++;
        if (count % 2 === 1) {
            startScreen.options[selectedOption].letterColor = 'white';
            if (startScreen.options[selectedOption - 1]) {
                startScreen.options[selectedOption - 1].letterColor = 'black';
            } else {
                startScreen.options[selectedOption + 1].letterColor = 'black';
            }
            gameOverScreen.buttonColor = 'white';
        } else {
            startScreen.options[selectedOption].letterColor = 'black';
            gameOverScreen.buttonColor = 'black';
        }
    }, 500);
}
async function playSound(soundName, volume = 0.3) {
    sounds[soundName].volume = volume;
    try {
        sounds[soundName].play();
    } catch (DOMException){
        return;
    }
}
if (window.matchMedia('(pointer: coarse)').matches) {
    addTouchListners();
    addFullScreenListner();
    addInstructionImage();
    changeInstructionsToATouchGame();
    increaseBallVelocity();

    function addTouchListners() {
        canvas.addEventListener('touchstart', (event) => touchHandler(event.touches));
        canvas.addEventListener('touchmove', (event) => touchHandler(event.touches));
    }
    function addFullScreenListner() {
        let isFull = false;
        canvas.addEventListener('click', () => {
            if (!isFull) try { document.documentElement.requestFullscreen(); } catch { }
        });
        canvas.addEventListener('blur', () => {
            if (isFull) try { document.documentElement.exitFullscreen(); } catch { }
        });
    }
    function addInstructionImage() {
        document.getElementById('img_instructions').src = 'img/mobile_tutorial.gif';
    }
    function changeInstructionsToATouchGame() {
        startScreen.instruction.text = "clique em um modo de jogar";
        gameOverScreen.returnInstruction = 'clique na seta para voltar';
        gameOverScreen.drawExitButton = true;
    }
    function increaseBallVelocity() {
        physics.ballVelocityX += 3;
    }
} else {
    window.addEventListener('keyup', () => KeyPressed = undefined);
    window.addEventListener('keydown', (event) => KeyPressed = event.key.toUpperCase());
}
gameLoop();
ruffleBallInitialDirection();
flashyText();