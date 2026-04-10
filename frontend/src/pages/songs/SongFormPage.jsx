import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSongs, createSong, updateSong } from '../../api/songs.api';

const EMPTY_FORM = {
  title: '',
  album_name: '',
  genre: ''
};

const GENRES = ['rnb', 'country', 'classic', 'rock', 'jazz'];

function SongFormPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const { artistId, songId } = useParams();
  const isEdit = Boolean(songId);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getSongs(artistId, 1, 100)
      .then((data) => {
        const song = data.songs.find((s) => String(s.id) === String(songId));
        if (song) {
          setForm({ title: song.title, album_name: song.album_name, genre: song.genre });
        }
      })
      .catch((err) => alert(err.message))
      .finally(() => setFetching(false));
  }, [artistId, songId, isEdit]);

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
        await updateSong(artistId, songId, form);
      } else {
        await createSong(artistId, form);
      }
      navigate(`/artists/${artistId}/songs`);
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
        <h2>{isEdit ? 'Edit Song' : 'Add Song'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Album Name</label>
          <input name="album_name" value={form.album_name} onChange={handleChange} />
          {errors.album_name && <span className="field-error">{errors.album_name}</span>}
        </div>

        <div className="form-group">
          <label>Genre</label>
          <select name="genre" value={form.genre} onChange={handleChange}>
            <option value="">Select</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.genre && <span className="field-error">{errors.genre}</span>}
        </div>

        {errors.general && <p className="error-text">{errors.general}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="secondary" onClick={() => navigate(`/artists/${artistId}/songs`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SongFormPage;
