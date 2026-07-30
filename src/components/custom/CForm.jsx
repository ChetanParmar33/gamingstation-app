import React from 'react';
import { Form } from 'antd';

export const CForm = React.forwardRef((props, ref) => {
  return <Form ref={ref} {...props} />;
});

CForm.Item = (props) => {
  return <Form.Item {...props} />;
};

CForm.useForm = Form.useForm;

CForm.displayName = 'CForm';
CForm.Item.displayName = 'CForm.Item';
