


class Component {

  constructor() {

    this.id = generateUniqueID("component", 12);


  }


  /**
   * Get the componenets Id
   * @return {string} Unique ID for the component
   */
  getId() {
    return this.id;
  }


  /**
   * Render to container
   * @param  {object} parent Container
   * @return {undefined}  No Return
   */
  renderTo(parent) {
    return;
  }


}
