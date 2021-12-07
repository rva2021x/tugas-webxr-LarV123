AFRAME.registerComponent('node', {
    schema: {
      color: {default: 'red'}
    },
  
    init: function () {
      this.eventEmitter = document.querySelector("#event-emitter");
      this.comboCounter = document.querySelector("[combo-counter]");
      this.eventEmitter.addEventListener('shoot', ()=>{
        if(this.isHover){
          this.el.remove();
          currentNodeCount--;
          this.comboCounter.components['combo-counter'].hit();
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