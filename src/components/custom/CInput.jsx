import React from 'react';
import { Input } from 'antd';

export const CInput = React.forwardRef((props, ref) => {
  return <Input ref={ref} {...props} style={{ borderRadius: '8px', ...props.style }} />;
});

CInput.Password = React.forwardRef((props, ref) => {
  return <Input.Password ref={ref} {...props} style={{ borderRadius: '8px', ...props.style }} />;
});

CInput.TextArea = React.forwardRef((props, ref) => {
  return <Input.TextArea ref={ref} {...props} style={{ borderRadius: '8px', ...props.style }} />;
});

CInput.displayName = 'CInput';
CInput.Password.displayName = 'CInput.Password';
CInput.TextArea.displayName = 'CInput.TextArea';
