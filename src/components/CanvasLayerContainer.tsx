/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';

export interface CanvasLayerContainerStateProps {
  layerItem: Btwx.Layer;
  parentItem: Btwx.Artboard | Btwx.Group;
  artboardItem: Btwx.Artboard;
  projectIndex: number;
  documentImage: Btwx.DocumentImage;
}

export interface CanvasLayerContainerProps extends CanvasLayerContainerStateProps {
  rendered: boolean;
  setRendered(rendered: boolean): void;
}

const CanvasLayerContainerWrap = (Component: any): (props: any) => ReactElement => {
  const CanvasLayerContainer = (props: any): ReactElement => {
    const [rendered, setRendered] = useState<boolean>(false);

    return (
      <Component
        {...props}
        rendered={rendered}
        setRendered={setRendered} />
    );
  }

  const mapStateToProps = (state: RootState, ownProps: any): CanvasLayerContainerStateProps => {
    const layerItem = state.layer.present.byId[ownProps.id];
    const parentItem = layerItem ? layerItem.type !== 'Artboard' ? state.layer.present.byId[layerItem.parent] as Btwx.Artboard | Btwx.Group : null : null;
    const artboardItem = layerItem ? layerItem.type !== 'Artboard' ? state.layer.present.byId[layerItem.artboard] as Btwx.Artboard : null : null;
    const projectIndex = layerItem ? layerItem.type !== 'Artboard' ? artboardItem.projectIndex : (layerItem as Btwx.Artboard).projectIndex : null;
    const documentImage = layerItem ? layerItem.type === 'Image' ? state.documentSettings.images.byId[(layerItem as Btwx.Image).imageId] : null : null;
    return {
      layerItem,
      parentItem,
      artboardItem,
      projectIndex,
      documentImage
    }
  }

  return connect(mapStateToProps)(CanvasLayerContainer);
}

export default CanvasLayerContainerWrap;