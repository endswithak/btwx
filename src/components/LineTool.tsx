import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { SetCanvasResizingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';

interface LineToolProps {
  resizing?: boolean;
  setCanvasResizing?(payload: SetCanvasResizingPayload): CanvasSettingsTypes;
}

const LineTool = (props: LineToolProps): ReactElement => {
  const { resizing, setCanvasResizing } = props;

  const handleMouseMove = () => {
    if (!resizing) {
      setCanvasResizing({resizing: true});
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
      if (resizing) {
        setCanvasResizing({resizing: false});
      }
    }
  });

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  resizing: boolean;
} => {
  const { canvasSettings } = state;
  const resizing = canvasSettings.resizing;
  return { resizing };
};

export default connect(
  mapStateToProps,
  { setCanvasResizing }
)(LineTool);