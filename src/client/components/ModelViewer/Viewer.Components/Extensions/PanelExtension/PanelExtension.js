import ReactPanel from './ReactPanel';

export default class PanelExtension extends window.Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);

    this.panel = new ReactPanel(viewer, {
      id: 'cctv-panel',
      title: 'CCTV',
      width: '665px',
      height: '425px',
      content: 'video',
    });

    this.panel2 = new ReactPanel(viewer, {
      id: 'sensor-panel',
      title: 'Sensor',
      width: '530px',
      height: '400px',
      content: 'sensor',
    });

    this.panel3 = new ReactPanel(viewer, {
      id: 'report-panel',
      title: 'Reports',
      width: '800px',
      height: '800px',
      content: 'report',
    });

    this.panel4 = new ReactPanel(viewer, {
      id: 'event-panel',
      title: 'Events',
      width: '60%',
      height: '90%',
      content: 'event',
    });

    if (!this.viewer.panel) {
      this.viewer.panel = [];
    }

    this.viewer.panel.push(this.panel);
    this.viewer.panel.push(this.panel2);
    this.viewer.panel.push(this.panel3);
    this.viewer.panel.push(this.panel4);
  }

  static get ExtensionId() {
    return 'PanelExtension';
  }
}

window.Autodesk.Viewing.theExtensionManager.registerExtension(
  PanelExtension.ExtensionId,
  PanelExtension,
);
