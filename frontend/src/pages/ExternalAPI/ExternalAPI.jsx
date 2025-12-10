import { useState, useEffect } from 'react';
import externalApiService from '../../services/externalApiService';
import Loading from '../../components/ui/Loading';
import ErrorMessage from '../../components/ui/ErrorMessage';
import './ExternalAPI.css';

const ExternalAPI = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, count: 0 });
  const [filters, setFilters] = useState({
    status: '',
    species: '',
    name: '',
  });

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filtrar solo los filtros con valor
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      );

      const data = await externalApiService.getCharacters(page, activeFilters);
      setCharacters(data.results);
      setPagination({
        pages: data.info.pages,
        count: data.info.count,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setCharacters([]);
        setError('No se encontraron personajes con esos filtros');
      } else {
        setError('Error al cargar los personajes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCharacters();
  };

  const handleClearFilters = () => {
    setFilters({ status: '', species: '', name: '' });
    setPage(1);
    setTimeout(fetchCharacters, 0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'alive': return '#10b981';
      case 'dead': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'alive': return 'Vivo';
      case 'dead': return 'Muerto';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="external-api-page">
      <div className="api-header">
        <h1>🛸 Rick and Morty API</h1>
        <p>Integración con API pública externa - Personajes del multiverso</p>
        <a
          href="https://rickandmortyapi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="api-link"
        >
          rickandmortyapi.com ↗
        </a>
      </div>

      <form onSubmit={handleSearch} className="api-filters">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Buscar por nombre..."
          className="filter-input"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          <option value="alive">Vivo</option>
          <option value="dead">Muerto</option>
          <option value="unknown">Desconocido</option>
        </select>

        <select
          name="species"
          value={filters.species}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Todas las especies</option>
          <option value="Human">Humano</option>
          <option value="Alien">Alien</option>
          <option value="Robot">Robot</option>
          <option value="Humanoid">Humanoide</option>
          <option value="Cronenberg">Cronenberg</option>
          <option value="Mythological Creature">Criatura Mitológica</option>
        </select>

        <button type="submit" className="btn-search">
          Buscar
        </button>

        <button type="button" onClick={handleClearFilters} className="btn-clear">
          Limpiar
        </button>
      </form>

      {loading ? (
        <Loading message="Cargando personajes del multiverso..." />
      ) : error && characters.length === 0 ? (
        <ErrorMessage message={error} onRetry={fetchCharacters} />
      ) : (
        <>
          <div className="results-info">
            <p>Mostrando {characters.length} de {pagination.count} personajes</p>
          </div>

          <div className="characters-grid">
            {characters.map(character => (
              <div key={character.id} className="character-card">
                <div className="character-image">
                  <img src={character.image} alt={character.name} />
                  <span
                    className="character-status"
                    style={{ backgroundColor: getStatusColor(character.status) }}
                  >
                    {getStatusText(character.status)}
                  </span>
                </div>

                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>

                  <div className="character-details">
                    <div className="detail-item">
                      <span className="detail-label">Especie:</span>
                      <span className="detail-value">{character.species}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Género:</span>
                      <span className="detail-value">{character.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Origen:</span>
                      <span className="detail-value">{character.origin.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ubicación:</span>
                      <span className="detail-value">{character.location.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Episodios:</span>
                      <span className="detail-value">{character.episode.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>

              <span className="pagination-info">
                Página {page} de {pagination.pages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="pagination-btn"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExternalAPI;
