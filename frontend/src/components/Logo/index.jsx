import logo from '../../logo.svg';

function Logo() {
    return (<div className="mt-2 mb-4 d-flex flex-column align-items-center">
        <div className="col text-center image-wrapper">
        <img src={logo} className="wrapped-img" alt="Logo" />
        </div>
    </div>);
}

export default Logo;