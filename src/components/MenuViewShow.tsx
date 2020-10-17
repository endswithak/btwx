import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuViewShowProps {
  layersOpen?: boolean;
  stylesOpen?: boolean;
  eventsOpen?: boolean;
}

const MenuViewShow = (props: MenuViewShowProps): ReactElement => {
  const { layersOpen, stylesOpen, eventsOpen } = props;

  useEffect(() => {
    setMenuItems({
      viewShowLayers: {
        id: 'viewShowLayers',
        checked: layersOpen,
        enabled: true
      }
    });
  }, [layersOpen]);

  useEffect(() => {
    setMenuItems({
      viewShowStyles: {
        id: 'viewShowStyles',
        checked: stylesOpen,
        enabled: true
      }
    });
  }, [stylesOpen]);

  useEffect(() => {
    setMenuItems({
      viewShowEvents: {
        id: 'viewShowEvents',
        checked: eventsOpen,
        enabled: true
      }
    });
  }, [eventsOpen]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  layersOpen: boolean;
  stylesOpen: boolean;
  eventsOpen: boolean;
} => {
  const { viewSettings } = state;
  const layersOpen = viewSettings.leftSidebar.isOpen;
  const stylesOpen = viewSettings.rightSidebar.isOpen;
  const eventsOpen = viewSettings.tweenDrawer.isOpen;
  return { layersOpen, stylesOpen, eventsOpen };
};

export default connect(
  mapStateToProps
)(MenuViewShow);