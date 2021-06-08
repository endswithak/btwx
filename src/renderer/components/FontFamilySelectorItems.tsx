import React, { ReactElement, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { setLayersFontFamilyThunk } from '../store/actions/layer';
import { setTextSettingsFontFamily } from '../store/actions/textSettings';
import LoadingIndicator from './LoadingIndicator';
import EmptyState from './EmptyState';
import Form from './Form';

interface FontFamilySelectorItemsProps {
  itemData: { value: string; label: string }[];
  search: string;
  searching: boolean;
  loading: boolean;
}

const FontFamilySelectorItems = (props: FontFamilySelectorItemsProps): ReactElement => {
  const formControlRef = useRef<HTMLSelectElement>(null);
  const { itemData, search, searching, loading } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontsLoaded = useSelector((state: RootState) => state.textSettings.ready);
  const fontFamilyValue = useSelector((state: RootState) => getSelectedFontFamily(state));
  const [fontFamily, setFontFamily] = useState(fontFamilyValue);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== 'multi') {
      setFontFamily(e.target.value);
      dispatch(setLayersFontFamilyThunk({
        layers: selected,
        fontFamily: e.target.value
      }));
      dispatch(setTextSettingsFontFamily({
        fontFamily: e.target.value
      }));
    }
  }

  return (
    <div className='c-font-family-selector__items'>
      {
        !fontsLoaded || loading
        ? <LoadingIndicator />
        : itemData && itemData.length > 0
          ? <Form inline>
              <Form.Group controlId='control-font-family-selector'>
                <Form.Control
                  ref={formControlRef}
                  as='select'
                  value={searching ? undefined : fontFamily}
                  htmlSize={8}
                  type='text'
                  onChange={handleChange}
                  required
                  style={{
                    boxShadow: 'none',
                    background: 'none'
                  }}>
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
                          height: 32,
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