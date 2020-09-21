import $ from 'jquery';
import Snap from 'snapsvg-cjs';
const axios = require('axios');

const ExtensionId = 'MarkupExtension';

export default class MarkupExtension extends window.Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(options);
    this.viewer = viewer;
    this.keyPress = null;
    this.currentSelect = 0;
    
    this.sensorData = null;
    axios.get('http://localhost:5000/sensordata-mainroad/')
      .then(res => {
        this.sensorData = res.data;
      });;
      
    this.cctvData = [
      {
        Position: [-140.80, 15.97, 26.46],//{ x: -140.80, y: 15.97, z: 26.46 },
        dbId: 4689,
      },
    ];
  }

  onSelectionChange = (event) => {
    const dbIds = event.dbIdArray;
    if (dbIds.length > 0) {
      this.currentSelect = dbIds;
      //console.log('Now Selected: ', dbIds);
    }
  }

  load() {
    this.init();
    this.viewer.addEventListener(
      window.Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      this.onSelectionChange,
    );

    return true;
  }

  // unload() {
  //   return true;
  // }

  init() {
    $(this.viewer.container).bind('click', this.onMouseClick);

    $(document).bind('keypress', (event) => {
      if (String.fromCharCode(event.which) === 's' || String.fromCharCode(event.which) === 'c' || String.fromCharCode(event.which) === 'd') {
        this.keyPress = String.fromCharCode(event.which);
      }
    });

    $(document).bind('keyup', () => {
      this.keyPress = null;
    });

    // delegate the event of CAMERA_CHANGE_EVENT
    this.viewer.addEventListener(window.Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
      // find out all pushpin markups
      const $eles = $("div[id^='mymk']");
      const DOMeles = $eles.get();

      DOMeles.map((DOMEle) => {
        // get each DOM element
        const divEle = $(`#${DOMEle.id}`);
        // get out the 3D coordination
        const val = divEle.data('3DData');
        const pushpinModelPt = JSON.parse(val);
        // get the updated screen point
        const screenpoint = this.viewer.worldToClient(new window.THREE.Vector3(
          pushpinModelPt.x,
          pushpinModelPt.y,
          pushpinModelPt.z,
        ));
        // update the SVG position.
        divEle.css({
          left: screenpoint.x - pushpinModelPt.radius,
          top: screenpoint.y - pushpinModelPt.radius,
        });

        return true;
      });
    });

    this.viewer.createAllPinPoint = this.createAllPinPoint;
    this.viewer.removeAllPinPoint = this.removeAllPinPoint;
    this.viewer.createSelectOption = this.createSelectOption;
    this.viewer.removeSelectOption = this.removeSelectOption;
  }

  onMouseClick = (event) => {
    if (!(this.keyPress === 's' || this.keyPress === 'c') || !this.viewer.pinPointVisibility) {
      return;
    }

    const screenPoint = {
      x: event.clientX,
      y: event.clientY,
    };
    console.log(screenPoint)

    // get the selected 3D position of the object

    // viewer canvas might have offset from the webpage.

    const viewerPosition = this.viewer.container.getBoundingClientRect();

    const hitTest = this.viewer.impl.hitTest(
      screenPoint.x - viewerPosition.x, screenPoint.y - viewerPosition.y, true,
    );

    // var hitTest = this.viewer.impl.hitTest(screenPoint.x,screenPoint.y,true);

    if (hitTest) {
      let sameElement = false;

      if (this.keyPress === 's') {
        this.sensorData.map((sensor) => {
          if (sensor.bindElementId === this.currentSelect[0]) {
            sameElement = true;
          }
          return false;
        });
      } else if (this.keyPress === 'c') {
        this.cctvData.map((cctv) => {
          if (cctv.bindElementId === this.currentSelect[0]) {
            sameElement = true;
          }
          return false;
        });
      }

      if (!sameElement) {
        const pinPoint = {
          position: {
            x: hitTest.intersectPoint.x,
            y: hitTest.intersectPoint.y,
            z: hitTest.intersectPoint.z,
          },
          bindElementId: this.currentSelect[0],
        };

        if (this.keyPress === 's') {
          this.sensorData.push(pinPoint);
          this.drawPushpin(pinPoint, 'sensor');
        } else {
          this.cctvData.push(pinPoint);
          this.drawPushpin(pinPoint, 'cctv');
        }
      }
    }
  }

  drawPushpin(pushpinModelPt, type) {
    const pushpinPt = pushpinModelPt;

    // convert 3D position to 2D screen coordination
    const screenpoint = this.viewer.worldToClient(
      new window.THREE.Vector3(
        parseFloat(pushpinPt.Position[0]),
        parseFloat(pushpinPt.Position[1]),
        parseFloat(pushpinPt.Position[2]),
      ),
    );

    // build the div container
    const id = pushpinPt.dbId;
    const htmlMarker = `<div id="mymk${id}-${type}"></div>`;
    const parent = this.viewer.container;

    $(parent).append(htmlMarker);
    $(`#mymk${id}-${type}`).css({
      'pointer-events': 'auto',
      position: 'absolute',
      overflow: 'visible',
      cursor: 'pointer',
      display: 'block',
    });

    const divContainer = $(`#mymk${id}-${type}`);

    divContainer.bind('click', () => {
      if (type === 'sensor') {
        if (this.keyPress === 'd') {
          this.removeOnePinPoint(id, type);
          return;
        }
        this.viewer.panel[1].setElementId(id);
        this.viewer.panel[1].setData(pushpinPt);
        this.viewer.panel[1].setVisible(true);
        // this.viewer.fitToView([id]);
      } else {
        if (this.keyPress === 'd') {
          this.removeOnePinPoint(id, type);
          return;
        }
        this.viewer.panel[0].setVisible(true);
        // this.viewer.fitToView([id]);
      }
    });

    const rad = 12;

    if (type === 'cctv') {
      divContainer.append(`
      <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -65 512 512" width="30px" class="">
        <g>
          <path d="m428.242188 34.117188h-58.921876v-23.109376c0-6.078124 4.929688-11.007812 11.007813-11.007812h36.910156c6.078125 0 11.003907 4.929688 11.003907 11.007812zm0 0" fill="#618baa" data-original="#618BAA" class=""/>
          <path d="m151.441406 23.664062v38.519532h-102.949218v-38.519532c0-6.074218 4.933593-11.007812 11.007812-11.007812h80.9375c6.074219 0 11.003906 4.933594 11.003906 11.007812zm0 0" fill="#e3f4ff" data-original="#E3F4FF" class=""/>
          <path d="m48.492188 37.234375h102.949218v24.949219h-102.949218zm0 0" fill="#bddff4" data-original="#BDDFF4"/>
          <path d="m450.257812 62.183594h-102.949218v-23.113282c0-6.078124 4.929687-11.003906 11.007812-11.003906h80.933594c6.078125 0 11.007812 4.925782 11.007812 11.003906zm0 0" fill="#38627c" data-original="#38627C" class=""/>
          <path d="m221.882812 62.183594h-36.910156v-27.515625c0-6.078125 4.925782-11.003907 11.003906-11.003907h14.898438c6.078125 0 11.007812 4.925782 11.007812 11.003907zm0 0" fill="#fc3e81" data-original="#FC3E81" class=""/>
          <path d="m512 72.453125v274.425781c0 12.148438-9.851562 22.011719-22.011719 22.011719h-467.976562c-12.160157 0-22.011719-9.863281-22.011719-22.011719v-274.425781c0-12.152344 9.851562-22.011719 22.011719-22.011719h467.976562c12.160157 0 22.011719 9.859375 22.011719 22.011719zm0 0" fill="#9cc6db" data-original="#9CC6DB" class=""/>
          <path d="m408.203125 243.960938c0 51.660156-25.875 97.402343-65.355469 124.929687h-173.695312c-39.480469-27.527344-65.355469-73.269531-65.355469-124.929687 0-83.921876 68.28125-152.203126 152.203125-152.203126s152.203125 68.28125 152.203125 152.203126zm0 0" fill="#84a1c0" data-original="#84A1C0" class=""/>
          <path d="m463.25 118.894531h-51.300781c-5.691407 0-10.300781-4.613281-10.300781-10.300781v-15.195312c0-5.691407 4.609374-10.304688 10.300781-10.304688h51.300781c5.691406 0 10.304688 4.613281 10.304688 10.304688v15.195312c-.003907 5.6875-4.613282 10.300781-10.304688 10.300781zm0 0" fill="#fc3e81" data-original="#FC3E81" class=""/>
          <path d="m0 118.898438h512v217.335937h-512zm0 0" fill="#618baa" data-original="#618BAA" class=""/><path d="m408.203125 243.960938c0 34.65625-11.644531 66.652343-31.234375 92.273437h-241.9375c-19.589844-25.621094-31.234375-57.617187-31.234375-92.273437 0-51.75 25.964844-97.546876 65.542969-125.0625h173.320312c39.578125 27.515624 65.542969 73.3125 65.542969 125.0625zm0 0" fill="#4e7693" data-original="#4E7693" class=""/>
          <path d="m420.269531 264.085938h-32.199219v-45.144532h32.199219c7.148438 0 12.945313 5.796875 12.945313 12.945313v19.253906c0 7.148437-5.796875 12.945313-12.945313 12.945313zm0 0" fill="#38627c" data-original="#38627C" class=""/><path d="m394.992188 243.960938c0 76.761718-62.226563 138.992187-138.992188 138.992187s-138.992188-62.230469-138.992188-138.992187c0-76.765626 62.226563-138.996094 138.992188-138.996094s138.992188 62.230468 138.992188 138.996094zm0 0" fill="#e3f4ff" data-original="#E3F4FF" class=""/>
          <path d="m365.078125 243.960938c0 60.242187-48.835937 109.078124-109.078125 109.078124s-109.078125-48.835937-109.078125-109.078124c0-60.246094 48.835937-109.082032 109.078125-109.082032s109.078125 48.835938 109.078125 109.082032zm0 0" fill="#bddff4" data-original="#BDDFF4"/><path d="m352.230469 243.960938c0 53.144531-43.085938 96.226562-96.230469 96.226562s-96.230469-43.082031-96.230469-96.226562c0-53.148438 43.085938-96.230469 96.230469-96.230469s96.230469 43.082031 96.230469 96.230469zm0 0" fill="#38627c" data-original="#38627C" class=""/>
          <g fill="#3fefef">
              <path d="m320.878906 243.960938c0 35.828124-29.046875 64.875-64.878906 64.875s-64.878906-29.046876-64.878906-64.875c0-35.832032 29.046875-64.878907 64.878906-64.878907s64.878906 29.046875 64.878906 64.878907zm0 0" data-original="#000000" class="active-path"/><path d="m99.96875 118.894531c0 11.949219-9.6875 21.632813-21.632812 21.632813-11.949219 0-21.636719-9.683594-21.636719-21.632813s9.6875-21.632812 21.636719-21.632812c11.945312 0 21.632812 9.683593 21.632812 21.632812zm0 0" data-original="#000000" class="active-path"/>
          </g>
        </g> 
      </svg>`);
    } else {
      // build the svg element and draw a circle
      divContainer.append(`<svg id="mysvg${id}"></svg>`);
      const snap = Snap($(`#mysvg${id}`)[0]);
      const circle = snap.paper.circle(14, 14, rad);

      circle.attr({
        fill: type === 'sensor' ? '#FF8888' : '#FFFE58',
        fillOpacity: 0.6,
        stroke: type === 'sensor' ? '#FF0000' : '#FFC801',
        strokeWidth: 3,
      });

      // set the position of the SVG
      // adjust to make the circle center is the position of the click point
      const svgContainer = $(`#mysvg${id}`);
      svgContainer.css({
        width: rad * 2 + 7,
        height: rad * 2 + 7,
      });
    }

    divContainer.css({
      left: screenpoint.x - rad,
      top: screenpoint.y - rad,
      width: rad * 2 + 7,
      height: rad * 2 + 7,
    });

    // store 3D point data to the DOM
    const div = $(`#mymk${id}-${type}`);
    // add radius info with the 3D data
    const storeData = JSON.stringify({
      x: parseFloat(pushpinPt.Position[0]),
      y: parseFloat(pushpinPt.Position[1]),
      z: parseFloat(pushpinPt.Position[2]),
      radius: rad
    });
    div.data('3DData', storeData);
  }

  createAllPinPoint = (currType) => {
    this.sensorData.map((sensor) => {
      var corrtype = null;
      switch(sensor.SensorType){
        case "POT":
          corrtype = "Potentiometers";
          break;
        case "WS":
          corrtype = "Wind";
          break;
        case "WD":
          corrtype = "Wind";
          break;
        case "SR":
          corrtype = "Strain Rings";
          break;
        case "SG":
          corrtype = "Strain Gauge";
          break;
        case "ACC":
          corrtype = "Accelerometers";
          break;
      }

      if(corrtype === currType)
        this.drawPushpin(sensor, 'sensor');
      return true;
    });
    this.cctvData.map((cctv) => {
      this.drawPushpin(cctv, 'cctv');
      return true;
    });
    this.viewer.pinPointVisibility = true;
  }

  removeAllPinPoint = () => {
    this.sensorData.map((sensor) => {
      $(`#mymk${sensor.dbId}-sensor`).remove();
      return true;
    });
    this.cctvData.map((cctv) => {
      $(`#mymk${cctv.dbId}-cctv`).remove();
      return true;
    });
    this.viewer.pinPointVisibility = false;
  }

  removeOnePinPoint = (id, type) => {
    $(`#mymk${id}-${type}`).remove();
    if (type === 'sensor') {
      this.sensorData = this.sensorData.filter(item => item.bindElementId !== id);
    } else if (type === 'cctv') {
      this.cctvData = this.cctvData.filter(item => item.bindElementId !== id);
    }
  }

  createSelectOption = (sensorTypes) => {
    const htmlSelect = `<select id="SensorSelect"></select>`;
    const parent = this.viewer.container;

    $(parent).append(htmlSelect);
    $(`#SensorSelect`).append(sensorTypes.map((type) => {
      return `<option id=${type}>${type}</option>`;
    }));
    $(`#SensorSelect`).change(this.selectOptionChangeHandler);
  }

  selectOptionChangeHandler = () => {
    this.removeAllPinPoint();
    this.createAllPinPoint($("#SensorSelect :selected").text());
  }

  removeSelectOption = () => {
    $(`#SensorSelect`).remove();
  }
}

window.Autodesk.Viewing.theExtensionManager.registerExtension(
  ExtensionId, MarkupExtension,
);
