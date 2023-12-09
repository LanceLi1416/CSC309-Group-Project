import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField, useFormikContext } from 'formik';

const MultipleImagesUploadButton = ({ name, accept, placeholder }) => {
  const { setFieldValue } = useFormikContext();
  const [, meta] = useField(name);

  const handleImageChange = (e) => {
    const files = e.target.files;
    setFieldValue(name, files);
  };

  return (
    <>
      <Form.Group controlId="avatar">
        <Form.Label>{placeholder}</Form.Label>
        <Form.Control
          type="file"
          name={name}
          accept={accept}
          onChange={(e) => { handleImageChange(e); }}
          multiple  // Allow multiple file selection
          isInvalid={meta.touched && !!meta.error}
        />
        {meta.touched && meta.error && (
          <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
        )}
      </Form.Group>
    </>
  );
};

export default MultipleImagesUploadButton;
