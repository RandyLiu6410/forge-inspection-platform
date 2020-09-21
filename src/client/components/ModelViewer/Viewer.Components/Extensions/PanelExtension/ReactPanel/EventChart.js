import React from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis, YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import styled from 'styled-components';
import CanvasJSReact from '../../../../../CanvasJS/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const axios = require('axios');
var randomcolor = require("randomcolor")


class EventChart extends React.Component {
    constructor(props){
        super(props)
  
        this.state = {
            eventchartData: [],
            spectrumchartData: []
        }

        this.loadEvent = this.loadEvent.bind(this)
        this.loadEvent(this.props.eventname)
    }

    loadEvent(eventname) {
        const datetime = eventname.slice(5,15);
        axios.get(`http://localhost:5000/accelerometerdata/GetDateData/${datetime}`)
        .then(res => {
            var eventchartdata = []
            var spectrumchartdata = []

            res.data.map(sensorData => {
                var eventdatum = {
                type:"line",
                name: sensorData.SensorName,
                showInLegend: true,
                xValueFormatString: "hh:mm:ss",
                yValueFormatString: "##.######g",
                markerSize: 0,
                dataPoints: []
                }
                var predate = new Date(sensorData.Data["EventData"][0].timeStamp);
                var pretime = predate.getTime()
                for (var i = 0; i < sensorData.Data["EventData"].length; i++) {
                if(predate.getTime() !== (new Date(sensorData.Data["EventData"][i].timeStamp).getTime()))
                {
                    eventdatum.dataPoints.push({
                    x: new Date(sensorData.Data["EventData"][i].timeStamp),
                    y: sensorData.Data["EventData"][i].value
                    })
                    predate = new Date(sensorData.Data["EventData"][i].timeStamp)
                    pretime = predate.getTime()
                }
                else
                {
                    pretime += 7
                    eventdatum.dataPoints.push({
                    x: new Date(pretime),
                    y: sensorData.Data["EventData"][i].value
                    })
                }
                }
                eventchartdata.push(eventdatum)

                var spectrumdatum = {
                type:"line",
                name: sensorData.SensorName,
                showInLegend: true,
                yValueFormatString: "##.######g",
                markerSize: 0
                }
                for (var i = 0; i < sensorData.Data["SpectrumData"].length; i++) {
                sensorData.Data["SpectrumData"][i].x = sensorData.Data["SpectrumData"][i].frequency;
                sensorData.Data["SpectrumData"][i].y = sensorData.Data["SpectrumData"][i].value;
                delete sensorData.Data["SpectrumData"][i].frequency;
                delete sensorData.Data["SpectrumData"][i].value;
                }
                spectrumdatum.dataPoints = sensorData.Data["SpectrumData"];
                spectrumchartdata.push(spectrumdatum)
            })
            
            this.setState({
                eventchartData: eventchartdata,
                spectrumchartData: spectrumchartdata
            })
            // var eventchartData = []
            // var spectrumchartData = []
            // const eventdataCount = res.data[0].Data["EventData"].length
            // const spectrumdataCount = res.data[0].Data["SpectrumData"].length

            // for(var i = 0; i < eventdataCount; i++)
            // {
            //     var eventchartDatum = {
            //         timeStamp: res.data[0].Data["EventData"][i].timeStamp
            //     }
            //     res.data.map(sensorData => {
            //         eventchartDatum[sensorData.SensorName] = sensorData.Data["EventData"][i].value
            //     })
            //     eventchartData.push(eventchartDatum)
            // }

            // for(var i = 0; i < spectrumdataCount; i++)
            // {
            //     var spectrumchartDatum = {
            //         frequency: res.data[0].Data["SpectrumData"][i].frequency
            //     }
            //     res.data.map(sensorData => {
            //         spectrumchartDatum[sensorData.SensorName] = sensorData.Data["SpectrumData"][i].value
            //     })
            //     spectrumchartData.push(spectrumchartDatum)
            // }
            
            // this.setState({
            //     eventchartData: eventchartData,
            //     spectrumchartData: spectrumchartData
            // })
        });
    }

    render(){
        const ChartWrapper = styled.div`
        width: 900;
        height: 250;
        margin-top: 25;
        margin-right: 30;
        margin-left: 20;
        margin-bottom: 5;
        `;

        const options_event = {
            theme:"dark2",
			zoomEnabled: true,
			animationEnabled: true,
			title: {
				text: "Event"
            },
            axisX: {
                title: "Timestamp",
                valueFormatString: "hh:mm:ss"
            },
            axisY: {
                title: "Acceleration",
                suffix: "g"
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                horizontalAlign: "center",
                dockInsidePlotArea: true
            },
			data: this.state.eventchartData
		}
		
		const options_spectrum = {
            theme:"dark2",
            zoomEnabled: true,
            animationEnabled: true,
            title: {
                text: "Spectrum"
            },
            axisX: {
                title: "Frequency"
            },
            axisY: {
                title: "Acceleration",
                suffix: "g"
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                horizontalAlign: "center",
                dockInsidePlotArea: true
            },
			data: this.state.spectrumchartData
		}
				
		return (
            <div>
                <ChartWrapper>
                    <CanvasJSChart options = {options_event} style={{widith: '900px'}}/>
                </ChartWrapper>
                <ChartWrapper>
                    <CanvasJSChart options = {options_spectrum} style={{widith: '900px'}}/>
                </ChartWrapper>
            </div>
		);
    }
}

export default EventChart;