import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { remote, clipboard } from 'electron';
import { RootState } from '../store/reducers';
import { pasteLayersThunk, pasteStyleThunk, copyStyleThunk, copyLayersThunk, removeLayersThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, escapeLayerScopeThunk } from '../store/actions/layer';
import { resetCanvasSettingsThunk } from '../store/actions/canvasSettings';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { getLayerAndDescendants, canGroupSelection, canUngroupSelection, canSendBackwardSelection, canBringForwardSelection, canToggleSelectionStroke, canToggleSelectionShadow, canToggleSelectionFill, canTransformFlipSelection, canMaskSelection, canBooleanOperationSelection, canPasteSVG } from '../store/selectors/layer';

interface KeyBindingsProps {
  themeName?: em.ThemeName;
  // selectedWithDescendents?: {
  //   allIds: string[];
  //   byId: {
  //     [id: string]: em.Layer;
  //   };
  // };
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
  canArtboardZoom?: boolean;
  canSelectedZoom?: boolean;
  canCanvasZoom?: boolean;
  canZoomOut?: boolean;
  layersOpen?: boolean;
  stylesOpen?: boolean;
  eventsOpen?: boolean;
  canSelectAll?: boolean;
  canSelectAllArtboards?: boolean;
  canToggleStroke?: boolean;
  canToggleShadow?: boolean;
  canToggleFill?: boolean;
  canToggleFlip?: boolean;
  canMask?: boolean;
  canBooleanOperation?: boolean;
  fillsEnabled?: boolean;
  strokesEnabled?: boolean;
  shadowsEnabled?: boolean;
  horizontalFlipEnabled?: boolean;
  verticalFlipEnabled?: boolean;
  canPasteAsSVG?: boolean;
  toggleArtboardToolThunk?(): void;
  toggleTextToolThunk?(): void;
  toggleShapeToolThunk?(shapeType: em.ShapeType): void;
  toggleSelectionToolThunk?(): void;
  escapeLayerScopeThunk?(): void;
  toggleAreaSelectToolThunk?(): void;
}

const KeyBindings = (props: KeyBindingsProps): ReactElement => {
  const { canPasteAsSVG, fillsEnabled, strokesEnabled, shadowsEnabled, horizontalFlipEnabled, verticalFlipEnabled, canToggleStroke, canToggleShadow, canToggleFill, canToggleFlip, canMask, canBooleanOperation, canSelectAll, canSelectAllArtboards, layersOpen, canZoomOut, stylesOpen, eventsOpen, canArtboardZoom, canSelectedZoom, canCanvasZoom, themeName, canUndo, canRedo, clipboardType, toggleAreaSelectToolThunk, scope, activeToolShapeType, toggleSelectionToolThunk, activeTool, escapeLayerScopeThunk, selected, focusing, canMoveBackward, canMoveForward, canGroup, canUngroup, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk } = props;

  const handleKeyDown = (e: any) => {
    if (focusing) {
      switch(e.key) {
        case 'Escape': {
          if (activeTool) {
            switch(activeTool) {
              case 'Artboard':
                toggleArtboardToolThunk();
                break;
              case 'Shape':
                toggleShapeToolThunk(activeToolShapeType);
                break;
              case 'Text':
                toggleTextToolThunk();
                break;
            }
          }
          if (scope.length > 0) {
            escapeLayerScopeThunk();
          }
          break;
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const menu = remote.Menu.getApplicationMenu();
    const menuItems = {
      appThemeDark: {
        id: 'appThemeDark',
        enabled: true,
        checked: themeName === 'dark'
      },
      appThemeLight: {
        id: 'appThemeLight',
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
      editDuplicate: {
        id: 'editDuplicate',
        enabled: focusing && selected.length > 0
      },
      editSelectAll: {
        id: 'editSelectAll',
        enabled: focusing && canSelectAll
      },
      editSelectAllArtboards: {
        id: 'editSelectAllArtboards',
        enabled: focusing && canSelectAllArtboards
      },
      editCopy: {
        id: 'editCopy',
        enabled: focusing && selected.length > 0
      },
      editCopySVG: {
        id: 'editCopySVG',
        enabled: focusing && selected.length > 0
      },
      editCopyStyle: {
        id: 'editCopyStyle',
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
      editPasteSVG: {
        id: 'editPasteSVG',
        enabled: focusing && canPasteAsSVG
      },
      insertArtboard: {
        id: 'insertArtboard',
        enabled: focusing
      },
      insertShapeRectangle: {
        id: 'insertShapeRectangle',
        enabled: focusing
      },
      insertShapeRounded: {
        id: 'insertShapeRounded',
        enabled: focusing
      },
      insertShapeEllipse: {
        id: 'insertShapeEllipse',
        enabled: focusing
      },
      insertShapeStar: {
        id: 'insertShapeStar',
        enabled: focusing
      },
      insertShapePolygon: {
        id: 'insertShapePolygon',
        enabled: focusing
      },
      insertShapeLine: {
        id: 'insertShapeLine',
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
      },
      viewZoomIn: {
        id: 'viewZoomIn',
        enabled: true
      },
      viewZoomOut: {
        id: 'viewZoomOut',
        enabled: canZoomOut
      },
      viewZoomFitCanvas: {
        id: 'viewZoomFitCanvas',
        enabled: canCanvasZoom
      },
      viewZoomFitSelection: {
        id: 'viewZoomFitSelection',
        enabled: canSelectedZoom
      },
      viewZoomFitArtboard: {
        id: 'viewZoomFitArtboard',
        enabled: canArtboardZoom
      },
      viewCenterSelection: {
        id: 'viewCenterSelection',
        enabled: selected.length > 0
      },
      viewShowLayers: {
        id: 'viewShowLayers',
        checked: layersOpen,
        enabled: true
      },
      viewShowStyles: {
        id: 'viewShowStyles',
        checked: stylesOpen,
        enabled: true
      },
      viewShowEvents: {
        id: 'viewShowEvents',
        checked: eventsOpen,
        enabled: true
      },
      layerStyleFill: {
        id: 'layerStyleFill',
        checked: fillsEnabled,
        enabled: canToggleFill
      },
      layerStyleStroke: {
        id: 'layerStyleStroke',
        checked: strokesEnabled,
        enabled: canToggleStroke
      },
      layerStyleShadow: {
        id: 'layerStyleShadow',
        checked: shadowsEnabled,
        enabled: canToggleShadow
      },
      layerTransformFlipHorizontally: {
        id: 'layerTransformFlipHorizontally',
        checked: horizontalFlipEnabled,
        enabled: canToggleFlip
      },
      layerTransformFlipVertically: {
        id: 'layerTransformFlipVertically',
        checked: verticalFlipEnabled,
        enabled: canToggleFlip
      },
      layerMask: {
        id: 'layerMask',
        enabled: canMask
      },
      layerCombineUnion: {
        id: 'layerCombineUnion',
        enabled: canBooleanOperation
      },
      layerCombineDifference: {
        id: 'layerCombineDifference',
        enabled: canBooleanOperation
      },
      layerCombineSubtract: {
        id: 'layerCombineSubtract',
        enabled: canBooleanOperation
      },
      layerCombineIntersect: {
        id: 'layerCombineIntersect',
        enabled: canBooleanOperation
      }
    }
    Object.keys(menuItems).forEach((key: string) => {
      const menuItem = (menuItems as any)[key] as { id: string; enabled: boolean; checked?: boolean };
      const electronMenuItem = menu.getMenuItemById(key);
      electronMenuItem.enabled = menuItem.enabled;
      if (menuItem.checked !== null || menuItem.checked !== undefined) {
        electronMenuItem.checked = menuItem.checked;
      }
    });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selected, focusing]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  themeName: em.ThemeName;
  // selectedWithDescendents: {
  //   allIds: string[];
  //   byId: {
  //     [id: string]: em.Layer;
  //   };
  // };
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
  canArtboardZoom: boolean;
  canSelectedZoom: boolean;
  canCanvasZoom: boolean;
  layersOpen: boolean;
  stylesOpen: boolean;
  eventsOpen: boolean;
  canZoomOut: boolean;
  canSelectAll: boolean;
  canSelectAllArtboards: boolean;
  canToggleStroke: boolean;
  canToggleShadow: boolean;
  canToggleFill: boolean;
  canToggleFlip: boolean;
  canMask: boolean;
  canBooleanOperation: boolean;
  fillsEnabled: boolean;
  strokesEnabled: boolean;
  shadowsEnabled: boolean;
  horizontalFlipEnabled: boolean;
  verticalFlipEnabled: boolean;
  canPasteAsSVG: boolean;
} => {
  const { canvasSettings, layer, shapeTool, viewSettings, documentSettings } = state;
  const layersOpen = viewSettings.leftSidebar.isOpen;
  const stylesOpen = viewSettings.rightSidebar.isOpen;
  const eventsOpen = viewSettings.tweenDrawer.isOpen;
  const focusing = canvasSettings.focusing;
  const selected = layer.present.selected;
  const canPasteAsSVG = canPasteSVG();
  const canArtboardZoom = selected.length === 1 && layer.present.byId[selected[0]].type === 'Artboard';
  const canSelectedZoom = selected.length > 0;
  const canCanvasZoom = layer.present.allIds.length > 1;
  const canUndo = state.layer.past.length > 0;
  const canRedo = state.layer.future.length > 0;
  const canZoomOut = documentSettings.matrix[0] !== 0.01;
  const canSelectAll = layer.present.allIds.length > 1;
  const canSelectAllArtboards = layer.present.allArtboardIds.length > 0;
  const canMoveBackward = canSendBackwardSelection(layer.present);
  const canMoveForward = canBringForwardSelection(layer.present);
  const canGroup = canGroupSelection(layer.present);
  const canUngroup = canUngroupSelection(layer.present);
  const canToggleStroke = canToggleSelectionStroke(layer.present);
  const canToggleShadow = canToggleSelectionShadow(layer.present);
  const canToggleFill = canToggleSelectionFill(layer.present);
  const canToggleFlip = canTransformFlipSelection(layer.present);
  const fillsEnabled = canToggleFill ? selected.every((id) => layer.present.byId[id].style.fill.enabled) : false;
  const strokesEnabled = canToggleStroke ? selected.every((id) => layer.present.byId[id].style.stroke.enabled) : false;
  const shadowsEnabled = canToggleShadow ? selected.every((id) => layer.present.byId[id].style.shadow.enabled) : false;
  const horizontalFlipEnabled = canToggleFlip ? selected.every((id) => layer.present.byId[id].transform.horizontalFlip) : false;
  const verticalFlipEnabled = canToggleFlip ? selected.every((id) => layer.present.byId[id].transform.verticalFlip) : false;
  const canMask = canMaskSelection(layer.present);
  const canBooleanOperation = canBooleanOperationSelection(layer.present);
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
  // const selectedWithDescendents = selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
  //   const layerAndChildren = getLayerAndDescendants(state.layer.present, current);
  //   result.allIds = [...result.allIds, ...layerAndChildren];
  //   layerAndChildren.forEach((id) => {
  //     result.byId[id] = state.layer.present.byId[id];
  //   });
  //   return result;
  // }, { allIds: [], byId: {} });
  const themeName = viewSettings.theme;
  return { canPasteAsSVG, fillsEnabled, strokesEnabled, shadowsEnabled, horizontalFlipEnabled, verticalFlipEnabled, canToggleStroke, canToggleShadow, canToggleFill, canToggleFlip, canMask, canBooleanOperation, canSelectAll, canSelectAllArtboards, layersOpen, canZoomOut, stylesOpen, eventsOpen, canArtboardZoom, canSelectedZoom, canCanvasZoom, themeName, canUndo, canRedo, clipboardType, selected, focusing, canMoveBackward, canMoveForward, canGroup, canUngroup, activeTool, activeToolShapeType, scope };
};

export default connect(
  mapStateToProps,
  { copyStyleThunk, pasteStyleThunk, escapeLayerScopeThunk, pasteLayersThunk, copyLayersThunk, removeLayersThunk, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, resetCanvasSettingsThunk }
)(KeyBindings);