


class Container {


  constructor(name) {

    this.name = name;
    this.id = generateUniqueID("container", 12);

    this.components = [];


  }

  /**
   * Add a component to the componets list
   * @param {object} component Component to add
   */
  addComponent(component) {

    this.components.push(component);

  }

  renderTo(parent) {

    let contDiv =  document.createElement("div");
    contDiv.id = this.id;
    contDiv.classList.add('pane');

    //this.div
    let cl = this.components.length;
    for(let c=0; c < cl; c++) {
      let comp = this.components[c];
      comp.renderTo(contDiv);

    }

    //let parent = document.getElementById(this.parentId);
    parent.appendChild(contDiv);


  }



}
