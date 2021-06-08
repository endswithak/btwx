import React, { ReactElement, useState, useEffect } from 'react';
import MenuArrangeDistributeHorizontally from './MenuArrangeDistributeHorizontally';
import MenuArrangeDistributeVertically from './MenuArrangeDistributeVertically';

interface MenuArrangeDistributeProps {
  setDistribute(distribute: any): void;
}

const MenuArrangeDistribute = (props: MenuArrangeDistributeProps): ReactElement => {
  const { setDistribute } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Distribute'
  });
  const [horizontal, setHorizontal] = useState(undefined);
  const [vertical, setVertical] = useState(undefined);

  useEffect(() => {
    if (horizontal && vertical) {
      setDistribute({
        ...menuItemTemplate,
        submenu: [horizontal, vertical]
      });
    }
  }, [horizontal, vertical]);

  return (
    <>
      <MenuArrangeDistributeHorizontally
        setHorizontal={setHorizontal} />
      <MenuArrangeDistributeVertically
        setVertical={setVertical} />
    </>
  );
};

export default MenuArrangeDistribute;