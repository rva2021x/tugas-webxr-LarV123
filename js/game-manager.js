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
        document.querySelector("[combo-counter]").components['combo-counter'].reset();
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
        document.querySelector("[combo-counter]").components['combo-counter'].reset();
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