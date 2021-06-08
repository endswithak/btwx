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
  setArrange(arrange: any): void;
}

const MenuArrange = (props: MenuArrangeProps): ReactElement => {
  const { setArrange } = props;
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
        setBringForward={setBringForward} />
      <MenuArrangeBringToFront
        setBringToFront={setBringToFront} />
      <MenuArrangeSendBackward
        setSendBackward={setSendBackward} />
      <MenuArrangeSendToBack
        setSendToBack={setSendToBack} />
      <MenuArrangeAlign
        setAlign={setAlign} />
      <MenuArrangeDistribute
        setDistribute={setDistribute} />
      <MenuArrangeGroup
        setGroup={setGroup} />
      <MenuArrangeUngroup
        setUngroup={setUngroup} />
    </>
  );
};

export default MenuArrange;