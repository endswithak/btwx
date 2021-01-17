import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clipboard } from 'electron';
import { RootState } from '../store/reducers';
import ContextMenuLayerEdit from './ContextMenuLayerEdit';

const ContextMenuWrap = (): ReactElement => {
  const contextMenu = useSelector((state: RootState) => state.contextMenu);

  return (
    contextMenu.isOpen
    ? (() => {
        switch(contextMenu.type) {
          case 'ArtboardCustomPreset':
            return null;
          case 'EventDrawerEvent':
            return null;
          case 'Input':
            return null;
          case 'LayerEdit':
            return (
              <ContextMenuLayerEdit />
            );
          case 'TweenEvent':
            return null;
          case 'TweenEventDestination':
            return null;
        }
      })()
    : null
  );
}

export default ContextMenuWrap;

// import React, { ReactElement } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { clipboard } from 'electron';
// import { RootState } from '../store/reducers';
// import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
// import { addLayerTweenEvent, removeLayers, selectLayers, selectAllLayers, copyLayersThunk, pasteLayersThunk, sendLayersBackward, bringLayersForward, groupLayersThunk, ungroupLayers, removeLayerTweenEvent, duplicateLayers, setLayerHover, toggleSelectedMaskThunk, toggleSelectionIgnoreUnderlyingMask, replaceSelectedImagesThunk } from '../store/actions/layer';
// import { removeArtboardPreset } from '../store/actions/documentSettings';
// import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
// import { canGroupSelected, canUngroupSelected, canToggleSelectedUseAsMask, canBringSelectedForward, canSendSelectedBackward, selectedIgnoreUnderlyingMaskEnabled, selectedUseAsMaskEnabled, canToggleSelectedIgnoreUnderlyingMask, canReplaceSelectedImages } from '../store/selectors/layer';
// import { setEventDrawerEventHoverThunk, setEventDrawerEventThunk } from '../store/actions/eventDrawer';
// import { setEditing } from '../store/actions/leftSidebar';
// import { APP_NAME, DEFAULT_TWEEN_EVENTS } from '../constants';
// import ContextMenu from './ContextMenu';

// const ContextMenuWrap = (): ReactElement => {
//   const contextMenu = useSelector((state: RootState) => state.contextMenu);
//   const artboards = useSelector((state: RootState) => ({
//     allIds: state.layer.present.allArtboardIds,
//     byId: state.layer.present.allArtboardIds.reduce((result, current) => ({
//       ...result,
//       [current]: state.layer.present.byId[current]
//     }), {})
//   })) as { allIds: string[]; byId: { [id: string]: Btwx.Artboard } };
//   const selected = useSelector((state: RootState) => state.layer.present.selected);
//   const canSetEventDrawerEventHover = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen && !state.eventDrawer.event);
//   const layerItem = useSelector((state: RootState) => Object.prototype.hasOwnProperty.call(state.layer.present.byId, state.contextMenu.id) && state.contextMenu.id !== 'root' ? state.layer.present.byId[state.contextMenu.id] : null);
//   const tweenEventLayerScope = layerItem ? layerItem.scope : null;
//   const hasArtboardParent = useSelector((state: RootState) => layerItem ? tweenEventLayerScope[1] && state.layer.present.byId[tweenEventLayerScope[1]].type === 'Artboard' : false);
//   const isArtboard = layerItem ? layerItem.type === 'Artboard' : false;
//   const artboardParent = isArtboard ? layerItem.id : hasArtboardParent ? tweenEventLayerScope[1] : null;
//   const canAddTweenEvent = useSelector((state: RootState) => layerItem && (state.layer.present.selected.length === 0 || (state.layer.present.selected.length === 1 && state.layer.present.selected[0] === state.contextMenu.id)) && (tweenEventLayerScope.some(id => state.layer.present.allArtboardIds.includes(id)) || state.layer.present.allArtboardIds.includes(state.contextMenu.id)));
//   const tweenEvents = useSelector((state: RootState) => layerItem && canAddTweenEvent ? state.layer.present.events.allIds.filter((id) => state.layer.present.events.byId[id].layer === state.contextMenu.id && state.layer.present.events.byId[id].artboard === artboardParent) : null);
//   const tweenEventItems = useSelector((state: RootState) => tweenEvents ? tweenEvents.reduce((result, current) => {
//     result = [...result, state.layer.present.events.byId[current]];
//     return result;
//    }, []) : null);
//   const currentY = useSelector((state: RootState) => state.contextMenu.y && document.getElementById('context-menu') ? document.getElementById('context-menu').offsetTop : state.contextMenu.y);
//   const currentX = useSelector((state: RootState) => state.contextMenu.x && document.getElementById('context-menu') ? document.getElementById('context-menu').offsetLeft : state.contextMenu.x);
//   const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1);
//   const canMoveBackward = useSelector((state: RootState) => canSendSelectedBackward(state));
//   const canMoveForward = useSelector((state: RootState) => canBringSelectedForward(state));
//   const canGroup = useSelector((state: RootState) => canGroupSelected(state));
//   const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
//   const canMask = useSelector((state: RootState) => canToggleSelectedUseAsMask(state));
//   const useAsMaskChecked = useSelector((state: RootState) => selectedUseAsMaskEnabled(state));
//   const canIgnoreUnderlyingMask = useSelector((state: RootState) => canToggleSelectedIgnoreUnderlyingMask(state));
//   const ignoreUnderlyingMaskChecked = useSelector((state: RootState) => selectedIgnoreUnderlyingMaskEnabled(state));
//   const canDuplicate = selected.length > 0 || layerItem !== null;
//   const canRename = selected.length === 1;
//   const canReplaceImage = useSelector((state: RootState) => canReplaceSelectedImages(state));
//   const clipboardType: Btwx.ClipboardType = ((): Btwx.ClipboardType => {
//     try {
//       const text = clipboard.readText();
//       const parsedText: Btwx.ClipboardLayers = JSON.parse(text);
//       return parsedText.type ? parsedText.type : null;
//     } catch (error) {
//       return null;
//     }
//   })();
//   const dispatch = useDispatch();

//   const getOptions = () => {
//     switch(contextMenu.type) {
//       case 'LayerEdit': {
//         return [{
//           type: 'MenuItem',
//           text: 'Add Event...',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canAddTweenEvent,
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(openContextMenu({
//               ...contextMenu,
//               x: currentX,
//               y: currentY,
//               type: 'TweenEvent'
//             }));
//           }
//         },{
//           type: 'MenuDivider',
//           hidden: contextMenu.id && contextMenu.id === 'root'
//         },{
//           type: 'MenuItem',
//           text: 'Select',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(selectLayers({layers: [contextMenu.id], newSelection: true}));
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Select All',
//           disabled: !canSelectAll,
//           hidden: contextMenu.id && contextMenu.id !== 'root',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(selectAllLayers());
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Copy',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(copyLayersThunk());
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Paste Here',
//           hidden: contextMenu.data && contextMenu.data.origin && contextMenu.data.origin === 'sidebar',
//           disabled: !clipboardType,
//           onClick: (): void => {
//             (dispatch(pasteLayersThunk({overPoint: { x: contextMenu.paperX, y: contextMenu.paperY }, overLayer: contextMenu.id} as any)) as any).then(() => {
//               dispatch(closeContextMenu());
//             });
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Paste Over',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !clipboardType,
//           onClick: (): void => {
//             if (selected.length > 0) {
//               if (selected.length === 1) {
//                 (dispatch(pasteLayersThunk({overLayer: selected[0]} as any)) as any).then(() => {
//                   dispatch(closeContextMenu());
//                 });
//               } else {
//                 (dispatch(pasteLayersThunk({overSelection: true} as any)) as any).then(() => {
//                   dispatch(closeContextMenu());
//                 });
//               }
//             } else {
//               (dispatch(pasteLayersThunk({overLayer: contextMenu.id} as any)) as any).then(() => {
//                 dispatch(closeContextMenu());
//               });
//             }
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Duplicate',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canDuplicate,
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             if (selected.length > 0) {
//               dispatch(duplicateLayers({layers: selected}));
//             } else {
//               dispatch(duplicateLayers({layers: [contextMenu.id]}));
//             }
//           }
//         },{
//           type: 'MenuDivider',
//           hidden: contextMenu.id && contextMenu.id === 'root'
//         },{
//           type: 'MenuItem',
//           text: 'Delete',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             if (selected.length > 0) {
//               dispatch(removeLayers({layers: selected}));
//             } else {
//               dispatch(removeLayers({layers: [contextMenu.id]}));
//             }
//           }
//         },{
//           type: 'MenuDivider',
//           hidden: contextMenu.id && contextMenu.id === 'root'
//         },{
//           type: 'MenuItem',
//           text: 'Move Forward',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canMoveForward,
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             if (selected.length > 0) {
//               dispatch(bringLayersForward({layers: selected}));
//             } else {
//               dispatch(bringLayersForward({layers: [contextMenu.id]}));
//             }
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Move Backward',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canMoveBackward,
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             if (selected.length > 0) {
//               dispatch(sendLayersBackward({layers: selected}));
//             } else {
//               dispatch(sendLayersBackward({layers: [contextMenu.id]}));
//             }
//           }
//         },{
//           type: 'MenuDivider',
//           hidden: contextMenu.id && contextMenu.id === 'root'
//         },{
//           type: 'MenuItem',
//           text: 'Group',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canGroup,
//           onClick: (): void => {
//             if (selected.length > 0) {
//               (dispatch(groupLayersThunk({layers: selected})) as any).then(() => {
//                 dispatch(closeContextMenu());
//               });
//             } else {
//               (dispatch(groupLayersThunk({layers: [contextMenu.id]})) as any).then(() => {
//                 dispatch(closeContextMenu());
//               });
//             }
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Ungroup',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canUngroup,
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             if (selected.length > 0) {
//               dispatch(ungroupLayers({layers: selected}));
//             } else {
//               dispatch(ungroupLayers({layers: [contextMenu.id]}));
//             }
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Rename Layer',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canRename,
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(setEditing({editing: selected[0]}));
//           }
//         },{
//           type: 'MenuDivider',
//           hidden: contextMenu.id && contextMenu.id === 'root'
//         },{
//           type: 'MenuItem',
//           text: 'Mask',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canMask,
//           checked: useAsMaskChecked,
//           onClick: (): void => {
//             dispatch(toggleSelectedMaskThunk());
//             dispatch(closeContextMenu());
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Ignore Underlying Mask',
//           hidden: contextMenu.id && contextMenu.id === 'root',
//           disabled: !canIgnoreUnderlyingMask,
//           checked: ignoreUnderlyingMaskChecked,
//           onClick: (): void => {
//             dispatch(toggleSelectionIgnoreUnderlyingMask());
//             dispatch(closeContextMenu());
//           }
//         },{
//           type: 'MenuDivider',
//           hidden: !canReplaceImage
//         },{
//           type: 'MenuItem',
//           text: 'Replace Image...',
//           hidden: !canReplaceImage,
//           onClick: (): void => {
//             dispatch(replaceSelectedImagesThunk());
//             dispatch(closeContextMenu());
//           }
//         }]
//       }
//       case 'TweenEvent': {
//         return [{
//           type: 'MenuHead',
//           text: 'On Event:',
//           backButton: true,
//           backButtonClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(openContextMenu({
//               ...contextMenu,
//               x: currentX,
//               y: currentY,
//               type: 'LayerEdit'
//             }));
//           }
//         }, ...DEFAULT_TWEEN_EVENTS.reduce((result, current) => {
//           const isDisabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === current.event);
//           const eventItem = tweenEventItems && tweenEventItems.find((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === current.event);
//           result = [
//             ...result,
//             {
//               type: 'MenuItem',
//               text: current.titleCase,
//               disabled: isDisabled,
//               onMouseEnter(): void {
//                 if (eventItem && canSetEventDrawerEventHover) {
//                   dispatch(setEventDrawerEventHoverThunk({id: eventItem.id}));
//                 }
//               },
//               onMouseLeave(): void {
//                 if (eventItem && canSetEventDrawerEventHover) {
//                   dispatch(setEventDrawerEventHoverThunk({id: null}));
//                 }
//               },
//               onClick(): void {
//                 dispatch(closeContextMenu());
//                 dispatch(openContextMenu({
//                   ...contextMenu,
//                   x: currentX,
//                   y: currentY,
//                   type: 'TweenEventDestination',
//                   data: {
//                     tweenEvent: current.event
//                   }
//                 }));
//               }
//             }
//           ]
//           return result;
//         }, [])];
//       }
//       case 'TweenEventDestination': {
//         const tweenDestinations = artboards.allIds.reduce((result, current) => {
//           const artboardItem = artboards.byId[current];
//           const disabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === contextMenu.data.tweenEvent && tweenEvent.destinationArtboard === artboardItem.id );
//           if (artboardItem.id !== artboardParent && artboardItem.id !== contextMenu.id) {
//             result = [
//               ...result,
//               {
//                 type: 'MenuItem',
//                 text: artboardItem.name,
//                 disabled: disabled,
//                 onMouseEnter(): void {
//                   dispatch(setLayerHover({id: artboardItem.id}));
//                 },
//                 onMouseLeave(): void {
//                   dispatch(setLayerHover({id: null}));
//                 },
//                 onClick: (): void => {
//                   dispatch(addLayerTweenEvent({
//                     name: `Tween Event`,
//                     artboard: artboardParent,
//                     destinationArtboard: artboardItem.id,
//                     event: contextMenu.data.tweenEvent,
//                     layer: contextMenu.id,
//                     tweens: []
//                   }));
//                   dispatch(closeContextMenu());
//                 }
//               }
//             ]
//           }
//           return result;
//         }, []);
//         return tweenDestinations.length > 0 ? [{
//           type: 'MenuHead',
//           text: `On ${DEFAULT_TWEEN_EVENTS.find((event) => event.event === contextMenu.data.tweenEvent).titleCase}, Go To:`,
//           backButton: true,
//           backButtonClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(openContextMenu({
//               ...contextMenu,
//               x: currentX,
//               y: currentY,
//               type: 'TweenEvent'
//             }));
//           }
//         }, ...tweenDestinations] : tweenDestinations;
//       }
//       case 'ArtboardCustomPreset': {
//         return [{
//           type: 'MenuItem',
//           text: 'Edit',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(openArtboardPresetEditor({
//               id: contextMenu.id,
//               category: 'Custom',
//               type: contextMenu.data.type,
//               width: contextMenu.data.width,
//               height: contextMenu.data.width
//             }));
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Remove',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(removeArtboardPreset({id: contextMenu.id}));
//           }
//         }]
//       }
//       case 'EventDrawerEvent': {
//         return [{
//           type: 'MenuItem',
//           text: 'Edit',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(setEventDrawerEventThunk({id: contextMenu.id}));
//           }
//         },{
//           type: 'MenuItem',
//           text: 'Remove',
//           onClick: (): void => {
//             dispatch(closeContextMenu());
//             dispatch(removeLayerTweenEvent({id: contextMenu.id}));
//           }
//         }]
//       }
//     }
//   }

//   const getEmptyState = (): string => {
//     switch(contextMenu.type) {
//       case 'TweenEvent': {
//         return null;
//       }
//       case 'TweenEventDestination': {
//         return 'Two or more artboards are required to create an event.';
//       }
//       case 'ArtboardCustomPreset': {
//         return null;
//       }
//     }
//   }

//   return (
//     contextMenu.isOpen
//     ? <ContextMenu
//         options={getOptions()}
//         emptyState={getEmptyState()} />
//     : null
//   );
// }

// export default ContextMenuWrap;