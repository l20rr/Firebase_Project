import { initializeApp } from "firebase/app";
import { onSnapshot, getFirestore, getDocs, collection,addDoc , doc, deleteDoc , updateDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import emailjs from '@emailjs/browser'
import './style.css';
import Login from "./Login";
import { Modal, Button } from 'react-bootstrap';


const firebaseApp = initializeApp( {
  apiKey: "AIzaSyC-WLcn3-G0R62xVwsq1MwrJPx2wrrUuj8",
  authDomain: "condominio-b9c00.firebaseapp.com",
  projectId: "condominio-b9c00",
});

function App() {
  const [cookies] = useCookies(['email', 'password']);
  const [paidValues, setPaidValues] = useState([])
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Num_ap, setNum_ap] = useState('');
  const [Data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedNum_ap, setEditedNum_ap] = useState('');
  const [editingValue, setEditingValue] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [showModal, setShowModal] = useState(false);
const [modalContent, setModalContent] = useState('');
  
const db = getFirestore(firebaseApp);
const CollectionRef = collection(db, "condominio");

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
          message: `Olá, ${item.Num_ap}, a adm envia essa menssagem para dizer que com a reforma do predio voce deve ${item.value} €`
        };

        try {
          const response = await emailjs.send("service_qseq5h4", "template_nn6jd2z", templateParams);
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



  useEffect(() => {
    const getData = async () => {
      const data = await getDocs(CollectionRef);
      console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getData();
  }, []);

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
  
  async function deleteData(id) {
    const info = await deleteDoc(doc(db, "condominio", id));
    window.location.reload();
  }

  const markAsPaid = async (id, value) => {
    let updatedPaidValues = { ...paidValues };
  
    // Verifica o valor atual do item
    if (updatedPaidValues[id] === 0) {
      updatedPaidValues[id] = value; // Atualiza para "Pago" com o valor original do item
    } else {
      updatedPaidValues[id] = 0; // Atualiza para "Checked" com valor 0
    }
  
    setPaidValues(updatedPaidValues);
    localStorage.setItem('paidValues', JSON.stringify(updatedPaidValues));
  
    try {
      await updateDoc(doc(db, "condominio", id), {
        value: updatedPaidValues[id],
      });
      console.log("Valor pago atualizado no Firebase com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o valor pago no Firebase:", error);
    }
    
  };
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'condominio'), (querySnapshot) => {
      let updatedPaidValues = {};
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        updatedPaidValues[doc.id] = item.value;
      });
      setPaidValues(updatedPaidValues);
    });
  
    return () => unsubscribe();
  }, []);
  const edit = async (id) => {
    try {
      await updateDoc(doc(db, "condominio", id), {
        name: editedName,
        email: editedEmail,
        Num_ap: editedNum_ap,
        value: parseFloat(editedValue),
      });
      console.log("Dados atualizados no Firebase com sucesso!");
  
      // Limpa os campos de edição e redefine o item em edição para null
      setEditedName('');
      setEditedEmail('');
      setEditedNum_ap('');
      setEditedValue('');
      setEditingValue(null);
      setEditingItem(null);
    } catch (error) {
      console.error("Erro ao atualizar os dados no Firebase:", error);
    }
    window.location.reload();
  };
  
  const getEmailFromCookies = () => {
    return cookies.email || '';
  };

  const getPasswordFromCookies = () => {
    const encryptedPassword = cookies.password || '';
    const password = decryptPassword(encryptedPassword);
    return password;
  };

  const decryptPassword = (encryptedPassword) => {
    // Implemente seu método de descriptografia aqui
    return atob(encryptedPassword); 
  };

//add 280€
useEffect(() => {
  const currentMonth = new Date().getMonth() + 1; 

  if ([1, 4, 6,7, 10].includes(currentMonth)) {
   
    const isValueAdded = Data.some(item => item.value === item.initialValue + 280);

    if (!isValueAdded) {
      setData(prevData => prevData.map(item => ({
        ...item,
        value: item.value + 280
      })));
    }
  } 
}, []);
  
  useEffect(() => {
    // Salvar a soma atualizada no Firebase
    Data.forEach(item => {
      const docRef = doc(db, "condominio" ,item.id); 
      updateDoc(docRef, { value: item.value });
    });
  }, [Data]);

  const storedEmail = getEmailFromCookies();
  const storedPassword = getPasswordFromCookies();

  const isUserAuthenticated = storedEmail === 'condominio@gmail.com' && storedPassword === '1234';

  if (!isUserAuthenticated) {
    return <Login />;
  }

 
  return (
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
       <button onClick={cirarDado} disabled={!name || !email || !Num_ap }>
        Criar
      </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Apartamento</th>
            <th>Email</th>
            <th>Valor</th>
          
          </tr>
        </thead>
        <tbody>
          
{Data.map((item) => (
  <tr key={item.id}>
    <td>
      {editingItem === item.id ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      ) : (
        item.name
      )}
    </td>
    <td>
      {
      editingItem === item.id ? (
      <input
      type="text"
      value={editedNum_ap}
      onChange={(e) => {
   
          setEditedNum_ap(e.target.value);

      }}
    />
      ) : (
        item.Num_ap
      )}
    </td>
    <td>
      {editingItem === item.id ? (
        <input
          type="text"
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
        />
      ) : (
        item.email
      )}
    </td>
    <td>
  {editingItem === item.id ? (
    <input
      className="form-control"
      type="text"
      value={editedEmail}
      onChange={(e) => setEditedEmail(e.target.value)}
    />
  ) : (
    item.email
  )}
</td>
<td>
  {editingItem === item.id ? (
    <input
      className="form-control"
      type="number"
      min={0}
      value={editedValue}
      onChange={(e) => setEditedValue(e.target.value)}
    />
  ) : (
    `${paidValues[item.id] !== undefined ? paidValues[item.id] : item.value}€`
  )}
</td>
<td>
  {editingItem === item.id ? (
    <button className="btn btn-success" onClick={() => edit(item.id)}>
      Salvar
    </button>
  ) : (
    <button
      className="btn btn-dark"
      onClick={() => {
        setEditedName(item.name);
        setEditedNum_ap(item.Num_ap);
        setEditedEmail(item.email);
        setEditedValue(item.value);
        setEditingItem(item.id);
      }}
    >
      Editar
    </button>
  )}
</td>
    <td>
      {paidValues[item.id] === 0 ? (
        <input
        className="form-check-input form-check-input-lg"
          type="checkbox"
          checked={true}
          onChange={() => markAsPaid(item.id, item.value)}
        />
      ) : (
        <button
          className="btn btn-info"
          onClick={() => markAsPaid(item.id, item.value)}
        >
          Pago
        </button>
      )}
    </td>
    <td>
      <button
        className="btn btn-danger"
        onClick={() => deleteData(item.id)}
      >
        Apagar
      </button>
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
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Resultado do envio de e-mails</Modal.Title>
  </Modal.Header>
  <Modal.Body>{modalContent}</Modal.Body>
</Modal>

<button onClick={sendEmailsSeparately} class="btn btn-outline-success">Enviar e-mails</button>
      </div>
    </div>
  );
}

export default App;
