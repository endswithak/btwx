import React, { ReactElement } from 'react';
import Icon from './Icon';

interface EmptyStateProps {
  icon?: string;
  text: string | ReactElement;
  detail?: string | ReactElement;
  style?: any;
}

const EmptyState = (props: EmptyStateProps): ReactElement => {
  const { icon, text, detail, style } = props;
  return (
    <div className='c-empty-state'>
      <div className='c-empty-state__inner' style={{...style}}>
        {
          icon
          ? <div className='c-empty-state__icon'>
              <Icon name={icon} />
            </div>
          : null
        }
        <div className='c-empty-state__text'>
          { text }
        </div>
        {
          detail
          ? <div className='c-empty-state__detail'>
              { detail }
            </div>
          : null
        }
      </div>
    </div>
  );
}

export default EmptyState;