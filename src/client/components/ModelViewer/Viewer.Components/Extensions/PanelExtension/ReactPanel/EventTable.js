import React from 'react';
import EventChart from './EventChart.js'

class EventTable extends React.Component {
  constructor(props){
      super(props)

      this.state = {
          nowEvent: "",
          showChart: false
      }

      this.handleButtonClicked = this.handleButtonClicked.bind(this)
  }

  componentDidMount() {
    console.log('EventTable Mounted');
  }

  componentWillUnmount() {
    // console.log('ReactPanelContent Unmounted');
  }

  handleButtonClicked(event) {
      this.setState({
        nowEvent: event.target.dataset.chartname,
        showChart: true
      })
  }

  cellButton(data) {
    if(data)
    {
        return(<button data-chartname={data} onClick={this.handleButtonClicked} style={{color: 'black'}}>Check</button>)
    }
  }

  render() {
    var table;
    if(this.props.data)
    {
        table = this.props.data.map((data, index) => {
          return (
              <tr key={index}>
                  <td data-chartname={data} 
                      key={index} 
                      onClick={this.handleButtonClicked} 
                      style={data == this.state.nowEvent ? {fontWeight: 'bold'} : {}}>{data}</td>
              </tr>
          )
        })
    }

    var chart;
    if(this.state.showChart)
    {
        chart = <EventChart eventname={this.state.nowEvent} style={{width:'70%'}} />
    }

    return (
    <div id='events-container' style={{display: 'flex'}}>
        <table id='events'>
            <tbody>
                <tr>
                    <th key="1">Event Name</th>
                </tr>
                {table}
            </tbody>
        </table>    
        {chart}
      </div>
    );
  }
}

export default EventTable;
