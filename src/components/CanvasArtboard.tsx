// /* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { ReactElement, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { paperMain } from '../canvas';
// import { RootState } from '../store/reducers';
// import { importProjectJSON } from '../store/selectors/layer';

// interface CanvasArtboardProps {
//   id: string;
// }

// const CanvasArtboard = (props: CanvasArtboardProps): ReactElement => {
//   const { id } = props;
//   const projectIndex = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Artboard).projectIndex);
//   const json = useSelector((state: RootState) => (state.layer.present.byId[id] as Btwx.Artboard).json);
//   const documentImages = useSelector((state: RootState) => state.documentSettings.images.byId);

//   useEffect(() => {
//     const project = paperMain.projects[projectIndex];
//     importProjectJSON({
//       documentImages,
//       json,
//       project
//     });
//     return () => {
//       const item = paperMain.projects[projectIndex].getItem({data: {id}});
//       if (item) {
//         item.remove();
//       }
//     }
//   }, [id]);

//   return (
//     <></>
//   );
// }

// export default CanvasArtboard;