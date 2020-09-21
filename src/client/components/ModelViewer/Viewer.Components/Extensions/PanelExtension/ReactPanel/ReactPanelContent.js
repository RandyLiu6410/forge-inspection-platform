import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import {
  LineChart,
  CartesianGrid,
  XAxis, YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import RealTimeChart from './RealTimeChart';
import ReportTable from './ReportTable';
import EventTable from './EventTable';

class ReactPanelContent extends React.Component {
  constructor(){
    super();
  }

  componentWillReceiveProps(nextprops){

  }

  componentDidMount() {
    // console.log('ReactPanelContent Mounted');
  }

  componentWillUnmount() {
    // console.log('ReactPanelContent Unmounted');
  }

  render() {
    let data = null;
    if(this.props.data)
    {
      data = this.props.data;
    };

    let content = null;

    const { contentType } = this.props;

    if (contentType === 'video') {
      content = (
        <div className="react-content">
          <ReactPlayer url="https://www.youtube.com/watch?v=-MT0LYAso-E" playing />
        </div>);
    } else if (contentType === 'sensor') {
      content = (
        <div>
          <h3 style={{color: 'white'}}>{data.SensorName}</h3>
          <RealTimeChart data={data.Data}/>
        </div>
      );
    } else if (contentType === 'report') {
      content = (
        <div>
          <ReportTable data={data}/>
        </div>
      );
    } else if (contentType === 'event') {
      content = (
        <div>
          <EventTable data={data}/>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

ReactPanelContent.propTypes = {
  contentType: PropTypes.string,
};

ReactPanelContent.defaultProps = {
  contentType: '',
};

export default ReactPanelContent;
