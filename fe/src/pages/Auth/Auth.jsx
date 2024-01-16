import { useContext, useEffect } from 'react';
import {Navigate, Route, Routes, useNavigate, Link} from 'react-router-dom';
import Register from './Component/Register';
import Login from './Component/Login';
import { LoginContext } from '../../store';


export default function Auth() {
  const navigate = useNavigate();

  const [loggedIn] = useContext(LoginContext)

  useEffect(() => {
    if (loggedIn) {
      navigate('/myarticle');
    }
  }, [loggedIn]);

  return (
    <>
    <h5>Auth</h5>
    <Link to='/'>Back to Home</Link>
    <br />
    <br />
    <br />
    <button onClick={() =>navigate('/auth/login')}>Login</button>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button onClick={() => navigate('/auth/register')}>Register</button>
    <Routes>
      <Route path='*' element={<Navigate to="login" replace={true} />} />
      <Route path='/register' Component={Register} />
      <Route path='/login' Component={Login} />
    </Routes>
    </>
  )
}
