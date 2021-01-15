import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import CanvasArtboardLayer from './CanvasArtboardLayer';
import CanvasShapeLayer from './CanvasShapeLayer';
import CanvasTextLayer from './CanvasTextLayer';

interface CanvasLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

interface CanvasLayerStateProps {
  type: Btwx.LayerType;
}

const CanvasLayer = (props: CanvasLayerProps & CanvasLayerStateProps): ReactElement => (
  <>
    {
      ((): ReactElement => {
        switch(props.type) {
          case 'Artboard':
            return (
              <CanvasArtboardLayer
                {...props} />
            );
          case 'Shape':
            return (
              <CanvasShapeLayer
                {...props} />
            );
          case 'Text':
            return (
              <CanvasTextLayer
                {...props} />
            );
        }
      })()
    }
  </>
);

// useSelector makes this super laggy
const mapStateToProps = (state: RootState, ownProps: CanvasLayerProps): CanvasLayerStateProps => {
  const type = state.layer.present.byId[ownProps.id].type;
  return { type }
}

export default connect(
  mapStateToProps
)(CanvasLayer);