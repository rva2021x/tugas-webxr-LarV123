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