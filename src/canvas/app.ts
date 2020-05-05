import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getLayerDepth, getParentLayer, getNearestScopeAncestor, isScopeGroupLayer, getLayer, getPaperLayer } from '../store/selectors/layer';
import { groupLayers, ungroupLayers, selectLayer, deselectLayer, deselectAllLayers, removeLayers, increaseLayerScope, decreaseLayerScope, clearLayerScope, setLayerHover, newLayerScope, copyLayerToClipboard, copyLayersToClipboard, pasteLayersFromClipboard, moveLayerBy, moveLayersBy, escapeLayerScope, deepSelectLayer } from '../store/actions/layer';
import store, { StoreDispatch, StoreGetState } from '../store';
import AreaSelect from './areaSelectTool';
import { enableRectangleDrawTool, enableEllipseDrawTool, enableDragTool } from '../store/actions/tool';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { applyShapeMethods } from './utils';

// paper.view.onDoubleClick = (event: paper.MouseEvent) => {
//   const state = store.getState();
//   const hitResult = getPaperLayer(state.layer.present.page).hitTest(event.point);
//   if (hitResult) {
//     store.dispatch(deepSelectLayer({id: this.data.id}));
//   }
// }