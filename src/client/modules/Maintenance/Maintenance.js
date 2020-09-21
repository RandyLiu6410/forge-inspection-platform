import React , {Component}from 'react';
import styled from 'styled-components';
import ModelViewer from '../../components/ModelViewer/ModelViewer';
import Aux from '../../hoc/Auxiliary';
import GanttChart from '../../components/GanttChart/GanttChart';
import Store from '../../components/GanttChart/Store/Store';
import ModelSelector from '../../components/ModelSelector/ModelSelector';
import { Provider } from "react-redux";
import FlexLayout from "flexlayout-react";
import DockLayout from 'rc-dock';
import './Maintenance.css';
import '../../layout/dark.css';
const axios = require('axios');

const ModelSelectorWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 30%;
  left: 0;
  right: 85%;
`;

const ModelViewerWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 30%;
  left: 15%;
  right: 0;
`;

const GanttChartWrapper = styled.div`
position: absolute;
top: 70%;
bottom: 0;
left: 0;
right: 0;
`;

var json = {
	"global": {
    "tabEnableClose": false,
    "tabSetEnableDrop": false
  },
	"layout": {
		"type": "row",
		"weight": 100,
		"children": [{
			"type": "tabset",
			"weight": 30,
			"selected": 0,
			"children": [{
				"type": "tab",
				"name": "Projects",
				"component": "Selector",
				"config": {
					"id": "1"
				}
			}]
		}, {
			"type": "row",
			"weight": 170,
			"children": [{
				"type": "row",
				"weight": 9,
				"children": [{
					"type": "tabset",
					"weight": 50,
					"color": "#ffcccc",
					"selected": 0,
					"children": [{
						"type": "tab",
						"name": "Viewer",
						"component": "Viewer",
						"config": {}
					}]
				}]
			}, {
				"type": "row",
				"weight": 0.2,
				"children": [{
					"type": "tabset",
					"weight": 50,
					"selected": 0,
					"children": [{
						"type": "tab",
						"name": "Schedule",
						"component": "Schedule",
						"config": {}
					}]
				}]
			}]
		}]
	}
}

class Maintenance extends Component{
  state = {
    scheduleStatusData : [],
    autodeskForgeConfig : {
      clientId: 'vmKo1NMXEAQxLQg5rwf98DLZ95KT83R7',
      clientSecret: '1p5ZgoVSZv3NREmx',
      grantType: 'client_credentials',
      scope: 'data:read',
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDIwLTA0LTE1LTA3LTM5LTE4LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL3BvbHlVX0JJTV9Nb2RlbF8zNzVtXzA0MDdfdjIucnZ0',
    },
    model: FlexLayout.Model.fromJson(json)
  };

  factory(node) {
    var component = node.getComponent();
    switch(component){
      case "Selector":
        return (<ModelSelector key={"panel"} className="panel" changeModel={this.changeModel}/>);
        //有model list去選擇模型 所以changemodel是去更改this.state.autodeskForgeConfig.urn
      case "Viewer":
        return (<ModelViewer className="panel"
          autodeskForgeConfig={this.state.autodeskForgeConfig}
          //裡面會去抓舊的props跟新的props的autodeskForgeConfig.urn有沒有差別去啟動shouldComponentUpdate
          setViewer={this.setViewer}
          />);
      case "Schedule":
        return (<Provider className="panel" store={Store}>
          <GanttChart 
          className="GanttChart" 
          scheduleStatusData={this.state.scheduleStatusData}
          />
        </Provider>);
    }
  }

  componentWillMount() {
    axios.get('http://localhost:5000/schedule-railway')
      .then(res => {
        console.log(res.data);
        this.setState({scheduleStatusData:res.data});
      });;
  }

  changeModel = (urn) => {
    this.setState(prevState => {
      let autodeskForgeConfig = Object.assign({}, prevState.autodeskForgeConfig);
      autodeskForgeConfig.urn = urn;
      return{autodeskForgeConfig};
    })
  }

  setViewer = (viewer) => {
    this.setState({viewer:viewer});
  }

  render(){
    {/*
      <Aux>
        <ModelSelectorWrapper className="model-selector">
          <ModelSelector changeModel={this.changeModel}/>
        </ModelSelectorWrapper>
        <ModelViewerWrapper className="forge-model-viewer">
          <ModelViewer
          autodeskForgeConfig={this.state.autodeskForgeConfig}
          setViewer={this.setViewer}
          />
        </ModelViewerWrapper>
          <Provider store={Store}>
            <GanttChart 
            className="GanttChart" 
            scheduleStatusData={this.state.scheduleStatusData}
            viewer={this.state.viewer}
            />
          </Provider>
      </Aux>      
      <DockLayout defaultLayout={box} groups={groups}
        style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}/>
      */}
    return(<FlexLayout.Layout className="layout"
    model={this.state.model}
    factory={this.factory.bind(this)}/>)
  }
}

export default Maintenance;
