import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerCombineUnion';

interface MenuLayerCombineUnionProps {
  isEnabled?: boolean;
  applyBooleanOperationThunk?(operation: Btwx.BooleanOperation): void;
}

const MenuLayerCombineUnion = (props: MenuLayerCombineUnionProps): ReactElement => {
  const { isEnabled, applyBooleanOperationThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      applyBooleanOperationThunk('unite');
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const isEnabled = canBooleanSelected(state);
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(MenuLayerCombineUnion);