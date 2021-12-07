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