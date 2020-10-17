import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

// interface MenuFileProps {
//   focusing?: boolean;
// }

const MenuFile = (): ReactElement => {
  // const { focusing } = props;

  useEffect(() => {
    setMenuItems({
      fileSave: {
        id: 'fileSave',
        enabled: true
      },
      fileSaveAs: {
        id: 'fileSaveAs',
        enabled: true
      },
      fileOpen: {
        id: 'fileOpen',
        enabled: true
      },
      fileNew: {
        id: 'fileNew',
        enabled: true
      }
    });
  }, []);

  return (
    <></>
  );
}

export default MenuFile;

// const mapStateToProps = (state: RootState): {
//   focusing: boolean;
// } => {
//   const { canvasSettings } = state;
//   const focusing = canvasSettings.focusing;
//   return { focusing };
// };

// export default connect(
//   mapStateToProps
// )(MenuFile);