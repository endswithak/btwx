import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { SetCanvasDrawingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';

interface ShapeToolProps {
  drawing?: boolean;
  setCanvasDrawing?(payload: SetCanvasDrawingPayload): CanvasSettingsTypes;
}

const ShapeTool = (props: ShapeToolProps): ReactElement => {
  const { drawing, setCanvasDrawing } = props;

  const handleMouseDown = () => {
    setCanvasDrawing({drawing: true});
  }

  const handleMouseUp = () => {
    setCanvasDrawing({drawing: false});
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas-container');
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    return () => {
      const tooltip = paperMain.project.getItem({ data: { id: 'Tooltip' } });
      const preview = paperMain.project.getItem({ data: { id: 'ShapeToolPreview' } });
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
      const canvas = document.getElementById('canvas-container');
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      if (tooltip) {
        tooltip.remove();
      }
      if (preview) {
        preview.remove();
      }
      if (guides.length > 0) {
        guides.forEach(guide => guide.remove());
      }
      if (measureGuides.length > 0) {
        measureGuides.forEach(measureGuide => measureGuide.remove());
      }
    }
  });

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  drawing: boolean;
} => {
  const { canvasSettings } = state;
  const drawing = canvasSettings.drawing;
  return { drawing };
};

export default connect(
  mapStateToProps,
  { setCanvasDrawing }
)(ShapeTool);