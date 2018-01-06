


class WindingSolver extends Component {

  constructor() {
    super();

    // this.baseLayerTurns = 1;
    this.totalTurns = 1;

    this.wireLengthMM = 1;

    this.lengthMM = 0;
    this.diameterMM = 0;

    this.wireEnds = [];

    this.canvas = null;

  }

  renderTo(parent) {

    this.canvas = document.createElement("canvas");

    //set canvas width
    this.canvas.width =  400;
    this.canvas.height = 600;

    parent.appendChild(this.canvas);

  }

  /**
   * Solve the Coil winding Prodcedure
   * @param  {number} coreLengthMM   Length of the Iron Core in milimeters
   * @param  {[type]} coreDiameterMM Diameter of the Iron Core in milimeters
   * @param  {object} wireSpec       Wire Specification Object
   * @param  {number} layers         NUmber of Layers
   * @return {undefined}             No Return
   */
  solve(coreLengthMM, coreDiameterMM, wireSpec, layers) {

    //reset circles collection
    this.wireEnds = [];
    //store for drawing
    this.lengthMM = coreLengthMM;
    this.diameterMM = coreDiameterMM;
    //wire diameter in milimeters
    let wireDia = wireSpec.getCoatedDiaMM();
    let wireRad = wireDia / 2;
    let bareDia = wireSpec.getBareDiaMM();
    let bareRad = bareDia / 2;


    //base layer number of turns
    let baseTurns = Math.floor(coreLengthMM / wireDia);
    // this.baseLayerTurns = baseTurns;

    //core radius
    let coreRad = coreDiameterMM / 2;
    //radius increment (after first layer) since wires pack at 60 degrees
    let rad60 = 60.0 * Math.PI / 180.0;
    let radInc = wireRad * Math.tan(rad60);//30/60 triangle

    let totalWireLength = 0;
    let totalTurns = 0;
    let nTurns = baseTurns;

    let radius = coreRad + wireRad;//initial
    // let xoffset = wireRad;
    //loop through layers
    for(let i = 0; i < layers; i++) {

      //current radius = core + wireRad + ( radius increment * layer)
      //first layer lays flat, additional layers pack in
      // let radius = 0;//coreRad + wireRad + (radInc * i);

      let weOffset = 0;//wire end offset
      //number of turns?
      if(i % 2 === 0) {
        nTurns = baseTurns; //even layer
        weOffset = wireRad;
      } else {
        nTurns = baseTurns - 1; //odd layer
        weOffset = wireRad + wireRad;
      }

      let turnLength = 2.0 * Math.PI * radius;  //circumference
      //length of all turns at current radius
      let curLength = nTurns * turnLength;
      //add to total length
      totalWireLength += curLength;
      //update total number of turns
      totalTurns += nTurns;

      for(let c = 0; c < nTurns; c++) {
        let y = weOffset + (c * wireDia);
        // let wep = new WireEnd(x, radius, bareRad, wireRad);
        // let wen = new WireEnd(x,-radius, bareRad, wireRad);//mirrored
        //
        let wep = new WireEnd(radius, y,  bareRad, wireRad);
        let wen = new WireEnd(-radius, y, bareRad, wireRad);//mirrored

        this.wireEnds.push(wep);
        this.wireEnds.push(wen);

      }

      radius += radInc;

    }//end for

    // debugger;

    //total wire length
    this.wireLengthMM = totalWireLength;
    //total number of turns
    this.totalTurns = totalTurns;


  }//end solve



  getWireLength() {
    return this.wireLengthMM / 25.4;
  }

  getWireLengthMM() {
    return this.wireLengthMM;
  }

  getWireLengthM() {
    return this.wireLengthMM * 0.001;
  }

  getTurns() {
    return this.totalTurns;
  }


  draw(scale) {


    if (this.canvas === null) {
        console.error("No Canvas object to get context from.");
        return;
    }

    let g = this.canvas.getContext('2d');

    let cw = g.canvas.width;
    let ch = g.canvas.height;
    let midx = cw / 2;

    //view scale to draw at
    let vs = scale;

    // let length = this.sliderLength.getValue();
    // let diameter = this.sliderCoreDia.getValue();
    let lengthMM = this.lengthMM;
    let diameterMM = this.diameterMM;

    g.clearRect(0,0,cw,ch);


    //push transform stack
    g.save();

    let ds = 96 / 25.4 * vs;
    g.translate(cw/2, 0);
    g.scale(ds,ds);


    g.fillStyle = "rgb(128,128,128)";
    g.lineWidth = 0;
    // g.beginPath();
    g.fillRect(-diameterMM / 2, 0,  diameterMM, lengthMM);



    let wel = this.wireEnds.length;
    //console.log("drawing: " + wel);
    for (let w =0; w < wel; w++) {
      let we = this.wireEnds[w];
      we.draw(g);
    }

    g.restore();

  }//end draw

}//end class


class WireEnd {

  constructor(x,y,br, cr) {
    this.x = x;
    this.y = y;
    this.br = br;
    this.cr = cr;
  }


  draw(g) {

    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(this.x , this.y , this.cr , 0, 2 * Math.PI, false);
    g.fill();
    g.closePath();

    g.fillStyle = '#c96333';
    g.beginPath();
    g.arc(this.x , this.y , this.br , 0, 2 * Math.PI, false);
    g.fill();
    g.closePath();


  }


}
