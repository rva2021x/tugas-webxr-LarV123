

function spawnNote(parent, pos={x:0, y:0, z:0}){
    let newObject = document.createElement("a-entity");
    newObject.setAttribute("geometry", {primitive: "sphere", radius: 0.25});
    newObject.setAttribute("material", {color: "#0095DD", shader: "standard"});
    newObject.setAttribute("position", pos);
    newObject.setAttribute("note", "");
    parent.appendChild(newObject);
}

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