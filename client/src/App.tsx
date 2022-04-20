import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import './App.css';
import LoginForm from './components/LoginForm';
import { IUser } from './models/User';
import UserServise from './servises/UserServise';

function App() {
  const [users, setUsers] = useState<IUser[]>([])
  const {store} = useContext(Context);
  useEffect(() => {
      if (localStorage.getItem('token')) {
        store.checkAuth();
      }
  },[]);

  async function getUsers() {
    try {
      const res = await UserServise.getUsers();
      setUsers(res.data)
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>
  }

  if (!store.isAuth) {
    return <LoginForm/>
  }

  return (
    <div>
      <h1>You are {store.isAuth ? "" : "not"} authorized!</h1>
      <h2>{store.user.isActivated ? "Your Email is verified" : "PLEASE CONFIRM YOUR EMAIL"}</h2>
      <button onClick={() => store.logout()}>Logout</button>
      <button onClick={getUsers}>Get Users</button>
      {users.map(user => <div key={user.id}>{user.email}</div>)}
    </div>
  );
}

export default observer(App);
