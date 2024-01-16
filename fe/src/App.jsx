import axios from 'axios';
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import Home from './pages/Home';
import MyArticle from './pages/MyArticle/MyArticle';
import { LoginContext } from './store';
import { useLayoutEffect, useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loader, setLoader] = useState(false);

  let token, count=0;

  useLayoutEffect(() => {
    token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  axios.interceptors.request.use((req) => {
    if(!token){
      token = localStorage.getItem('token');
    }
    if(token){
      req.headers.Authorization = `Bearer ${token}`;
    }
    setLoader(true);
    ++count;
    return req;
  });
  axios.interceptors.response.use((res) => {
    --count;
    if(!count){
      setLoader(false);
    }
    return res;
  }, function (error) {
    --count;
    if(!count){
      setLoader(false);
    }
    return Promise.reject(error);
  });

  return (
    <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
      <span
        style={{
          backgroundColor: loader ? 'red' : 'green',
          ...styles.dotLoader
        }}
      ></span>
      <p style={{ fontSize: 'x-large', fontWeight: 'bold', display: 'inline' }}>
        LOGO
      </p>
      <Routes>
        <Route path='*' element={<Navigate to='/' replace={true} />} />
        <Route path='/' Component={Home} />
        <Route path='/myarticle' Component={MyArticle} />
        <Route path='/auth/*' Component={Auth} />
      </Routes>
    </LoginContext.Provider>
  );
}

export default App;

const styles = {
  dotLoader: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '100%',
    marginRight: '8px',
    marginBottom: '3px'
  }
};
