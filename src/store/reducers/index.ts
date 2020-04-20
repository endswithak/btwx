import { combineReducers } from 'redux';
import layers from './layers';
import drawTool from './drawTool';

export default combineReducers({ layers, drawTool });