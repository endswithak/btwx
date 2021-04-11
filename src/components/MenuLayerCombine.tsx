import React, { ReactElement, useState, useEffect } from 'react';
import MenuLayerCombineUnion from './MenuLayerCombineUnion';
import MenuLayerCombineSubtract from './MenuLayerCombineSubtract';
import MenuLayerCombineIntersect from './MenuLayerCombineIntersect';
import MenuLayerCombineDifference from './MenuLayerCombineDifference';

interface MenuLayerCombineProps {
  setCombine(combine: any): void;
}

const MenuLayerCombine = (props: MenuLayerCombineProps): ReactElement => {
  const { setCombine } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Combine'
  });
  const [union, setUnion] = useState(undefined);
  const [subtract, setSubtract] = useState(undefined);
  const [intersect, setIntersect] = useState(undefined);
  const [difference, setDifference] = useState(undefined);

  useEffect(() => {
    if (union && subtract && intersect && difference) {
      setCombine({
        ...menuItemTemplate,
        submenu: [union, subtract, intersect, difference]
      });
    }
  }, [union, subtract, intersect, difference]);

  return (
    <>
      <MenuLayerCombineUnion
        setUnion={setUnion} />
      <MenuLayerCombineSubtract
        setSubtract={setSubtract} />
      <MenuLayerCombineIntersect
        setIntersect={setIntersect} />
      <MenuLayerCombineDifference
        setDifference={setDifference} />
    </>
  );
};

export default MenuLayerCombine;