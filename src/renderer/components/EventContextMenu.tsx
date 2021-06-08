import React, { useEffect, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import MenuEventEdit from './MenuEventEdit';
import MenuEventDelete from './MenuEventDelete';

interface EventContextMenuProps {
  setEventContextMenu(EventContextMenu: any[] | null): void;
}

const EventContextMenu = (props: EventContextMenuProps): ReactElement => {
  const { setEventContextMenu } = props;
  const [eventEdit, setEventEdit] = useState(undefined);
  const [eventDelete, setEventDelete] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (eventEdit && eventDelete) {
      setEventContextMenu([
        eventEdit,
        eventDelete
      ]);
    }
  }, [eventEdit, eventDelete]);

  return (
    <>
      <MenuEventEdit
        setEventEdit={setEventEdit} />
      <MenuEventDelete
        setEventDelete={setEventDelete} />
    </>
  );
}

export default EventContextMenu;