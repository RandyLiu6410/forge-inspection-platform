import Actions from "./Const";
import ReducerHelper from "./ReducerHelper";
const axios = require('axios');

export const timeline = (state = {}, action = {}) => {
  let item = null;
  let props = null;
  switch (action.type) {
    case Actions.AC_ADD_TASK:
      let newTask = {
        id: state.data.length + 1,
        start: new Date(),
        end: ReducerHelper.getRandomDate(),
        name: "New Task",
        //color: ReducerHelper.getRandomColor()
      };
      return {
        data: [newTask, ...state.data],
        links: state.links,
        selectedItem: state.selectedItem
      };

    case Actions.AC_SELECT_ITEM:
      item = action.payload.item;
      console.log(`Select Item ${item}`);
      return {
        data: state.data,
        links: state.links,
        selectedItem: item
      };

    case Actions.AC_UPDATE_TASK:
      item = action.payload.item;
      props = action.payload.props;
      item.start = props.start ? props.start : item.start;
      item.end = props.end ? props.end : item.end;
      item.name = props.name ? props.name : item.name;
      return {
        data: [...state.data],
        links: [...state.links],
        selectedItem: state.selectedItem
      };

    case Actions.AC_DELETE:
      if (state.selectedItem) {
        let index = state.links.indexOf(state.selectedItem);
        if (index > -1) {
          state.links.splice(index, 1);
          return {
            data: state.data,
            links: [...state.links],
            selectedItem: null
          };
        }
        index = state.data.indexOf(state.selectedItem);
        if (index > -1) {
          state.data.splice(index, 1);
          return {
            data: [...state.data],
            links: state.links,
            selectedItem: null
          };
        }
      }
      break;
    case Actions.AC_ADD_LINK:
      item = action.payload.item;
      let newLink = {
        id: ReducerHelper.genID(),
        start: item.start.task.id,
        end: item.end.task.id
      };
      return {
        links: [...state.links, newLink],
        data: state.data,
        selectedItem: newLink
      };
    case Actions.AC_CONNECT_DB:
      return {
        data: action.payload.data,
        links: state.links,
        selectedItem: state.selectedItem
      };
    case Actions.AC_DESELECT_ITEM:
      return {
        data: state.data,
        links: state.links,
        selectedItem: null
      };
    default:
      return state;
  }
};

export default timeline;
