import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { SetCanvasDrawingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';

interface ArtboardToolProps {
  drawing?: boolean;
  setCanvasDrawing?(payload: SetCanvasDrawingPayload): CanvasSettingsTypes;
}

const ArtboardTool = (props: ArtboardToolProps): ReactElement => {
  const { drawing, setCanvasDrawing } = props;

  const handleMouseDown = () => {
    setCanvasDrawing({drawing: true});
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas-container');
    canvas.addEventListener('mousedown', handleMouseDown);
    return () => {
      const tooltip = paperMain.project.getItem({ data: { id: 'Tooltip' } });
      const preview = paperMain.project.getItem({ data: { id: 'ArtboardToolPreview' } });
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
      const canvas = document.getElementById('canvas-container');
      canvas.removeEventListener('mousedown', handleMouseDown);
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
      if (drawing) {
        setCanvasDrawing({drawing: false});
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
)(ArtboardTool);