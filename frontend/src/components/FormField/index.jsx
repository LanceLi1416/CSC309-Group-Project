import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

function FormField({ id, width, type, placeholder, name, value, handleChange, error, label }) {
    return (
        <Form.Group as={Col} md={width} controlId={id}>
            {label && <Form.Label className="fw-bold">{label}</Form.Label>}
            <Form.Control
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={handleChange}
                isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default FormField;