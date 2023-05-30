import React from "react";

import { initializeApp } from "firebase/app";
import { onSnapshot, getFirestore, getDocs, collection,addDoc , doc, deleteDoc , updateDoc} from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseApp = initializeApp( {
    apiKey: "AIzaSyC-WLcn3-G0R62xVwsq1MwrJPx2wrrUuj8",
    authDomain: "condominio-b9c00.firebaseapp.com",
    projectId: "condominio-b9c00",
  });
  

function Tabledata(){
    const [paidValues, setPaidValues] = useState([])
    const [Data, setData] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedNum_ap, setEditedNum_ap] = useState('');
    const [editingValue, setEditingValue] = useState(null);
    const [editedValue, setEditedValue] = useState('');

      
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


    return(

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
    )

}

export default Tabledata;