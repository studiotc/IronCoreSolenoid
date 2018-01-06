

class ICSLayout extends Container {

  constructor() {
    super("Layout", "pageLayout");


    this.leftComp = null;
    this.centerComp = null;
    this.rightComp = null;

  }


  addComponent(component) {

    //this.components.push(component);
    throw "AddCompnenet method in Layout is unsupported - add component to zones";

  }

  addComponentLeft(component) {
    this.leftComp = component;
  }

  addComponentCenter(component) {
    this.centerComp = component;
  }

  addComponentRight(component) {
    this.rightComp = component;
  }

  renderTo(parent) {

    let wrapperDiv =  document.createElement("div");
    wrapperDiv.id = this.id;
    wrapperDiv.classList.add('wrapper');

    let leftDiv =  document.createElement("div");
    leftDiv.id = generateUniqueID("leftzone", 12);
    leftDiv.classList.add('left-zone');

    let centerDiv =  document.createElement("div");
    centerDiv.id = generateUniqueID("centerzone", 12);
    centerDiv.classList.add('center-zone');

    let rightDiv =  document.createElement("div");
    rightDiv.id = generateUniqueID("rightzone", 12);
    rightDiv.classList.add('right-zone');

    //start appending zones
    if(this.rightComp !== null) {
      //rightDiv.appendChild(this.rightComp);
      this.rightComp.renderTo(rightDiv);
    }
    if(this.centerComp !== null) {
      //centerDiv.appendChild(this.centerComp);
      this.centerComp.renderTo(centerDiv);
    }
    if(this.leftComp !== null) {
      //leftDiv.appendChild(this.leftComp);
      this.leftComp.renderTo(leftDiv);
    }
    //
    wrapperDiv.appendChild(leftDiv);
    wrapperDiv.appendChild(centerDiv);
    wrapperDiv.appendChild(rightDiv);

    //append the wrapper
    parent.appendChild(wrapperDiv);


  }


}
