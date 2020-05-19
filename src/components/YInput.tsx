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

interface YInputProps {
  selected?: string[];
  yValue?: number | string;
  moveLayerTo?(payload: MoveLayerToPayload): LayerTypes;
  enableSelectionTool?(): ToolTypes;
  disableSelectionTool?(): ToolTypes;
}

const YInput = (props: YInputProps): ReactElement => {
  const { selected, moveLayerTo, enableSelectionTool, disableSelectionTool, yValue } = props;
  const [y, setY] = useState<string | number>(props.yValue);

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
    setY(yValue);
  }, [yValue]);

  const handleFocus = () => {
    disableSelectionTool();
  };

  const handleBlur = () => {
    enableSelectionTool();
  };

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setY(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.position.y = evaluate(`${y}`);
    moveLayerTo({id: selected[0], x: paperLayer.position.x, y: evaluate(`${y}`)});
  }

  return (
    <SidebarInput
      value={y}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      label={'Y'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const yValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].frame.y);
      default:
        return 'multi';
    }
  })();
  return { selected, yValue };
};

export default connect(
  mapStateToProps,
  { moveLayerTo, enableSelectionTool, disableSelectionTool }
)(YInput);