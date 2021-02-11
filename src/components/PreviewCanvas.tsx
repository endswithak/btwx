/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useEffect, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import CanvasArtboardLayer from './CanvasArtboardLayer';

interface PreviewCanvasProps {
  touchCursor: boolean;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const { touchCursor } = props;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const edit = useSelector((state: RootState) => state.layer.present.edit.id);
  const artboards = useSelector((state: RootState) => state.layer.present.byId.root.children);
  // const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardItem = useSelector((state: RootState) => state.layer.present.byId[state.layer.present.activeArtboard]);
  const [ready, setReady] = useState(false);
  const [prevEdit, setPrevEdit] = useState(edit);
  const [previewArtboards, setPreviewArtboards] = useState(artboards);

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

  useEffect(() => {
    if (prevEdit !== edit) {
      setPreviewArtboards([...artboards]);
      setPrevEdit(edit);
    }
  }, [edit]);

  return (
    <>
      <div
        className='c-canvas'
        ref={canvasContainerRef}
        style={{
          cursor: touchCursor ? `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAGqADAAQAAAABAAAAGgAAAABvAZQwAAADhElEQVRIDbWWT0tbQRTFk6hNrbYSFWyphUIWFdy4FFwZd25dKn4R134AP4Lixq0Ll4ILwaXLWLAtNKUVlFCxtol/0vO7fed1jJZCoRduZub+OefOvPfupFj4uxQVUpIyWsnqJHqbzbE/KCT+SQBHH0nLmfZlNg0FwK+krUzbmQ37PXmICBsEgA9MTExUlpeXR2q12tPx8fFHo6OjsavT09PbRqPR2t3dvdjY2Dir1+tNxX+TQnxvh91ErHukT8bGxkZWV1dfLS0tPSuXy9g5KgA81zRiO61Wq7C5uXm+srLy8eTk5Ez2S+mNlJyQlMgkg9PT0y+U+LparfYqigTHMUdMRlEIgKXj4+MbFfbh4ODgs9YX0pzMALJFdQMiebmzs1OtVCr4CPQuTOgqu8lY9zSbzc78/PyxyD5pzVFGcSaKZ6Ljer6/vz+R7MRn7WNTXr4bE5GLMIays5mZmbqO8Yts8czYelSicWhtba06NzfXrznABvfco3epkIhxsaxjPjw83KsTKW9vb5/LBlEHB9qvt2v88PDwjR48uzAY4D4y22QKca53RNHeVVEvSGlqauqt3saG7N/tKPMKi8RV/4L6/WsS/BTSXQyRzmUs8KaCyVRa4q2isnKtVhvM5qxTQD8nE9ivsFzYDX77YswwISqaqI+PMQumeogIRk2QjjLHMTFawPKuwOgRJiR0kyJHB1hJX7zPWsu8MhLwW1Iy5oj9rD1n7GSYwfEQeAQlSXHmyVrTO5L6fRLpGMEQYbyld2XpTmQZ1SR21qlmrtiJd5PnCzOwFdQx0RUNUgYeqr8tJwBgcHw8CzS1mcRjYGSYdPicKLqwDAgEJBAMGKPn3aT4U5vJA4POLn98sDg4shatXh+ZSWTKxTaTGiwtxsGOLdDRwZQjWhBJSJv7hFavuQE8pgTeGbZ4bTXa751HnrC+ZncUF2KAMhJc7mqq7NQdgRi/LABROcIcRSAKEjXV6+6mCgECSJtLi/tErZ51JGlMK2ae2u3L7eSCkV2Avt6jCuXmcqM3pb23t3c9Ozs7pC4MAGIgSKzY7ijXw8LCwvvs4uMu8incI+JIrkX2Y2tr61Kt/vHk5GR/by9v8x0CyExCpy6ur6+fLy4uvjs6OjqRzxeejziSAUnFIPSp7j8nfW5VfIx8J//65yQldMX/7e9WSsbcO/SzYUQ4FivPIj8mnN3yE/4Ik03mkJJbAAAAAElFTkSuQmCC) 12 12, auto` : 'default'
        }}>
        <canvas
          id='canvas-preview'
          ref={canvasRef} />
        {
          ready
          ? previewArtboards.map((id) => (
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