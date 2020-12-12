/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { importPaperJSON } from '../store/selectors/layer';

interface CanvasArtboardProps {
  id: string;
}

const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
  const { id } = props;
  const paperScopeIndex = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Artboard).paperScope);
  const paperJSON = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Artboard).paperJSON);
  const documentImages = useSelector((state: RootState) => state.documentSettings.images.byId);

  useEffect(() => {
    const paperScope = uiPaperScope.projects[paperScopeIndex];
    importPaperJSON({
      documentImages,
      paperJSON,
      paperScope
    });
    return () => {
      const item = uiPaperScope.projects[paperScopeIndex].getItem({data: {id}});
      if (item) {
        item.remove();
      }
    }
  }, [id]);

  return (
    <></>
  );
}

export default CanvasArtboard;

// const mapStateToProps = (state: RootState, ownProps: CanvasArtboardProps): {
//   documentImages: {
//     [id: string]: Btwx.DocumentImage;
//   };
//   paperScope: number;
//   paperJSON: string;
// } => {
//   const { layer, documentSettings } = state;
//   const artboardItem = layer.present.byId[ownProps.id] as Btwx.Artboard;
//   const paperScope = artboardItem.paperScope;
//   const paperJSON = artboardItem.paperJSON;
//   return {
//     documentImages: documentSettings.images.byId,
//     paperScope: paperScope,
//     paperJSON: paperJSON
//   };
// };

// export default connect(
//   mapStateToProps
// )(CanvasArtboard);