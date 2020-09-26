import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { activateInsertKnob } from '../store/actions/insertKnob';
import { InsertKnobTypes } from '../store/actionTypes/insertKnob';
import SidebarEmptyState from './SidebarEmptyState';

interface SidebarLeftEmptyStateProps {
  activeTool?: em.ToolType;
  shapeToolShapeType?: em.ShapeType;
  isEmpty?: boolean;
  insertKnobOpen?: boolean;
  emptyStateActionActive?: boolean;
  activateInsertKnob?(): InsertKnobTypes;
}

const SidebarLeftEmptyState = (props: SidebarLeftEmptyStateProps): ReactElement => {
  const { isEmpty, activeTool, shapeToolShapeType, insertKnobOpen, activateInsertKnob } = props;

  const handleEmptyStateActionClick = () => {
    activateInsertKnob();
  }

  const getEmptyStateIcon = () => {
    switch(activeTool) {
      case 'Shape':
        switch(shapeToolShapeType) {
          case 'Rectangle':
            return 'rectangle';
          case 'Rounded':
            return 'rounded';
          case 'Ellipse':
            return 'ellipse';
          case 'Star':
            return 'star';
          case 'Polygon':
            return 'polygon';
          case 'Line':
            return 'line';
        }
        break;
      case 'Text':
        return 'text';
      case 'Artboard':
        return 'artboard';
      default:
        return 'insert';
    }
  }

  const getEmptyStateText = () => {
    switch(activeTool) {
      case 'Shape':
        return shapeToolShapeType;
      case 'Text':
      case 'Artboard':
        return activeTool;
      default:
        return 'Layers';
    }
  }

  const getEmptyStateDetail = () => {
    // eslint-disable-next-line react/prop-types
    switch(activeTool) {
      case 'Shape':
        return 'Click and drag on canvas to draw layer.';
      case 'Artboard':
        return 'Click and drag on canvas to draw layer. Or select a preset in styles.';
      case 'Text':
        return 'Click on canvas to add text layer.';
      default:
        return null;
    }
  }

  const getEmptyStateActionText = () => {
    switch(activeTool) {
      case 'Shape':
        return `Adding ${shapeToolShapeType}...`;
      case 'Text':
      case 'Artboard':
        return `Adding ${activeTool}...`;
      default:
        return 'Add Layer';
    }
  }

  return (
    <SidebarEmptyState
      icon={getEmptyStateIcon()}
      text={getEmptyStateText()}
      detail={getEmptyStateDetail()}
      action
      actionText={getEmptyStateActionText()}
      actionActive={activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text' || insertKnobOpen}
      actionDisabled={insertKnobOpen}
      actionClick={handleEmptyStateActionClick}
      style={{width: 211}} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { documentSettings, layer, insertKnob, canvasSettings, shapeTool } = state;
  const sidebarWidth = documentSettings.leftSidebarWidth;
  const isEmpty = layer.present.allIds.length <= 1;
  const insertKnobOpen = insertKnob.isActive;
  const activeTool = canvasSettings.activeTool;
  const shapeToolShapeType = shapeTool.shapeType;
  return { sidebarWidth, isEmpty, insertKnobOpen, activeTool, shapeToolShapeType };
};

export default connect(
  mapStateToProps,
  { activateInsertKnob }
)(SidebarLeftEmptyState);