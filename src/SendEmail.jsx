import React from "react";
import { Modal, Button } from 'react-bootstrap';
import emailjs from '@emailjs/browser'
import { initializeApp } from "firebase/app";
import { onSnapshot, getFirestore, getDocs, collection,addDoc , doc, deleteDoc , updateDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import Header from "./Header";

const firebaseApp = initializeApp( {
    apiKey: "key",
    authDomain: "condominio-key.firebaseapp.com",
    projectId: "condominio-key",
  });
  

function SendEmail() {
    const [Data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
const [modalContent, setModalContent] = useState('');

      
const db = getFirestore(firebaseApp);
const CollectionRef = collection(db, "condominio");


useEffect(() => {
    const getData = async () => {
      const data = await getDocs(CollectionRef);
      console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getData();
  }, []);

  

const sendEmailsSeparately = async () => {
    try {
      emailjs.init('key');

      // Itera sobre cada item na lista de dados (e-mails)
      for (let i = 0; i < Data.length; i++) {
        const item = Data[i];

        // Configura os parâmetros do template de e-mail
        const templateParams = {
          from_name: item.Num_ap,
          to_name: item.email,
          subject: `Cobrança ${item.Num_ap}`,
          message: `Olá, ${item.Num_ap}, a adm envia essa menssagem para dizer que com a reforma do predio voce deve ${item.value} €`
        };

        try {
          const response = await emailjs.send("service_key", "template_key", templateParams);
          setModalContent(`E-mail enviado para ${item.Num_ap}`);
          setShowModal(true);
        } catch (error) {
          setModalContent(`Erro ao enviar o e-mail para ${item.email}: ${error}`);
          setShowModal(true);
        }
      }
    } catch (error) {
      alert('Erro ao enviar e-mails:', error);
    }
  };
    return (  
        <>
        <Header />
        <div className="container mt-4 mb-4" >
        <div className="email-container">
        <h1>Emails:</h1>
        <h3>Serão enviados separadamente</h3>
        <table className="email-table">
          <tbody>
            {Data.map((item) => (
              <tr key={item.id}>
                <td>{item.Num_ap}</td>
                <td>{item.email}</td>
                <td>{item.value}€</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br/>
        <br/>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Resultado do envio de e-mails</Modal.Title>
  </Modal.Header>
  <Modal.Body>{modalContent}</Modal.Body>
</Modal>

<button onClick={sendEmailsSeparately} class="btn btn-outline-success">Enviar e-mails</button>
      </div>
      </div>
      </>
     )
}

export default SendEmail ;
