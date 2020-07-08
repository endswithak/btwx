import paper from 'paper';
import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import chroma from 'chroma-js';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSwatch from './SidebarSwatch';
import GradientTypeSelector from './GradientTypeSelector';
import { getPaperLayer, getGradientOriginPoint, getGradientDestinationPoint, getGradientStops } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { EnableLayerFillPayload, DisableLayerFillPayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import { OpenFillEditorPayload, FillEditorTypes } from '../store/actionTypes/fillEditor';
import { openFillEditor } from '../store/actions/fillEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';

interface FillInputProps {
  selected: string[];
  selectedType?: em.LayerType;
  fillValue?: em.Fill;
  fillOpacity: number;
  fillEditorOpen?: boolean;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  openFillEditor?(payload: OpenFillEditorPayload): FillEditorTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const FillInput = (props: FillInputProps): ReactElement => {
  const { selected, selectedType, fillValue, fillOpacity, fillEditorOpen, enableLayerFill, setLayerFillGradient, openFillEditor, setTextSettingsFillColor, setLayerFillColor } = props;
  const [enabled, setEnabled] = useState<boolean>(fillValue.enabled);
  const [fill, setFill] = useState(fillValue);
  const [opacity, setOpacity] = useState<number | string>(fillOpacity);
  const [hex, setHex] = useState(chroma(fillValue.color).alpha(1).hex().replace('#', ''));

  useEffect(() => {
    setEnabled(fillValue.enabled);
    setFill(fillValue);
    setOpacity(fillOpacity);
    setHex(chroma(fillValue.color).alpha(1).hex().replace('#', ''));
  }, [fillValue, selected, fillOpacity, fillValue.gradient]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleHexChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setHex(target.value);
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
        switch(fill.fillType) {
          case 'color': {
            const newColor = chroma(fill.color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
            setLayerFillColor({id: selected[0], fillColor: newColor});
            break;
          }
          case 'gradient': {
            const newGradient = {
              ...fill.gradient,
              stops: fill.gradient.stops.map((stop) => {
                return {...stop, color: chroma(stop.color).alpha(nextOpacity / 100).hex()}
              })
            }
            setLayerFillGradient({id: selected[0], gradient: newGradient});
            break;
          }
        }
      } else {
        setOpacity(fillOpacity);
      }
    } catch(error) {
      setOpacity(fillOpacity);
    }
  }

  const handleHexSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(hex)) {
      const paperLayer = getPaperLayer(selected[0]);
      const nextFillColor = chroma(hex).alpha(fillOpacity / 100).hex();
      paperLayer.fillColor = new paper.Color(nextFillColor);
      if (selectedType === 'Text') {
        setTextSettingsFillColor({fillColor: chroma(hex).hex()});
      }
      setLayerFillColor({id: selected[0], fillColor: nextFillColor});
    } else {
      setHex(chroma(fillValue.color).alpha(1).hex().replace('#', ''));
    }
  };

  const handleFillEditorChange = (editorFill: em.Fill): void => {
    setFill(editorFill);
    const paperLayer = getPaperLayer(selected[0]);
    switch(editorFill.fillType) {
      case 'color':
        setOpacity(chroma(editorFill.color).alpha() * 100);
        setHex(chroma(editorFill.color).alpha(1).hex().replace('#', ''));
        paperLayer.fillColor = new paper.Color(editorFill.color);
        break;
      case 'gradient':
        setOpacity(editorFill.gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(editorFill.gradient.stops[0].color).alpha()) ? chroma(editorFill.gradient.stops[0].color).alpha() * 100 : 'multi');
        paperLayer.fillColor = {
          gradient: {
            stops: getGradientStops(editorFill.gradient.stops),
            radial: editorFill.gradient.gradientType === 'radial'
          },
          origin: getGradientOriginPoint(selected[0], editorFill.gradient.origin),
          destination: getGradientDestinationPoint(selected[0], editorFill.gradient.destination)
        }
        break;
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    console.log(bounding);
    if (!enabled) {
      enableLayerFill({id: selected[0]});
    }
    openFillEditor({
      fill,
      onChange: handleFillEditorChange,
      layer: selected[0],
      x: bounding.x,
      y: bounding.y - (bounding.height - 10) // 2 (swatch drop shadow) + 8 (top-padding)
    });
  };

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          isActive={fillEditorOpen}
          style={{
            background: (() => {
              switch(fill.fillType) {
                case 'color':
                  return fill.color;
                case 'gradient':
                  return [...fill.gradient.stops].sort((a,b) => { return a.position - b.position }).reduce((result, current, index) => {
                    result = result + `${current.color} ${current.position * 100}%`;
                    if (index !== fill.gradient.stops.length - 1) {
                      result = result + ',';
                    } else {
                      result = result + ')';
                    }
                    return result;
                  }, `linear-gradient(to right,`)
              }
            })()
          }}
          onClick={handleSwatchClick}
          bottomLabel={(() => {
            switch(fill.fillType) {
              case 'color':
                return 'Color';
              case 'gradient':
                return 'Gradient'
            }
          })()} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        {
          (() => {
            switch(fill.fillType) {
              case 'color':
                return (
                  <SidebarInput
                    value={hex}
                    onChange={handleHexChange}
                    onSubmit={handleHexSubmit}
                    submitOnBlur
                    disabled={selected.length > 1 || selected.length === 0 || !enabled}
                    leftLabel={'#'}
                    bottomLabel={'Hex'} />
                )
              case 'gradient':
                return (
                  <GradientTypeSelector
                    gradientTypeValue={fill.gradient.gradientType}
                    disabled={selected.length > 1 || selected.length === 0 || !enabled} />
                )
            }
          })()
        }
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
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, fillEditor } = state;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const fillValue = layer.present.byId[layer.present.selected[0]].style.fill;
  const gradient = fillValue.gradient;
  const fillOpacity = (() => {
    switch(fillValue.fillType) {
      case 'color':
        return chroma(fillValue.color).alpha() * 100;
      case 'gradient':
        return gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(gradient.stops[0].color).alpha()) ? chroma(gradient.stops[0].color).alpha() * 100 : 'multi';
    }
  })();
  const fillEditorOpen = fillEditor.isOpen;
  return { selected, selectedType, fillValue, fillOpacity, fillEditorOpen };
};

export default connect(
  mapStateToProps,
  { enableLayerFill, setLayerFillGradient, openFillEditor, setTextSettingsFillColor, setLayerFillColor }
)(FillInput);