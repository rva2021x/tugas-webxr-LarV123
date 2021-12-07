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