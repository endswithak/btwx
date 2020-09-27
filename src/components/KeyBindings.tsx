import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { remote, clipboard } from 'electron';
import { RootState } from '../store/reducers';
import { UngroupLayersPayload, SendLayersBackwardPayload, SendLayersForwardPayload, SendLayersToBackPayload, GroupLayersPayload, SendLayersToFrontPayload, LayerTypes } from '../store/actionTypes/layer';
import { pasteLayersThunk, pasteStyleThunk, copyStyleThunk, copyLayersThunk, removeLayersThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, escapeLayerScopeThunk } from '../store/actions/layer';
import { resetCanvasSettingsThunk } from '../store/actions/canvasSettings';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { toggleDragToolThunk } from '../store/actions/dragTool';
import { toggleAreaSelectToolThunk } from '../store/actions/areaSelectTool';
import { getLayerAndDescendants } from '../store/selectors/layer';

interface KeyBindingsProps {
  themeName?: em.ThemeName;
  selectedWithDescendents?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  clipboardType?: em.ClipboardType;
  scope?: string[];
  activeTool?: em.ToolType;
  activeToolShapeType?: em.ShapeType;
  selected?: string[];
  focusing?: boolean;
  canMoveBackward?: boolean;
  canMoveForward?: boolean;
  canGroup?: boolean;
  canUngroup?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  copyLayersThunk?(): void;
  copyStyleThunk?(): void;
  pasteLayersThunk?({overSelection, overPoint, overLayer}: { overSelection?: boolean; overPoint?: em.Point; overLayer?: string }): Promise<any>;
  pasteStyleThunk?(): void;
  removeLayersThunk?(): void;
  toggleArtboardToolThunk?(): void;
  toggleTextToolThunk?(): void;
  toggleShapeToolThunk?(shapeType: em.ShapeType): void;
  redoThunk?(): void;
  undoThunk?(): void;
  ungroupLayers?(payload: UngroupLayersPayload): LayerTypes;
  groupLayersThunk?(payload: GroupLayersPayload): Promise<em.Group>;
  sendLayersForward?(payload: SendLayersForwardPayload): LayerTypes;
  sendLayersToFront?(payload: SendLayersToFrontPayload): LayerTypes;
  sendLayersBackward?(payload: SendLayersBackwardPayload): LayerTypes;
  sendLayersToBack?(payload: SendLayersToBackPayload): LayerTypes;
  toggleSelectionToolThunk?(): void;
  resetCanvasSettingsThunk?(): void;
  escapeLayerScopeThunk?(): void;
  toggleDragToolThunk?(): void;
  toggleAreaSelectToolThunk?(): void;
}

const KeyBindings = (props: KeyBindingsProps): ReactElement => {
  const { themeName, canUndo, canRedo, selectedWithDescendents, clipboardType, copyStyleThunk, pasteStyleThunk, toggleDragToolThunk, toggleAreaSelectToolThunk, scope, activeToolShapeType, toggleSelectionToolThunk, activeTool, escapeLayerScopeThunk, selected, focusing, canMoveBackward, canMoveForward, canGroup, canUngroup, copyLayersThunk, pasteLayersThunk, removeLayersThunk, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, resetCanvasSettingsThunk } = props;

  // const handleKeyDown = (e: any) => {
  //   if (focusing) {
  //     switch(e.key) {
  //       case 'a': {
  //         toggleArtboardToolThunk();
  //         break;
  //       }
  //       case 'Backspace': {
  //         removeLayersThunk();
  //         break;
  //       }
  //       case 'c': {
  //         if (e.metaKey) {
  //           copyLayersThunk();
  //         }
  //         break;
  //       }
  //       case 'ç': {
  //         if (e.metaKey && e.altKey) {
  //           copyStyleThunk() as any;
  //         }
  //         break;
  //       }
  //       case 'Escape': {
  //         if (activeTool) {
  //           switch(activeTool) {
  //             case 'Artboard':
  //               toggleArtboardToolThunk();
  //               break;
  //             case 'Selection':
  //               toggleSelectionToolThunk();
  //               break;
  //             case 'Shape':
  //               toggleShapeToolThunk(activeToolShapeType);
  //               break;
  //             case 'Text':
  //               toggleTextToolThunk();
  //               break;
  //             // case 'Drag':
  //             //   toggleDragToolThunk();
  //             //   break;
  //             case 'AreaSelect':
  //               toggleAreaSelectToolThunk();
  //               break;
  //           }
  //         }
  //         if (scope.length > 0) {
  //           escapeLayerScopeThunk();
  //         }
  //         break;
  //       }
  //       case 'g': {
  //         if (e.metaKey) {
  //           if (e.shiftKey) {
  //             if (canUngroup) {
  //               ungroupLayers({layers: selected});
  //             }
  //           } else {
  //             if (canGroup) {
  //               groupLayersThunk({layers: selected});
  //             }
  //           }
  //         }
  //         break;
  //       }
  //       case 'l': {
  //         toggleShapeToolThunk('Line');
  //         break;
  //       }
  //       case 'o': {
  //         toggleShapeToolThunk('Ellipse');
  //         break;
  //       }
  //       case 'r': {
  //         if (!e.metaKey) {
  //           toggleShapeToolThunk('Rectangle');
  //         }
  //         break;
  //       }
  //       case 't': {
  //         toggleTextToolThunk();
  //         break;
  //       }
  //       case 'u': {
  //         toggleShapeToolThunk('Rounded');
  //         break;
  //       }
  //       case 'v': {
  //         if (e.metaKey) {
  //           pasteLayersThunk({overSelection: e.shiftKey}) as any;
  //         }
  //         break;
  //       }
  //       case '√': {
  //         if (e.metaKey && e.altKey) {
  //           pasteStyleThunk() as any;
  //         }
  //         break;
  //       }
  //       case 'z': {
  //         if (e.metaKey) {
  //           if (e.shiftKey) {
  //             redoThunk();
  //           } else {
  //             undoThunk();
  //           }
  //         }
  //         break;
  //       }
  //       case '[': {
  //         if (e.metaKey && canMoveBackward) {
  //           if (e.shiftKey) {
  //             sendLayersToBack({layers: selected});
  //           } else {
  //             sendLayersBackward({layers: selected});
  //           }
  //         }
  //         break;
  //       }
  //       case ']': {
  //         if (e.metaKey && canMoveForward) {
  //           if (e.shiftKey) {
  //             sendLayersToFront({layers: selected});
  //           } else {
  //             sendLayersForward({layers: selected});
  //           }
  //         }
  //         break;
  //       }
  //     }
  //   } else {
  //     switch(e.key) {
  //       case 'r': {
  //         if (e.metaKey) {
  //           resetCanvasSettingsThunk();
  //         }
  //         break;
  //       }
  //     }
  //   }
  // }

  useEffect(() => {
    const menu = remote.Menu.getApplicationMenu();
    const menuItems = {
      appDarkTheme: {
        id: 'appDarkTheme',
        enabled: true,
        checked: themeName === 'dark'
      },
      appLightTheme: {
        id: 'appLightTheme',
        enabled: true,
        checked: themeName === 'light'
      },
      appReload: {
        id: 'appReload',
        enabled: true
      },
      fileSave: {
        id: 'fileSave',
        enabled: true
      },
      fileSaveAs: {
        id: 'fileSaveAs',
        enabled: true
      },
      fileOpen: {
        id: 'fileOpen',
        enabled: true
      },
      fileNew: {
        id: 'fileNew',
        enabled: true
      },
      editUndo: {
        id: 'editUndo',
        enabled: focusing && canUndo
      },
      editRedo: {
        id: 'editRedo',
        enabled: focusing && canRedo
      },
      editCut: {
        id: 'editCut',
        enabled: focusing && selected.length > 0
      },
      editDelete: {
        id: 'editDelete',
        enabled: focusing && selected.length > 0
      },
      editCopy: {
        id: 'editCopy',
        enabled: focusing && selected.length > 0
      },
      editCopySVG: {
        id: 'editCopySVG',
        enabled: focusing && selected.length === 1 && selectedWithDescendents.byId[selected[0]].type === 'Shape'
      },
      editCopyStyle: {
        id: 'editCopySVG',
        enabled: focusing && selected.length === 1
      },
      editPaste: {
        id: 'editPaste',
        enabled: focusing && clipboardType === 'layers'
      },
      editPasteOverSelection: {
        id: 'editPasteOverSelection',
        enabled: focusing && clipboardType === 'layers' && selected.length > 0
      },
      editPasteStyle: {
        id: 'editPasteStyle',
        enabled: focusing && clipboardType === 'style' && selected.length > 0
      },
      insertArtboard: {
        id: 'insertArtboard',
        enabled: focusing
      },
      insertRectangle: {
        id: 'insertRectangle',
        enabled: focusing
      },
      insertRounded: {
        id: 'insertRounded',
        enabled: focusing
      },
      insertEllipse: {
        id: 'insertEllipse',
        enabled: focusing
      },
      insertStar: {
        id: 'insertStar',
        enabled: focusing
      },
      insertPolygon: {
        id: 'insertPolygon',
        enabled: focusing
      },
      insertLine: {
        id: 'insertLine',
        enabled: focusing
      },
      insertText: {
        id: 'insertText',
        enabled: focusing
      },
      insertImage: {
        id: 'insertImage',
        enabled: focusing
      },
      arrangeBringForward: {
        id: 'arrangeBringForward',
        enabled: focusing && canMoveForward
      },
      arrangeBringToFront: {
        id: 'arrangeBringToFront',
        enabled: focusing && canMoveForward
      },
      arrangeSendBackward: {
        id: 'arrangeSendBackward',
        enabled: focusing && canMoveBackward
      },
      arrangeSendToBack: {
        id: 'arrangeSendToBack',
        enabled: focusing && canMoveBackward
      },
      arrangeAlignLeft: {
        id: 'arrangeAlignLeft',
        enabled: focusing && selected.length >= 2
      },
      arrangeAlignHorizontally: {
        id: 'arrangeAlignHorizontally',
        enabled: focusing && selected.length >= 2
      },
      arrangeAlignRight: {
        id: 'arrangeAlignRight',
        enabled: focusing && selected.length >= 2
      },
      arrangeAlignTop: {
        id: 'arrangeAlignTop',
        enabled: focusing && selected.length >= 2
      },
      arrangeAlignVertically: {
        id: 'arrangeAlignVertically',
        enabled: focusing && selected.length >= 2
      },
      arrangeAlignBottom: {
        id: 'arrangeAlignBottom',
        enabled: focusing && selected.length >= 2
      },
      arrangeDistributeHorizontally: {
        id: 'arrangeDistributeHorizontally',
        enabled: focusing && selected.length >= 3
      },
      arrangeDistributeVertically: {
        id: 'arrangeDistributeVertically',
        enabled: focusing && selected.length >= 3
      },
      arrangeGroup: {
        id: 'arrangeGroup',
        enabled: focusing && canGroup
      },
      arrangeUngroup: {
        id: 'arrangeUngroup',
        enabled: focusing && canUngroup
      }
    }
    Object.keys(menuItems).forEach((key: string) => {
      const menuItem = menuItems[key] as { id: string; enabled: boolean; checked?: boolean };
      const electronMenuItem = menu.getMenuItemById(key);
      electronMenuItem.enabled = menuItem.enabled;
      if (menuItem.checked) {
        electronMenuItem.checked = menuItem.checked;
      }
    });
  });

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  themeName: em.ThemeName;
  selectedWithDescendents: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  clipboardType: em.ClipboardType;
  activeTool: em.ToolType;
  activeToolShapeType: em.ShapeType;
  scope: string[];
  selected: string[];
  focusing: boolean;
  canMoveBackward: boolean;
  canMoveForward: boolean;
  canGroup: boolean;
  canUngroup: boolean;
  canUndo: boolean;
  canRedo: boolean;
} => {
  const { canvasSettings, layer, shapeTool, theme } = state;
  const focusing = canvasSettings.focusing;
  const selected = layer.present.selected;
  const emptySelection = selected.length === 0;
  const canUndo = state.layer.past.length > 0;
  const canRedo = state.layer.future.length > 0;
  const canMoveBackward = !emptySelection && !selected.some((id: string) => {
    const layerItem = layer.present.byId[id];
    const parent = layer.present.byId[layerItem.parent];
    const inMaskedGroup = parent.type === 'Group' && (parent as em.Group).clipped;
    const isFirstMaskChild = inMaskedGroup && parent.children[1] === id;
    return parent.children[0] === id || isFirstMaskChild;
  });
  const canMoveForward = !emptySelection && !selected.some((id: string) => {
    const layerItem = layer.present.byId[id];
    const parent = state.layer.present.byId[layerItem.parent];
    const isMask = layerItem.mask;
    return parent.children[parent.children.length - 1] === id || isMask;
  });
  const canGroup = !emptySelection && !selected.some((id: string) => {
    const layerItem = layer.present.byId[id];
    return layerItem.type === 'Artboard';
  });
  const canUngroup = !emptySelection && selected.some((id: string) => {
    const layerItem = layer.present.byId[id];
    return layerItem.type === 'Group';
  });
  const clipboardType: em.ClipboardType = ((): em.ClipboardType => {
    try {
      const text = clipboard.readText();
      const parsedText: em.ClipboardLayers = JSON.parse(text);
      return parsedText.type ? parsedText.type : null;
    } catch (error) {
      return null;
    }
  })();
  const activeTool = canvasSettings.activeTool;
  const activeToolShapeType = shapeTool.shapeType;
  const scope = layer.present.scope;
  const selectedWithDescendents = selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
    const layerAndChildren = getLayerAndDescendants(state.layer.present, current);
    result.allIds = [...result.allIds, ...layerAndChildren];
    layerAndChildren.forEach((id) => {
      result.byId[id] = state.layer.present.byId[id];
    });
    return result;
  }, { allIds: [], byId: {} });
  const themeName = theme.theme;
  return { themeName, canUndo, canRedo, selectedWithDescendents, clipboardType, selected, focusing, canMoveBackward, canMoveForward, canGroup, canUngroup, activeTool, activeToolShapeType, scope };
};

export default connect(
  mapStateToProps,
  { copyStyleThunk, pasteStyleThunk, toggleDragToolThunk, toggleAreaSelectToolThunk, escapeLayerScopeThunk, pasteLayersThunk, copyLayersThunk, removeLayersThunk, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, resetCanvasSettingsThunk }
)(KeyBindings);