import React from 'react';
import { Select } from 'antd';

export const CSelect = React.forwardRef((props, ref) => {
  return (
    <Select
      ref={ref}
      {...props}
      style={{
        borderRadius: '8px',
        ...props.style
      }}
    />
  );
});

CSelect.Option = Select.Option;

CSelect.displayName = 'CSelect';
CSelect.Option.displayName = 'CSelect.Option';
