import React, {Component} from 'react';

class ReportTable extends Component{
    constructor(){
        super();

        this.state = {
            data: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
          console.log("getDerivedStateFromProps"+ props.data);
          return {
            data: props.data
          };
        }
        // Return null to indicate no change to state.
        return null;
    }

    location(cell, row, enumObject, rowIndex, index){
        if(row)
        {
            return (
                <p>
                    <div>Latitude: {row.location[0].toFixed(2)}</div>
                    <div>Longitude: {row.location[1].toFixed(2)}</div>
                    <div>Altitude: {row.location[2].toFixed(2)}</div>
                </p>
            )
        }
    }

    _location(location){
        if(location)
        {
            return (
                <p>
                    <div>Latitude: {location[0].toFixed(2)}</div>
                    <div>Longitude: {location[1].toFixed(2)}</div>
                    <div>Altitude: {location[2].toFixed(2)}</div>
                </p>
            )
        }
    }

    thumb(cell, row, enumObject, rowIndex, index) {
        if(row)
        {
            return (
                <img src={`data:image/jpeg;base64,${row.thumbimage64str}`} width="100"/>
            )
        }
    }

    _thumb(str64) {
        if(str64)
        {
            return (
                <img src={`data:image/jpeg;base64,${str64}`} width="100"/>
            )
        }
    }

    cellButton(cell, row, enumObject, rowIndex, index) {
        if(row)
        {
            return (
            <div>
                <ZoomButton cell={cell} row={row} rowIndex={rowIndex} data={this.state.data}/>
            </div>
            )
        }
    }

    _cellButton(data) {
        if(data)
        {
            return (
            <div>
                <ZoomButton data={data}/>
            </div>
            )
        }
    }

    renderTableData() {
        if(this.state.data)
        {
            return this.state.data.map((data, index) => {
            const { project, inspector, time, location, description, thumbimage64str} = data //destructuring
            return (
                <tr key={index}>
                    <td>{project}</td>
                    <td>{inspector}</td>
                    <td>{time}</td>
                    <td>{this._location(location)}</td>
                    <td>{description}</td>
                    <td>{this._thumb(thumbimage64str)}</td>
                    <td>{this._cellButton(data)}</td>
                </tr>
            )
            })
        }
     }

     renderTableHeader() {
        if(this.state.data)
        {
            let header = ["Project", "Inspector", "Date", "Location", "Description", "Image", "#"]
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }
     }

    render() {
        return (
          <div>
                <table id='reports'>
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
           </div>
        );
    }
}

class ZoomButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("ZoomButton is clicked");
        window.NOP_VIEWER.fitToView([2683]);
   }

   render() {
        return (
            <React.Fragment>
                <button id='zoom-button' onClick={this.handleClick}>Zoom In</button>
            </React.Fragment>
        )
    }
}

export default ReportTable;