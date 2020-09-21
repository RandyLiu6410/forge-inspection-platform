import React,{Component} from 'react'
import DateHelper from '../../helpers/DateHelper'
import {MODE_NONE,MODE_MOVE,MOVE_RESIZE_LEFT,MOVE_RESIZE_RIGHT} from '../../Const'
import {LINK_POS_LEFT,LINK_POS_RIGHT } from '../../Const'
import Config from '../../helpers/config/Config'

export default class Slider extends Component{
    constructor(props){
        super(props);
        this.calculateStyle=this.calculateStyle.bind(this)
        this.state={dragging:false,
                    date:new Date(),
                    left:DateHelper.dateToPixel(new Date(),this.props.nowposition,this.props.dayWidth),
                    mode:MODE_NONE}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nowposition !== this.props.nowposition) {
            const new_left = DateHelper.dateToPixel(this.state.date,nextProps.nowposition,nextProps.dayWidth)
            this.setState({ left: new_left });
        }
      }

    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.doMouseMove)
            document.addEventListener('mouseup', this.doMouseUp)
            document.addEventListener('touchmove', this.doTouchMove)
            document.addEventListener('touchend', this.doTouchEnd)
        } else if (!this.state.dragging && state.dragging) {
          document.removeEventListener('mousemove', this.doMouseMove)
          document.removeEventListener('mouseup', this.doMouseUp)
          document.removeEventListener('touchmove', this.doTouchMove)
          document.removeEventListener('touchend', this.doTouchEnd)
        }
    }

    dragStart(x, mode) {
        this.props.onChildDrag(true)
        this.draggingPosition=x;
        this.setState({
            dragging: true,
            mode: mode,
            left: this.state.left,
        });
    }
    dragProcess(x) {
        let delta=this.draggingPosition-x;
        let newLeft=this.state.left;
        
        switch(this.state.mode){
            case MODE_MOVE:
                newLeft=this.state.left-delta
                break;
        }
        //the coordinates need to be global
        this.setState({left:newLeft});
        this.draggingPosition=x;
    }
    dragEnd() {
        this.props.onChildDrag(false)
        let new_start_date=DateHelper.pixelToDate(this.state.left,this.props.nowposition,this.props.dayWidth);
        this.props.onUpdateSlider({date:new_start_date.toISOString()})
        this.setState({date:new_start_date,dragging:false,mode:MODE_NONE})
    }

    doMouseDown=(e, mode)=>{
        if(!this.props.onUpdateSlider)
            return;
        if (e.button === 0){
            e.stopPropagation();
            this.dragStart(e.clientX, mode)
        }
    }
    doMouseMove=(e)=>{
        if (this.state.dragging) {
            e.stopPropagation();
            this.dragProcess(e.clientX);
        }
    }
    doMouseUp=()=>{
        this.dragEnd();
    }

    doTouchStart=(e, mode)=>{
        if(!this.props.onUpdateSlider)
            return;
            console.log('start')
        e.stopPropagation();
        this.dragStart(e.touches[0].clientX, mode);
    }
    doTouchMove=(e)=>{
        if (this.state.dragging) {
            console.log('move')
            e.stopPropagation();
            this.dragProcess(e.changedTouches[0].clientX);
        }
    }
    doTouchEnd=(e)=>{
        console.log('end')
        this.dragEnd();
    }
    calculateStyle(){
        let configStyle={
            position: 'absolute',
            borderLeft: '3px solid green',
            marginLeft: '-3px',
            height: this.props.height,
            zIndex: 10
        };

        if(this.state.dragging){
            return {...configStyle,left:this.state.left}
        }else{
            return {...configStyle,left:this.state.left}
       }
     
    }
    
    render(){
        let style=this.calculateStyle()
        return (
        <div 
            onMouseDown={(e)=>this.doMouseDown(e,MODE_MOVE)}
            onTouchStart={(e)=>this.doTouchStart(e,MODE_MOVE)}
            style={style}>
        </div>)
          
    }
}