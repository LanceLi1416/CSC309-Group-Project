import {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
import {Link, useNavigate} from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import {jwtDecode} from "jwt-decode";

function Login() {
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const submitHandler = (values) => {
        // TODO: endpoint url
        axios({
            method: "POST",
            url: API_URL + "api/token/",
            data: {
                "username": values.email,
                "password": values.password
            }
        }).then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // console.log(localStorage.getItem('access_token'));

            // Stores the user information in local storage
            const user_id = jwtDecode(response.data.access).user_id;
            axios({
                method: "GET",
                url: API_URL + "accounts/" + user_id + "/",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
            }).catch((error) => {
                // console.log(error.response.data.detail);
            });
            navigate("/");
        }).catch((error) => {
            // console.log(error.response.data.detail);
            setLoginError('Login failed: ' + error.response.data.detail);
        });
    };

    const {Formik} = formik;
    const schema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required'),
    });

    return (<>
        <Logo/>
        <Header header="Welcome Back to PetPal!" subheader="Login with your email address and password."/>
        <Formik
            validationSchema={schema}
            onSubmit={(values) => submitHandler(values)}
            initialValues={{email: '', password: ''}}
        >
            {({handleSubmit, handleChange, values, touched, errors}) => (
                <Form noValidate onSubmit={handleSubmit} className="centered-form mt-5">
                    <Row className="mb-3">
                        <FormField id="email" width="12" type="email" placeholder="Email" name="email"
                                   value={values.email} handleChange={handleChange}
                                   error={touched.email && errors.email}/>
                    </Row>
                    <Row className="mb-3">
                        <FormField id="password" width="12" type="password" placeholder="Password" name="password"
                                   value={values.password} handleChange={handleChange}
                                   error={touched.password && errors.password}/>
                    </Row>
                    <Button type="submit">Login</Button>
                </Form>
            )}
        </Formik>
        <div className="mt-2 text-center">
            Don't have a PetPal account yet? <Link to="/register">Sign up</Link>.
            {loginError && <p className='error-text'>{loginError}</p>}
        </div>
    </>);
}

export default Login;