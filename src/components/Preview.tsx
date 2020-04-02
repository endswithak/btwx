import React, { useRef, useContext, useEffect, ReactElement } from 'react';

interface PreviewProps {
  globalState: any;
}

const Preview = (props: PreviewProps): ReactElement => {
  //const test = parse(props.globalState);
  return (
    <div
      className='c-preview'>
      <h1>Hello</h1>
    </div>
  );
}

export default Preview;