import Reducer from "./Reducer";
import { createStore } from "redux";

const state = {
  data: [],
  links: [],
  selectedItem: null
};
export default createStore(Reducer, state);
