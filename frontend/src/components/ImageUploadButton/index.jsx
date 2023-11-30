import Form from 'react-bootstrap/Form';
import { useField, useFormikContext } from 'formik';

const ImageUploadButton = ({ name, accept, placeholder }) => {
    const { setFieldValue } = useFormikContext();
    const [, meta] = useField(name);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setFieldValue(name, file);
    };
  
    return (<>
        <Form.Group controlId="avatar">
            <Form.Label className='fw-bold'>{placeholder}</Form.Label>
            <Form.Control type="file" name={name} accept={accept} onChange={(e) => {handleImageChange(e);}} isInvalid={meta.touched && !!meta.error}/>
            {meta.touched && meta.error && (<Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>)}
        </Form.Group>
    </>);
};

export default ImageUploadButton;