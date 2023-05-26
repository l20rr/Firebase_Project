import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection,addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import emailjs from '@emailjs/browser'
import './style.css';
const firebaseApp = initializeApp( {
  apiKey: "AIzaSyC-WLcn3-G0R62xVwsq1MwrJPx2wrrUuj8",
  authDomain: "condominio-b9c00.firebaseapp.com",
  projectId: "condominio-b9c00",
});

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [Num_ap, setNum_ap] = useState('')
  const [Data, setData] = useState([])

  const sendEmailsSeparately = async () => {
    try {
      emailjs.init('ldVC4gfqmNeOy61oI');

      // Itera sobre cada item na lista de dados (e-mails)
      for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
  
        // Configura os parâmetros do template de e-mail
        const templateParams = {
          from_name: item.Num_ap,
          to_name: item.email,
          subject: `Cobrança ${item.Num_ap}`,
          message: `Olá, ${item.Num_ap}, a adm envia essa menssagem para dizer que com a reforma do predio voce deve ${item.value}`
        };
  
        // Envia o e-mail para cada endereço de e-mail separadamente
        const response = await emailjs.send("service_qseq5h4","template_nn6jd2z", templateParams);
        console.log(`E-mail enviado para ${item.email}:`, response);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mails:', error);
    }
  };


  const db = getFirestore(firebaseApp)
  const CollectionRef = collection(db, "condominio")



  useEffect(()=> {
    const getData = async () => {
      const data = await getDocs(CollectionRef)
      console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))

      setData(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getData()
  }, [])

  async function cirarDado() {
    const info = await addDoc(CollectionRef, {
      name,
      email,
      Num_ap,
      value:280,
    })
    window.location.reload();
  }
  return (
    <div className="container">
      <div className="form">
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número do Apartamento"
          onChange={(e) => setNum_ap(e.target.value)}
        />
        <button onClick={cirarDado}>Criar</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Apartamento</th>
            <th>Email</th>
            <th>Valor</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.Num_ap}</td>
              <td>{item.email}</td>
              <td>{item.value}€</td>
              <td>
                <button>Editar</button>
              </td>
              <td>
                <button>pago</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <button onClick={sendEmailsSeparately}>Enviar E-mail</button>
      </div>
    </div>
  );
}

export default App;
