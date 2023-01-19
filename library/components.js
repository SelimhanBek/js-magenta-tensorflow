class Components {
    /* Div */
    createDiv(id, className) {
      let div = document.createElement("div");
      div.id = id;
      div.className = className;
      return div;
    }
  
    /* Button */
    createButton(id, className, innerHTML) {
      let btn = document.createElement("button");
      btn.id = id;
      btn.className = className;
      btn.innerHTML = innerHTML;
      return btn;
    }
  
    
  }
  