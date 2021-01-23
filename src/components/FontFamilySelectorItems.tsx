import React, { ReactElement, useContext, memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import FontFamilySelectorItem from './FontFamilySelectorItem';
import { ThemeContext } from './ThemeProvider';
import EmptyState from './EmptyState';

interface FontFamilySelectorItemsProps {
  itemData: { family: string; selected: boolean }[];
  search: string;
  searching: boolean;
}

const FontFamilySelectorItems = (props: FontFamilySelectorItemsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { itemData, search, searching } = props;

  const Node = memo(function Node(props: any) {
    const {data, index, style} = props;
    return (
      <FontFamilySelectorItem
        isActive={data[index].selected}
        fontFamily={data[index].family}
        style={style} />
    )
  });

  return (
    <div
      className='c-font-family-selector__items'>
      {
        itemData && itemData.length > 0
        ? <AutoSizer>
            {({height, width}): ReactElement => (
              <List
                itemSize={32}
                height={height}
                itemCount={itemData.length}
                itemData={itemData}
                width={width}>
                { Node }
              </List>
            )}
          </AutoSizer>
        : searching
          ? <EmptyState
              icon='search'
              text='No Typefaces Found'
              detail={`Could not find any typefaces matching "${search}"`}
              style={{width: 211}} />
          : <EmptyState
              icon='text'
              text='No Typefaces Found'
              style={{width: 211}} />
      }
    </div>
  );
}

export default FontFamilySelectorItems;