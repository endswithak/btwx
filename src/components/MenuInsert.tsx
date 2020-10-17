import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuInsertProps {
  focusing?: boolean;
}

const MenuInsert = (props: MenuInsertProps): ReactElement => {
  const { focusing } = props;

  useEffect(() => {
    setMenuItems({
      insertArtboard: {
        id: 'insertArtboard',
        enabled: focusing
      },
      insertShapeRectangle: {
        id: 'insertShapeRectangle',
        enabled: focusing
      },
      insertShapeRounded: {
        id: 'insertShapeRounded',
        enabled: focusing
      },
      insertShapeEllipse: {
        id: 'insertShapeEllipse',
        enabled: focusing
      },
      insertShapeStar: {
        id: 'insertShapeStar',
        enabled: focusing
      },
      insertShapePolygon: {
        id: 'insertShapePolygon',
        enabled: focusing
      },
      insertShapeLine: {
        id: 'insertShapeLine',
        enabled: focusing
      },
      insertText: {
        id: 'insertText',
        enabled: focusing
      },
      insertImage: {
        id: 'insertImage',
        enabled: focusing
      }
    });
  }, [focusing]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  focusing: boolean;
} => {
  const { canvasSettings } = state;
  const focusing = canvasSettings.focusing;
  return { focusing };
};

export default connect(
  mapStateToProps
)(MenuInsert);