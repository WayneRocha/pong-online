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
        positionX: (canvas.width / 12) - (20 / 2),
        positionY: (canvas.height / 2) - (60 / 2),
        width: 20,
        height: 60
    },
    player2: {
        positionX: (canvas.width / 1.1),
        positionY: (canvas.height / 2) - (60 / 2),
        width: 20,
        height: 60
    },
    ball: {
        positionX: (canvas.width / 2) - 20,
        positionY: (canvas.height / 2) - 20,
        width: 20,
        height: 20
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
    }
}
function gameLoop(){
    whiteScreen.draw();
    currentScreen.draw();
}

var currentScreen = startScreen;
setInterval(() => gameLoop(), 16);
window.addEventListener('keydown', keyboard);
flashyText();

function keyboard(e){
    switch (e.keyCode){
        case 13:
            console.log('enter');
            currentScreen = gameScreen;
            break;
        case 38:
            console.log('seta - cima');
            break;
        case 40:
            console.log('seta - baixo');
            break;
        case 87:
            console.log('W - cima');
            break;
        case 83:
            console.log('S - baixo');
            break;
        case 27:
            currentScreen = startScreen;
            console.log('sair');
            break;
    }
}
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