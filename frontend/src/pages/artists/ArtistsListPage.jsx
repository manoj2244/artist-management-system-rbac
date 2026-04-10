import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtists, deleteArtist, exportArtistsCSV, importArtistsCSV } from '../../api/artists.api';
import Pagination from '../../components/common/Pagination';
import useAuthStore from '../../store/auth.store';

function ArtistsListPage() {
  const [artists, setArtists] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState(null);

  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const fileInputRef = useRef(null);
  const limit = 10;

  async function loadArtists(currentPage) {
    setLoading(true);
    setError('');
    try {
      const data = await getArtists(currentPage, limit);
      setArtists(data.artists);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArtists(page);
  }, [page]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this artist?')) return;
    try {
      await deleteArtist(id);
      loadArtists(page);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleExport() {
    try {
      await exportArtistsCSV();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportResult(null);
    try {
      const result = await importArtistsCSV(file);
      setImportResult(result);
      loadArtists(page);
    } catch (err) {
      alert(err.message);
    } finally {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Artists</h2>
        {role === 'artist_manager' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/artists/new')}>Add Artist</button>
            <button className="secondary" onClick={handleExport}>Export CSV</button>
            <button className="secondary" onClick={() => fileInputRef.current.click()}>Import CSV</button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          </div>
        )}
      </div>

      {importResult && (
        <div style={{ marginBottom: 16, padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6 }}>
          <p>Imported: {importResult.inserted_count} rows. Failed: {importResult.failed_count} rows.</p>
          {importResult.failed.map((f) => (
            <p key={f.row} className="error-text">Row {f.row}: {Object.values(f.errors).join(', ')}</p>
          ))}
        </div>
      )}

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
                  <th>Gender</th>
                  <th>First Release</th>
                  <th>Albums</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.id}>
                    <td>{artist.name}</td>
                    <td>{artist.gender === 'm' ? 'Male' : artist.gender === 'f' ? 'Female' : 'Other'}</td>
                    <td>{artist.first_release_year}</td>
                    <td>{artist.no_of_albums_released}</td>
                    <td>
                      <div className="table-actions">
                        <button onClick={() => navigate(`/artists/${artist.id}/songs`)}>Songs</button>
                        {role === 'artist_manager' && (
                          <>
                            <button onClick={() => navigate(`/artists/${artist.id}/edit`)}>Edit</button>
                            <button className="danger" onClick={() => handleDelete(artist.id)}>Delete</button>
                          </>
                        )}
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

export default ArtistsListPage;
