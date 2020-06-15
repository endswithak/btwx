/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import throttle from 'lodash.throttle';
import gsap from 'gsap';
import chroma from 'chroma-js';
import { Draggable } from 'gsap/Draggable';

interface GradientSliderProps {
  gradient: em.Gradient;
  activeStopIndex: number;
  setActiveStopIndex: any;
  //setFill: any;
  setActivePickerColor: any;
  onChange?(stops: em.GradientStop[]): any;
}

const GradientSlider = (props: GradientSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { gradient, activeStopIndex, onChange, setActiveStopIndex, setActivePickerColor } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [stops, setStops] = useState(gradient.stops);

  useEffect(() => {
    if (onChange) {
      onChange(stops);
    }
  }, [stops]);

  useEffect(() => {
    if (containerRef.current) {
      stops.forEach((stop, index) => {
        const stopId = `#gradient-stop-${index}`;
        if (Draggable.get(stopId)) {
          Draggable.get(stopId).kill();
        }
        gsap.set(stopId, {x: `${stops[index].position * 100}%`});
        Draggable.create(stopId, {
          type: 'x',
          zIndexBoost: false,
          bounds: containerRef.current,
          onPress: function() {
            setActiveStopIndex(index);
            setActivePickerColor(stops[index].color);
          },
          onDrag: function() {
            const newStops = [...stops];
            newStops[index].position = this.x / this.maxX;
            setStops(sortedStops(newStops));
          }
        });
      });
    }
  }, [stops.length]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingBox = containerRef.current.getBoundingClientRect();
    const x = e.pageX;
    let left = x - (boundingBox.left + window.pageXOffset);

    if (left < 0) {
      left = 0
    } else if (left > boundingBox.width) {
      left = boundingBox.width
    }

    const position = left / boundingBox.width;
    let leftDistance = 999999999;
    const leftStop = stops.reduce((result, current) => {
      if (current.position <= position && position - current.position < leftDistance) {
        result = current;
        leftDistance = position - current.position;
      }
      return result;
    }, stops[0]);
    let rightDistance = 999999999;
    const rightStop = stops.reduce((result, current) => {
      if (current.position >= position && current.position - position < rightDistance) {
        result = current;
        rightDistance = current.position - position;
      }
      return result;
    }, stops[0]);
    const color = chroma.average([leftStop.color, rightStop.color]).hex();
    const newStop = {position, color};
    const newStops = sortedStops([...stops, newStop]);
    const newStopIndex = newStops.findIndex((stop) => stop.position === position && stop.color === color);
    setStops(newStops);
    setActiveStopIndex(newStopIndex);
    setActivePickerColor(color);
  }

  const sortedStops = (s: em.GradientStop[]) => {
    return s.sort((a,b) => { return b.position - a.position }).reverse();
  }

  return (
    <div
      className='c-gradient-slider'
      style={{
        boxShadow: `0 -1px 0 0 ${theme.background.z4} inset`
      }}>
      <div
        ref={containerRef}
        className='c-gradient-slider__slider'
        style={{
          boxShadow: `0 0 0 -1px ${theme.background.z4} inset`
        }}>
        <div
          className='c-gradient-slider__background'
          onClick={handleClick}
          style={{
            background: (() => {
              return stops.reduce((result, current, index) => {
                result = result + `${current.color} ${current.position * 100}%`;
                if (index !== stops.length - 1) {
                  result = result + ',';
                } else {
                  result = result + ')';
                }
                return result;
              }, 'linear-gradient(to right,');
            })()
          }} />
        {
          stops.map((stop, index) => (
            <div
              key={index}
              id={`gradient-stop-${index}`}
              className='c-gradient-slider__pointer'>
              <div
                className='c-gradient-slider__circle'
                style={{
                  boxShadow: activeStopIndex === index
                  ? `0 0 0 1.5px #fff, 0 0 0 3.5px ${theme.palette.primary}, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
                  : `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
                }} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default GradientSlider;