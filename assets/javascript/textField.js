
class TextField extends Component {


  constructor(label, suffix, round) {
    super();
    this.label = label;
    this.suffix = suffix;

    this.round = round;

    this.value = "<value>";

    this.id = generateUniqueID("textField", 8);

  }

  renderTo(parent) {

    let tfDiv = document.createElement("div");
    let tfLabel = document.createElement("p");
    let tfValue = document.createElement("p");


    tfLabel.innerHTML = this.label + ": ";
    tfLabel.classList.add("text-label");

    tfValue.innerHTML = this.value;
    tfValue.classList.add("text-value");
    tfValue.id = this.id;

    //attach to div
    tfDiv.appendChild(tfLabel);
    tfDiv.appendChild(tfValue);

    //attach to parent
    parent.appendChild(tfDiv);

  }

  attach(parent) {

    let tfDiv = document.createElement("div");
    let tfLabel = document.createElement("p");
    let tfValue = document.createElement("p");


    tfLabel.innerHTML = this.label + ": ";
    tfLabel.classList.add("text-label");

    tfValue.innerHTML = this.value;
    tfValue.classList.add("text-value");
    tfValue.id = this.id;

    //attach to div
    tfDiv.appendChild(tfLabel);
    tfDiv.appendChild(tfValue);

    //attach to parent
    parent.appendChild(tfDiv);

  }

  getId() {
    return this.id;
  }


  setValue(value) {
    let v = parseFloat(value);
    v = v.toFixed(this.round);
    this.value = v;

    let text = document.getElementById(this.id);
    text.innerHTML = this.value + this.suffix;

  }


}//end text field
