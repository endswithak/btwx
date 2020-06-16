/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import { paperMain } from '../canvas';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { getPaperLayer } from '../store/selectors/layer';

interface GradientDraggerProps {
  layer: string;
  gradient: em.Gradient;
  onChange?(origin: em.Point, destination: em.Point): any;
}

const GradientDragger = (props: GradientDraggerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, gradient, onChange } = props;
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState(gradient.origin);
  const [destination, setDestination] = useState(gradient.destination);

  useEffect(() => {
    if (onChange) {
      onChange(origin, destination);
    }
  }, [origin, destination]);

  useEffect(() => {
    if (originRef) {
      const paperLayer = getPaperLayer(layer);
      const gradientOrigin = new paperMain.Point((gradient.origin.x * paperLayer.bounds.width) + paperLayer.position.x, (gradient.origin.y * paperLayer.bounds.height) + paperLayer.position.y);
      const gradientDestination = new paperMain.Point((gradient.destination.x * paperLayer.bounds.width) + paperLayer.position.x, (gradient.destination.y * paperLayer.bounds.height) + paperLayer.position.y);
      const originToView = paperMain.view.projectToView(gradientOrigin);
      const destinationToView = paperMain.view.projectToView(gradientDestination);
      const snapPoints = (() => {
        const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
        const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
        const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
        const bottomLeft = paperMain.view.projectToView(paperLayer.bounds.bottomLeft);
        const bottomCenter = paperMain.view.projectToView(paperLayer.bounds.bottomCenter);
        const bottomRight = paperMain.view.projectToView(paperLayer.bounds.bottomRight);
        const leftCenter = paperMain.view.projectToView(paperLayer.bounds.leftCenter);
        const rightCenter = paperMain.view.projectToView(paperLayer.bounds.rightCenter);
        const centerCenter = paperMain.view.projectToView(paperLayer.bounds.center);
        return [topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight, leftCenter, rightCenter, centerCenter].map((point) => {
          return {x: point.x, y: point.y};
        });
      })();
      gsap.set(originRef.current, {x: originToView.x, y: originToView.y});
      gsap.set(destinationRef.current, {x: destinationToView.x, y: destinationToView.y});
      Draggable.create(originRef.current, {
        type: 'x,y',
        zIndexBoost: false,
        liveSnap: {
          points: snapPoints,
          radius: 5
        },
        bounds: document.getElementById('canvas-main'),
        onDrag: function() {
          const handlePos = paperMain.view.viewToProject(new paperMain.Point(this.x, this.y));
          const fromLayerCenter = new paperMain.Point(handlePos.x - paperLayer.position.x, handlePos.y - paperLayer.position.y);
          const newOrigin = new paperMain.Point(fromLayerCenter.x / paperLayer.bounds.width, fromLayerCenter.y / paperLayer.bounds.height);
          setOrigin({x: newOrigin.x, y: newOrigin.y});
        }
      });
      Draggable.create(destinationRef.current, {
        type: 'x,y',
        zIndexBoost: false,
        liveSnap: {
          points: snapPoints,
          radius: 5
        },
        bounds: document.getElementById('canvas-main'),
        onDrag: function() {
          const handlePos = paperMain.view.viewToProject(new paperMain.Point(this.x, this.y));
          const fromLayerCenter = new paperMain.Point(handlePos.x - paperLayer.position.x, handlePos.y - paperLayer.position.y);
          const newDestination = new paperMain.Point(fromLayerCenter.x / paperLayer.bounds.width, fromLayerCenter.y / paperLayer.bounds.height);
          setDestination({x: newDestination.x, y: newDestination.y});
        }
      });
    }
  }, []);

  return (
    <div
      className='c-gradient-dragger'
      style={{
        left: document.getElementById('canvas-main').getBoundingClientRect().x,
        top: document.getElementById('canvas-main').getBoundingClientRect().y
      }}>
      <div
        ref={originRef}
        className='c-gradient-dragger__handle'>
        <div
          className='c-gradient-dragger__circle'
          style={{
            background: gradient.stops[0].color
          }} />
      </div>
      <div
        ref={destinationRef}
        className='c-gradient-dragger__handle'>
        <div
          className='c-gradient-dragger__circle'
          style={{
            background: (() => {
              return [...gradient.stops].reverse().reduce((result, current) => {
                if (current.position === result.position) {
                  result = current;
                }
                return result;
              }, gradient.stops[gradient.stops.length - 1]).color
            })()
          }} />
      </div>
    </div>
  );
}

export default GradientDragger;