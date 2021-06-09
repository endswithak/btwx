import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { bufferToBase64 } from '../utils';
import { RootState } from '../store/reducers';

const SessionImages = (): ReactElement => {
  const sessionImages = useSelector((state: RootState) => state.session.images);

  return (
    <>
      {
        sessionImages && sessionImages.allIds.length > 0
        ? sessionImages.allIds.map((id) => {
          const sessionImage = sessionImages.byId[id];
          const base64 = bufferToBase64(sessionImage.buffer);
          const ext = sessionImage.ext;
          return (
            <img
              key={id}
              id={id}
              src={`data:image/${ext};base64,${base64}`}
              style={{
                position: 'absolute',
                left: -9999999999999999
              }} />
          )
        })
        : null
      }
    </>
  );
}

export default SessionImages;