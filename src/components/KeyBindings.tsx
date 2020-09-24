import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { UngroupLayersPayload, SendLayersBackwardPayload, SendLayersForwardPayload, SendLayersToBackPayload, GroupLayersPayload, SendLayersToFrontPayload, LayerTypes } from '../store/actionTypes/layer';
import { pasteLayersThunk, copyLayersThunk, removeLayersThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, escapeLayerScopeThunk } from '../store/actions/layer';
import { resetCanvasSettingsThunk } from '../store/actions/canvasSettings';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

interface KeyBindingsProps {
  selected?: string[];
  focusing?: boolean;
  canMoveBackward?: boolean;
  canMoveForward?: boolean;
  canGroup?: boolean;
  canUngroup?: boolean;
  copyLayersThunk?(): void;
  pasteLayersThunk?({overSelection, overPoint, overLayer}: { overSelection?: boolean; overPoint?: em.Point; overLayer?: string }): Promise<any>;
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
  resetCanvasSettingsThunk?(): void;
  escapeLayerScopeThunk?(): void;
}

const KeyBindings = (props: KeyBindingsProps): ReactElement => {
  const { escapeLayerScopeThunk, selected, focusing, canMoveBackward, canMoveForward, canGroup, canUngroup, copyLayersThunk, pasteLayersThunk, removeLayersThunk, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, resetCanvasSettingsThunk } = props;

  const handleKeyDown = (e: any) => {
    if (focusing) {
      switch(e.key) {
        case 'a': {
          toggleArtboardToolThunk();
          break;
        }
        case 'Backspace': {
          removeLayersThunk();
          break;
        }
        case 'c': {
          if (e.metaKey) {
            copyLayersThunk();
          }
          break;
        }
        case 'Escape': {
          escapeLayerScopeThunk();
          break;
        }
        case 'g': {
          if (e.metaKey) {
            if (e.shiftKey) {
              if (canUngroup) {
                ungroupLayers({layers: selected});
              }
            } else {
              if (canGroup) {
                groupLayersThunk({layers: selected});
              }
            }
          }
          break;
        }
        case 'l': {
          toggleShapeToolThunk('Line');
          break;
        }
        case 'o': {
          toggleShapeToolThunk('Ellipse');
          break;
        }
        case 'r': {
          if (!e.metaKey) {
            toggleShapeToolThunk('Rectangle');
          }
          break;
        }
        case 't': {
          toggleTextToolThunk();
          break;
        }
        case 'u': {
          toggleShapeToolThunk('Rounded');
          break;
        }
        case 'v': {
          if (e.metaKey) {
            pasteLayersThunk({overSelection: e.shiftKey}) as any
          }
          break;
        }
        case 'z': {
          if (e.metaKey) {
            if (e.shiftKey) {
              redoThunk();
            } else {
              undoThunk();
            }
          }
          break;
        }
        case '[': {
          if (e.metaKey && canMoveBackward) {
            if (e.shiftKey) {
              sendLayersToBack({layers: selected});
            } else {
              sendLayersBackward({layers: selected});
            }
          }
          break;
        }
        case ']': {
          if (e.metaKey && canMoveForward) {
            if (e.shiftKey) {
              sendLayersToFront({layers: selected});
            } else {
              sendLayersForward({layers: selected});
            }
          }
          break;
        }
      }
    } else {
      switch(e.key) {
        case 'r': {
          if (e.metaKey) {
            resetCanvasSettingsThunk();
          }
          break;
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  focusing: boolean;
  canMoveBackward: boolean;
  canMoveForward: boolean;
  canGroup: boolean;
  canUngroup: boolean;
} => {
  const { canvasSettings, layer } = state;
  const focusing = canvasSettings.focusing;
  const selected = layer.present.selected;
  const emptySelection = selected.length === 0;
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
  return { selected, focusing, canMoveBackward, canMoveForward, canGroup, canUngroup };
};

export default connect(
  mapStateToProps,
  { escapeLayerScopeThunk, pasteLayersThunk, copyLayersThunk, removeLayersThunk, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk, redoThunk, undoThunk, ungroupLayers, groupLayersThunk, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack, resetCanvasSettingsThunk }
)(KeyBindings);