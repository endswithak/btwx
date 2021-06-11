import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

const SessionImages = (): ReactElement => {
  const sessionImages = useSelector((state: RootState) => state.session.images);

  return (
    <>
      {
        sessionImages && sessionImages.allIds.length > 0
        ? sessionImages.allIds.map((id) => {
          return (
            <img
              key={id}
              id={id}
              src={sessionImages.byId[id].base64}
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