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
// import FillColorInput from './FillColorInput';
// import FillGradientInput from './FillGradientInput';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { EnableLayerFillPayload, DisableLayerFillPayload, SetLayerFillGradientPayload, SetLayerFillColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, disableLayerFill, setLayerFillGradient, setLayerFillColor } from '../store/actions/layer';
import { OpenFillEditorPayload, FillEditorTypes } from '../store/actionTypes/fillEditor';
import { openFillEditor } from '../store/actions/fillEditor';
import { SetTextSettingsFillColorPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettingsFillColor } from '../store/actions/textSettings';

interface FillInputProps {
  selected: string[];
  selectedType?: em.LayerType;
  fillValue?: em.Fill;
  fillOpacity: number;
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  disableLayerFill?(payload: DisableLayerFillPayload): LayerTypes;
  setLayerFillColor?(payload: SetLayerFillColorPayload): LayerTypes;
  setLayerFillGradient?(payload: SetLayerFillGradientPayload): LayerTypes;
  openFillEditor?(payload: OpenFillEditorPayload): FillEditorTypes;
  setTextSettingsFillColor?(payload: SetTextSettingsFillColorPayload): TextSettingsTypes;
}

const FillInput = (props: FillInputProps): ReactElement => {
  const { selected, selectedType, fillValue, fillOpacity, enableLayerFill, disableLayerFill, setLayerFillGradient, openFillEditor, setTextSettingsFillColor, setLayerFillColor } = props;
  const [enabled, setEnabled] = useState<boolean>(fillValue.enabled);
  const [fill, setFill] = useState(fillValue);
  const [opacity, setOpacity] = useState<number | string>(fillOpacity);

  useEffect(() => {
    setEnabled(fill.enabled);
    setFill(fillValue);
    setOpacity(fillOpacity);
  }, [fillValue, selected, fillOpacity]);

  const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleHexChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setFill({
      ...fill,
      color: target.value
    });
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
        switch(fill.fillType) {
          case 'color': {
            const newColor = chroma(fill.color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
            paperLayer.fillColor = new paper.Color(newColor);
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
    if (chroma.valid(fill.color)) {
      const paperLayer = getPaperLayer(selected[0]);
      const nextFillColor = chroma(fill.color).alpha(fillOpacity / 100).hex();
      paperLayer.fillColor = new paper.Color(nextFillColor);
      if (selectedType === 'Text') {
        setTextSettingsFillColor({fillColor: chroma(fill.color).hex()});
      }
      setLayerFillColor({id: selected[0], fillColor: nextFillColor});
    } else {
      setFill({
        ...fill,
        color: fillValue.color
      });
    }
  };

  const handleFillEditorChange = (editorFill: em.Fill): void => {
    setFill(editorFill);
    const paperLayer = getPaperLayer(selected[0]);
    switch(editorFill.fillType) {
      case 'color':
        setOpacity(chroma(editorFill.color).alpha() * 100);
        paperLayer.fillColor = new paper.Color(editorFill.color);
        break;
      case 'gradient':
        setOpacity(editorFill.gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(editorFill.gradient.stops[0].color).alpha()) ? chroma(editorFill.gradient.stops[0].color).alpha() * 100 : 'multi');
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
        break;
    }
  };

  const handleFillEditorClose = (editorFill: em.Fill): void => {
    switch(editorFill.fillType) {
      case 'color': {
        if (selectedType === 'Text') {
          setTextSettingsFillColor({fillColor: editorFill.color});
        }
        setLayerFillColor({id: selected[0], fillColor: editorFill.color});
        break;
      }
      case 'gradient':
        setLayerFillGradient({id: selected[0], gradient: editorFill.gradient});
        break;
    }
  };

  const handleSwatchClick = (bounding: DOMRect): void => {
    if (!enabled) {
      const paperLayer = getPaperLayer(selected[0]);
      enableLayerFill({id: selected[0]});
      switch(fill.fillType) {
        case 'color':
          paperLayer.fillColor = new paper.Color(fill.color);
          break;
        case 'gradient':
          paperLayer.fillColor = {
            gradient: {
              stops: fill.gradient.stops.map((stop) => {
                return new paper.GradientStop(new paper.Color(stop.color), stop.position);
              }),
              radial: fill.gradient.gradientType === 'radial'
            },
            origin: new paper.Point((fill.gradient.origin.x * paperLayer.bounds.width) + paperLayer.position.x, (fill.gradient.origin.y * paperLayer.bounds.height) + paperLayer.position.y),
            destination: new paper.Point((fill.gradient.destination.x * paperLayer.bounds.width) + paperLayer.position.x, (fill.gradient.destination.y * paperLayer.bounds.height) + paperLayer.position.y)
          }
          break;
      }
    }
    openFillEditor({fill, onChange: handleFillEditorChange, onClose: handleFillEditorClose, layer: selected[0], x: bounding.x - 228, y: bounding.y > paperMain.view.bounds.height / 2 ? bounding.y - 208 : bounding.y + 4});
  };

  return (
    <SidebarSectionRow alignItems='center'>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          style={{
            background: (() => {
              switch(fill.fillType) {
                case 'color':
                  return fill.color;
                case 'gradient':
                  return fill.gradient.stops.reduce((result, current, index) => {
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
                    value={chroma(fill.color).alpha(1).hex().replace('#', '')}
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
                    gradientTypeValue={fill.gradient.gradientType} />
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
  const { layer } = state;
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
  return { selected, selectedType, fillValue, fillOpacity };
};

export default connect(
  mapStateToProps,
  { enableLayerFill, disableLayerFill, setLayerFillGradient, openFillEditor, setTextSettingsFillColor, setLayerFillColor }
)(FillInput);

// interface FillInputProps {
//   fillType?: em.FillType;
// }

// const FillInput = (props: FillInputProps): ReactElement => {
//   const { fillType } = props;

//   switch(fillType) {
//     case 'color':
//       return <FillColorInput />
//     case 'gradient':
//       return <FillGradientInput />
//   }
// }

// const mapStateToProps = (state: RootState) => {
//   const { layer } = state;
//   const selected = layer.present.selected;
//   const fillType = layer.present.byId[layer.present.selected[0]].style.fill.fillType;
//   return { selected, fillType };
// };

// export default connect(
//   mapStateToProps
// )(FillInput);