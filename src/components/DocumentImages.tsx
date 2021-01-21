import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { bufferToBase64 } from '../utils';
import { RootState } from '../store/reducers';

const DocumentImages = (): ReactElement => {
  const documentImages = useSelector((state: RootState) => state.documentSettings.images);

  return (
    <>
      {
        documentImages.allIds.map((id, index) => {
          const base64 = bufferToBase64(Buffer.from(documentImages.byId[id].buffer));
          return (
            <img
              key={id}
              id={id}
              src={`data:image/webp;base64,${base64}`}
              style={{
                position: 'absolute',
                left: -9999999999999999
              }} />
          )
        })
      }
    </>
  );
}

export default DocumentImages;