
/**
 * WireSPec class
 *
 * This holds the dimensions of wires in inches
 * http://mwswire.com/wp-content/uploads/2016/10/Copper-Magnet-Wire-Data.pdf
 *
 * gauge is the AWG size
 * bareDia is the diameter of coppercore
 * coatedDia is the full outer diameter of the wire (core and coating)
 *
 *
 */

class WireSpec {

  constructor(gauge, bareDia, coatedDia) {

    this.gauge = gauge;
    this.bareDia = bareDia;
    this.coatedDia = coatedDia;

  }

  getGauge() {
    return this.gauge;
  }

  getBareDia() {
    return this.bareDia;
  }

  getBareDiaMM() {
    return this.bareDia * 25.4;
  }

  getCoatedDia() {
    return this.coatedDia;
  }

  getCoatedDiaMM() {
    return this.coatedDia * 25.4;
  }


  getSectionAreaM(){

    //base geometric information for the wire

    let wireRadM = (this.bareDia / 2) * 0.0254;//wire radius in meters
    let wireAreaM = Math.PI * Math.pow(wireRadM, 2);//area of cross section in meters^2
    return wireAreaM;
  }


}

/**
 * Database for all the supported wire sizes
 */
class WireDB {

  constructor() {

    this.wires = new Map();


    this.addWire( 32, 0.0081, 0.0088);
    this.addWire( 30, 0.0101, 0.0106);
    this.addWire( 28, 0.0126, 0.0137);
    this.addWire( 26, 0.0159, 0.0170);
    this.addWire( 24, 0.0201, 0.0213);
    this.addWire( 22, 0.0253, 0.0266);
    this.addWire( 20, 0.0320, 0.0334);
    this.addWire( 18, 0.0403, 0.0418);
    this.addWire( 16, 0.0508, 0.0524);

  }

  gaugeName(gauge) {
    return "gauge" + gauge.toString();
  }

  /**
   * Add a Wire Spec to the database
   * @param {[type]} gauge     [description]
   * @param {[type]} bareDia   [description]
   * @param {[type]} coatedDia [description]
   */
  addWire(gauge, bareDia, coatedDia) {

    let gn = this.gaugeName(gauge);
    let wo = new WireSpec(gauge,bareDia,coatedDia);

    this.wires.set(gn, wo);


  }

  /**
   * Get a Wire Object Data
   * @param  {Number} gauge Wire Gauage information to retrieve
   * @return {[type]}       [description]
   */
  getWire(gauge) {

    let gn = this.gaugeName(gauge);
    let wire = this.wires.get(gn);
    return wire;

  }



}
