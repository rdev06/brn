import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);

    const registerRef = useRef()
    function onSubmitHandler(){
        const formData = new FormData(registerRef.current);
        const formProps = Object.fromEntries(formData);
        if(formProps.password !== formProps.repassword){
            setError('Password and repassword is not matching')
        }
        // console.log(formProps);

        axios.post('http://localhost:5000/user', formProps).then(res => {
            console.log(res.data);
            navigate('/auth/login')
        }).catch(err => setError(err.response.data.message))
    }
  return (<>
    <h2>Register</h2>
    {error && <p style={{color: 'red'}} >Error: {error}</p>}
    <form action="" method="post" ref={registerRef} onSubmit={(e) => {e.preventDefault()}}>

        <input type="email" name='email' placeholder='email' required/>
        <div style={{border: 'solid 1px'}}>
        <input style={{border: 'none'}} type={visible ? 'text' : 'password'} name='password' placeholder='password' required />
        <button onClick={()=>setVisible(pre => !pre)} >{!visible ? 'Show': 'Hide'}</button>
        </div>
        <input type="password" name='repassword' placeholder='re-password' />
        <button type="submit" onClick={onSubmitHandler} >Register</button>
    </form>
    </>)
}
