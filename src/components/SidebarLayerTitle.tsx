import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setLayerName } from '../store/actions/layer';
import { LayerTypes, SetLayerNamePayload } from '../store/actionTypes/layer';
import { setEditing, setEdit } from '../store/actions/leftSidebar';
import { SetEditingPayload, SetEditPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { RootState } from '../store/reducers';
import SidebarInput from './SidebarInput';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerTitleProps {
  id: string;
  name?: string;
  isDragGhost?: boolean;
  isArtboard?: boolean;
  isSelected?: boolean;
  editing?: boolean;
  edit?: string;
  setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
  setEdit?(payload: SetEditPayload): LeftSidebarTypes;
  setLayerName?(payload: SetLayerNamePayload): LayerTypes;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id, name, isArtboard, isSelected, setEditing, setLayerName, editing, edit, setEdit } = props;
  // const [nameInput, setNameInput] = useState(editing ? edit : name);

  // useEffect(() => {
  //   if (editing) {
  //     setNameInput(name);
  //   }
  // }, []);

  useEffect(() => {
    console.log('LAYER TITLE');
  }, []);

  const handleSubmit = () => {
    if (edit.replace(/\s/g, '').length > 0 && edit !== name) {
      setLayerName({id: id, name: edit});
    }
    setEditing({editing: null});
  }

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // setNameInput((e.target as HTMLInputElement).value);
    setEdit({edit: (e.target as HTMLInputElement).value});
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
            value={editing ? edit : name}
            onSubmit={handleSubmit}
            submitOnBlur
            removedOnSubmit
            selectOnMount />
        : name
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerTitleProps): {
  name: string;
  isSelected: boolean;
  isArtboad: boolean;
  editing: boolean;
  edit: string;
} => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const name = layerItem.name;
  const isArtboad = layerItem.type === 'Artboard';
  const isSelected = layerItem.selected;
  const editing = leftSidebar.editing === ownProps.id && !ownProps.isDragGhost;
  const edit = leftSidebar.edit;
  return { name, isSelected, isArtboad, editing, edit };
};

export default connect(
  mapStateToProps,
  { setLayerName, setEditing, setEdit }
)(SidebarLayerTitle);

// import React, { useContext, ReactElement, useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { setLayerName } from '../store/actions/layer';
// import { LayerTypes, SetLayerNamePayload } from '../store/actionTypes/layer';
// import { setEditing, setEdit } from '../store/actions/leftSidebar';
// import { SetEditingPayload, SetEditPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
// import { RootState } from '../store/reducers';
// import SidebarInput from './SidebarInput';
// import { ThemeContext } from './ThemeProvider';

// interface SidebarLayerTitleProps {
//   id: string;
//   name: string;
//   type: Btwx.LayerType;
//   selected: boolean;
//   isDragGhost?: boolean;
//   isArtboard?: boolean;
//   isSelected?: boolean;
//   layerName?: string;
//   editing?: boolean;
//   edit?: string;
//   setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
//   setEdit?(payload: SetEditPayload): LeftSidebarTypes;
//   setLayerName?(payload: SetLayerNamePayload): LayerTypes;
// }

// const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { id, name, type, selected, setEditing, setLayerName, editing, edit, setEdit } = props;
//   // const [nameInput, setNameInput] = useState(editing ? edit : name);

//   // useEffect(() => {
//   //   if (editing) {
//   //     setNameInput(name);
//   //   }
//   // }, []);

//   const handleSubmit = () => {
//     if (edit.replace(/\s/g, '').length > 0 && edit !== name) {
//       setLayerName({id: id, name: edit});
//     }
//     setEditing({editing: null});
//   }

//   const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
//     // setNameInput((e.target as HTMLInputElement).value);
//     setEdit({edit: (e.target as HTMLInputElement).value});
//   }

//   return (
//     <div
//       className={`
//         c-sidebar-layer__name
//         ${editing
//           ? 'c-sidebar-layer__name--editing'
//           : null
//         }
//         ${type === 'Artboard'
//           ? 'c-sidebar-layer__name--artboard'
//           : null
//         }`
//       }
//       style={{
//         color: selected
//         ? theme.text.onPrimary
//         : theme.text.base
//       }}>
//       {
//         editing
//         ? <SidebarInput
//             onChange={handleChange}
//             value={editing ? edit : name}
//             onSubmit={handleSubmit}
//             submitOnBlur
//             removedOnSubmit
//             selectOnMount />
//         : name
//       }
//     </div>
//   );
// }

// const mapStateToProps = (state: RootState, ownProps: SidebarLayerTitleProps): {
//   editing: boolean;
//   edit: string;
// } => {
//   const { leftSidebar } = state;
//   const editing = leftSidebar.editing === ownProps.id && !ownProps.isDragGhost;
//   const edit = leftSidebar.edit;
//   return { editing, edit };
// };

// export default connect(
//   mapStateToProps,
//   { setLayerName, setEditing, setEdit }
// )(SidebarLayerTitle);