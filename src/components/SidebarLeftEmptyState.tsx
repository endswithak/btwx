import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { activateInsertKnob } from '../store/actions/insertKnob';
import { InsertKnobTypes } from '../store/actionTypes/insertKnob';
import { enableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { ToolState } from '../store/reducers/tool';
import SidebarEmptyState from './SidebarEmptyState';

interface SidebarLeftEmptyStateProps {
  isEmpty?: boolean;
  tool?: ToolState;
  insertKnobOpen?: boolean;
  emptyStateActionActive?: boolean;
  activateInsertKnob?(): InsertKnobTypes;
  enableSelectionTool?(): ToolTypes;
}

const SidebarLeftEmptyState = (props: SidebarLeftEmptyStateProps): ReactElement => {
  const { isEmpty, insertKnobOpen, tool, activateInsertKnob, enableSelectionTool } = props;

  const handleEmptyStateActionClick = () => {
    if (tool.type !== 'Selection') {
      enableSelectionTool();
    }
    activateInsertKnob();
  }

  const getEmptyStateIcon = () => {
    switch(tool.type) {
      case 'Shape':
        switch(tool.shapeToolType) {
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
    switch(tool.type) {
      case 'Shape':
        return tool.shapeToolType;
      case 'Text':
      case 'Artboard':
        return tool.type;
      default:
        return 'Layers';
    }
  }

  const getEmptyStateDetail = () => {
    // eslint-disable-next-line react/prop-types
    switch(tool.type) {
      case 'Shape':
        return 'Click and drag on canvas to draw layer.';
      case 'Artboard':
        return 'Click and drag on canvas to draw layer. Or select a preset in styles.';
      case 'Text':
        return 'Click on canvas to add text layer.';
      default:
        return 'View and edit document layers here.';
    }
  }

  const getEmptyStateActionText = () => {
    switch(tool.type) {
      case 'Shape':
        return `Adding ${tool.shapeToolType}...`;
      case 'Text':
      case 'Artboard':
        return `Adding ${tool.type}...`;
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
      actionActive={tool.type === 'Artboard' || tool.type === 'Shape' || tool.type === 'Text' || insertKnobOpen}
      actionDisabled={insertKnobOpen}
      actionClick={handleEmptyStateActionClick}
      style={{width: 211}} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { documentSettings, layer, tool, insertKnob } = state;
  const sidebarWidth = documentSettings.leftSidebarWidth;
  const isEmpty = layer.present.allIds.length <= 1;
  const insertKnobOpen = insertKnob.isActive;
  return { sidebarWidth, isEmpty, insertKnobOpen, tool };
};

export default connect(
  mapStateToProps,
  { activateInsertKnob, enableSelectionTool }
)(SidebarLeftEmptyState);