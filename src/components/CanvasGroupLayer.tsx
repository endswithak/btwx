import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerAbsPosition, getPaperParent } from '../store/utils/paper';
import CanvasLayerContainer, { CanvasLayerContainerProps } from './CanvasLayerContainer';
import { paperMain, paperPreview } from '../canvas';
import CanvasLayers from './CanvasLayers';

interface CanvasGroupLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
}

interface CanvasGroupLayerStateProps {
  projectIndex: number;
  layerFrame: Btwx.Frame;
  artboardFrame: Btwx.Frame;
  underlyingMaskIndex: number;
  masked: boolean;
  underlyingMask: string;
  name: string;
  layerIndex: number;
  scope: string[];
  parent: string;
  artboard: string;
  children: string[];
}

const CanvasGroupLayer = (props: CanvasLayerContainerProps & CanvasGroupLayerProps & CanvasGroupLayerStateProps): ReactElement => {
  const { id, paperScope, projectIndex, layerIndex, layerFrame, artboardFrame, children, artboard, rendered, parent, name, scope, masked, underlyingMask, underlyingMaskIndex, setRendered } = props;
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const paperProject = paperScope === 'main' ? paperMain.projects[projectIndex] : paperPreview.project;

  const createGroup = (): void => {
    const paperLayerIndex = masked ? (layerIndex - underlyingMaskIndex) + 1 : layerIndex;
    const paperParent = getPaperParent({
      paperScope,
      projectIndex,
      parent,
      isParentArtboard: parent === artboard,
      masked,
      underlyingMask
    });
    const group = new paperLayerScope.Group({
      name: name,
      data: { id: id, type: 'Layer', layerType: 'Group', scope: scope },
      position: getLayerAbsPosition(layerFrame, artboardFrame),
      insert: false
    });
    paperParent.insertChild(paperLayerIndex, group);
  }

  useEffect(() => {
    // build layer
    createGroup();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = paperProject.getItem({data: {id}});
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  return (
    <>
      {
        rendered && children.length > 0
        ? <CanvasLayers
            layers={children}
            paperScope={paperScope} />
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasGroupLayerProps): CanvasGroupLayerStateProps => {
  const layerItem = state.layer.present.byId[ownProps.id] as Btwx.Group;
  const name = layerItem ? layerItem.name : null;
  const masked = layerItem ? layerItem.masked : null;
  const parent = layerItem ? layerItem.parent : null;
  const artboard = layerItem ? layerItem.artboard : null;
  const artboardItem = layerItem ? state.layer.present.byId[artboard] as Btwx.Artboard : null;
  const projectIndex = artboardItem ? artboardItem.projectIndex : null;
  const parentItem = layerItem ? state.layer.present.byId[parent] : null;
  const layerIndex = layerItem ? parentItem.children.indexOf(ownProps.id) : null;
  const underlyingMask = layerItem ? (layerItem as Btwx.MaskableLayer).underlyingMask : null;
  const underlyingMaskIndex = underlyingMask ? parentItem.children.indexOf(underlyingMask) : null;
  const layerFrame = layerItem ? layerItem.frame : null;
  const artboardFrame = artboardItem ? artboardItem.frame : null;
  const scope = layerItem ? layerItem.scope : null;
  const children = layerItem ? layerItem.children : null;
  return {
    projectIndex,
    layerFrame,
    artboardFrame,
    layerIndex,
    underlyingMaskIndex,
    parent,
    name,
    masked,
    underlyingMask,
    artboard,
    scope,
    children
  }
}

export default connect(
  mapStateToProps
)(CanvasLayerContainer(CanvasGroupLayer));