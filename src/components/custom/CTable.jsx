import React from 'react';
import { Table } from 'antd';

export const CTable = React.forwardRef((props, ref) => {
  return (
    <Table
      ref={ref}
      {...props}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--glass-shadow)',
        ...props.style
      }}
    />
  );
});

CTable.displayName = 'CTable';
