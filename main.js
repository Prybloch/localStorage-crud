"use strict";

const showDeleteConfirmation = (client, index) => {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay-confirm");

  const box = document.createElement("div");
  box.classList.add("modal-confirm");

  box.innerHTML = `
    <p>Tem certeza que deseja excluir o cliente <strong>${client.nome}</strong>?</p>
    <div class="btn-container">
      <button class="button red" id="confirm-delete">Excluir</button>
      <button class="button gray" id="cancel-delete">Cancelar</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Eventos
  document.getElementById("cancel-delete").onclick = () => overlay.remove();
  document.getElementById("confirm-delete").onclick = () => {
    deleteClient(index);
    updateTable();
    overlay.remove();
  };
};

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
 clearFields();
 document.getElementById("modal").classList.remove("active");
 document.getElementById('modal-title').textContent = "Novo Cliente";
}


const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

const readClient = () => getLocalStorage();

const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};

const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
};

const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

const saveClient = () => {
    if(isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const index = document.getElementById('nome').dataset.index;
        if (index == 'new') {
        createClient(client);
        updateTable();
        closeModal();
        }
        else {
          updateClient(index, client);
          updateTable();
          closeModal();
        }
        
    }
}

const creatRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
    <button type="button" class="button green" id="edit-${index}" >Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

const updateTable = () => {
    clearTable();
    const dbClient = readClient();
    dbClient.forEach(creatRow);
    
}

const fillFields = (client) => {
  document.getElementById('nome').value = client.nome;
  document.getElementById('email').value = client.email;
  document.getElementById('celular').value = client.celular;
  document.getElementById('cidade').value = client.cidade;
  document.getElementById('nome').dataset.index = client.index;
}

const editClient = (index) => {
  document.getElementById('modal-title').textContent = "Editando Cliente";
  const client = readClient()[index];
  client.index = index;
  fillFields(client);
  openModal();
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

      const [action, index] = event.target.id.split('-');
      
      if (action == 'edit') 
      {
        editClient(index);
      }
      else 
      {
        const client = readClient()[index];
       showDeleteConfirmation(client, index);
        if (response) {
        deleteClient(index);
        updateTable();
        }
      }
    }
}

const cancelAction = () => closeModal();


updateTable();


document.getElementById("cadastrarCliente").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);

document.getElementById('cancelar').addEventListener('click', cancelAction);
