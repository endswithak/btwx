import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import CanvasPreviewLayerEvent from './CanvasPreviewLayerEvent';

interface CanvasPreviewLayerProps {
  id: string;
  rendered: boolean;
}

interface CanvasPreviewLayerStateProps {
  events: string[];
}

const CanvasPreviewLayer = (props: CanvasPreviewLayerProps & CanvasPreviewLayerStateProps): ReactElement => {
  const { id, rendered, events } = props;

  return (
    <>
      {
        events.map((eventId, index) => (
          <CanvasPreviewLayerEvent
            key={eventId}
            id={id}
            eventId={eventId}
            rendered={rendered} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasPreviewLayerProps): CanvasPreviewLayerStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id];
  const events = layerItem ? layerItem.events : null;
  return {
    events
  }
}

export default connect(
  mapStateToProps
)(CanvasPreviewLayer);