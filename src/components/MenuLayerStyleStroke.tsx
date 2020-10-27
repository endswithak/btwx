import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedStrokeThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedStrokesEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleStroke';

interface MenuLayerStyleStrokeProps {
  isEnabled?: boolean;
  isChecked?: boolean;
  toggleSelectedStrokeThunk?(): void;
}

const MenuLayerStyleStroke = (props: MenuLayerStyleStrokeProps): ReactElement => {
  const { isEnabled, isChecked, toggleSelectedStrokeThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleSelectedStrokeThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  isChecked: boolean;
} => {
  const isEnabled = canToggleSelectedFillOrStroke(state);
  const isChecked = selectedStrokesEnabled(state);
  return { isEnabled, isChecked };
};

export default connect(
  mapStateToProps,
  { toggleSelectedStrokeThunk }
)(MenuLayerStyleStroke);