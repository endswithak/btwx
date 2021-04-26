import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { bufferToBase64 } from '../utils';
import { RootState } from '../store/reducers';

const DocumentImages = (): ReactElement => {
  const documentImages = useSelector((state: RootState) => state.documentSettings.images);

  return (
    <>
      {
        documentImages && documentImages.allIds.length > 0
        ? documentImages.allIds.map((id) => {
          const documentImage = documentImages.byId[id];
          const base64 = bufferToBase64(Buffer.from(documentImage.buffer));
          const ext = documentImage.ext;
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

export default DocumentImages;