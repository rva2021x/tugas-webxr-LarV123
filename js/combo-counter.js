AFRAME.registerComponent('combo-counter', {
    schema: {
      nodeCount: {default: 5}
    },
    init : function(){
      this.eventEmitter = document.querySelector("#event-emitter");
      this.comboHitText = document.querySelector("#hit-combo");
      this.multiplierText = document.querySelector("#multiplier-text");
      this.shoot = false;
      this.shotHit = false;
      this.comboCount = 0;
      this.eventEmitter.addEventListener('shoot', ()=>{
        this.shoot = true;
      });
    },
    tick: function(time, deltaTime){
        if(this.shoot){
            if(this.shotHit){
                this.comboCount++;
                let currentMultiplier = Math.pow(2, Math.floor(this.comboCount/5));
                score+= 100 * currentMultiplier;
                score_text.setAttribute("text", `value: ${score};`);
                this.comboHitText.setAttribute("text", `value: Hit combo : ${this.comboCount};`);
                this.multiplierText.setAttribute("text", `value: x${currentMultiplier};`);
            }else{
                this.comboCount = 0;
                let currentMultiplier = Math.pow(2, Math.floor(this.comboCount/5));
                this.comboHitText.setAttribute("text", `value: Hit combo : ${this.comboCount};`);
                this.multiplierText.setAttribute("text", `value: x${currentMultiplier};`);
            }
            this.shoot = false;
            this.shotHit = false;
        }
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
    },
    hit: function () {  
        this.shotHit = true;
    },
    reset: function(){
        this.shoot = false;
        this.shotHit = false;
        this.comboCount = 0;
    }
});