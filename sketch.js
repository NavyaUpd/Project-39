/*IMPORTANT NOTE - Change the snowSpeed to 8 for low CPU usage*/
var snowSpeed = 3;
var snowImg, snow;
var gift1, gift2, gift3, gift, giftGroup;
var tree1, tree2, tree, treeGroup;
var santaImg, santa, obstacleImg, obstacle, obstacleGroup;
var skyImg, sky, sky2, groundImg, ground;
var gameover, gameoverImg, reset, resetImg, win, winImg;
var jingle, bells;
var score = 0;
var crashes = 0;
var PLAY = 0;
var END = 1;
var WIN = 2;
var giftNum;

var gamestate = PLAY;

function preload(){
  
  snowImg = loadImage("snow.png");
  tree1 = loadImage("tree.png");
  tree2 = loadImage("tree2.png");
  gift1 = loadImage("gift1.png");
  gift2 = loadImage("gift2.png");
  gift3 = loadImage("gift3.png");
  skyImg = loadImage("sky2.webp");
  groundImg = loadImage("grass2.PNG");
  santaImg = loadAnimation("santa1.png","santa2.png","santa3.png","santa4.png");
  obstacleImg = loadImage("stone.png");
  gameoverImg = loadImage("gameover.png");
  winImg = loadImage("win.png");
  resetImg= loadImage("reset-button-png.png");
  jingle = loadSound("jingle-bells.mp3");
  bells = loadSound("bells.mp3");
  
}
function setup() {
  createCanvas(600, 400);
  
  console.warn("Change the snowSpeed to 8 for low CPU usage")
  
  sky = createSprite(300, 450, 10, 10);
  sky.addImage("sky", skyImg);
  sky.scale = 3.2;
  sky2 = createSprite(-1325, 450, 10, 10);
  sky2.addImage("sky", skyImg);
  sky2.scale = 3.2;
  
  ground = createSprite(-520, 380);// 600, 30
  ground.addImage("ground", groundImg);
  ground.scale = 0.5;
  //ground.velocityX = 3;
  
  santa = createSprite(420, 200, 10, 10);
  santa.addAnimation("santa", santaImg);
  santa.scale = 0.5;
  
  giftGroup = new Group();
  obstacleGroup = new Group();
  treeGroup = new Group();
  
  gameover = createSprite (300, 150);
  gameover.addImage("gamover", gameoverImg);
  gameover.visible = false;

  win = createSprite (300, 150);
  win.addImage("win", winImg);
  win.visible = false;
  
  reset = createSprite(300, 250);
  reset.addImage("reset", resetImg);
  reset.visible = false;
  reset.scale = 0.3;
  
  jingle.loop();
  giftNum = Math.round(random(10, 20));
}

function draw() {
  background("black");
  drawSprites();
  
  //displays score and crashes
  fill("white");
  textSize(16);
  noStroke();
  text("Score: " + score, camera.x - 270, 30);
  text("Crashes: " + crashes, camera.x + 200, 30)
  
  fill("red");
  textSize(35);
  strokeWeight(3);
  stroke("white");
  text("CHRISTMAS", camera.x - 200, 40);
  fill("green");
  text("RUNNER", camera.x + 20, 40);
  
  if(gamestate === PLAY){
    textSize(10);
    fill("white");
    
    drawGift();
    drawObstacle();
    //drawTree();
    
    if(score < 1){
      fill("white");
      textSize(20);
      noStroke();
      text("Control using arrow keys", camera.x - 200, 60);
      text("Collect "+giftNum+" presents and avoid rocks", camera.x - 200, 80);
    }
    if(score >= giftNum){
      gamestate = WIN;
    }
    //snow
    if (frameCount % snowSpeed === 0){
      drawSnow();
    }
    /*//infinite ground
    if(ground.x >= 1200){
      ground.x = -660;
    }*/
    //increases score on collecting trees
    if (santa.isTouching(giftGroup)) {
      score = score + 1;
      giftGroup.destroyEach();
    }
    //increases crashes when santa collides with rock
    if (santa.isTouching(obstacleGroup)) {
      crashes = crashes + 1;
      obstacleGroup.destroyEach();
    }
    if (crashes >= 3){
      gamestate = END;
    }
    //controlling the sleigh
    if (keyDown("UP_ARROW") && santa.y > 0) {
      santa.y = santa.y - 10;
    }if (keyDown("DOWN_ARROW") && santa.y < 400) {
      santa.y = santa.y + 10;
    }if (keyDown("LEFT_ARROW") && santa.x > -1470) {
        santa.x = santa.x - 10;
    }if (keyDown("RIGHT_ARROW") && santa.x < 420) {
        santa.x = santa.x + 10;
    }
    camera.position.x = santa.x;
    
  }else if(gamestate === END){
    camera.x = 300;
    camera.y = 200;
    santa.visible = false;
    gameover.visible = true;
    win.visible = false;
    reset.visible = true;
    
    treeGroup.destroyEach();
    obstacleGroup.destroyEach();
    giftGroup.destroyEach();
    
    if(mousePressedOver(reset)){
      santa.x = 420;
      santa.y = 200;
      score = 0;
      crashes = 0;
      santa.visible = true;
      gameover.visible = false;
      reset.visible = false;
      //ground.velocityX = 3;
      gamestate = PLAY;
    }
  }else if(gamestate === WIN){
    camera.x = 300;
    camera.y = 200;
    santa.visible = false;
    gameover.visible = false;
    win.visible = true;
    reset.visible = true;
    
    treeGroup.destroyEach();
    obstacleGroup.destroyEach();
    giftGroup.destroyEach();
    
    if(mousePressedOver(reset)){
      santa.x = 420;
      santa.y = 200;
      score = 0;
      crashes = 0;
      santa.visible = true;
      gameover.visible = false;
      win.visible = false;
      reset.visible = false;
      //ground.velocityX = 3;
      gamestate = PLAY;
      
    }
  }
    
}
function drawSnow(){
    snow = createSprite(200, 0, 10, 10);
    snow.addImage("snow", snowImg);
    snow.scale = 0.12;
    snow.x = random(santa.x - 400, santa.x + 400);
    snow.velocityY = random(2, 5);
    snow.lifetime = 400/snow.velocityY;
}

function drawGift() {
  if (frameCount % 200 === 0 || frameCount === 1) {
    gift = createSprite(-1470, 300);
    gift.scale = 0.3;
    var giftX = Math.round(random(-1470, 0));
    gift.x = giftX;
    gift.y = random(50, 250);
    gift.velocityX = 3;
    gift.lifetime = 2190/3;
    gift.setCollider("rectangle", 0, 0, 200, 150);
    giftGroup.add(gift);
    //gift.debug = true;
    
    randomNum = Math.floor(random(1, 4))
    if(randomNum === 1){
      gift.addImage("gift1", gift1);
    }else if(randomNum === 2){
      gift.addImage("gift2", gift2);
    }else if(randomNum === 3){
      gift.addImage("gift3", gift3);
    } 
  }
}

function drawObstacle() {
  if (frameCount % 250 === 0) {
    obstacle = createSprite(0, ground.y-35, 10, 10);
    obstacle.addImage("obstacle", obstacleImg);
    obstacle.scale = 0.15;
    var obstacleX = random(-1470, 0);
    obstacle.x = obstacleX;
    obstacle.y = random(50, 250);
    obstacle.velocityX = 3;
    obstacle.lifetime = 2190/3;
    obstacle.setCollider("circle", 0, 10, 200);
    obstacleGroup.add(obstacle);

    obstacle.depth = santa.depth;
    santa.depth = santa.depth + 1;
    //obstacle.debug = true;
  }
}

function drawTree() {
  if (frameCount % 100 === 0 || frameCount === 1) {
    tree = createSprite(-10, 320);
    tree.scale = 0.7;
    tree.velocityX = 3;
    tree.lifetime = 600/3;
    tree.setCollider("rectangle", 0, 0, 200, 150);
    treeGroup.add(tree);
    tree.depth = santa.depth;
    santa.depth = santa.depth + 1;
    //tree.debug = true;
    
    randomNum2 = Math.floor(random(1, 2))
    if(randomNum === 1){
      tree.addImage("tree1", tree1);
    }else if(randomNum === 2){
      tree.addImage("tree2", tree2);
    }else if(randomNum === 3){
      tree.addImage("tree2", tree2);
    } 
  }
}