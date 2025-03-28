//Board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//bird
let birdheight = 42;
let birdwidth = 36;
let birdx = boardwidth/8;
let birdy = boardheight/2;

let bird = {
    x : birdx,
    y : birdy,
    height : birdheight,
    width : birdwidth
}
//pipes
let pipeArray = [];
let pipeWidth = 74;
let pipeHeight = 532;
let pipex = boardwidth;
let pipey = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -1.5; //pipes left speed
let velocityY = 0; //bird up speed
let gravity = 0.1  ;

let gameOver = false;
let score = 0;
//let highScore = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    //draw Flappy Bird 
    birdImg = new Image();
    birdImg.src = "./images/bird.png";
    birdImg.onload = function drawBirds(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";
  
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";
   

    requestAnimationFrame(update);
    setInterval(placePipes, 800);
    document.addEventListener("keydown", moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height)
    

    //bird
    velocityY +=gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 
    
    if(bird.y > board.height){
        gameOver = true;
    }
    //pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;

        }

        if(decactCollision(bird,pipe)){
            gameOver = true;
        }
    }
    //clear pipes
    while(pipeArray.length >0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }
    //socre
    context.fillStyle = "white";
    context.font = "35px sans-serif";
    
    context.fillText( "Score:", 5, 45);
    context.fillText( score, 155, 45);

    if(gameOver){
        context.font = "45px sans-serif";
        context.fillStyle = "red";
        context.fillText("GAME OVER", 30, 100);
        context.fillStyle = "yellow"; 
        context.font = "25px sans-serif";
        context.fillText("Press Space key to restart ", 30, 300);

       // context.fillStyle = "white";
        //context.font = "30px sans-serif";
       // context.fillText("High Score: ", 35, 600);
        //if(score>highScore){
          //  highscore = score;
       //}
        //context.fillText(highScore, 55, 600);
       //}
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipey - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let opeaningSpace = board.height/4;
    let toppipe = {
        img: topPipeImg,
        x: pipex,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }
    pipeArray.push(toppipe);

    let bottompipe = {
        img: bottomPipeImg,
        x: pipex,
        y: randomPipeY + pipeHeight + opeaningSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottompipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX"){
        //jump
        velocityY = -4;
        //reset game
        if(gameOver){
            bird.y = birdy;
            pipeArray = [];
            score = 0;
            gameOver = false;

        }

    }
}
function decactCollision(a,b) {
    const margin = 10 ; // Add a small margin to the collision area
    return a.x + margin < b.x + b.width &&
           a.x + a.width - margin > b.x &&
           a.y + margin < b.y + b.height &&
           a.y + a.height - margin > b.y;
}

 
