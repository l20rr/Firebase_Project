import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection,addDoc , doc, deleteDoc , updateDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import emailjs from '@emailjs/browser'
import './style.css';
import Login from "./Login";


const firebaseApp = initializeApp( {
  apiKey: "Key",
  authDomain: "Domin.firebaseapp.com",
  projectId: "condominio-ID",
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
  


  const sendEmailsSeparately = async () => {
    try {
      emailjs.init('User_id');

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
        const response = await emailjs.send("service_id","template_id", templateParams);
        console.log(`E-mail enviado para ${item.email}:`, response);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mails:', error);
    }
  };

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

  async function cirarDado() {
    const info = await addDoc(CollectionRef, {
      name,
      email,
      Num_ap,
      value: 280,
    });
    window.location.reload();
  }

  async function deleteData(id) {
    const info = await deleteDoc(doc(db, "condominio", id));
    window.location.reload();
  }

  const markAsPaid = async (id) => {
    const updatedPaidValues = {
      ...paidValues,
      [id]: 0,
    };
    
    setPaidValues(updatedPaidValues);
    
    try {
      await updateDoc(doc(db, "condominio", id), {
        value: 0,
      });
      console.log("Valor pago atualizado no Firebase com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o valor pago no Firebase:", error);
    }
  };

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

  const storedEmail = getEmailFromCookies();
  const storedPassword = getPasswordFromCookies();

  const isUserAuthenticated = storedEmail === 'condominio@gmail.com' && storedPassword === '1234';

  if (!isUserAuthenticated) {
    return <Login />;
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
      {editingItem === item.id ? (
        <input
          type="text"
          value={editedNum_ap}
          onChange={(e) => setEditedNum_ap(e.target.value)}
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
      {editingValue === item.id ? (
        <input
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
      ) : (
        `${paidValues[item.id] !== undefined ? paidValues[item.id] : item.value}€`
      )}
    </td>
    <td>
      {editingItem === item.id ? (
        <button onClick={() => edit(item.id)}>Salvar</button>
      ) : (
        <button onClick={() => {
          setEditedName(item.name);
          setEditedNum_ap(item.Num_ap);
          setEditedEmail(item.email);
          setEditingItem(item.id);
        }}>Editar</button>
      )}
    </td>
    <td>
      <button onClick={() => markAsPaid(item.id)}>Pago</button>
    </td>
    <td>
      <button onClick={() => deleteData(item.id)}>Apagar</button>
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
