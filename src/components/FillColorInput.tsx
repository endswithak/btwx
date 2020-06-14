import paper from 'paper';
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import chroma from 'chroma-js';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import { RootState } from '../store/reducers';
import { EnableLayerFillPayload, DisableLayerFillPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, disableLayerFill, setLayerFillColor } from '../store/actions/layer';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';
import { OpenFillEditorPayload, FillEditorTypes } from '../store/actionTypes/fillEditor';
import { openFillEditor } from '../store/actions/fillEditor';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';

interface FillColorInputProps {
  fill?: em.Fill;
  fillOpacity?: number;
  selected: string[];
  selectedType?: em.LayerType;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  disableLayerFill?(payload: DisableLayerFillPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
  openFillEditor?(payload: OpenFillEditorPayload): FillEditorTypes;
}

const FillColorInput = (props: FillColorInputProps): ReactElement => {
  const { fill, fillOpacity, selected, selectedType, enableLayerFill, disableLayerFill, openFillEditor, setLayerFillColor, setTextSettingsFillColor } = props;
  const [enabled, setEnabled] = useState<boolean>(fill.enabled);
  const [color, setColor] = useState<string>(chroma(fill.color).alpha(1).hex().replace('#', ''));
  const [opacity, setOpacity] = useState<number | string>(fillOpacity);
  const [swatchColor, setSwatchColor] = useState<string>(fill.color);

  useEffect(() => {
    setEnabled(fill.enabled);
    setColor(chroma(fill.color).alpha(1).hex().replace('#', ''));
    setOpacity(fillOpacity);
    setSwatchColor(fill.color);
  }, [fill, selected]);

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
      if (nextOpacity  !== fillOpacity && !isNaN(nextOpacity)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const paperLayer = getPaperLayer(selected[0]);
        const newColor = chroma(color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
        paperLayer.fillColor = new paper.Color(newColor);
        setLayerFillColor({id: selected[0], fillColor: newColor});
      } else {
        setOpacity(fillOpacity);
      }
    } catch(error) {
      setOpacity(fillOpacity);
    }
  }

  const handleColorSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(color)) {
      const paperLayer = getPaperLayer(selected[0]);
      const nextFillColor = chroma(color).alpha(fillOpacity / 100).hex();
      paperLayer.fillColor = new paper.Color(nextFillColor);
      if (selectedType === 'Text') {
        setTextSettingsFillColor({fillColor: chroma(color).hex()});
      }
      setLayerFillColor({id: selected[0], fillColor: nextFillColor});
    } else {
      setColor(chroma(fill.color).alpha(1).hex().replace('#', ''));
    }
  };

  const handleFillEditorChange = (editorFill: em.Fill): void => {
    setColor(chroma(editorFill.color).alpha(1).hex().replace('#', ''));
    setOpacity(chroma(editorFill.color).alpha() * 100);
    setSwatchColor(editorFill.color);
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.fillColor = new paper.Color(editorFill.color);
  };

  const handleFillEditorClose = (editorFill: em.Fill): void => {
    if (chroma.valid(editorFill.color)) {
      const paperLayer = getPaperLayer(selected[0]);
      paperLayer.fillColor = new paper.Color(editorFill.color);
      if (selectedType === 'Text') {
        setTextSettingsFillColor({fillColor: editorFill.color});
      }
      setLayerFillColor({id: selected[0], fillColor: editorFill.color});
    } else {
      setColor(chroma(fill.color).alpha(1).hex().replace('#', ''));
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      const paperLayer = getPaperLayer(selected[0]);
      enableLayerFill({id: selected[0]});
      paperLayer.fillColor = new paper.Color(fill.color);
    }
    openFillEditor({fill, onChange: handleFillEditorChange, onClose: handleFillEditorClose, layer: selected[0], x: bounding.x - 228, y: bounding.y > paperMain.view.bounds.height / 2 ? bounding.y - 208 : bounding.y + 4});
  };

  return (
    <div>
      <SidebarSectionRow alignItems='center'>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarSwatch
            //layer={selected[0]}
            //prop={prop}
            //fill={fill}
            style={{
              background: swatchColor
            }}
            //onChange={handleSwatchChange}
            //onClose={handleSwatchClose}
            onClick={handleSwatchClick}
            bottomLabel={'Color'} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={color}
            onChange={handleColorChange}
            onSubmit={handleColorSubmit}
            submitOnBlur
            disabled={selected.length > 1 || selected.length === 0 || !enabled}
            leftLabel={'#'}
            bottomLabel={'Hex'} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={opacity}
            onChange={handleOpacityChange}
            onSubmit={handleOpacitySubmit}
            submitOnBlur
            label={'%'}
            disabled={selected.length > 1 || selected.length === 0 || !enabled}
            bottomLabel={'Opacity'} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </div>
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
  { enableLayerFill, disableLayerFill, setLayerFillColor, setTextSettingsFillColor, openFillEditor }
)(FillColorInput);