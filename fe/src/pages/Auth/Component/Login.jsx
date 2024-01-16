import { useContext, useRef } from 'react';
import axios from 'axios';
import { LoginContext } from '../../../store';


export default function Login() {
  const loginRef = useRef();
  const [_, setLoggedIn] = useContext(LoginContext);



    function onSubmitHandler(e){
        e.preventDefault();
        const formData = new FormData(loginRef.current);
        const formProps = Object.fromEntries(formData);
        axios.post('http://localhost:5000/user/login', formProps).then(res => {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('email', formProps.email);
          setLoggedIn(true);
        }).catch(err => console.error(err.response.data))
    }

  return (
    <>
    <h2>Login</h2>
    <form action="" method="post" ref={loginRef} onSubmit={onSubmitHandler}>

        <input type="email" name='email' placeholder='email' />
        <input type="password" name='password' placeholder='password' />
        <button type="submit">Login</button>
        

    </form>
    </>
  )
}
