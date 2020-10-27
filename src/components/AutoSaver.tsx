/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import fs from 'fs';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface AutoSaverProps {
  saveEdit?: string;
}

const AutoSaver = (props: AutoSaverProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { saveEdit } = props;

  useEffect(() => {
    if (saveEdit) {

    }
  }, [saveEdit]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  saveEdit: string;
} => {
  const { documentSettings } = state;
  const saveEdit = documentSettings.edit;
  return { saveEdit };
};

export default connect(
  mapStateToProps
)(AutoSaver);