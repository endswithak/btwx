import paper from 'paper';
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import chroma from 'chroma-js';
import SidebarInput from './SidebarInput';
import SidebarCheckbox from './SidebarCheckbox';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import { RootState } from '../store/reducers';
import { EnableLayerStrokePayload, DisableLayerStrokePayload, SetLayerStrokeColorPayload, SetLayerStrokeWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerStroke, disableLayerStroke, setLayerStrokeColor, setLayerStrokeWidth } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface SidebarStrokeStyleProps {
  stroke?: {
    enabled: boolean;
    color: string;
    width: number;
  };
  strokeOpacity?: number;
  selected: string[];
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  disableLayerStroke?(payload: DisableLayerStrokePayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerStrokeWidth?(payload: SetLayerStrokeWidthPayload): LayerTypes;
}

const SidebarStrokeStyle = (props: SidebarStrokeStyleProps): ReactElement => {
  const { stroke, strokeOpacity, selected, enableLayerStroke, disableLayerStroke, setLayerStrokeColor, setLayerStrokeWidth } = props;
  const [enabled, setEnabled] = useState<boolean>(stroke.enabled);
  const [color, setColor] = useState<string>(stroke.color);
  const [opacity, setOpacity] = useState<number | string>(strokeOpacity);
  const [width, setWidth] = useState<number | string>(stroke.width);

  useEffect(() => {
    setEnabled(stroke.enabled);
    setColor(chroma(stroke.color).alpha(1).hex());
    setOpacity(strokeOpacity);
    setWidth(stroke.width);
  }, [stroke, selected]);

  const handleCheckChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const paperLayer = getPaperLayer(selected[0]);
    if (target.checked) {
      enableLayerStroke({id: selected[0]});
      paperLayer.strokeColor = new paper.Color(stroke.color);
    } else {
      disableLayerStroke({id: selected[0]});
      paperLayer.strokeColor = null;
    }
  };

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleColorChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setColor(target.value);
  };

  const handleWidthChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setWidth(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const paperLayer = getPaperLayer(selected[0]);
    let nextOpacity = evaluate(`${opacity}`);
    if (nextOpacity > 100) {
      nextOpacity = 100;
    }
    if (nextOpacity < 0) {
      nextOpacity = 0;
    }
    const newColor = chroma(color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
    paperLayer.strokeColor = new paper.Color(newColor);
    setLayerStrokeColor({id: selected[0], strokeColor: newColor});
    setColor(chroma(newColor).alpha(1).hex());
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(color)) {
      const paperLayer = getPaperLayer(selected[0]);
      paperLayer.strokeColor = new paper.Color(color);
      setLayerStrokeColor({id: selected[0], strokeColor: chroma(color).hex()});
      setColor(chroma(color).alpha(1).hex());
    } else {
      setColor(chroma(stroke.color).alpha(1).hex());
    }
  };

  const handleWidthSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.strokeWidth = evaluate(`${width}`);
    setLayerStrokeWidth({id: selected[0], strokeWidth: evaluate(`${width}`)});
    setWidth(evaluate(`${width}`));
  };

  return (
    <div
      className='c-sidebar-layer'>
      <SidebarSectionRow alignItems='center'>
        <SidebarSectionColumn width={'10%'} justifyContent={'center'}>
          <SidebarCheckbox
            id={`strokeColor`}
            onChange={handleCheckChange}
            checked={enabled} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'23%'}>
          <SidebarSwatch
            color={stroke.color} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'47%'}>
          <SidebarInput
            value={color}
            onChange={handleColorChange}
            onSubmit={handleColorSubmit}
            blurOnSubmit
            disabled={selected.length > 1 || selected.length === 0 || !enabled} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'20%'}>
          <SidebarInput
            value={width}
            onChange={handleWidthChange}
            onSubmit={handleWidthSubmit}
            blurOnSubmit
            label={'W'}
            disabled={selected.length > 1 || selected.length === 0 || !enabled} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const stroke = layer.present.byId[layer.present.selected[0]].style.stroke;
  const strokeOpacity = chroma(stroke.color).alpha() * 100;
  return { selected, stroke, strokeOpacity };
};

export default connect(
  mapStateToProps,
  { enableLayerStroke, disableLayerStroke, setLayerStrokeColor, setLayerStrokeWidth }
)(SidebarStrokeStyle);