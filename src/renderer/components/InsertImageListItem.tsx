/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPrettyAccelerator } from '../utils';
import { addImageThunk } from '../store/actions/layer';
import ListItem from './ListItem';

interface InsertImageListItemProps {
  closeDropdown(): void;
}

const InsertImageListItem = (props: InsertImageListItemProps): ReactElement => {
  const { closeDropdown } = props;
  const imageAccelerator = useSelector((state: RootState) => getPrettyAccelerator(state.keyBindings.insert.image));
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', function() {
      let image = new Image();
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        dispatch(addImageThunk({
          layer: {
            name: file.name,
            frame: {
              x: 0,
              y: 0,
              width,
              height,
              innerWidth: width,
              innerHeight: height
            },
            originalDimensions: {
              width,
              height
            }
          },
          base64: this.result as string
        }));
        closeDropdown();
      }
      image.src = this.result as string;
    }, false);
    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  return (
    <ListItem
      disabled={activeArtboard === null}
      interactive
      as='label'>
      <input
        style={{
          position: 'absolute',
          zIndex: -1
        }}
        type='file'
        accept='image/*'
        onChange={handleChange} />
      <ListItem.Icon name='image' />
      <ListItem.Body>
        <ListItem.Text size='small'>
          Image
        </ListItem.Text>
      </ListItem.Body>
      <ListItem.Right>
        <ListItem.Text
          size='small'
          variant='lighter'>
          { imageAccelerator }
        </ListItem.Text>
      </ListItem.Right>
    </ListItem>
  );
}

export default InsertImageListItem;