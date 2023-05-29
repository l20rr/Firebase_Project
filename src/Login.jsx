import React from 'react';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { useCookies } from 'react-cookie';
import { atob } from 'atob';
import 'bootstrap/dist/css/bootstrap.min.css';
function Login() {
  const [cookies, setCookies] = useCookies(['email', 'password']);

  const handleSignIn = () => {
    const email = document.getElementById('form1').value;
    const password = document.getElementById('form2').value;

    // Criptografar a senha (usando um método de criptografia seguro)
    const encryptedPassword = encryptPassword(password);

    // Armazenar email e senha nos cookies
    setCookies('email', email);
    setCookies('password', encryptedPassword);

 
     window.location.href = '/home';
  };

  const encryptPassword = (password) => {
    // Implemente seu método de criptografia aqui
    return btoa(password); 
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBInput wrapperClass="mb-4" label="Email address" id="form1" type="email" />
      <MDBInput wrapperClass="mb-4" label="Password" id="form2" type="password" />

      <MDBBtn className="mb-4" onClick={handleSignIn}>
        Sign in
      </MDBBtn>
    </MDBContainer>
  );
}

export default Login;
