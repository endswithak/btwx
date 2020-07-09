import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import { insertLayerAbove, insertLayerBelow, addLayerChild } from '../store/actions/layer';
import { InsertLayerAbovePayload, InsertLayerBelowPayload, AddLayerChildPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';
import SidebarLayer from './SidebarLayer';
import { getLayerScope } from '../store/selectors/layer';
import { LayerState } from '../store/reducers/layer';

interface SidebarLayerTreeProps {
  page: em.Group;
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const [dragLayer, setDragLayer] = useState<string>(null);
  const { page } = props;

  return (
    <div>
      {
        dragLayer
        ? <SidebarDropzone
            layer={page}
            depth={0}
            dragLayer={dragLayer}
            setDragLayer={setDragLayer} />
        : null
      }
      {
        page.children.map((layer: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={layer}
            dragLayer={dragLayer}
            setDragLayer={setDragLayer}
            depth={0} />
        ))
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return {
    page: layer.present.byId[layer.present.page]
  };
};

export default connect(
  mapStateToProps
)(SidebarLayerTree);