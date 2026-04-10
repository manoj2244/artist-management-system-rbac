import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../api/users.api';
import Pagination from '../../components/common/Pagination';

function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const limit = 10;

  async function loadUsers(currentPage) {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers(currentPage, limit);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      loadUsers(page);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
        <button onClick={() => navigate('/users/new')}>Add User</button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      <div className="table-actions">
                        <button onClick={() => navigate(`/users/${user.id}/edit`)}>Edit</button>
                        <button className="danger" onClick={() => handleDelete(user.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default UsersListPage;
