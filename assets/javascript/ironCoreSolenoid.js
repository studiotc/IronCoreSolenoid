


class IronCoreSolenoid {

  constructor() {

    this.PFS = 4 * Math.PI * Math.pow(10, -7); //1.2566370614359172953850573533118e-5

    //resistance of copper from: http://hyperphysics.phy-astr.gsu.edu/hbase/Tables/rstiv.html#c1
    this.CU_R = 1.724e-8; // ohm m  1.724 or 1.68?

    this.CU_TC = 0.0068; //temperature cooefficant of copper per degree C

    //constant for relative permeability of iron
    this.RP_FE = 200;  // http://info.ee.surrey.ac.uk/Workshop/advice/coils/mu/index.html#mur


    //wire database
    this.wireDB = new WireDB();

    //winding solver
    this.windingSolver = new WindingSolver();

    this.coreLength = 1;
    this.coreDiameter = 0.5;

    this.canvas = null;

    this.sliderVoltage = new Slider( "Voltage", " VDC", 0.1, 24, 0.1);
    this.sliderLength = new Slider( "Length", "\"", 0.5, 2.0, 0.0625);
    this.sliderCoreDia = new Slider( "Diameter", "\"", 0.125, 1.0, 0.0625);
    this.sliderLayers = new Slider( "Layers", "", 2, 24, 2);
    this.sliderGauge = new Slider( "Gauge", " AWG", 16, 32 , 2);

    this.sliderViewScale = new Slider( "View Scale", "X", 1, 5, 0.1);

    this.layout = new ICSLayout();

    this.inputContainer = new Container("Input", "inputArea");
    this.viewContainer = new Container("Solenoid", "solenoidArea");
    this.reportContainer = new Container("Report", "reportArea");

    //text fields
    this.textFieldWireLength = new TextField("Length", "\"", 2);
    this.textFieldWireResistance = new TextField("R", " ohm", 2);
    this.textFieldI = new TextField("I", " A", 2);
    this.textFieldP = new TextField("P", " W", 2);

    this.textFieldB = new TextField("B", " T", 5);
    this.textFieldH = new TextField("H", " at", 2);
    this.textFieldMMF = new TextField("MMF", "  At/m", 2);

    //pack all the controls
    this.pack();

    //update to calc intial state
    this.update();

  }//end constructor


/**
 * Pack the controls
 * @return {undefined} No Return
 */
  pack() {

    //add input controls
    this.inputContainer.addComponent(this.sliderVoltage);
    this.inputContainer.addComponent(this.sliderLength);
    this.inputContainer.addComponent(this.sliderCoreDia);
    this.inputContainer.addComponent(this.sliderLayers);
    this.inputContainer.addComponent(this.sliderGauge);
    this.inputContainer.addComponent(this.sliderViewScale);

    //push container to doc
    //this.inputContainer.renderTo(document.body);

    this.layout.addComponentLeft(this.inputContainer);

    //add the winding display
    this.viewContainer.addComponent(this.windingSolver);
    //push to doc
    //this.viewContainer.renderTo(document.body);

    this.layout.addComponentCenter(this.viewContainer);

    //add the report fields
    this.reportContainer.addComponent(this.textFieldWireLength);
    this.reportContainer.addComponent(this.textFieldWireResistance);
    this.reportContainer.addComponent(this.textFieldI);
    this.reportContainer.addComponent(this.textFieldP);
    this.reportContainer.addComponent(this.textFieldB);
    this.reportContainer.addComponent(this.textFieldH);
    this.reportContainer.addComponent(this.textFieldMMF);
    //push text fields to doc
    //this.reportContainer.renderTo(document.body);

    this.layout.addComponentRight(this.reportContainer);

    this.layout.renderTo(document.body);

  }

  /**
   * Attach controls to the DOM
   * @return {[type]} [description]
   */
  attachControlsXXX() {

    let slidersDiv = document.createElement("div");
    let displayDiv = document.createElement("div");
    let reportDiv = document.createElement("div");

    slidersDiv.id = "slidersArea";
    displayDiv.id = "displayArea";
    reportDiv.id = "reportArea";

    slidersDiv.classList.add('pane');
    displayDiv.classList.add('pane');
    reportDiv.classList.add('pane');

    document.body.appendChild(slidersDiv);
    document.body.appendChild(displayDiv);
    document.body.appendChild(reportDiv);

    //attach sliders to div
    this.sliderVoltage.attach(slidersDiv);
    this.sliderLength.attach(slidersDiv);
    this.sliderCoreDia.attach(slidersDiv);
    this.sliderLayers.attach(slidersDiv);
    this.sliderGauge.attach(slidersDiv);
    this.sliderViewScale.attach(slidersDiv);

    this.canvas = document.createElement("canvas");


    //set canvas width
    this.canvas.width =  400;
    this.canvas.height = 600;

    //attach to div
    displayDiv.appendChild(this.canvas);


    // this.textFieldWireLength.attach(reportDiv);
    // this.textFieldWireResistance.attach(reportDiv);
    // this.textFieldI.attach(reportDiv);
    // this.textFieldP.attach(reportDiv);
    //
    // this.textFieldB.attach(reportDiv);
    // this.textFieldH.attach(reportDiv);
    // this.textFieldMMF.attach(reportDiv);


  }//end attach controls


  /**
   * Update the solution
   * @return {[type]} [description]
   */
  update() {

    let voltage = this.sliderVoltage.getValue();
    let length = this.sliderLength.getValue();
    let diameter = this.sliderCoreDia.getValue();
    let layers = this.sliderLayers.getValue();
    let gauge = this.sliderGauge.getValue();

    let lengthMM = length * 25.4;
    let lengthM = length * 0.0254;
    let diameterMM = diameter * 25.4;
    let wire = this.wireDB.getWire(gauge);

    //console.log("wire db:");
    //console.log(this.wireDB);
    // debugger;
    //winding solver
    this.windingSolver.solve(lengthMM, diameterMM, wire, layers);

    let wl = this.windingSolver.getWireLength();
    wl = wl.toFixed(2);

    this.textFieldWireLength.setValue(wl);

    let coilTurns = this.windingSolver.getTurns();
    //coil density in turns/meters
    let coilTurnDensityM = coilTurns / this.windingSolver.getWireLengthM();

    //calc resistance - https://www.engineeringtoolbox.com/resistance-resisitivity-d_1382.html
    let wireResistance = this.CU_R * this.windingSolver.getWireLengthM() /  wire.getSectionAreaM();
    this.textFieldWireResistance.setValue(wireResistance);

    //current I (amps)
    let currentI = voltage / wireResistance;
    this.textFieldI.setValue(currentI);

    //power W (watts)
    let circuitPower = voltage * currentI;
    this.textFieldP.setValue(circuitPower);

    //magno momentive force???....
    let coilMMF = currentI * coilTurns;

    let p = this.RP_FE * this.PFS;
    //magnetic field (results in Tesla)
    let fieldB = p  * coilTurnDensityM * currentI;
    let fieldH = currentI * coilTurns / lengthM;

    this.textFieldB.setValue(fieldB);
    this.textFieldH.setValue(fieldH);
    this.textFieldMMF.setValue(coilMMF);

    let vs = this.sliderViewScale.getValue();
    this.windingSolver.draw(vs);

    //draw the coil
  //  this.draw();

  }

  /**
   * Draw the cross section
   * @return {[type]} [description]
   */
  drawXXX() {

    if (this.canvas === null) {
        console.error("No Canvas object to get context from.");
        return;
    }

    let vs = this.sliderViewScale.getValue();

    let g = this.canvas.getContext('2d');

    let cw = g.canvas.width;
    let ch = g.canvas.height;
    let midx = cw / 2;

    let length = this.sliderLength.getValue();
    let diameter = this.sliderCoreDia.getValue();
    let lengthMM = length * 25.4;
    let diameterMM = diameter * 25.4;

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
     // g.fill();
     // g.closePath();

    // g.fillStyle = 'red';
    // g.beginPath();
    // g.arc(0,0, 0.001 , 0, 2 * Math.PI, false);
    // g.fill();
    // g.closePath();

   this.windingSolver.draw(g);




     g.restore();

  }//end draw



}//end class
