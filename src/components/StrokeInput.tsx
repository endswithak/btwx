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
import { EnableLayerStrokePayload, DisableLayerStrokePayload, SetLayerStrokeGradientPayload, SetLayerStrokeColorPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerStroke, disableLayerStroke, setLayerStrokeGradient, setLayerStrokeColor } from '../store/actions/layer';
import { OpenStrokeEditorPayload, StrokeEditorTypes } from '../store/actionTypes/strokeEditor';
import { openStrokeEditor } from '../store/actions/strokeEditor';

interface StrokeInputProps {
  selected: string[];
  strokeValue?: em.Stroke;
  strokeOpacity: number;
  strokeEditorOpen?: boolean;
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  disableLayerStroke?(payload: DisableLayerStrokePayload): LayerTypes;
  setLayerStrokeColor?(payload: SetLayerStrokeColorPayload): LayerTypes;
  setLayerStrokeGradient?(payload: SetLayerStrokeGradientPayload): LayerTypes;
  openStrokeEditor?(payload: OpenStrokeEditorPayload): StrokeEditorTypes;
}

const StrokeInput = (props: StrokeInputProps): ReactElement => {
  // const { selected, strokeValue, strokeOpacity, strokeEditorOpen, enableLayerStroke, disableLayerStroke, setLayerStrokeGradient, openStrokeEditor, setLayerStrokeColor } = props;
  // const [enabled, setEnabled] = useState<boolean>(strokeValue.enabled);
  // const [stroke, setStroke] = useState(strokeValue);
  // const [opacity, setOpacity] = useState<number | string>(strokeOpacity);
  // const [hex, setHex] = useState(chroma(strokeValue.color).alpha(1).hex().replace('#', ''));

  // useEffect(() => {
  //   setEnabled(strokeValue.enabled);
  //   setStroke(strokeValue);
  //   setOpacity(strokeOpacity);
  //   setHex(chroma(strokeValue.color).alpha(1).hex().replace('#', ''));
  // }, [strokeValue, selected, strokeOpacity, strokeValue.gradient]);

  // const handleOpacityChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
  //   const target = e.target as HTMLInputElement;
  //   setOpacity(target.value);
  // };

  // const handleHexChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
  //   const target = e.target as HTMLInputElement;
  //   setHex(target.value);
  // };

  // const handleOpacitySubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
  //   try {
  //     let nextOpacity = evaluate(`${opacity}`);
  //     if (nextOpacity  !== strokeOpacity && !isNaN(nextOpacity)) {
  //       if (nextOpacity > 100) {
  //         nextOpacity = 100;
  //       }
  //       if (nextOpacity < 0) {
  //         nextOpacity = 0;
  //       }
  //       const paperLayer = getPaperLayer(selected[0]);
  //       switch(stroke.fillType) {
  //         case 'color': {
  //           const newColor = chroma(stroke.color).alpha(evaluate(`${nextOpacity} / 100`)).hex();
  //           paperLayer.strokeColor = new paper.Color(newColor);
  //           setLayerStrokeColor({id: selected[0], strokeColor: newColor});
  //           break;
  //         }
  //         case 'gradient': {
  //           const newGradient = {
  //             ...stroke.gradient,
  //             stops: stroke.gradient.stops.map((stop) => {
  //               return {...stop, color: chroma(stop.color).alpha(nextOpacity / 100).hex()}
  //             })
  //           }
  //           paperLayer.strokeColor = {
  //             gradient: {
  //               stops: getGradientStops(newGradient.stops),
  //               radial: newGradient.gradientType === 'radial'
  //             },
  //             origin: getGradientOriginPoint(selected[0], newGradient.origin),
  //             destination: getGradientDestinationPoint(selected[0], newGradient.destination)
  //           }
  //           setLayerStrokeGradient({id: selected[0], gradient: newGradient});
  //           break;
  //         }
  //       }
  //     } else {
  //       setOpacity(strokeOpacity);
  //     }
  //   } catch(error) {
  //     setOpacity(strokeOpacity);
  //   }
  // }

  // const handleHexSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
  //   if (chroma.valid(hex)) {
  //     const paperLayer = getPaperLayer(selected[0]);
  //     const nextStrokeColor = chroma(hex).alpha(strokeOpacity / 100).hex();
  //     paperLayer.strokeColor = new paper.Color(nextStrokeColor);
  //     setLayerStrokeColor({id: selected[0], strokeColor: nextStrokeColor});
  //   } else {
  //     setHex(chroma(strokeValue.color).alpha(1).hex().replace('#', ''));
  //   }
  // };

  // const handleStrokeEditorChange = (editorStroke: em.Stroke): void => {
  //   setStroke(editorStroke);
  //   const paperLayer = getPaperLayer(selected[0]);
  //   switch(editorStroke.fillType) {
  //     case 'color':
  //       setOpacity(chroma(editorStroke.color).alpha() * 100);
  //       setHex(chroma(editorStroke.color).alpha(1).hex().replace('#', ''));
  //       paperLayer.strokeColor = new paper.Color(editorStroke.color);
  //       break;
  //     case 'gradient':
  //       setOpacity(editorStroke.gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(editorStroke.gradient.stops[0].color).alpha()) ? chroma(editorStroke.gradient.stops[0].color).alpha() * 100 : 'multi');
  //       paperLayer.strokeColor = {
  //         gradient: {
  //           stops: getGradientStops(editorStroke.gradient.stops),
  //           radial: editorStroke.gradient.gradientType === 'radial'
  //         },
  //         origin: getGradientOriginPoint(selected[0], editorStroke.gradient.origin),
  //         destination: getGradientDestinationPoint(selected[0], editorStroke.gradient.destination)
  //       }
  //       break;
  //   }
  // };

  // const handleStrokeEditorClose = (editorStroke: em.Stroke): void => {
  //   switch(editorStroke.fillType) {
  //     case 'color':
  //       setLayerStrokeColor({id: selected[0], strokeColor: editorStroke.color});
  //       break;
  //     case 'gradient':
  //       setLayerStrokeGradient({id: selected[0], gradient: editorStroke.gradient});
  //       break;
  //   }
  // };

  // const handleSwatchClick = (bounding: DOMRect): void => {
  //   if (!enabled) {
  //     enableLayerStroke({id: selected[0]});
  //   }
  //   openStrokeEditor({stroke, onChange: handleStrokeEditorChange, onClose: handleStrokeEditorClose, layer: selected[0], x: bounding.x - 228, y: bounding.y > paperMain.view.bounds.height / 2 ? bounding.y - 208 : bounding.y + 4});
  // };

  return (
    <SidebarSectionRow alignItems='center'>
      {/* <SidebarSectionColumn width={'33.33%'}>
        <SidebarSwatch
          active={strokeEditorOpen}
          style={{
            background: (() => {
              switch(stroke.fillType) {
                case 'color':
                  return stroke.color;
                case 'gradient':
                  return stroke.gradient.stops.reduce((result, current, index) => {
                    result = result + `${current.color} ${current.position * 100}%`;
                    if (index !== stroke.gradient.stops.length - 1) {
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
            switch(stroke.fillType) {
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
            switch(stroke.fillType) {
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
                    gradientTypeValue={stroke.gradient.gradientType}
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
      </SidebarSectionColumn> */}
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState) => {
  // const { layer, strokeEditor } = state;
  // const selected = layer.present.selected;
  // const strokeValue = layer.present.byId[layer.present.selected[0]].style.stroke;
  // const gradient = strokeValue.gradient;
  // const strokeOpacity = (() => {
  //   switch(strokeValue.fillType) {
  //     case 'color':
  //       return chroma(strokeValue.color).alpha() * 100;
  //     case 'gradient':
  //       return gradient.stops.every((stop) => chroma(stop.color).alpha() === chroma(gradient.stops[0].color).alpha()) ? chroma(gradient.stops[0].color).alpha() * 100 : 'multi';
  //   }
  // })();
  // const strokeEditorOpen = strokeEditor.isOpen;
  // return { selected, strokeValue, strokeOpacity, strokeEditorOpen };
};

export default connect(
  mapStateToProps,
  { enableLayerStroke, disableLayerStroke, setLayerStrokeGradient, openStrokeEditor, setLayerStrokeColor }
)(StrokeInput);