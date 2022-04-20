import { observer } from 'mobx-react-lite';
import React, { FC, useContext, useState } from 'react'
import { Context } from '..';

const LoginForm: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {store} = useContext(Context);
  return (
    <div>
        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder='Password' value={password}  onChange={(e) => setPassword(e.target.value)}/>
        <button onClick={() => store.sign(email, password, true)}>Login</button>
        <button onClick={() => store.sign(email, password, false)}>Sign up</button>
    </div>
  )
}

export default observer(LoginForm)