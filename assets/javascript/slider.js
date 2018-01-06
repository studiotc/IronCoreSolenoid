



class Slider extends Component {

  constructor( label, suffix,  min, max, step) {
    super();
    this.width = 200;
    this.height = 40;
    this.margin = 4;

    this.sliderPosition = this.width / 2;

    this.label = label;
    this.suffix = suffix;
    this.min = min;
    this.max = max;
    this.range = max - min;
    this.step = step;
    this.stepPrec = 0;

    //sort out the display precision
    let stepstr = step.toString();
    let si = stepstr.indexOf(".");

    if(si !== -1) {
      this.stepPrec = stepstr.length - si - 1;
    }

    this.nSteps = Math.floor((max - min) / step);

    //default is minimum
    this.value = min;

    this.id = generateUniqueID("slider", 8);

    this.canvas = null;


    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseDown = false;


  //pre-calc the ticks
  //this.calcTicks();

    //do intial calc
    this.calcValue();



  }//end constructor


  renderTo(parent) {

    //grab a reference for handler functions
      var sliderObj = this;

    //  let parent = document.getElementById(id);

      let sliderCanvas = document.createElement("canvas");
      this.canvas = sliderCanvas;

      //set canvas width
      sliderCanvas.width =  this.width;
      sliderCanvas.height =  this.height;

      sliderCanvas.id = this.id;
      //sliderCanvas.style.background = "#000";

      sliderCanvas.addEventListener("mousemove",
                                    function(event) {
                                      sliderObj.onMouseMove(event);
                                    },
                                    false);

      sliderCanvas.addEventListener("mouseup",
                                    function(event) {
                                      sliderObj.onMouseUp(event);
                                    },
                                    false);
      sliderCanvas.addEventListener("mousedown",
                                    function(event) {
                                      sliderObj.onMouseDown(event);
                                    },
                                    false);

      parent.appendChild(sliderCanvas);

      parent.appendChild(document.createElement("br"));

      //draw intial view
      sliderObj.draw();

  }

  onMouseUp(event) {
    //console.log("mouse up.");
    if(event.which === 1) {
      this.mouseDown = false;
      this.draw();
    }

  }


  onMouseDown(event) {
    //console.log("mouse down.");
    if(event.which === 1) {
      this.mouseDown = true;

      let rect = this.canvas.getBoundingClientRect();

      let cx =  event.clientX - rect.left;
      let cy =  event.clientY - rect.top;

      this.sliderPosition = cx;
      this.draw();

      this.calcValue();

    }

  }


  onMouseMove(event) {

    let rect = this.canvas.getBoundingClientRect();

    let cx =  event.clientX - rect.left;
    let cy =  event.clientY - rect.top;

    let minx = this.margin;
    let maxx = this.width - this.margin;

    if(this.mouseDown) {

          let dx = cx - this.lastMouseX;
          //console.log("mouse: " + cx + ", " + cy + ", delta x : " + dx);
          this.sliderPosition += dx;

          if(this.sliderPosition < minx ) {
            this.sliderPosition = minx;
          }
          if(this.sliderPosition > maxx ) {
            this.sliderPosition = maxx;
          }

          this.calcValue();
    }//end if


    this.draw();

    //store mouse coords
    this.lastMouseX = cx;
    this.lastMouseY = cy;

  }



  calcValue() {


    //value range
    let vrng = this.max - this.min;
    //value increment number
    let vinc = this.range / this.step;
    //vinc += 1;
    //width increment value
    let winc = this.width / vinc ;


    console.log("total incs: " + vinc + ", width inc: " + winc);

    //pixel range
    let prng = this.width - this.margin - this.margin;
    // let pval = this.sliderPosition / prng;

    //unit pixel spacing for ticks
    let punit = prng / vinc;
    let pincs = (this.sliderPosition - this.margin) / punit;
    let tmpVal = this.min + ( pincs * this.step);


    let remx = tmpVal % this.step;
    tmpVal -= remx;
    if(remx >= this.step / 2) {
      tmpVal += this.step;
    }

    console.log("slider unit: " + punit + ", incs: " + pincs + ", value: " + tmpVal);

    tmpVal = tmpVal.toFixed(this.stepPrec);
    let valIsNew = tmpVal !== this.value ? true : false;

    //set the value
    this.value = tmpVal;

    //only dispatch event if value has changed
    if (valIsNew) {
      //dispatch event
      try {
        window.dispatchEvent(sliderUpdateEvent);
      } catch (e) {
        console.log("Error raising Slider Update Event");
      }

    }//end if

  }//end set value


  /**
   * Calculate the value
   * @return {[type]} [description]
   */
  calcValueOld() {


    //value range
    let vrng = this.max - this.min;
    //value increment number
    let vinc = vrng / this.step;
    //width increment value
    let winc = this.width / vinc ;

    vinc += 1;
    console.log("total incs: " + vinc);

    //pixel range
    let prng = this.width - this.margin - this.margin;
    // let pval = this.sliderPosition / prng;

    //unit pixel spacing for ticks
    let punit = prng / vinc;
    let pincs = (this.sliderPosition - this.margin) / punit;
    let tmpVal = this.min + ( pincs * this.step);
    console.log("slider unit: " + punit + ", incs: " + pincs + ", value: " + tmpVal);

    let nTicks = vinc;
    let newValue = this.min + (nTicks * this.step);
    console.log("Ticks = " + nTicks + ", value = " + newValue);

    //number of steps based on slider position
    let cn = this.sliderPosition / winc; //Math.floor(this.sliderPosition / winc);
    //get final value
    let val = this.min + ( cn * this.step );
    //half step
    let hs = this.step / 2;
    //remainder from step
    let rem = val % this.step;

    //remove remainder
    val -= rem;

    //round up?
    if(rem > hs) {
      val += this.step;
    }


    //set the value
    this.value = val.toFixed(this.stepPrec); //.toFixed(4);

    //dispatch event
    try {
      window.dispatchEvent(sliderUpdateEvent);
    } catch (e) {
      console.log("error raising event");
    }

    //console.log("slider " + this.label + " : " + this.value);

  }//end set value

  getValue() {
    return this.value;
  }

  // displayId() {
  //   console.log("id: " + this.id);
  // }


  draw() {

    if (this.canvas === null) {
        console.error("No Canvas object to get context from.");
        return;
    }


    let g = this.canvas.getContext('2d');
    let cw = g.canvas.width;
    let ch = g.canvas.height;

    //clear canvas
    g.clearRect(0,0,cw,ch);
    //push transform stack
     g.save();


    let sx =  this.sliderPosition;

    let sp = sx / cw;


    // var grd = g.createLinearGradient(0,0,cw,0);
    // grd.addColorStop(0,"rgb(0,0,0)");
    // grd.addColorStop(sp,"rgb(51,51,153)"); //grd.addColorStop(sp,"rgb(140,140,140)");
    // grd.addColorStop(1,"rgb(0,0,0)");
    //
    //
    // g.fillStyle = grd;

    // g.fillStyle = "rgb(80,80,80)";
    // g.fillRect(0,0,cw,ch);

    g.fillStyle = "rgba(80,80,80,0.65)";
    // g.fillStyle = "rgba(0,0,80,0.6)";
    let pad = this.margin;
    let pad2 = pad * 2;
    g.fillRect(pad,pad,cw - pad2, ch - pad2);

    // this.drawTicks(g);
    // this.drawPane(g,pad,pad,cw - pad2, ch - pad2);

     // let rad = 4;
     // let cx = cw / 2;
     // let cy = ch / 2;


     // this.drawValueMarker(g,sx,0,sx,ch, "black");
    //  g.strokeStyle = "rgb(200,200,200)";
    //  g.lineWidth = 0.75;
    // g.beginPath();
    // g.rect(sx -1.5 , 5, 5, ch - 10);
    // g.stroke();
    // g.closePath();

    this.drawGrip(g,ch);

     g.font = "16px  sans-serif";

     g.fillStyle = "rgba(255,255,255,1)";
     let text = this.label + " : " + this.value + this.suffix;
     g.fillText(text, 12,26);

     //console.log("label = " + this.label);
    //pop transform stack
    g.restore();

  }


  drawPane(g, x, y, w, h) {

    const edgeDepth = 2;

    g.fillStyle = "rgba(180,180,180,0.7)";
    g.strokeStyle = "rgb(120,120,120)";
    g.lineWidth = 0.1;

    var grd = g.createLinearGradient(x,y,x+w,y+h);
    grd.addColorStop(0,"rgba(0,0,120,0.5)");
    grd.addColorStop(1,"rgba(80,80,80,0.5)");

    //drop shadow
    let sd = 6;
    g.fillStyle = "rgba(40,40,40,0.52)";
    g.beginPath();
    g.rect(x + sd,y + sd,w + edgeDepth ,h + edgeDepth);
    g.fill();
    g.closePath();



    //bottom rectangle
    g.beginPath();
    g.rect(x + edgeDepth,y + edgeDepth,w,h);
    g.stroke();
    g.closePath();



    //base color
    g.fillStyle = grd;
    g.fillRect(x,y,w,h);


    g.strokeStyle = "rgb(0,0,0)";
    //edge outline
    g.beginPath();
    g.moveTo(x, y + h);
    //move down diagonal
    g.lineTo(x + edgeDepth, y + edgeDepth + h);
    //move along bottom edge
    g.lineTo(x + edgeDepth + w, y + edgeDepth + h);
    //back up
    g.lineTo(x + edgeDepth + w, y + edgeDepth);
    //diagonal up
    g.lineTo(x + w, y );
    //back to lower corner
    g.lineTo(x +  w, y + h);
    //close
    g.lineTo(x, y + h);
    // g.stroke();
    g.fill();
    g.closePath();


    //overlay outline
    g.beginPath();
    g.rect(x,y,w,h);
    g.stroke();
    g.closePath();


  }





  drawGrip(g,  h) {

    let x = this.sliderPosition;
    let tw = 4;
    let th = tw * 2;
    let x1 = x - tw;
    let x2 = x + tw;

    g.lineWidth = 1.5;
    g.strokeStyle = "rgb(200,200,200)";;
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.moveTo(x1, 0);
    g.lineTo(x, th);
    g.lineTo(x2, 0);
    g.lineTo(x, 0);
    // g.stroke();
    g.fill();
    g.closePath();

    g.beginPath();
    g.moveTo(x1, h);
    g.lineTo(x, h- th);
    g.lineTo(x2, h);
    g.lineTo(x, h);
    // g.stroke();
    g.fill();
    g.closePath();



  }








}//end class
