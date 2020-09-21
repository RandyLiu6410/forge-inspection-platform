import React from 'react';
import ReactDOM from 'react-dom';
import ReactPanelContent from './ReactPanelContent';
import './ReactPanel.scss';

export default class ReactPanel extends window.Autodesk.Viewing.UI.DockingPanel {
  constructor(viewer, options) {
    super(viewer.container, options.id, options.title, {
      addFooter: false,
      content: options.content,
      viewer,
    });

    this.container.classList.add('react-docking-panel');
    this.container.style.width = options.width;
    this.container.style.height = options.height;

    this.DOMContent = document.createElement('div');

    this.DOMContent.className = 'content';

    this.container.appendChild(this.DOMContent);

    //Sensor ElementId
    this.elementId = null;

    this.data = null;
  }

  initialize() {
    super.initialize();

    this.viewer = this.options.viewer;
    this.footer = this.createFooter();

    this.container.appendChild(this.footer);
  }

  setVisible(show) {
    super.setVisible(show);

    if (show) {
      this.reactNode = ReactDOM.render(
        <ReactPanelContent contentType={this.options.content} elementId={this.elementId} data={this.data}/>,
        this.DOMContent,
      );
    } else if (this.reactNode) {
      ReactDOM.unmountComponentAtNode(
        this.DOMContent,
      );
      this.reactNode = null;
    }
  }

  setElementId(id){
    this.elementId = id;
  }

  setData(data){
    this.data = data;
  }
}
