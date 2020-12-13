import React, { ReactElement } from 'react';
import { useSelector,  } from 'react-redux';
import { RootState } from '../store/reducers';
import EmptyState from './EmptyState';

const SidebarLeftEmptyState = (): ReactElement => {
  // const isEmpty = useSelector((state: RootState) => state.layer.present.allIds.length <= 1);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const shapeToolShapeType = useSelector((state: RootState) => state.shapeTool.shapeType);

  // const handleEmptyStateActionClick = () => {
  //   activateInsertKnob();
  // }

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
        return 'left-sidebar';
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

  // const getEmptyStateActionText = () => {
  //   switch(activeTool) {
  //     case 'Shape':
  //       return `Adding ${shapeToolShapeType}...`;
  //     case 'Text':
  //     case 'Artboard':
  //       return `Adding ${activeTool}...`;
  //     default:
  //       return 'Add Layer';
  //   }
  // }

  return (
    <EmptyState
      icon={getEmptyStateIcon()}
      text={getEmptyStateText()}
      detail={getEmptyStateDetail()}
      // action
      // actionText={getEmptyStateActionText()}
      // actionActive={activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text' || insertKnobOpen}
      // actionDisabled={insertKnobOpen}
      // actionClick={handleEmptyStateActionClick}
      style={{width: 211}} />
  );
}

export default SidebarLeftEmptyState;