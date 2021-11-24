AFRAME.registerComponent('weapon-switch', {
    schema: {
      color_a: {default: 'red'},
      color_b: {default: 'blue'},
      color_c: {default: 'yellow'},
      color_d: {default: 'green'},
      prev_color: {default: 'blue'}
    },

    init: function () {
      var data = this.data;
      var el = this.el;
      el.setAttribute("color", data.color_a);
      el.addEventListener("keydown", e=>{
        let curColor = el.getAttribute("color");
        let color;
        console.log('a');
        if(e.code == 49){
          color = data.color_a;
        }else if(e.code == 50){
          color = data.color_b;
        }else if(e.code == 51){
          color = data.color_c;
        }else if(e.code == 52){
          color = data.color_d;
        }
        if(curColor != color){
          this.data.prev_color = curColor;
          el.setAttribute("color", color);
        }
      });
    }
  });