let mainScene = document.getElementById("scene");
var beatmap = undefined;

// spawnObject(mainScene, {x:0, y:0, z:-5});
// setTimeout(spawnObject, 5000, mainScene, {x:1, y:1, z:-5});

function spawnObject(scene, pos={x:0, y:0, z:0}){
    console.log("spawn");    let newObject = document.createElement("a-entity");
    newObject.setAttribute("geometry", {primitive: "sphere", radius: 0.5});
    newObject.setAttribute("material", {color: "yellow", shader: "standard", src: "#metal"});
    newObject.setAttribute("position", pos);
    newObject.setAttribute("node", "");
    scene.appendChild(newObject);
}

AFRAME.registerComponent('node-spawner', {
    schema: {
      color: {default: 'red'}
    },
    init: function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let audioPlayer = document.getElementById("audio-player");
                audioPlayer.components.sound.playSound();
                let nodeSpawner = document.getElementById("node-spawner");
                console.log(nodeSpawner.components['node-spawner']);
                beatmap = JSON.parse(this.responseText);
            }
        };
        this.currentTime = 0; 
        this.currentNode = 0;
        xmlhttp.open("GET", "./beatmap/demo/Normal.json", true);
        xmlhttp.send();
    },
    tick: function(time, timeDelta){
        if(beatmap != undefined){
            this.currentTime += timeDelta;
            let bps = beatmap._bpm/60;
            let currentBeat = this.currentTime/1000 * bps;
            
            let curNote = beatmap._notes[this.currentNode];
            while(curNote._time <= currentBeat){
                spawnObject(mainScene, {x:this.currentNode%10-5, y:0, z:-5});
                this.currentNode++;
                curNote = beatmap._notes[this.currentNode];
            }
        }
    }
  });

AFRAME.registerComponent('node', {
    schema: {
      color: {default: 'red'}
    },

    init: function () {
      var data = this.data;
      var el = this.el;
      var defaultColor = el.getAttribute('material').color;

      el.addEventListener('mouseenter', function () {
        el.setAttribute('material', {color:data.color});
      });

      el.addEventListener('mouseleave', function () {
        el.setAttribute('material', {color:defaultColor});
      });

      el.addEventListener('click', function () {  
        el.remove();
      });
    }
  });