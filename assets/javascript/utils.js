




  /**
   * Degrees to Radians conversion
   * @param {type} deg angle in degrees
   * @returns {Number} angle in radians
   */
  function degToRad(deg) {
      return deg * Math.PI / 180.0;
  }

  /**
   * Radians to Degrees conversion
   * @param {type} rad angle in radians
   * @returns {Number} angle in degrees
   */
  function radToDeg(rad) {
      return rad *  180.0 / Math.PI;
  }


   function generateUniqueID(prefix, length) {

      const alpha = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";
      let al = alpha.length;
      let idLen = length;
      let id = "";

      for(let i = 0; i < idLen; i++) {

        let index = Math.floor(Math.random() * al);
        id += alpha.charAt(index);

      }

      return prefix.toString() + id;

    }
