import React, {Component} from 'react';
import {
    LineChart,
    CartesianGrid,
    XAxis, YAxis,
    Tooltip,
    Legend,
    Line,
  } from 'recharts';

class RealTimeChart extends Component{
    constructor(){
        super();

        this.animationElements = [6141]
        for(var i = 6197; i < 6214; i ++)
        {
          this.animationElements.push(i)
        }
        this.animationElementsNames = ["SMT_train_0407_2018_v2.skp (2)", "懸浮架"]

        // this.getAnimationElements()

        this.state = {
            index: 1,
            data: [{Frequency: 0, Value: 0}]
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        // this.backToStart();
        clearInterval(this.timerID);
    }

    tick = () => {
        const newIndex = this.state.index + 1;
        var tempdata = []
        this.props.data.slice(0, newIndex).map((data, index) => {
          tempdata.push({
            Value: data.Value,
            Frequency: 153511 + index
          })
        })
        this.setState({
            index: newIndex,
            data: tempdata
        })
        this.move();
    }

    move = () => {
        const viewer = window.NOP_VIEWER;
        let tree = viewer.model.getData().instanceTree;
        this.animationElements.forEach(elementId => {
          tree.enumNodeFragments(elementId, function (frag) {
            let fragProxy = viewer.impl.getFragmentProxy(viewer.model, frag);
            fragProxy.getAnimTransform();
            fragProxy.position.y += 1
            fragProxy.updateAnimTransform();
          });
        })
        viewer.impl.sceneUpdated(true);
    }

    backToStart = () => {
        const viewer = window.NOP_VIEWER;
        let tree = viewer.model.getData().instanceTree;
        tree.enumNodeFragments(5254, function (frag) {
          let fragProxy = viewer.impl.getFragmentProxy(viewer.model, frag);
          fragProxy.getAnimTransform();
          fragProxy.position.y -= this.state.index
          fragProxy.updateAnimTransform();
        });
        viewer.impl.sceneUpdated(true);
    }
     
    render() {
        return (
            <LineChart
            width={500}
            height={250}
            data={this.state.data}
            margin={{
              top: 25,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Frequency" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Value" stroke="#8884d8" />
          </LineChart>
        );
    }

    getAnimationElementsProps() {
      return new Promise(function(resolve, reject) {
        window.NOP_VIEWER.model.getBulkProperties(Object.keys(window.NOP_VIEWER.model.getData().instanceTree.nodeAccess.dbIdToIndex), {
          propFilter: ["類型名稱"],
          ignoreHidden: true
          }, function(data) {
            resolve(data)
          }, function(error) {})
      });
    }

    async getAnimationElements(){
      var data = await this.getAnimationElementsProps()
      for (var key in data) {
        var item = data[key];
        if (this.animationElementsNames.includes(item.properties[0].displayValue)) {
          this.animationElements.push(item.dbId);
        }
      }
      console.log(this.animationElements)
    }
}

export default RealTimeChart;