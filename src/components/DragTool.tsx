import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { SetCanvasDraggingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';

interface DragToolProps {
  dragging?: boolean;
  setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
}

const DragTool = (props: DragToolProps): ReactElement => {
  const { dragging, setCanvasDragging } = props;

  const handleMouseMove = () => {
    if (!dragging) {
      setCanvasDragging({dragging: true});
    }
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas-container');
    canvas.addEventListener('mousemove', handleMouseMove);
    return (): void => {
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
      const canvas = document.getElementById('canvas-container');
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (guides.length > 0) {
        guides.forEach(guide => guide.remove());
      }
      if (measureGuides.length > 0) {
        measureGuides.forEach(measureGuide => measureGuide.remove());
      }
      if (dragging) {
        setCanvasDragging({dragging: false});
      }
    }
  });

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  dragging: boolean;
} => {
  const { canvasSettings } = state;
  const dragging = canvasSettings.dragging;
  return { dragging };
};

export default connect(
  mapStateToProps,
  { setCanvasDragging }
)(DragTool);