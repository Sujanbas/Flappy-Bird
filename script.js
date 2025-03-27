// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdHeight = 42;
let birdWidth = 36;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let bird = {
    x: birdX,
    y: birdY,
    height: birdHeight,
    width: birdWidth
};

// Pipes
let pipeArray = [];
let pipeWidth = 74;
let pipeHeight = 532;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -1.5; // Pipes move left speed
let velocityY = 0; // Bird jump speed
let gravity = 0.1;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load Flappy Bird Image
    birdImg = new Image();
    birdImg.src = "./images/bird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 800);
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Bird physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Clear off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score
    context.fillStyle = "white";
    context.font = "35px sans-serif";
    context.fillText("Score:", 5, 45);
    context.fillText(score, 155, 45);

    // Game Over Screen
    if (gameOver) {
        context.font = "45px sans-serif";
        context.fillStyle = "red";
        context.fillText("GAME OVER", 30, 100);
        context.fillStyle = "yellow";
        context.font = "25px sans-serif";
        context.fillText("Press Space key to restart", 30, 300);

        context.fillStyle = "white";
        context.font = "30px sans-serif";
        context.fillText("High Score:", 35, 600);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // Store new high score
        }
        context.fillText(highScore, 200, 600);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        velocityY = -4; // Jump

        // Reset game when space is pressed after game over
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            velocityY = 0;
        }
    }
}

function detectCollision(a, b) {
    const margin = 10; // Add a small margin to the collision area
    return (
        a.x + margin < b.x + b.width &&
        a.x + a.width - margin > b.x &&
        a.y + margin < b.y + b.height &&
        a.y + a.height - margin > b.y
    );
}
