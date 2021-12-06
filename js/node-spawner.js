let mainScene = document.getElementById("scene");
var beatmap = undefined;
let game_manager = document.querySelector('[game-manager]');
let score_text = document.querySelector("#text-score");
let end_score_text = document.querySelector("#end-score");
let main_menu = document.querySelector("#main-menu");
let end_menu = document.querySelector("#end-menu");
let game_level = document.querySelector("#game-level");
const maxNode = 5;
let score = 0;
let currentNodeCount = 0;

// spawnObject(mainScene, {x:0, y:0, z:-5});
// setTimeout(spawnObject, 5000, mainScene, {x:1, y:1, z:-5});

function spawnNode(scene, pos={x:0, y:0, z:0}){
  let newObject = document.createElement("a-entity");
  newObject.setAttribute("geometry", {primitive: "sphere", radius: 0.5});
  newObject.setAttribute("material", {color: "yellow", shader: "standard"});
  newObject.setAttribute("position", pos);
  newObject.setAttribute("node", "");
  scene.appendChild(newObject);
  currentNodeCount++;
}

function spawnNote(parent, pos={x:0, y:0, z:0}){
  let newObject = document.createElement("a-entity");
  newObject.setAttribute("geometry", {primitive: "sphere", radius: 0.25});
  newObject.setAttribute("material", {color: "#0095DD", shader: "standard"});
  newObject.setAttribute("position", pos);
  newObject.setAttribute("note", "");
  parent.appendChild(newObject);
}

function getRandom(min, max){
  return Math.random() * (max-min) + min;
}

AFRAME.registerComponent('game-manager', {
  init: function(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "./beatmap/demo/Normal.json", false);
    xmlhttp.send();
    beatmap = JSON.parse(xmlhttp.responseText);
    let soundEntity = document.querySelector("#audio-player");
    soundEntity.addEventListener('sound-ended', ()=>{
      let nodes = document.querySelectorAll('[node]');
      for(let i = 0; i < nodes.length; i++){
        nodes[i].remove();
      }
      end_menu.setAttribute("scale", "1 1 1");
      end_score_text.setAttribute("text", `value: Score ${score};`);
      game_level.setAttribute("visible", "false");
    });
    let playButton = document.querySelector("#play-button");
    playButton.addEventListener("click", ()=>{
      score=000;
      score_text.setAttribute("text", `value: ${score};`);
      main_menu.setAttribute("scale", "0 0 0");
      game_level.setAttribute("visible", "true");
      document.querySelector("[node-spawner]").components['node-spawner'].start();
      document.querySelector("[note-spawner]").components['note-spawner'].start();
      setTimeout(()=>{
        document.querySelector("[game-start-timer]").components['game-start-timer'].start();
      }, 6000);
      setTimeout(()=>{
        let soundEntity = document.querySelector("#audio-player");
        soundEntity.components.sound.playSound();
      }, 9000);
    });
    let replayButton = document.querySelector("#replay-button");
    replayButton.addEventListener("click", ()=>{
      score=0;
      score_text.setAttribute("text", `value: ${score};`);
      end_menu.setAttribute("scale", "0 0 0");
      game_level.setAttribute("visible", "true");
      document.querySelector("[node-spawner]").components['node-spawner'].start();
      document.querySelector("[note-spawner]").components['note-spawner'].start();
      setTimeout(()=>{
        document.querySelector("[game-start-timer]").components['game-start-timer'].start();
      }, 6000);
      setTimeout(()=>{
        let soundEntity = document.querySelector("#audio-player");
        soundEntity.components.sound.playSound();
      }, 9000);
    });
  }
});

AFRAME.registerComponent('game-start-timer', {
  schema:{
    timer: {default: 3},
    autostart: {default: true}
  },
  init: function(){
    if(this.data.autostart){
      this.time = this.data.timer * 1000;
    }else{
      this.time = 0;
    }
  },
  tick: function(time, deltaTime){
    if(this.time > 0){
      this.time -= deltaTime;
      this.el.setAttribute("text", `value:${Math.ceil(this.time/1000)};`)
    }else{
      this.el.setAttribute("text", `value:;`);
    }
  },
  start: function(){
    this.time = this.data.timer * 1000;
  }
});

AFRAME.registerComponent('node-spawner', {
  schema: {
    color: {default: 'red'},
    autostart : {default: true},
    delay: {default: 7},
    min_pos:{default: {x:-3, y:-3, z:-7}},
    max_pos:{default: {x:3, y:3, z:-4}},
  },
  init: function () {
    this.currentTime = -this.data.delay*1000; 
    this.currentNode = 0;
    this.isRunning = this.data.autostart;
  },
  tick: function(time, timeDelta){
    if(!this.isRunning){
      return;
    }
    if(beatmap != undefined){
      if(currentNodeCount >= maxNode){
        return;
      }
      this.currentTime += timeDelta;
      let bps = beatmap._bpm/60;
      let currentBeat = this.currentTime/1000 * bps;
      let curNote = beatmap._notes[this.currentNode];
      if(this.currentNode < beatmap._notes.length){
        if(curNote._time <= currentBeat){
          let pos = {
            x: getRandom(this.data.min_pos.x, this.data.max_pos.x),
            y: getRandom(this.data.min_pos.y, this.data.max_pos.y),
            z: getRandom(this.data.min_pos.z, this.data.max_pos.z)
          }
          spawnNode(mainScene, pos);
          this.currentNode++;
          curNote = beatmap._notes[this.currentNode];
        }
        while(curNote._time <= currentBeat){
          this.currentNode++;
          curNote = beatmap._notes[this.currentNode];
          if(this.currentNode >= beatmap._notes.length){
            break;
          }
        }
      }
    }
  },
  start: function(){
    this.isRunning = true;
    this.currentTime = -this.data.delay*1000; 
    this.currentNode = 0;
    currentNodeCount = 0;
  },
  stop: function(){
    this.isRunning = false;
    this.currentTime = -this.data.delay*1000; 
    this.currentNode = 0;
  }
});

AFRAME.registerComponent('note-spawner', {
  schema: {
    color: {default: 'red'},
    autostart : {default: true},
    min_pos:{default: {x:-3, y:-3, z:-7}},
    max_pos:{default: {x:3, y:3, z:-4}},
  },
  init: function () {
      this.currentTime = 0; 
      this.currentNode = 0;
      this.isRunning = this.data.autostart;
      this.board = document.querySelector("#note-board");
  },
  tick: function(time, timeDelta){
    if(!this.isRunning){
      return;
    }
    if(beatmap != undefined){
        this.currentTime += timeDelta;
        let bps = beatmap._bpm/60;
        let currentBeat = this.currentTime/1000 * bps;
        let curNote = beatmap._notes[this.currentNode];
        if(this.currentNode < beatmap._notes.length){
          if(curNote._time <= currentBeat){
            let pos = {
              x: 5,
              y: 0,
              z: 0
            }
            spawnNote(this.board, pos);
            this.currentNode++;
            curNote = beatmap._notes[this.currentNode];
          }
          while(curNote._time <= currentBeat){
            this.currentNode++;
            curNote = beatmap._notes[this.currentNode];
            if(this.currentNode >= beatmap._notes.length){
              break;
            }
          }
        }
    }
  },
  start: function(){
    this.isRunning = true;
    this.currentTime = 0; 
    this.currentNode = 0;
  },
  stop: function(){
    this.isRunning = false;
    this.currentTime = 0; 
    this.currentNode = 0;
  }
});

AFRAME.registerComponent('node', {
  schema: {
    color: {default: 'red'}
  },

  init: function () {
    this.eventEmitter = document.querySelector("#event-emitter");
    this.eventEmitter.addEventListener('shoot', ()=>{
      if(this.isHover){
        this.el.remove();
        currentNodeCount--;
        score+=100;
        score_text.setAttribute("text", `value: ${score};`)
      }
    });
    var data = this.data;
    var el = this.el;
    var defaultColor = el.getAttribute('material').color;
    el.addEventListener('mouseenter', ()=>{
      el.setAttribute('material', {color:data.color});
      this.isHover = true;
    });
    el.addEventListener('mouseleave', ()=>{
      el.setAttribute('material', {color:defaultColor});
      this.isHover = false;
    });
  }
});

AFRAME.registerComponent('note', {
  schema: {
    speed: {default: 1}
  },
  init : function(){
    this.eventEmitter = document.querySelector("#event-emitter");
  },
  tick: function(time, deltaTime){
    var el = this.el;
    let pos = el.getAttribute("position");
    pos.x = pos.x - this.data.speed * deltaTime/1000;
    el.setAttribute("position", pos);
    if(pos.x <= -4){
      this.el.remove();
    }
  },
  remove: function(){
    this.eventEmitter.emit("shoot");
  }
});

AFRAME.registerComponent('flash', {
  schema: {
    color: {default: 'red'}
  },

  init: function () {
    this.eventEmitter = document.querySelector("#event-emitter");
    this.el.setAttribute("visible", "false");
    this.eventEmitter.addEventListener('shoot', ()=>{
      this.el.setAttribute("visible", "true");
      setTimeout(()=>{
        this.el.setAttribute("visible", "false");
      }, 100);
    });
  }
});