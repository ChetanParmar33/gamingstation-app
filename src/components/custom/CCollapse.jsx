import React from 'react';
import { Collapse } from 'antd';

export const CCollapse = React.forwardRef((props, ref) => {
  return (
    <Collapse
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

CCollapse.Panel = Collapse.Panel;

CCollapse.displayName = 'CCollapse';
CCollapse.Panel.displayName = 'CCollapse.Panel';
