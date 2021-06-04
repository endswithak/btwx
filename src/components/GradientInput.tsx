import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { enableLayersFill, enableLayersStroke, setLayersGradient, setLayersFill, setLayersStroke } from '../store/actions/layer';
import { openGradientEditor } from '../store/actions/gradientEditor';
import { getSelectedFillEnabled, getSelectedStrokeEnabled, getSelectedFillGradientType, getSelectedStrokeGradientType, getSelectedFillGradient, getSelectedStrokeGradient } from '../store/selectors/layer';
import { enableDraggingFill, disableDraggingFill, enableDraggingStroke, disableDraggingStroke, enableFillDragover, disableFillDragover, enableStrokeDragover, disableStrokeDragover } from '../store/actions/rightSidebar';
import PercentageFormGroup from './PercentageFormGroup';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import GradientTypeSelector from './GradientTypeSelector';
import Form from './Form';
import fillDropperCursor from '../../assets/cursor/fill-dropper.svg';
import strokeDropperCursor from '../../assets/cursor/stroke-dropper.svg';

interface GradientInputProps {
  prop: 'fill' | 'stroke';
}

const GradientInput = (props: GradientInputProps): ReactElement => {
  const colorFormControlRef = useRef(null);
  const opacityFormControlRef = useRef(null);
  const { prop } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const draggingFill = useSelector((state: RootState) => state.rightSidebar.draggingFill);
  const draggingStroke = useSelector((state: RootState) => state.rightSidebar.draggingStroke);
  // const draggingShadow = useSelector((state: RootState) => state.rightSidebar.draggingShadow);
  const gradientValue = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.selected[0]].style[prop].gradient);
  const enabledValue: boolean | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillEnabled(state);
      case 'stroke':
        return getSelectedStrokeEnabled(state);
    }
  });
  const gradientTypeValue: Btwx.GradientType | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillGradientType(state);
      case 'stroke':
        return getSelectedStrokeGradientType(state);
    }
  });
  const displayGradient: Btwx.Gradient | 'multi' = useSelector((state: RootState) => {
    switch(prop) {
      case 'fill':
        return getSelectedFillGradient(state);
      case 'stroke':
        return getSelectedStrokeGradient(state);
    }
  });
  const stops = gradientValue && gradientValue.stops;
  const gradientOpacity = stops && stops.every((stop) => stop.color.a === stops[0].color.a) ? stops[0].color.a : 'multi';
  const gradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const gradientEditorProp = useSelector((state: RootState) => state.gradientEditor.prop);
  const sortedStops = stops && [...stops].sort((a,b) => { return a.position - b.position });
  const cssGradient = sortedStops && sortedStops.reduce((result, current, index) => {
    const stopColor = tinyColor({h: current.color.h, s: current.color.s, l: current.color.l, a: current.color.a}).toRgbString();
    result = result + `${stopColor} ${current.position * 100}%`;
    if (index !== stops.length - 1) {
      result = result + ',';
    } else {
      result = result + ')';
    }
    return result;
  }, `linear-gradient(to right,`);
  const [enabled, setEnabled] = useState<boolean | 'multi'>(enabledValue);
  const [gradient, setGradient] = useState(gradientValue);
  const [activeDragover, setActiveDragover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setEnabled(enabledValue);
    setGradient(gradientValue);
  }, [gradientValue, selected, gradientOpacity, enabledValue]);

  const handleSubmitSuccess = (nextOpacity: any): void => {
    dispatch(setLayersGradient({layers: selected, prop: prop, gradient: {
      ...gradient,
      stops: gradient.stops.reduce((result, current) => {
        result = [...result, {
          ...current,
          color: {
            ...current.color,
            a: nextOpacity
          }
        }];
        return result;
      }, [])
    }}));
  }

  const handleSwatchClick = (e: any): void => {
    e.preventDefault();
    const sidebarRightScroll = document.getElementById('sidebar-scroll-right');
    const controlBox = colorFormControlRef.current.getBoundingClientRect();
    const sidebarBox = sidebarRightScroll.getBoundingClientRect();
    const scrollTop = sidebarRightScroll.scrollTop;
    if (!enabled) {
      switch(prop) {
        case 'fill':
          dispatch(enableLayersFill({layers: selected}));
          break;
        case 'stroke':
          dispatch(enableLayersStroke({layers: selected}));
          break;
      }
    }
    if (!gradientEditorOpen) {
      dispatch(openGradientEditor({
        prop: prop,
        x: controlBox.x,
        y: (controlBox.y + scrollTop + controlBox.height) - sidebarBox.top
      }));
    }
  };

  const handleDragStart = (e: any): void => {
    if (displayGradient !== 'multi') {
      switch(prop) {
        case 'fill':
          dispatch(enableDraggingFill({
            fill: {
              gradient: displayGradient,
              enabled: true,
              fillType: 'gradient'
            }
          }));
          break;
        case 'stroke':
          dispatch(enableDraggingStroke({
            stroke: {
              gradient: displayGradient,
              enabled: true,
              fillType: 'gradient'
            }
          }));
          break;
      }
      setDragging(true);
      gsap.set(colorFormControlRef.current, {
        cursor: `url(${prop === 'fill' ? fillDropperCursor : strokeDropperCursor}) 14 14, auto`
      });
    }
  };

  const handleDragEnd = (e: any): void => {
    if (dragging) {
      switch(prop) {
        case 'fill':
          dispatch(disableDraggingFill());
          setActiveDragover(false);
          break;
        case 'stroke':
          dispatch(disableDraggingStroke());
          setActiveDragover(false);
          break;
      }
      setDragging(false);
      gsap.set(colorFormControlRef.current, {
        clearProps: 'all'
      });
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    if ((draggingFill || draggingStroke) && !activeDragover) {
      switch(prop) {
        case 'fill':
          if (draggingStroke) {
            dispatch(enableFillDragover());
            setActiveDragover(true);
          }
          break;
        case 'stroke':
          if (draggingFill) {
            dispatch(enableStrokeDragover());
            setActiveDragover(true);
          }
          break;
      }
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    if (draggingFill || draggingStroke) {
      switch(prop) {
        case 'fill':
          if (draggingStroke) {
            dispatch(disableFillDragover());
            setActiveDragover(false);
          }
          break;
        case 'stroke':
          if (draggingFill) {
            dispatch(disableStrokeDragover());
            setActiveDragover(false);
          }
          break;
      }
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    if (draggingFill || draggingStroke) {
      switch(prop) {
        case 'fill':
          if (draggingStroke) {
            dispatch(setLayersFill({
              layers: selected,
              fill: draggingStroke as any
            }));
          }
          break;
        case 'stroke':
          if (draggingFill) {
            dispatch(setLayersStroke({
              layers: selected,
              stroke: draggingFill as any
            }));
          }
          break;
      }
    }
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'33.33%'}>
        <Form inline>
          <Form.Group controlId={`control-${prop}-gradient-swatch`}>
            <Form.Control
              ref={colorFormControlRef}
              type='color'
              size='small'
              draggable={displayGradient !== 'multi'}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              isActive={gradientEditorOpen && gradientEditorProp === prop}
              thiccActive={activeDragover}
              multiColor={displayGradient === 'multi'}
              colorGradient={displayGradient !== 'multi' ? cssGradient : null}
              value='#000000'
              onChange={() => {}}
              onClick={handleSwatchClick} />
            <Form.Label>
              Gradient
            </Form.Label>
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <GradientTypeSelector
          gradientTypeValue={gradientTypeValue}
          disabled={!enabled || enabled === 'multi'}
          prop={prop} />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <PercentageFormGroup
          controlId={`control-${prop}-gradient-opacity`}
          value={gradientOpacity}
          ref={opacityFormControlRef}
          disabled={!enabled || enabled === 'multi'}
          submitOnBlur
          canvasAutoFocus
          size='small'
          onSubmitSuccess={handleSubmitSuccess}
          label='Opacity' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default GradientInput;