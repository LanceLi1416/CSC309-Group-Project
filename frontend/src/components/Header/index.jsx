import { Col } from 'react-bootstrap';

function Header({header, subheader}) {
  return (<Col>
    <h1>{header}</h1>
    <p>{subheader}</p>
  </Col>);
}

export default Header;