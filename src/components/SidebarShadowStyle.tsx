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
import { EnableLayerShadowPayload, DisableLayerShadowPayload, SetLayerShadowColorPayload, SetLayerShadowBlurPayload, SetLayerShadowXOffsetPayload, SetLayerShadowYOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerShadow, disableLayerShadow, setLayerShadowColor, setLayerShadowBlur, setLayerShadowXOffset, setLayerShadowYOffset } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface SidebarShadowStyleProps {
  shadow?: {
    enabled: boolean;
    color: string;
    blur: number;
    offset: {
      x: number;
      y: number;
    };
  };
  shadowOpacity?: number;
  selected: string[];
  enableLayerShadow?(payload: EnableLayerShadowPayload): LayerTypes;
  disableLayerShadow?(payload: DisableLayerShadowPayload): LayerTypes;
  setLayerShadowColor?(payload: SetLayerShadowColorPayload): LayerTypes;
  setLayerShadowBlur?(payload: SetLayerShadowBlurPayload): LayerTypes;
  setLayerShadowXOffset?(payload: SetLayerShadowXOffsetPayload): LayerTypes;
  setLayerShadowYOffset?(payload: SetLayerShadowYOffsetPayload): LayerTypes;
}

const SidebarShadowStyle = (props: SidebarShadowStyleProps): ReactElement => {
  const { shadow, shadowOpacity, selected, enableLayerShadow, disableLayerShadow, setLayerShadowColor, setLayerShadowBlur, setLayerShadowXOffset, setLayerShadowYOffset } = props;
  const [enabled, setEnabled] = useState<boolean>(shadow.enabled);
  const [color, setColor] = useState<string>(shadow.color);
  const [opacity, setOpacity] = useState<number | string>(shadowOpacity);
  const [blur, setBlur] = useState<number | string>(shadow.blur);
  const [x, setX] = useState<number | string>(shadow.offset.x);
  const [y, setY] = useState<number | string>(shadow.offset.y);

  useEffect(() => {
    setEnabled(shadow.enabled);
    setColor(chroma(shadow.color).alpha(1).hex());
    setOpacity(shadowOpacity);
    setBlur(shadow.blur);
    setX(shadow.offset.x);
    setY(shadow.offset.y);
  }, [shadow, selected]);

  const handleCheckChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const paperLayer = getPaperLayer(selected[0]);
    if (target.checked) {
      enableLayerShadow({id: selected[0]});
      paperLayer.shadowColor = new paper.Color(shadow.color);
      paperLayer.shadowBlur = shadow.blur;
      paperLayer.shadowOffset = new paper.Point(shadow.offset.x, shadow.offset.y);
    } else {
      disableLayerShadow({id: selected[0]});
      paperLayer.shadowColor = null;
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

  const handleYChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setY(target.value);
  };

  const handleXChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setX(target.value);
  };

  const handleBlurChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setBlur(target.value);
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
    setLayerShadowColor({id: selected[0], shadowColor: newColor});
    setColor(chroma(newColor).alpha(1).hex());
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(color)) {
      const paperLayer = getPaperLayer(selected[0]);
      paperLayer.strokeColor = new paper.Color(color);
      setLayerShadowColor({id: selected[0], shadowColor: chroma(color).hex()});
      setColor(chroma(color).alpha(1).hex());
    } else {
      setColor(chroma(shadow.color).alpha(1).hex());
    }
  };

  const handleXSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.shadowOffset = new paper.Point(evaluate(`${x}`), y);
    setLayerShadowXOffset({id: selected[0], shadowXOffset: evaluate(`${x}`)});
    setX(evaluate(`${x}`));
  };

  const handleYSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.shadowOffset = new paper.Point(x, evaluate(`${y}`));
    setLayerShadowYOffset({id: selected[0], shadowYOffset: evaluate(`${y}`)});
    setY(evaluate(`${y}`));
  };

  const handleBlurSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.shadowBlur = evaluate(`${blur}`);
    setLayerShadowBlur({id: selected[0], shadowBlur: evaluate(`${blur}`)});
    setBlur(evaluate(`${blur}`));
  };

  return (
    <div
      className='c-sidebar-layer'>
      <SidebarSectionRow alignItems='center'>
        <SidebarSectionColumn width={'10%'} justifyContent={'center'}>
          <SidebarCheckbox
            id={`shadowColor`}
            onChange={handleCheckChange}
            checked={enabled} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'23%'}>
          <SidebarSwatch
            color={shadow.color} />
        </SidebarSectionColumn>
        {/* <SidebarSectionColumn width={'47%'}>
          <SidebarInput
            value={color}
            onChange={handleColorChange}
            onSubmit={handleColorSubmit}
            blurOnSubmit
            disabled={selected.length > 1 || selected.length === 0 || !enabled} />
        </SidebarSectionColumn> */}
        <SidebarSectionColumn width={'22%'}>
          <SidebarInput
            value={x}
            onChange={handleXChange}
            onSubmit={handleXSubmit}
            blurOnSubmit
            label={'X'}
            disabled={selected.length > 1 || selected.length === 0 || !enabled} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'22%'}>
          <SidebarInput
            value={y}
            onChange={handleYChange}
            onSubmit={handleYSubmit}
            blurOnSubmit
            label={'Y'}
            disabled={selected.length > 1 || selected.length === 0 || !enabled} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'22%'}>
          <SidebarInput
            value={blur}
            onChange={handleBlurChange}
            onSubmit={handleBlurSubmit}
            blurOnSubmit
            label={'B'}
            disabled={selected.length > 1 || selected.length === 0 || !enabled} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const shadow = layer.present.byId[layer.present.selected[0]].style.shadow;
  const shadowOpacity = chroma(shadow.color).alpha() * 100;
  return { selected, shadow, shadowOpacity };
};

export default connect(
  mapStateToProps,
  { enableLayerShadow, disableLayerShadow, setLayerShadowColor, setLayerShadowBlur, setLayerShadowXOffset, setLayerShadowYOffset }
)(SidebarShadowStyle);