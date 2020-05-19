import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { MoveLayerToPayload, LayerTypes } from '../store/actionTypes/layer';
import { moveLayerTo } from '../store/actions/layer';
import { ToolTypes } from '../store/actionTypes/tool';
import { enableSelectionTool, disableSelectionTool } from '../store/actions/tool';
import { getPaperLayer } from '../store/selectors/layer';

interface XInputProps {
  selected?: string[];
  xValue?: number | string;
  moveLayerTo?(payload: MoveLayerToPayload): LayerTypes;
  enableSelectionTool?(): ToolTypes;
  disableSelectionTool?(): ToolTypes;
}

const XInput = (props: XInputProps): ReactElement => {
  const { selected, moveLayerTo, enableSelectionTool, disableSelectionTool, xValue } = props;
  const [x, setX] = useState<string | number>(props.xValue);

  // const getX = () => {
  //   switch(selected.allIds.length) {
  //     case 0:
  //       return '';
  //     case 1:
  //       return Math.round(getPaperLayer(selected.allIds[0]).position.x);
  //     default:
  //       return 'multi';
  //   }
  // }

  useEffect(() => {
    setX(xValue);
  }, [xValue]);

  const handleFocus = () => {
    disableSelectionTool();
  };

  const handleBlur = () => {
    enableSelectionTool();
  };

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setX(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.position.x = evaluate(`${x}`);
    moveLayerTo({id: selected[0], x: evaluate(`${x}`), y: paperLayer.position.y});
  }

  return (
    <SidebarInput
      value={x}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      label={'X'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const xValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].frame.x);
      default:
        return 'multi';
    }
  })();
  return { selected, xValue };
};

export default connect(
  mapStateToProps,
  { moveLayerTo, enableSelectionTool, disableSelectionTool }
)(XInput);