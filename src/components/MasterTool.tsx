// import { remote } from 'electron';
import React, { useRef, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import PaperMasterTool from '../canvas/tool';

interface MasterToolProps {
  rootState: RootState;
}

let masterPaperTool: PaperMasterTool = null;

const MasterTool = (props: MasterToolProps): ReactElement => {
  const { rootState } = props;

  useEffect(() => {
    if (masterPaperTool) {
      masterPaperTool.state = rootState;
      masterPaperTool.type = rootState.canvasSettings.activeTool;
      masterPaperTool.shapeTool.shapeType = rootState.shapeTool.shapeType;
      masterPaperTool.areaSelectTool.state = rootState;
      masterPaperTool.dragTool.state = rootState;
      masterPaperTool.resizeTool.state = rootState;
      masterPaperTool.artboardTool.state = rootState;
      masterPaperTool.textTool.state = rootState;
      masterPaperTool.gradientTool.state = rootState;
      masterPaperTool.lineTool.state = rootState;
    }
  });

  useEffect(() => {
    masterPaperTool = new PaperMasterTool();
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  rootState: RootState;
} => {
  return {
    rootState: state
  };
};

export default connect(
  mapStateToProps
)(MasterTool);