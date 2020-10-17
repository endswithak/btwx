import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { escapeLayerScopeThunk } from '../store/actions/layer';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

interface KeyBindingsProps {
  activeTool?: em.ToolType;
  focusing?: boolean;
  scope?: string[];
  activeToolShapeType?: em.ShapeType;
  toggleArtboardToolThunk?(): void;
  toggleTextToolThunk?(): void;
  toggleShapeToolThunk?(shapeType: em.ShapeType): void;
  escapeLayerScopeThunk?(): void;
}

const KeyBindings = (props: KeyBindingsProps): ReactElement => {
  const { activeToolShapeType, scope, activeTool, escapeLayerScopeThunk, focusing, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk } = props;

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
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeTool, focusing, scope, activeToolShapeType]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  activeTool: em.ToolType;
  activeToolShapeType: em.ShapeType;
  focusing: boolean;
  scope: string[];
} => {
  const { canvasSettings, layer, shapeTool } = state;
  const activeTool = canvasSettings.activeTool;
  const scope = layer.present.scope;
  const focusing = canvasSettings.focusing;
  const activeToolShapeType = shapeTool.shapeType;
  return { activeTool, scope, focusing, activeToolShapeType };
};

export default connect(
  mapStateToProps,
  { escapeLayerScopeThunk, toggleArtboardToolThunk, toggleTextToolThunk, toggleShapeToolThunk }
)(KeyBindings);