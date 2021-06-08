/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useContext } from 'react';
import EaseEditorSelectorItem from './EaseEditorSelectorItem';

interface EaseEditorSelectorItemsProps {
  items: any[];
}

const EaseEditorSelectorItems = (props: EaseEditorSelectorItemsProps): ReactElement => {
  const { items } = props;

  return (
    <>
      {
        items.map((item, index) => (
          <EaseEditorSelectorItem
            key={index}
            item={item} />
        ))
      }
    </>
  );
}

export default EaseEditorSelectorItems;