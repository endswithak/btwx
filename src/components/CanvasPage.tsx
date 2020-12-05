/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import { uiPaperScope } from '../canvas';
import { connect } from 'react-redux';
import { importPaperProject } from '../store/selectors/layer';
import { RootState } from '../store/reducers';

// interface CanvasPageProps {
//   documentImages?: {
//     [id: string]: Btwx.DocumentImage;
//   };
//   matrix?: number[];
//   paperJSON?: string;
// }

const CanvasPage = (): ReactElement => {
  // const ref = useRef<HTMLCanvasElement>(null);
  // const { paperJSON, documentImages, matrix } = props;

  useEffect(() => {
    // uiPaperScope.setup(document.getElementById(`canvas-artboard-0`) as HTMLCanvasElement);
    [...Array(33).keys()].forEach((scope, index) => {
      new uiPaperScope.Project(document.getElementById(`canvas-artboard-${index}`) as HTMLCanvasElement);
    });
  }, []);

  return (
    <>
      {
        [...Array(33).keys()].map((key, index) => (
          <canvas
            key={index}
            id={`canvas-artboard-${index}`}
            className='c-canvas__layer c-canvas__layer--artboard' />
        ))
      }
    </>
    // <canvas
    //   id='canvas-page'
    //   className='c-canvas__layer c-canvas__layer--page'
    //   ref={ref} />
  );
}

export default CanvasPage;

// const mapStateToProps = (state: RootState): {
//   documentImages: {
//     [id: string]: Btwx.DocumentImage;
//   };
//   matrix: number[];
//   // paperJSON: string;
// } => {
//   const { layer, documentSettings } = state;
//   const page = layer.present.byId['page'] as Btwx.Page;
//   return {
//     documentImages: documentSettings.images.byId,
//     // matrix: documentSettings.matrix,
//     // paperJSON: page.paperJSON
//   };
// };

// export default connect(
//   mapStateToProps
// )(CanvasPage);