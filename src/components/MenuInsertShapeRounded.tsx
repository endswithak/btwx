import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeRounded';

interface MenuInsertShapeRoundedProps {
  canInsert?: boolean;
  isChecked?: boolean;
  toggleShapeToolThunk?(shapeType: Btwx.ShapeType): void;
}

const MenuInsertShapeRounded = (props: MenuInsertShapeRoundedProps): ReactElement => {
  const { canInsert, isChecked, toggleShapeToolThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canInsert;
    electronMenuItem.checked = isChecked;
  }, [canInsert, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleShapeToolThunk('Rounded');
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canInsert: boolean;
  isChecked: boolean;
} => {
  const { canvasSettings, shapeTool, layer } = state;
  const canInsert = canvasSettings.focusing && layer.present.activeArtboard !== null;
  const isChecked = canvasSettings.activeTool === 'Shape' && shapeTool.shapeType === 'Rounded';
  return { canInsert, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleShapeToolThunk }
)(MenuInsertShapeRounded);