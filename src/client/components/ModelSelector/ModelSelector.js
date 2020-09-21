import React, {Component} from 'react';
import TreeMenu from 'react-simple-tree-menu';
import TreeViewMenu, { defaultChildren, ItemComponent } from 'react-simple-tree-menu';
import ListTreeView from './ListTreeView';

class ModelSelector extends Component{
    constructor(){
        super();
    }

    state = {/*
        model:[
            {
                name: '江门侧式站房施工图',
                urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE5LTA5LTA0LTA3LTI4LTA1LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlLyVFNiVCMSU5RiVFOSU5NyVBOCVFNCVCRSVBNyVFNSVCQyU4RiVFNyVBQiU5OSVFNiU4OCVCRiVFNiU5NiVCRCVFNSVCNyVBNSVFNSU5QiVCRS5ydnQ',
            },
            {
                name: 'Exam Answer',
                urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE5LTA5LTExLTA0LTA1LTAzLWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL0V4YW0lMjBBbnN3ZXIucnZ0',
            }
        ],*/
        treeData: [
            {
                nodeId: 'list-level',
                label: 'SHM Projects',
                nodes: [
                    {
                        nodeId: 1,
                        label: '江门侧式站房施工图',
                        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE5LTA5LTA0LTA3LTI4LTA1LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlLyVFNiVCMSU5RiVFOSU5NyVBOCVFNCVCRSVBNyVFNSVCQyU4RiVFNyVBQiU5OSVFNiU4OCVCRiVFNiU5NiVCRCVFNSVCNyVBNSVFNSU5QiVCRS5ydnQ',
                    },
                    {
                        nodeId: 2,
                        label: 'Bungalow',
                        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE5LTEwLTA0LTEwLTA2LTM5LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL0J1bmdhbG93LnJ2dA',
                    },
                    {
                        nodeId: 3,
                        label: 'Mainroad',
                        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE5LTExLTEyLTA5LTU0LTQzLWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL1NITSVFNiVCOCVBQyVFOCVBOSVBNiVFNiVBOSU4QiVFNiVBMiU4MS5ydnQ',
                    },
                    {
                        nodeId: 4,
                        label: 'Maglev Train Railway',
                        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDIwLTA0LTE1LTA3LTM5LTE4LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL3BvbHlVX0JJTV9Nb2RlbF8zNzVtXzA0MDdfdjIucnZ0',
                    },
                ],
            },
        ]
    }

    render(){
        return(
            <div>
                <h1 style={{textAlign:"center", color: "white"}}>Projects</h1>
                <ListTreeView treeData={this.state.treeData} clicked={this.props.changeModel}/>
            </div>
        )
    }
}

export default ModelSelector;