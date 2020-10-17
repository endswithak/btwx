import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuArrangeAlignProps {
  canAlign?: boolean;
  focusing?: boolean;
}

const MenuArrangeAlign = (props: MenuArrangeAlignProps): ReactElement => {
  const { canAlign, focusing } = props;

  useEffect(() => {
    setMenuItems({
      arrangeAlignLeft: {
        id: 'arrangeAlignLeft',
        enabled: focusing && canAlign
      },
      arrangeAlignHorizontally: {
        id: 'arrangeAlignHorizontally',
        enabled: focusing && canAlign
      },
      arrangeAlignRight: {
        id: 'arrangeAlignRight',
        enabled: focusing && canAlign
      },
      arrangeAlignTop: {
        id: 'arrangeAlignTop',
        enabled: focusing && canAlign
      },
      arrangeAlignVertically: {
        id: 'arrangeAlignVertically',
        enabled: focusing && canAlign
      },
      arrangeAlignBottom: {
        id: 'arrangeAlignBottom',
        enabled: focusing && canAlign
      }
    });
  }, [canAlign, focusing]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canAlign: boolean;
  focusing: boolean;
} => {
  const { selection, canvasSettings } = state;
  const canAlign = selection.canAlign;
  const focusing = canvasSettings.focusing;
  return { canAlign, focusing };
};

export default connect(
  mapStateToProps
)(MenuArrangeAlign);