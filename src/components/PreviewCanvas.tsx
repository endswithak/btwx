/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useEffect, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import CanvasArtboardLayer from './CanvasArtboardLayer';
import touchCursorSvg from '../../assets/cursor/touch.svg';

interface PreviewCanvasProps {
  touchCursor: boolean;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const { touchCursor } = props;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tweening = useSelector((state: RootState) => state.preview.tweening !== null);
  const artboards = useSelector((state: RootState) => state.layer.present.byId.root.children);
  const activeArtboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const [ready, setReady] = useState(false);

  const handleResize = (): void => {
    paperPreview.view.viewSize = new paperPreview.Size(
      canvasContainerRef.current.clientWidth,
      canvasContainerRef.current.clientHeight
    );
    paperPreview.view.center = new paperPreview.Point(activeArtboardItem.frame.x, activeArtboardItem.frame.y);
  }

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
    paperPreview.view.center = new paperPreview.Point(activeArtboardItem.frame.x, activeArtboardItem.frame.y);
    window.addEventListener('resize', handleResize);
    setReady(true);
    return (): void => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      <div
        className='c-canvas'
        ref={canvasContainerRef}
        style={{
          cursor: touchCursor ? `url(${touchCursorSvg}) 13 13, auto` : 'default'
        }}>
        <canvas
          id='canvas-preview'
          ref={canvasRef}
          style={{
            pointerEvents: tweening ? 'none' : 'auto'
          }} />
        {
          ready
          ? artboards.map((id) => (
              <CanvasArtboardLayer
                key={id}
                id={id}
                paperScope='preview' />
            ))
          : null
        }
      </div>
    </>
  );
}

export default PreviewCanvas;