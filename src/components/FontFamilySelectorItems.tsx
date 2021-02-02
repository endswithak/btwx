import React, { ReactElement, memo, useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { setLayersFontFamilyThunk } from '../store/actions/layer';
import LoadingIndicator from './LoadingIndicator';
import EmptyState from './EmptyState';
import Form from './Form';

interface FontFamilySelectorItemsProps {
  itemData: { value: string; label: string }[];
  search: string;
  searching: boolean;
}

const FontFamilySelectorItems = (props: FontFamilySelectorItemsProps): ReactElement => {
  const formControlRef = useRef<HTMLSelectElement>(null);
  const { itemData, search, searching } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontFamilyValue = useSelector((state: RootState) => getSelectedFontFamily(state));
  const [fontFamily, setFontFamily] = useState(fontFamilyValue);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== 'multi') {
      setFontFamily(e.target.value);
      dispatch(setLayersFontFamilyThunk({layers: selected, fontFamily: e.target.value}));
    }
  }

  return (
    <div className='c-font-family-selector__items'>
      {
        itemData && itemData.length > 0
        ? <Form>
            <Form.Group controlId='control-font-family'>
              <Form.Control
                ref={formControlRef}
                as='select'
                value={fontFamily}
                htmlSize={8}
                type='text'
                onChange={handleChange}
                required>
                {
                  itemData.map((ff: any, index) => (
                    <option
                      key={index}
                      value={ff.value}
                      style={{
                        fontFamily: ff.value,
                        padding: 8,
                        borderRadius: 4,
                        maxHeight: 32,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                      { ff.value }
                    </option>
                  ))
                }
              </Form.Control>
            </Form.Group>
          </Form>
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

// import React, { ReactElement, memo } from 'react';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import { FixedSizeList as List } from 'react-window';
// import FontFamilySelectorItem from './FontFamilySelectorItem';
// import EmptyState from './EmptyState';

// interface FontFamilySelectorItemsProps {
//   itemData: { family: string; selected: boolean }[];
//   search: string;
//   searching: boolean;
// }

// const FontFamilySelectorItems = (props: FontFamilySelectorItemsProps): ReactElement => {
//   const { itemData, search, searching } = props;

//   const Node = memo(function Node(props: any) {
//     const {data, index, style} = props;
//     return (
//       <FontFamilySelectorItem
//         active={data[index].selected}
//         fontFamily={data[index].family}
//         style={style} />
//     )
//   });

//   return (
//     <div className='c-font-family-selector__items'>
//       {
//         itemData && itemData.length > 0
//         ? <AutoSizer>
//             {({height, width}): ReactElement => (
//               <List
//                 itemSize={32}
//                 height={height}
//                 itemCount={itemData.length}
//                 itemData={itemData}
//                 width={width}>
//                 { Node }
//               </List>
//             )}
//           </AutoSizer>
//         : searching
//           ? <EmptyState
//               icon='search'
//               text='No Typefaces Found'
//               detail={`Could not find any typefaces matching "${search}"`}
//               style={{width: 211}} />
//           : <EmptyState
//               icon='text'
//               text='No Typefaces Found'
//               style={{width: 211}} />
//       }
//     </div>
//   );
// }

// export default FontFamilySelectorItems;