import { useState, useEffect } from 'react';
import './App.css';

// Endpoint da API Spring Boot
const API_URL = 'http://localhost:8080/v1/users';

function App() {
  // Estados para listar os usuários
  const [users, setUsers] = useState([]);

  // Estados dos campos do formulário
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para exibir mensagens de sucesso ou erro (Error Handling do Spring Boot)
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. GET: Buscar todos os usuários da API
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Carrega a lista de usuários assim que a página abre
  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. POST: Enviar dados sem validação no front para demonstrar o Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const userData = { username, email, password };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // Se o backend retornar status de erro (ex: 400 Bad Request por validação)
      if (!response.ok) {
        const errorData = await response.json();

        // Se houver lista de erros do Spring Validation (MethodArgumentNotValidException)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const messages = errorData.errors.map((err) => err.defaultMessage).join(' | ');
          setErrorMessage(`Erro de validação (Spring Boot): ${messages}`);
        } else {
          setErrorMessage(errorData.message || `Erro HTTP ${response.status}`);
        }
        return;
      }

      // Sucesso no cadastro
      setSuccessMessage('Usuário cadastrado com sucesso!');
      setUsername('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (error) {
      setErrorMessage('Não foi possível conectar ao servidor.');
    }
  };

  // 3. DELETE: Excluir um usuário pelo ID
  const handleDelete = async (userId) => {
    try {
      await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">

      {/* Exibição de Mensagens de Erro da API */}
      {errorMessage && <div className="alert alert-error">⚠️ {errorMessage}</div>}
      {successMessage && <div className="alert alert-success">✅ {successMessage}</div>}

      {/* Formulário de Cadastro (Sem validação no front) */}
      <div className="card">
        <h2>Novo Usuário</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Nome de Usuário</label>
            <input
              type="text"
              placeholder="Ex: Felipe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="text"
              placeholder="Ex: nicollas@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="text"
              placeholder="Ex: 91827364"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Cadastrar no Backend
          </button>
        </form>
      </div>

      {/* Tabela de Listagem */}
      <div className="card">
        <h2>Usuários Cadastrados</h2>
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.userId)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
