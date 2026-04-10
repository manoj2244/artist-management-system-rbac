import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArtist, createArtist, updateArtist } from '../../api/artists.api';

const EMPTY_FORM = {
  name: '',
  dob: '',
  gender: '',
  address: '',
  first_release_year: '',
  no_of_albums_released: ''
};

function ArtistFormPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getArtist(id)
      .then((data) => {
        const a = data.artist;
        setForm({
          name: a.name,
          dob: a.dob ? a.dob.slice(0, 10) : '',
          gender: a.gender,
          address: a.address,
          first_release_year: String(a.first_release_year),
          no_of_albums_released: String(a.no_of_albums_released)
        });
      })
      .catch((err) => alert(err.message))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (isEdit) {
        await updateArtist(id, form);
      } else {
        await createArtist(form);
      }
      navigate('/artists');
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

  return (
    <div className="page">
      <div className="page-header">
        <h2>{isEdit ? 'Edit Artist' : 'Add Artist'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
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

        <div className="form-row">
          <div className="form-group">
            <label>First Release Year</label>
            <input type="number" name="first_release_year" value={form.first_release_year} onChange={handleChange} />
            {errors.first_release_year && <span className="field-error">{errors.first_release_year}</span>}
          </div>
          <div className="form-group">
            <label>No. of Albums Released</label>
            <input type="number" name="no_of_albums_released" value={form.no_of_albums_released} onChange={handleChange} min="0" />
            {errors.no_of_albums_released && <span className="field-error">{errors.no_of_albums_released}</span>}
          </div>
        </div>

        {errors.general && <p className="error-text">{errors.general}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/artists')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArtistFormPage;
