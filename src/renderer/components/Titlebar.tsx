import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

const Titlebar = (): ReactElement => {
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const windowType = useSelector((state: RootState) => state.session.windowType);
  const unsavedEdits = useSelector((state: RootState) => state.layer.present.edit.id !== state.documentSettings.edit);
  const documentName = useSelector((state: RootState) => state.documentSettings.name);
  const recording = useSelector((state: RootState) => state.preview.recording);

  const handleDoubleClick = () => {
    if (windowType === 'document') {
      (window as any).api.maximizeDocument(JSON.stringify({
        instanceId: instanceId
      }));
    }
  }

  useEffect(() => {
    if (windowType === 'document') {
      if (unsavedEdits) {
        (window as any).api.setDocumentEdited(JSON.stringify({
          instanceId: instanceId,
          edited: true
        }));
      } else {
        (window as any).api.setDocumentEdited(JSON.stringify({
          instanceId: instanceId,
          edited: false
        }));
      }
    }
  }, [unsavedEdits]);

  return (
    <div
      id={`${instanceId}-${windowType}-titlebar`}
      className={`c-titlebar${
        recording && windowType === 'document'
        ? `${' '}c-titlebar--recording`
        : ''
      }`}
      onDoubleClick={handleDoubleClick}>
      <span>
        <span className='c-titlebar__title'>
          {
            windowType !== 'document'
            ? ''
            : documentName
          }
        </span>
        {
          unsavedEdits && windowType === 'document'
          ? <span className='c-titlebar__unsaved-indicator'>
              (unsaved changes)
            </span>
          : null
        }
      </span>
    </div>
  );
}

export default Titlebar;