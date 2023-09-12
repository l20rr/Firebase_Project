import { useCookies } from 'react-cookie';

import './style.css';
import Login from "./Login";
import React from "react";
import { initializeApp } from "firebase/app";
import { onSnapshot, getFirestore, getDocs, collection,addDoc , doc, deleteDoc , updateDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import Tabledata from './Tabledata';
import Header from './Header';

const firebaseApp = initializeApp( {
    apiKey: "key",
    authDomain: "key.firebaseapp.com",
    projectId: "condominio-key",
  });
  

function App() {
  const [cookies] = useCookies(['email', 'password']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Num_ap, setNum_ap] = useState('');


const db = getFirestore(firebaseApp);
const CollectionRef = collection(db, "condominio");

  async function cirarDado() {
    if (name && email && Num_ap ) {
      const info = await addDoc(CollectionRef, {
        name,
        email,
        Num_ap,
        value: 280,
      });
      window.location.reload();
    }
  }
  const getEmailFromCookies = () => {
    return cookies.email || '';
  };
  
  const decryptPassword = (encryptedPassword) => {
    // Implemente seu método de descriptografia aqui
    return atob(encryptedPassword); 
  };

  const getPasswordFromCookies = () => {
    const encryptedPassword = cookies.password || '';
    const password = decryptPassword(encryptedPassword);
    return password;
  };


  const storedEmail = getEmailFromCookies();
  const storedPassword = getPasswordFromCookies();

 

  if (!isUserAuthenticated) {
    return <Login />;
  }

  return (
    <>
    <Header />
    <div className="container mt-4 mb-4" >
      <h1>Insira os dados dos condominos:</h1>
      <h4>Nome - Email - Nº Apartamento 
      </h4>
      <div className="form">
        <input
          type="text"
          placeholder="Ex: João"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="exemplo@mail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ex: 12C"
          onChange={(e) => setNum_ap(e.target.value)}
        />
       <button onClick={cirarDado} disabled={!name || !email || !Num_ap } className="btn btn-outline-success">Criar</button>
      </div>

      <Tabledata />   


    </div>
    </>
  );
}

export default App;
