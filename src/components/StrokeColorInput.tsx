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
import { EnableLayerStrokePayload, DisableLayerStrokePayload, SetLayerStrokeColorPayload, SetLayerStrokeWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerStroke, disableLayerStroke, setLayerStrokeColor, setLayerStrokeWidth } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import ColorInput from './ColorInput';

interface StrokeColorInputProps {
  stroke?: em.Stroke;
  strokeOpacity?: number;
  selected: string[];
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  disableLayerStroke?(payload: DisableLayerStrokePayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  //setLayerStrokeWidth?(payload: SetLayerStrokeWidthPayload): LayerTypes;
}

const StrokeColorInput = (props: StrokeColorInputProps): ReactElement => {
  const { stroke, strokeOpacity, selected, enableLayerStroke, disableLayerStroke, setLayerStrokeColor, setLayerStrokeWidth } = props;
  const [enabled, setEnabled] = useState<boolean>(stroke.enabled);
  const [color, setColor] = useState<string>(chroma(stroke.color).alpha(1).hex().replace('#', ''));
  const [opacity, setOpacity] = useState<number | string>(strokeOpacity);
  const [swatchColor, setSwatchColor] = useState<string>(stroke.color);

  useEffect(() => {
    setEnabled(stroke.enabled);
    setColor(chroma(stroke.color).alpha(1).hex().replace('#', ''));
    setOpacity(strokeOpacity);
    setSwatchColor(stroke.color);
  }, [stroke, selected]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleColorChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setColor(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity !== strokeOpacity && !isNaN(nextOpacity)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const paperLayer = getPaperLayer(selected[0]);
        const newColor = chroma(color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
        paperLayer.strokeColor = new paper.Color(newColor);
        setLayerStrokeColor({id: selected[0], strokeColor: newColor});
        setColor(chroma(newColor).alpha(1).hex().replace('#', ''));
      } else {
        setOpacity(strokeOpacity);
      }
    } catch(error) {
      setOpacity(strokeOpacity);
    }
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(color)) {
      const paperLayer = getPaperLayer(selected[0]);
      const nextStrokeColor = chroma(color).alpha(strokeOpacity / 100).hex();
      paperLayer.strokeColor = new paper.Color(nextStrokeColor);
      setLayerStrokeColor({id: selected[0], strokeColor: nextStrokeColor});
    } else {
      setColor(chroma(stroke.color).alpha(1).hex().replace('#', ''));
    }
  };

  const handleSwatchChange = (editorColor: string) => {
    setColor(chroma(editorColor).alpha(1).hex());
    setOpacity(chroma(editorColor).alpha() * 100);
    setSwatchColor(editorColor);
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.strokeColor = new paper.Color(editorColor);
  };

  const handleSwatchClick = (): void => {
    if (!enabled) {
      const paperLayer = getPaperLayer(selected[0]);
      enableLayerStroke({id: selected[0]});
      paperLayer.strokeColor = new paper.Color(stroke.color);
    }
  };

  return (
    <ColorInput
      layer={selected[0]}
      colorValue={color}
      swatchColorValue={swatchColor}
      prop='strokeColor'
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
    //         id={`strokeColor`}
    //         onChange={handleCheckChange}
    //         checked={enabled} />
    //     </SidebarSectionColumn>
    //     <SidebarSectionColumn width={'23%'}>
    //       <SidebarSwatch
    //         layer={selected[0]}
    //         prop={'strokeColor'}
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
    //         value={width}
    //         onChange={handleWidthChange}
    //         onSubmit={handleWidthSubmit}
    //         blurOnSubmit
    //         label={'W'}
    //         disabled={selected.length > 1 || selected.length === 0 || !enabled} />
    //     </SidebarSectionColumn>
    //   </SidebarSectionRow>
    // </div>
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
)(StrokeColorInput);