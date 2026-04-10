import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSongs, deleteSong } from '../../api/songs.api';
import Pagination from '../../components/common/Pagination';
import useAuthStore from '../../store/auth.store';

function ArtistSongsPage() {
  const [songs, setSongs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id: artistId } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const limit = 10;

  async function loadSongs(currentPage) {
    setLoading(true);
    setError('');
    try {
      const data = await getSongs(artistId, currentPage, limit);
      setSongs(data.songs);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSongs(page);
  }, [page]);

  async function handleDelete(songId) {
    if (!window.confirm('Delete this song?')) return;
    try {
      await deleteSong(artistId, songId);
      loadSongs(page);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Songs</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {role === 'artist' && (
            <button onClick={() => navigate(`/artists/${artistId}/songs/new`)}>Add Song</button>
          )}
          <button className="secondary" onClick={() => navigate('/artists')}>Back</button>
        </div>
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
                  <th>Title</th>
                  <th>Album</th>
                  <th>Genre</th>
                  {role === 'artist' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id}>
                    <td>{song.title}</td>
                    <td>{song.album_name}</td>
                    <td>{song.genre}</td>
                    {role === 'artist' && (
                      <td>
                        <div className="table-actions">
                          <button onClick={() => navigate(`/artists/${artistId}/songs/${song.id}/edit`)}>Edit</button>
                          <button className="danger" onClick={() => handleDelete(song.id)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {songs.length === 0 && (
                  <tr>
                    <td colSpan={role === 'artist' ? 4 : 3}>No songs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default ArtistSongsPage;
