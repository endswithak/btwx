import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setLayerName } from '../store/actions/layer';
import { LayerTypes, SetLayerNamePayload } from '../store/actionTypes/layer';
import { setEditing } from '../store/actions/leftSidebar';
import { SetEditingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerTitleProps {
  layer: string;
  isDragGhost?: boolean;
  editing?: boolean;
  isArtboard?: boolean;
  isSelected?: boolean;
  layerName?: string;
  setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
  setLayerName?(payload: SetLayerNamePayload): LayerTypes;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isArtboard, isSelected, layerName, layer, editing, setEditing, setLayerName } = props;
  const [nameInput, setNameInput] = useState(layerName);

  useEffect(() => {
    if (isSelected) {
      setNameInput(layerName);
    }
  }, [isSelected]);

  const handleSubmit = () => {
    if (nameInput.replace(/\s/g, '').length > 0 && nameInput !== layerName) {
      setLayerName({id: layer, name: nameInput});
    }
    setEditing({editing: null});
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setNameInput((e.target as HTMLInputElement).value);
  }

  return (
    <div
      className={`
        c-sidebar-layer__name
        ${editing
          ? 'c-sidebar-layer__name--editing'
          : null
        }
        ${isArtboard
          ? 'c-sidebar-layer__name--artboard'
          : null
        }`
      }
      style={{
        color: isSelected
        ? theme.text.onPrimary
        : theme.text.base
      }}>
      {
        editing
        ? <SidebarInput
            onChange={handleChange}
            value={nameInput}
            onSubmit={handleSubmit}
            submitOnBlur
            removedOnSubmit
            selectOnMount />
        : layerName
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerTitleProps): {
  editing: boolean;
  isArtboard: boolean;
  isSelected: boolean;
  layerName: string;
} => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const layerName = layerItem.name;
  const editing = leftSidebar.editing === ownProps.layer && !ownProps.isDragGhost;
  const isArtboard = layerItem.type === 'Artboard';
  const isSelected = layerItem.selected && !ownProps.isDragGhost;
  return { editing, isArtboard, isSelected, layerName };
};

export default connect(
  mapStateToProps,
  { setLayerName, setEditing }
)(SidebarLayerTitle);