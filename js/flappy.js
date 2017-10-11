// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)

var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var paused = true;

var score = 0;
var labelScore;
var player;
var pauseIcon;

var jump = -10;

var speed = 10;

var pipes = [];
var pipesOnScreen = [];

var lastScoreTime;
var scoreDelay = 1000;

var bg;
/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("birb", "assets/flappy.png");
  game.load.image("wall", "assets/pipe2-body.png");
  game.load.image("end", "assets/pipe2-end.png");
  game.load.image("pauseIcon", "assets/pauseIcon.png");
  game.load.image("bg", "assets/bg2.png");

  game.load.audio("jump", "assets/jump.ogg");
  game.load.audio("score", "assets/point.ogg");

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.setBackgroundColor("#F3D3A3");

    bg = game.add.sprite(0, 0, "bg");

    labelScore = game.add.text(20, 20, "Score: " + score.toString(), {font: "30px Consolas", fill: "white"});

   

    player = game.add.sprite(250, 200, "birb");
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.05, 0.05);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 750;

    pauseIcon = game.add.sprite(395, 200, "pauseIcon");
    pauseIcon.anchor.setTo(0.5, 0.5);
    pauseIcon.visible = false;

    var pipeInterval = 1.75 * Phaser.Timer.SECOND;
    game.time.events.loop(
      pipeInterval,
      generatePipes
    );

    game.input
      .onDown.add(clickHandler);

    game.input
      .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      .onDown.add(spaceHandler);

    game.input
      .keyboard.addKey(Phaser.Keyboard.A)
      .onDown.add(aiActivate);

    game.onPause.add(pause);
    game.onResume.add(pause);

    lastScoreTime = game.time.time;
    generatePipes();

    game.paused = true;
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(
    player,
    pipes,
    leFin
  )

  var datAngle = player.body.velocity.y / 6.1;
  player.angle = datAngle;
  player.body.angle = datAngle;
  checkPlayerPosition();

  for (i = 0; i < pipes.length;i++){
    if (pipes[i].body.x < -50) {
      pipes[i].kill();
      pipes.splice(i, 1);
    }
  }

  for (i = 0; i < pipesOnScreen.length; i++) {
    if (pipesOnScreen[i].body.x < player.body.x) {
      updateScore();
    }

  }
  
  if (typeof pipesOnScreen[0] != "undefined"){
    if (pipesOnScreen[0].x < player.x - 70){
        pipesOnScreen.splice(0, 1);
      }
  }
}

function clickHandler(event) {
  playerJump();
}

function spaceHandler(event) {
  game.paused = !game.paused ;
}

function updateScore() {
  console.log(game.time.time, lastScoreTime);
  if (game.time.time > lastScoreTime + scoreDelay) {
    score += 1;
    labelScore.destroy();
    labelScore = game.add.text(20, 20, "Score: " + score.toString(), {font: "30px Consolas", fill: "white"});
    lastScoreTime = game.time.time;
  }
}

function playerJump() {
  player.body.velocity.y = - 250;
  game.sound.play("jump");
}

function generatePipes() {
  var gapStart = game.rnd.integerInRange(1, 5);
  for (var i = 0; i < 8; i++) {
    if (i != gapStart && i != gapStart + 1) {
      pushLesPipes(790, i * 50, "wall");
    }else{
      if (i == gapStart) {
        pushLesPipes(815, i * 50, "end1");
      }
      else {
        pushLesPipes(815, i*50 + 44, "end2");
      }

    }
  }
}

function pushLesPipes(x, y, type) {
  if (type == "wall") {
    var block = game.add.sprite(x, y, "wall");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -200;
  }
  else if (type == "end1") {
    var end = game.add.sprite(x, y, "end");
    end.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(end);
    end.body.velocity.x = -200;
  }
  else {
    var end = game.add.sprite(x, y, "end");
    end.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(end);
    end.body.velocity.x = -200;
    pipesOnScreen.push(end);
  }
}

function checkPlayerPosition() {
  if (player.y < 0 || player.y > 400) {
    leFin();
  }
}

function aiActivate() {
  aion = true;
  game.time.events.loop(

    0.01 * Phaser.Timer.SECOND,


    aiLogic
  );
}

function aiLogic() {
  
    if (player.y > pipesOnScreen[0].y-50){
      //console.log("before " + (pipesOnScreen[0]) + " " + player.x);
      var tempdiff = (-1 * (pipesOnScreen[0].y - player.y)) + 40;
      //console.log("Diff : " + tempdiff);
  
      if (tempdiff > 12.5) {
        player.body.velocity.y = - 250;
        game.sound.play("jump", 0.2);
        }
  
    }
  }
  

function pause() {
  paused = !paused;
  pauseIcon.visible = !pauseIcon.visible;
}


function leFin() {
  location.reload();
}
