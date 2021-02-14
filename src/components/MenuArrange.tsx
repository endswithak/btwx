import React, { ReactElement, useState, useEffect } from 'react';
import MenuArrangeBringForward from './MenuArrangeBringForward';
import MenuArrangeBringToFront from './MenuArrangeBringToFront';
import MenuArrangeSendBackward from './MenuArrangeSendBackward';
import MenuArrangeSendToBack from './MenuArrangeSendToBack';
import MenuArrangeAlign from './MenuArrangeAlign';
import MenuArrangeDistribute from './MenuArrangeDistribute';
import MenuArrangeGroup from './MenuArrangeGroup';
import MenuArrangeUngroup from './MenuArrangeUngroup';

interface MenuArrangeProps {
  menu: Electron.Menu;
  setArrange(arrange: any): void;
}

const MenuArrange = (props: MenuArrangeProps): ReactElement => {
  const { menu, setArrange } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Arrange'
  });
  const [bringForward, setBringForward] = useState(undefined);
  const [bringToFront, setBringToFront] = useState(undefined);
  const [sendBackward, setSendBackward] = useState(undefined);
  const [sendToBack, setSendToBack] = useState(undefined);
  const [align, setAlign] = useState(undefined);
  const [distribute, setDistribute] = useState(undefined);
  const [group, setGroup] = useState(undefined);
  const [ungroup, setUngroup] = useState(undefined);

  useEffect(() => {
    if (bringForward && bringToFront && sendBackward && sendToBack && align && distribute && group && ungroup) {
      setArrange({
        ...menuItemTemplate,
        submenu: [
          bringForward,
          bringToFront,
          sendBackward,
          sendToBack,
          { type: 'separator' },
          align,
          distribute,
          { type: 'separator' },
          group,
          ungroup
        ]
      });
    }
  }, [bringForward, bringToFront, sendBackward, sendToBack, align, distribute, group, ungroup]);

  return (
    <>
      <MenuArrangeBringForward
        menu={menu}
        setBringForward={setBringForward} />
      <MenuArrangeBringToFront
        menu={menu}
        setBringToFront={setBringToFront} />
      <MenuArrangeSendBackward
        menu={menu}
        setSendBackward={setSendBackward} />
      <MenuArrangeSendToBack
        menu={menu}
        setSendToBack={setSendToBack} />
      <MenuArrangeAlign
        menu={menu}
        setAlign={setAlign} />
      <MenuArrangeDistribute
        menu={menu}
        setDistribute={setDistribute} />
      <MenuArrangeGroup
        menu={menu}
        setGroup={setGroup} />
      <MenuArrangeUngroup
        menu={menu}
        setUngroup={setUngroup} />
    </>
  );
};

export default MenuArrange;