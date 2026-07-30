import React from 'react';
import { Card } from 'antd';

export const CCard = React.forwardRef((props, ref) => {
  return (
    <Card
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

CCard.displayName = 'CCard';
