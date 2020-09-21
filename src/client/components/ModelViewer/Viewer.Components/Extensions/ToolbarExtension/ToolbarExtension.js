import './toolbarExtension.scss';
import $ from 'jquery';
const axios = require('axios');

const ExtensionId = 'ToolbarExtension';

export default class ToolbarExtension extends window.Autodesk.Viewing.Extension {
  constructor(viewer) {
    super();
    this.viewer = viewer;

    //sensorTypes
    this.sensorTypes = ['Potentiometers', 'Wind', 'Strain Rings', 'Strain Gauge', 'Accelerometers'];

    //events
    this.events = ['MRWA_1509260515', 'MRWA_1509260936', 'MRWA_1509281156', 'MRWA_1509291336', 'MRWA_1509301431']

    this.fetchReportData = this.fetchReportData.bind(this)
    this.fetchReportData()
  }

  fetchReportData() {
    //fetch report data
    this.reportData = null;
    axios.get('http://localhost:5000/report/nooriginalimage')
      .then(res => {
        this.reportData = res.data;
      });;
  }

  load() {
    if (this.viewer.toolbar) {
      // Toolbar is already available, create the UI
      this.createUI();
    } else {
      // Toolbar hasn't been created yet, wait until we get notification of its creation
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(window.av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }

    // console.log(`${ExtensionId} loaded`);

    return true;
  }

  unload() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    // console.log(`${ExtensionId} unloaded`);

    return true;
  }

  onToolbarCreated = () => {
    this.viewer.removeEventListener(window.av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
  };

  createUI = () => {
    const { viewer } = this;

    // Button 1
    const button1 = new window.Autodesk.Viewing.UI.Button('video-button');
    button1.onClick = () => {
      this.viewer.panel[0].setVisible(true);
    };
    button1.addClass('video-button');
    button1.setToolTip('Show Video');

    /*
    // Button 2
    const button2 = new window.Autodesk.Viewing.UI.Button('data-button');
    button2.onClick = () => {
      // viewer.setViewCube('back');
      this.viewer.panel[1].setVisible(true);
    };
    button2.addClass('sensor-button');
    button2.setToolTip('Show Data');*/

    // Button 3
    const button3 = new window.Autodesk.Viewing.UI.Button('pinPoint-button');
    button3.onClick = () => {
      console.log("button3.onClick");
      if (this.viewer.pinPointVisibility) {
        this.viewer.removeAllPinPoint();
        this.viewer.removeSelectOption();
      } else {
        this.viewer.createSelectOption(this.sensorTypes);
        this.viewer.createAllPinPoint($("#SensorSelect :selected").text());
      }
    };
    button3.addClass('pinPoint-button');
    button3.setToolTip('Toggle Sensor');

    // Button 4
    const button4 = new window.Autodesk.Viewing.UI.Button('report-button');
    button4.onClick = () => {
      this.viewer.panel[2].setVisible(true);
      this.viewer.panel[2].setData(this.reportData);
    };
    button4.addClass('report-button');
    button4.setToolTip('Show Report');

    // Button 5
    const button5 = new window.Autodesk.Viewing.UI.Button('event-button');
    button5.onClick = () => {
      this.viewer.panel[3].setVisible(true);
      this.viewer.panel[3].setData(this.events);
    };
    button5.addClass('event-button');
    button5.setToolTip('Show Event');

    // SubToolbar
    this.subToolbar = new window.Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar');
    this.subToolbar.addControl(button1);
    //this.subToolbar.addControl(button2);
    this.subToolbar.addControl(button3);
    this.subToolbar.addControl(button4);
    this.subToolbar.addControl(button5);

    viewer.toolbar.addControl(this.subToolbar);
  };
}

window.Autodesk.Viewing.theExtensionManager.registerExtension(
  ExtensionId, ToolbarExtension,
);
