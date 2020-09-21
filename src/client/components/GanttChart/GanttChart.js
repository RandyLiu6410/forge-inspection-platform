import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {
  selecteItem,
  addTask,
  updateTask,
  deleteItem,
  addLink,
  connectDB,
  deselecteItem
} from "./Store/Actions";
import { connect } from "react-redux";
//import TimeLine from "react-gantt-timeline";
import TimeLine from './react-gantt-timeline/TimeLine';
import './GanttChart.css';
import { Button, Confirm } from 'semantic-ui-react';
const axios = require('axios');

class GanttChart extends Component{
    constructor(props){
        super(props);
        this.state = {
          isolate: false,
          openDialog: false,
        }
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.scheduleStatusData !== nextProps.scheduleStatusData)
      {
        this.props.dispatch(connectDB(nextProps.scheduleStatusData));
      }
    }

    onUpdateTask = (item, props) => {
      this.props.dispatch(updateTask(item, props));
      console.log(item);
      axios.post('http://localhost:5000/schedule-railway/update/' + item._id, item);
    };

    onUpdateSlider = (props) => {
      let dbIds_temp =[]
      this.props.scheduleStatusData.map((d) => {
        var startDate = new Date(d.start).toISOString();
        var endDate = new Date(d.end).toISOString();
        var sliderDate = new Date(props.date).toISOString();
        if(startDate < sliderDate 
              && endDate > sliderDate)
          dbIds_temp.push(d.dbId);
      })
      if(dbIds_temp.length > 0)
      {
        try{
          this.isolate(window.NOP_VIEWER, dbIds_temp);
          this.setState({isolate: true});
        }
        catch{}
      }
    };
  
    onSelectItem = item => {
      try{
        this.props.dispatch(selecteItem(item));
        console.log(item);
        if(item.dbId)
        {
          this.isolate(window.NOP_VIEWER, item.dbId);
          this.setState({isolate: true});
        }
      }
      catch{}
    };
  
    addTask = () => {
      this.props.dispatch(addTask());
    };
    onCreateLink = item => {
      this.props.dispatch(addLink(item));
    };
    delete = () => {
      if(this.props.selectedItem)
      {
        var r = window.confirm("Are you sure to delete this item?");
        if (r == true) {
          console.log("You pressed delete!");
          this.props.dispatch(deleteItem(this.props.selectedItem));
          axios.delete('http://localhost:5000/schedule-railway/' + this.props.selectedItem._id);
        } else {
          this.props.dispatch(deselecteItem());
          console.log("You pressed Cancel!");
        }
      }
    };
    addDbId = () => {
      let selection = this.getSelection(window.NOP_VIEWER);
      if(selection.length > 0)
      {
        console.log(this.props.selectedItem);
        this.props.selectedItem.dbId = selection;
      }
      axios.post('http://localhost:5000/schedule-railway/add/', this.props.selectedItem);
    }

    getAllDbIds = (viewer) => {
      var instanceTree = viewer.model.getInstanceTree();
    
      var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
    
      return allDbIdsStr.map(function(id) { return parseInt(id)});
    };
    isolate = (viewer, dbIds) => {
      viewer.impl.visibilityManager.isolate(-1, viewer.model);
      dbIds.map((id) => {
        viewer.impl.visibilityManager.show(id, viewer.model);
      })
    };
    showAllItem = () => {
      window.NOP_VIEWER.impl.visibilityManager.show(this.getAllDbIds(window.NOP_VIEWER), window.NOP_VIEWER.model);
      this.props.dispatch(deselecteItem());
    }
    getSelection = (viewer) => {
      var allDbIdsStr = Object.keys(viewer.model.selector.selectedObjectIds);
      return allDbIdsStr.map(function(id) { return parseInt(id)});
    }

    moveTest = () => {
      const viewer = window.NOP_VIEWER;
      let tree = viewer.model.getData().instanceTree;
      tree.enumNodeFragments(viewer.getSelection()[0], function (frag) {
        let fragProxy = viewer.impl.getFragmentProxy(viewer.model, frag);
        fragProxy.getAnimTransform();
        fragProxy.position.x += 1
        fragProxy.updateAnimTransform();
      });
      viewer.impl.sceneUpdated(true);
    }

    animation = () => {
      var t = setInterval(this.moveTest,10);
    }

    render() {
        return (
          <div className="app-container">
            <div className="nav-container">
              <div className="mode-container-title">Progress schedule</div>
              <div className="operation-button-container">
                <div className="mode-button" title="Create Task" onClick={this.addTask}>
                  <svg height={30} width={30} viewBox="0 0 20 20">
                    <path
                      fill="silver"
                      d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"
                    />
                  </svg>
                </div>
                <div className="mode-button" title="Delete Task" onClick={this.delete}>
                  <svg height={30} width={30} viewBox="0 0 20 20">
                    <path
                      fill="silver"
                      d="M14.776,10c0,0.239-0.195,0.434-0.435,0.434H5.658c-0.239,0-0.434-0.195-0.434-0.434s0.195-0.434,0.434-0.434h8.684C14.581,9.566,14.776,9.762,14.776,10 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.691-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.382,10c0-4.071-3.312-7.381-7.382-7.381C5.929,2.619,2.619,5.93,2.619,10c0,4.07,3.311,7.382,7.381,7.382C14.07,17.383,17.382,14.07,17.382,10"
                    />
                  </svg>
                </div>
                <div className="mode-button" title="Show All" onClick={this.showAllItem}>
                  <svg height={30} width={30} viewBox="0 0 20 20">
                    <path
                      fill="silver"
                      d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"
                    />
                  </svg>
                </div>
                <div className="mode-button" title="Add to Status" onClick={this.addDbId}>
                  <svg height={30} width={30} viewBox="0 0 20 20">
                    <path
                      fill="silver"
                      d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="time-line-container" id="time-line-container">
              <TimeLine
                data={this.props.data}
                selectedItem={this.props.selectedItem}
                links={this.props.links}
                onUpdateTask={this.onUpdateTask}
                onCreateLink={this.onCreateLink}
                onSelectItem={this.onSelectItem}
                onUpdateSlider={this.onUpdateSlider}
              />
            </div>
          </div>
        );
    }
}

const mapProps = state => {
  console.log(state);
  return {
    data: state.data,
    links: state.links,
    selectedItem: state.selectedItem
  };
};

export default connect(mapProps)(GanttChart);


/*
      var statuses = ["Foundation", "Underground", "Driveway", "1F Construction", "Roof"];
      var id = 1;
      var d1 = new Date();
      var d2 = new Date();
      d2.setDate(d2.getDate() + 10);

      window.NOP_VIEWER.model.getBulkProperties(this.getAllDbIds(window.NOP_VIEWER), {
        propFilter: ["建立階段"],
        ignoreHidden: true
        }, function(data) {
            statuses.map((s) => {
              var DbIds = []
              for (var key in data) {
                var item = data[key];
                if (item.properties[0].displayValue === s) {
                  DbIds.push(item.dbId);
                }
              }
              const obj = {
                id: id,
                name: s,
                start: d1,
                end: d2,
                dbId: DbIds
              }
              axios.post('http://localhost:5000/schedule-bungalow/add/', obj);
              id+=1;
            });
        }, function(error) {})*/