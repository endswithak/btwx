import React, { useContext, ReactElement, useEffect } from 'react';
import { updateGradientFrame } from '../store/actions/layer';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';

interface GradientFrameProps {
  layer: string;
  gradient: Btwx.Gradient;
  onStopPress(index: number): void;
  zoom?: number;
  layerItem?: Btwx.Layer;
}

const GradientFrame = (props: GradientFrameProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, gradient, onStopPress, zoom, layerItem } = props;

  const handleWheel = (e: WheelEvent): void => {
    if (e.ctrlKey) {
      const oldGradientFrame = paperMain.project.getItem({ data: { id: 'GradientFrame' } });
      if (oldGradientFrame) {
        oldGradientFrame.remove();
      }
    }
  }

  useEffect(() => {
    updateGradientFrame(layerItem, gradient);
    document.getElementById('canvas').addEventListener('wheel', handleWheel);
    return () => {
      const oldGradientFrame = paperMain.project.getItem({ data: { id: 'GradientFrame' } });
      document.getElementById('canvas').removeEventListener('wheel', handleWheel);
      if (oldGradientFrame) {
        oldGradientFrame.remove();
      }
    }
  }, [gradient, layer, zoom]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: GradientFrameProps): {
  zoom: number;
  layerItem: Btwx.Layer;
} => {
  const { documentSettings, layer } = state;
  const zoom = documentSettings.matrix[0];
  const layerItem = layer.present.byId[ownProps.layer]
  return { zoom, layerItem };
};

export default connect(
  mapStateToProps
)(GradientFrame);