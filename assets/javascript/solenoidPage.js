
//Iron Core Solenoid
var ics = null;

//var event = new CustomEvent('sliderUpdate', { detail: elem.dataset.time });
var sliderUpdateEvent = new Event('sliderUpdate');

//add event listener to window for sliders
window.addEventListener('sliderUpdate', sliderUpdated, false);

//add the init listener
document.addEventListener("DOMContentLoaded", init);

function init(event) {

  console.log("Initializing:" );
  console.log(event);

  ics = new IronCoreSolenoid();


}


function sliderUpdated(event) {

  //console.log("Slider Updated");

  if(ics !== null) {
    ics.update();
  }

}
