import React, { useEffect, ReactElement, useState } from 'react';
import MenuTweenAddWiggle from './MenuTweenAddWiggle';

interface TweenLayerContextMenuProps {
  setTweenLayerContextMenu(TweenLayerContextMenu: any[] | null): void;
}

const TweenLayerContextMenu = (props: TweenLayerContextMenuProps): ReactElement => {
  const { setTweenLayerContextMenu } = props;
  const [addWiggle, setAddWiggle] = useState(undefined);

  useEffect(() => {
    if (addWiggle) {
      setTweenLayerContextMenu([
        addWiggle
      ]);
    }
  }, [addWiggle]);

  return (
    <>
      <MenuTweenAddWiggle
        setAddWiggle={setAddWiggle} />
    </>
  );
}

export default TweenLayerContextMenu;