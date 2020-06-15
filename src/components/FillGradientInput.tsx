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
import { EnableLayerFillPayload, DisableLayerFillPayload, SetLayerFillGradientPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, disableLayerFill, setLayerFillGradient } from '../store/actions/layer';
import { OpenFillEditorPayload, FillEditorTypes } from '../store/actionTypes/fillEditor';
import { openFillEditor } from '../store/actions/fillEditor';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import GradientTypeSelector from './GradientTypeSelector';

interface FillGradientInputProps {
  fill?: em.Fill;
  fillOpacity?: number;
  gradientOpacity?: number | string;
  selected: string[];
  selectedType?: em.LayerType;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  disableLayerFill?(payload: DisableLayerFillPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  openFillEditor?(payload: OpenFillEditorPayload): FillEditorTypes;
}

const FillGradientInput = (props: FillGradientInputProps): ReactElement => {
  const { fill, fillOpacity, gradientOpacity, selected, selectedType, enableLayerFill, disableLayerFill, openFillEditor, setLayerFillGradient } = props;
  const [enabled, setEnabled] = useState<boolean>(fill.enabled);
  const [gradient, setGradient] = useState(fill.gradient);
  const [opacity, setOpacity] = useState<number | string>(gradientOpacity);

  useEffect(() => {
    setEnabled(fill.enabled);
    setGradient(fill.gradient);
    setOpacity(gradientOpacity);
  }, [fill, selected, gradientOpacity]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity  !== gradientOpacity && !isNaN(nextOpacity)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        const paperLayer = getPaperLayer(selected[0]);
        const newGradient = {
          ...gradient,
          stops: gradient.stops.map((stop) => {
            return {...stop, color: chroma(stop.color).alpha(nextOpacity / 100).hex()}
          })
        }
        paperLayer.fillColor = {
          gradient: {
            stops: newGradient.stops.map((stop) => {
              return new paper.GradientStop(new paper.Color(stop.color), stop.position);
            }),
            radial: newGradient.gradientType === 'radial'
          },
          origin: new paper.Point((newGradient.origin.x * paperLayer.bounds.width) + paperLayer.position.x, (newGradient.origin.y * paperLayer.bounds.height) + paperLayer.position.y),
          destination: new paper.Point((newGradient.destination.x * paperLayer.bounds.width) + paperLayer.position.x, (newGradient.destination.y * paperLayer.bounds.height) + paperLayer.position.y)
        }
        setLayerFillGradient({id: selected[0], gradient: newGradient});
      } else {
        setOpacity(gradientOpacity);
      }
    } catch(error) {
      setOpacity(gradientOpacity);
    }
  }

  const handleFillEditorChange = (editorFill: em.Fill): void => {
    setGradient(editorFill.gradient);
    setOpacity(editorFill.gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(editorFill.gradient.stops[0].color).alpha()) ? chroma(editorFill.gradient.stops[0].color).alpha() * 100 : 'multi');
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.fillColor = {
      gradient: {
        stops: editorFill.gradient.stops.map((stop) => {
          return new paper.GradientStop(new paper.Color(stop.color), stop.position);
        }),
        radial: editorFill.gradient.gradientType === 'radial'
      },
      origin: new paper.Point((editorFill.gradient.origin.x * paperLayer.bounds.width) + paperLayer.position.x, (editorFill.gradient.origin.y * paperLayer.bounds.height) + paperLayer.position.y),
      destination: new paper.Point((editorFill.gradient.destination.x * paperLayer.bounds.width) + paperLayer.position.x, (editorFill.gradient.destination.y * paperLayer.bounds.height) + paperLayer.position.y)
    }
  };

  const handleFillEditorClose = (editorFill: em.Fill): void => {
    setLayerFillGradient({id: selected[0], gradient: editorFill.gradient});
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
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          style={{
            background: (() => {
              return gradient.stops.reduce((result, current, index) => {
                result = result + `${current.color} ${current.position * 100}%`;
                if (index !== gradient.stops.length - 1) {
                  result = result + ',';
                } else {
                  result = result + ')';
                }
                return result;
              }, `linear-gradient(to right,`);
            })()
          }}
          onClick={handleSwatchClick}
          bottomLabel={'Gradient'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={gradient.gradientType} />
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
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedType = layer.present.selected.length === 1 ? layer.present.byId[layer.present.selected[0]].type : null;
  const fill = layer.present.byId[layer.present.selected[0]].style.fill;
  const gradient = fill.gradient;
  const gradientOpacity = gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(gradient.stops[0].color).alpha()) ? chroma(gradient.stops[0].color).alpha() * 100 : 'multi';
  return { selected, fill, selectedType, gradientOpacity };
};

export default connect(
  mapStateToProps,
  { enableLayerFill, disableLayerFill, setLayerFillGradient, openFillEditor }
)(FillGradientInput);