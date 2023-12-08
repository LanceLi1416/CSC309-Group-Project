import logo from '../../assets/images/petpal.svg';

function Logo() {
    return (<div className="mt-3 mb-5 d-flex flex-column align-items-center">
        <div className="col text-center image-wrapper">
            <img src={logo} className="wrapped-img" alt="Logo"/>
        </div>
    </div>);
}

export default Logo;