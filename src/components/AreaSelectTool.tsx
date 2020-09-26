import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasSelecting } from '../store/actions/canvasSettings';
import { SetCanvasSelectingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';

interface AreaSelectToolProps {
  selecting?: boolean;
  setCanvasSelecting?(payload: SetCanvasSelectingPayload): CanvasSettingsTypes;
}

const AreaSelectTool = (props: AreaSelectToolProps): ReactElement => {
  const { selecting, setCanvasSelecting } = props;

  const handleMouseMove = () => {
    if (!selecting) {
      setCanvasSelecting({selecting: true});
    }
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas-container');
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
      const tooltip = paperMain.project.getItem({ data: { id: 'Tooltip' } });
      const preview = paperMain.project.getItem({ data: { id: 'AreaSelectToolPreview' } });
      const guides = paperMain.project.getItems({data: { id: 'Guide' }});
      const measureGuides = paperMain.project.getItems({data: { id: 'MeasureGuide' }});
      const canvas = document.getElementById('canvas-container');
      canvas.removeEventListener('mousemove', handleMouseMove);
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
      if (selecting) {
        setCanvasSelecting({selecting: false});
      }
    }
  });

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  selecting: boolean;
} => {
  const { canvasSettings } = state;
  const selecting = canvasSettings.selecting;
  return { selecting };
};

export default connect(
  mapStateToProps,
  { setCanvasSelecting }
)(AreaSelectTool);