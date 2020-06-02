import paper from 'paper';
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import chroma from 'chroma-js';
// import SidebarInput from './SidebarInput';
// import SidebarCheckbox from './SidebarCheckbox';
// import SidebarSectionRow from './SidebarSectionRow';
// import SidebarSectionColumn from './SidebarSectionColumn';
// import SidebarSwatch from './SidebarSwatch';
import { RootState } from '../store/reducers';
import { EnableLayerFillPayload, DisableLayerFillPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, disableLayerFill, setLayerFillColor } from '../store/actions/layer';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import { getPaperLayer } from '../store/selectors/layer';
import ColorInput from './ColorInput';

interface SidebarFillStyleProps {
  fill?: em.Fill;
  fillOpacity?: number;
  selected: string[];
  selectedType?: em.LayerType;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  disableLayerFill?(payload: DisableLayerFillPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const SidebarFillStyle = (props: SidebarFillStyleProps): ReactElement => {
  const { fill, fillOpacity, selected, selectedType, enableLayerFill, disableLayerFill, setLayerFillColor, setTextSettingsFillColor } = props;
  const [enabled, setEnabled] = useState<boolean>(fill.enabled);
  const [color, setColor] = useState<string>(chroma(fill.color).alpha(1).hex());
  const [opacity, setOpacity] = useState<number | string>(fillOpacity);
  const [swatchColor, setSwatchColor] = useState<string>(fill.color);

  useEffect(() => {
    setEnabled(fill.enabled);
    setColor(chroma(fill.color).alpha(1).hex());
    setOpacity(fillOpacity);
    setSwatchColor(fill.color);
  }, [fill, selected]);

  // const handleCheckChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
  //   const target = e.target as HTMLInputElement;
  //   const paperLayer = getPaperLayer(selected[0]);
  //   if (target.checked) {
  //     enableLayerFill({id: selected[0]});
  //     paperLayer.fillColor = new paper.Color(fill.color);
  //   } else {
  //     disableLayerFill({id: selected[0]});
  //     paperLayer.fillColor = null;
  //   }
  // };

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleColorChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setColor(target.value);
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
    paperLayer.fillColor = new paper.Color(newColor);
    setLayerFillColor({id: selected[0], fillColor: newColor});
    setColor(chroma(newColor).alpha(1).hex());
    setSwatchColor(newColor);
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(color)) {
      const paperLayer = getPaperLayer(selected[0]);
      paperLayer.fillColor = new paper.Color(color);
      if (selectedType === 'Text') {
        setTextSettingsFillColor({fillColor: chroma(color).hex()});
      }
      setLayerFillColor({id: selected[0], fillColor: chroma(color).hex()});
      setColor(chroma(color).alpha(1).hex());
      setSwatchColor(chroma(color).hex());
    } else {
      setColor(chroma(fill.color).alpha(1).hex());
    }
  };

  const handleSwatchChange = (editorColor: string): void => {
    setColor(chroma(editorColor).alpha(1).hex());
    setOpacity(chroma(editorColor).alpha() * 100);
    setSwatchColor(editorColor);
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.fillColor = new paper.Color(editorColor);
  };

  const handleSwatchClick = (): void => {
    if (!enabled) {
      const paperLayer = getPaperLayer(selected[0]);
      enableLayerFill({id: selected[0]});
      paperLayer.fillColor = new paper.Color(fill.color);
    }
  };

  return (
    <ColorInput
      layer={selected[0]}
      colorValue={color}
      swatchColorValue={swatchColor}
      prop='fillColor'
      opacityValue={opacity}
      onColorChange={handleColorChange}
      onColorSubmit={handleColorSubmit}
      onOpacityChange={handleOpacityChange}
      onOpacitySubmit={handleOpacitySubmit}
      onSwatchChange={handleSwatchChange}
      onSwatchClick={handleSwatchClick}
      disabled={selected.length > 1 || selected.length === 0 || !enabled} />
    // <div
    //   className='c-sidebar-layer'>
    //   <SidebarSectionRow alignItems='center'>
    //     <SidebarSectionColumn width={'10%'} justifyContent={'center'}>
    //       <SidebarCheckbox
    //         id={`fillColor`}
    //         onChange={handleCheckChange}
    //         checked={enabled} />
    //     </SidebarSectionColumn>
    //     <SidebarSectionColumn width={'23%'}>
    //       <SidebarSwatch
    //         layer={selected[0]}
    //         prop={'fillColor'}
    //         color={swatchColor}
    //         onChange={handleSwatchChange}
    //         onClick={handleSwatchClick} />
    //     </SidebarSectionColumn>
    //     <SidebarSectionColumn width={'47%'}>
    //       <SidebarInput
    //         value={color}
    //         onChange={handleColorChange}
    //         onSubmit={handleColorSubmit}
    //         blurOnSubmit
    //         disabled={selected.length > 1 || selected.length === 0 || !enabled} />
    //     </SidebarSectionColumn>
    //     <SidebarSectionColumn width={'20%'}>
    //       <SidebarInput
    //         value={opacity}
    //         onChange={handleOpacityChange}
    //         onSubmit={handleOpacitySubmit}
    //         blurOnSubmit
    //         label={'%'}
    //         disabled={selected.length > 1 || selected.length === 0 || !enabled} />
    //     </SidebarSectionColumn>
    //   </SidebarSectionRow>
    // </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const fill = layer.present.byId[layer.present.selected[0]].style.fill;
  const fillOpacity = chroma(fill.color).alpha() * 100;
  return { selected, fill, fillOpacity, selectedType };
};

export default connect(
  mapStateToProps,
  { enableLayerFill, disableLayerFill, setLayerFillColor, setTextSettingsFillColor }
)(SidebarFillStyle);