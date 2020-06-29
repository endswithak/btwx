/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import useDebounce from './useDebounce';
import GradientSliderStop from './GradientSliderStop';
import GradientSliderRemove from './GradientSliderRemove';
import GradientSliderGradient from './GradientSliderGradient';

gsap.registerPlugin(Draggable);

interface GradientSliderProps {
  gradientValue: em.Gradient;
  activeStopIndex: number;
  setActiveStopIndex(index: number): void;
  setActivePickerColor(color: string): any;
  onChange(gradient: em.Gradient): void;
  onChangeDebounce(gradient: em.Gradient): void;
}

const GradientSlider = (props: GradientSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { gradientValue, activeStopIndex, onChange, onChangeDebounce, setActiveStopIndex, setActivePickerColor } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [gradient, setGradient] = useState(gradientValue);
  const [stops, setStops] = useState(gradientValue.stops);
  const debounceGradient = useDebounce(gradient, 250) as em.Gradient;

  useEffect(() => {
    setGradient({
      ...gradient,
      stops
    });
  }, [stops]);

  useEffect(() => {
    onChange(gradient);
  }, [gradient]);

  useEffect(() => {
    onChangeDebounce(debounceGradient);
  }, [debounceGradient]);

  useEffect(() => {
    if (containerRef.current) {
      stops.forEach((stop, index) => {
        const stopId = `#gradient-stop-${index}`;
        if (Draggable.get(stopId)) {
          Draggable.get(stopId).kill();
        }
        gsap.set(stopId, {x: `${stop.position * 100}%`});
        Draggable.create(stopId, {
          type: 'x',
          zIndexBoost: false,
          bounds: containerRef.current,
          onPress: function() {
            setActiveStopIndex(index);
            setActivePickerColor(stop.color);
          },
          onDrag: function() {
            const newStops = [...stops];
            newStops[index].position = this.x / this.maxX;
            //newStops[index].position = this.x / this.maxX;
            //const sortedStops = newStops.sort((a,b) => { return b.position - a.position }).reverse();
            setStops(newStops);
          }
        });
      });
    }
  }, [stops.length]);

  return (
    <div
      className='c-gradient-slider'
      style={{
        boxShadow: `0 -1px 0 0 ${theme.background.z4} inset`
      }}>
      <div
        ref={containerRef}
        id='c-gradient-slider__slider'
        className='c-gradient-slider__slider'
        style={{
          boxShadow: `0 0 0 -1px ${theme.background.z4} inset`
        }}>
        <GradientSliderGradient
          stops={stops}
          setStops={setStops}
          setActivePickerColor={setActivePickerColor}
          setActiveStopIndex={setActiveStopIndex} />
        {
          stops.map((stop, index) => (
            <div
              key={index}
              id={`gradient-stop-${index}`}
              className='c-gradient-slider__pointer'>
              <div
                className='c-gradient-slider__circle'
                style={{
                  boxShadow: index === activeStopIndex
                  ? `0 0 0 1.5px #fff, 0 0 0 3.5px ${theme.palette.primary}, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
                  : `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
                }} />
            </div>
          ))
        }
      </div>
      <GradientSliderRemove
        stops={stops}
        setStops={setStops}
        setActivePickerColor={setActivePickerColor}
        setActiveStopIndex={setActiveStopIndex}
        disabled={stops.length <= 2}
        activeStopIndex={activeStopIndex} />
    </div>
  );
}

export default GradientSlider;