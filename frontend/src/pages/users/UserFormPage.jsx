import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../../api/users.api';
import { getArtistsForDropdown } from '../../api/artists.api';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',
  role: '',
  artist_id: ''
};

function UserFormPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [unlinkedArtists, setUnlinkedArtists] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    getArtistsForDropdown()
      .then((data) => setUnlinkedArtists(data.artists))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getUser(id)
      .then((data) => {
        const u = data.user;
        setForm({
          first_name: u.first_name,
          last_name: u.last_name,
          email: u.email,
          password: '',
          phone: u.phone,
          dob: u.dob ? u.dob.slice(0, 10) : '',
          gender: u.gender,
          address: u.address,
          role: u.role,
          artist_id: u.artist_id ? String(u.artist_id) : ''
        });
      })
      .catch((err) => alert(err.message))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && value !== 'artist' ? { artist_id: '' } : {})
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (payload.role !== 'artist') delete payload.artist_id;
      if (payload.artist_id) payload.artist_id = parseInt(payload.artist_id, 10);

      if (isEdit) {
        await updateUser(id, payload);
      } else {
        await createUser(payload);
      }
      navigate('/users');
    } catch (err) {
      if (err.details) {
        setErrors(err.details);
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <p className="loading">Loading...</p>;

  const artistOptionsForEdit = form.artist_id
    ? [
        ...unlinkedArtists,
        { id: form.artist_id, name: '(current linked artist)' }
      ]
    : unlinkedArtists;

  return (
    <div className="page">
      <div className="page-header">
        <h2>{isEdit ? 'Edit User' : 'Add User'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input name="first_name" value={form.first_name} onChange={handleChange} />
            {errors.first_name && <span className="field-error">{errors.first_name}</span>}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="last_name" value={form.last_name} onChange={handleChange} />
            {errors.last_name && <span className="field-error">{errors.last_name}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>{isEdit ? 'New Password (leave blank to keep current)' : 'Password'}</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
            {errors.dob && <span className="field-error">{errors.dob}</span>}
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="o">Other</option>
            </select>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="">Select</option>
            <option value="super_admin">Super Admin</option>
            <option value="artist_manager">Artist Manager</option>
            <option value="artist">Artist</option>
          </select>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        {form.role === 'artist' && (
          <div className="form-group">
            <label>Link to Artist Profile</label>
            <select name="artist_id" value={form.artist_id} onChange={handleChange}>
              <option value="">Select artist profile</option>
              {artistOptionsForEdit.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.artist_id && <span className="field-error">{errors.artist_id}</span>}
            {unlinkedArtists.length === 0 && !form.artist_id && (
              <span className="field-error">No unlinked artist profiles available. Create an artist profile first.</span>
            )}
          </div>
        )}

        {errors.general && <p className="error-text">{errors.general}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/users')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserFormPage;
