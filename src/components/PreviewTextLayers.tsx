/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardTextLayers } from '../store/selectors/layer';

interface PreviewTextLayerProps {
  id: string;
}

const PreviewTextLayerLines = (props: PreviewTextLayerProps): ReactElement => {
  const { id } = props;
  const textLines = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Text).lines);
  const maxLines = useSelector((state: RootState) => {
    const layerItem = state.layer.present.byId[id] as Btwx.Text;
    return layerItem.tweens.byProp.text.reduce((result, current) => {
      const tween = state.layer.present.tweens.byId[current];
      const destinationText = tween.layer === id ? tween.destinationLayer : tween.layer;
      const destinationLineCount = (state.layer.present.byId[destinationText] as Btwx.Text).lines.length;
      return Math.max(result, destinationLineCount);
    }, layerItem.lines.length);
  });

  return (
    <>
      {
        [...Array(maxLines).keys()].map((line, index) => (
          <div
            id={`${id}-${index}`}
            key={index}>
            { textLines[index] ? textLines[index].text : '' }
          </div>
        ))
      }
    </>
  );
}

const PreviewTextLayers = (): ReactElement => {
  const activeArtboardTextLayers = useSelector((state: RootState) => getActiveArtboardTextLayers(state));

  return (
    <div style={{
      zIndex: -999999999999,
      position: 'absolute',
      left: -999999999999
    }}>
      {
        activeArtboardTextLayers.map((id, index) => (
          <PreviewTextLayerLines
            id={id}
            key={index} />
        ))
      }
    </div>
  );
}

export default PreviewTextLayers;