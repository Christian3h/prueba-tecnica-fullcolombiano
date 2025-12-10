import axios from 'axios';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api';

export const externalApiService = {
  // Obtener personajes con paginación y filtros
  getCharacters: async (page = 1, filters = {}) => {
    const response = await axios.get(`${RICK_AND_MORTY_API}/character`, {
      params: { page, ...filters },
    });
    return response.data;
  },

  // Obtener un personaje por ID
  getCharacter: async (id) => {
    const response = await axios.get(`${RICK_AND_MORTY_API}/character/${id}`);
    return response.data;
  },

  // Obtener episodios
  getEpisodes: async (page = 1) => {
    const response = await axios.get(`${RICK_AND_MORTY_API}/episode`, {
      params: { page },
    });
    return response.data;
  },

  // Obtener ubicaciones
  getLocations: async (page = 1) => {
    const response = await axios.get(`${RICK_AND_MORTY_API}/location`, {
      params: { page },
    });
    return response.data;
  },
};

export default externalApiService;
