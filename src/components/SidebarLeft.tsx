import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { activateInsertKnob } from '../store/actions/insertKnob';
import { InsertKnobTypes } from '../store/actionTypes/insertKnob';
import { enableSelectionTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { ToolState } from '../store/reducers/tool';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';
import SidebarEmptyState from './SidebarEmptyState';

interface SidebarLeftProps {
  sidebarWidth: number;
  ready: boolean;
  isEmpty?: boolean;
  tool?: ToolState;
  insertKnobOpen?: boolean;
  emptyStateActionActive?: boolean;
  activateInsertKnob?(): InsertKnobTypes;
  enableSelectionTool?(): ToolTypes;
}

const SidebarLeft = (props: SidebarLeftProps): ReactElement => {
  const { sidebarWidth, ready, isEmpty, insertKnobOpen, tool, activateInsertKnob, enableSelectionTool } = props;

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
        return <span>Click and drag on canvas<br/> to draw layer.</span>;
      case 'Artboard':
        return <span>Click and drag on canvas<br/> to draw layer. Or select a<br/> preset in styles.</span>;
      case 'Text':
        return <span>Click on canvas to add<br/> text layer.</span>;
      default:
        return <span>View and edit document<br/> layers here.</span>;
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
    <>
      <SidebarLeftDragHandle />
      <Sidebar
        width={sidebarWidth}
        position='left'>
        {
          ready && !isEmpty
          ? <SidebarLayerTree />
          : <SidebarEmptyState
              icon={getEmptyStateIcon()}
              text={getEmptyStateText()}
              detail={getEmptyStateDetail()}
              action
              actionText={getEmptyStateActionText()}
              actionActive={tool.type === 'Artboard' || tool.type === 'Shape' || tool.type === 'Text' || insertKnobOpen}
              actionDisabled={insertKnobOpen}
              actionClick={handleEmptyStateActionClick} />
        }
      </Sidebar>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { canvasSettings, layer, tool, insertKnob } = state;
  const sidebarWidth = canvasSettings.leftSidebarWidth;
  const isEmpty = layer.present.allIds.length <= 1;
  const insertKnobOpen = insertKnob.isActive;
  return { sidebarWidth, isEmpty, insertKnobOpen, tool };
};

export default connect(
  mapStateToProps,
  { activateInsertKnob, enableSelectionTool }
)(SidebarLeft);