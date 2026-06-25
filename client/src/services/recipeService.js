import api from './api';

const recipeService = {
  generate: async (params) => {
    const response = await api.post('/recipes/generate', params);
    return response.data;
  },

  save: async (recipe) => {
    const response = await api.post('/recipes/save', recipe);
    return response.data;
  },

  getSaved: async () => {
    const response = await api.get('/recipes/saved');
    return response.data;
  },

  deleteSaved: async (index) => {
    const response = await api.delete(`/recipes/saved/${index}`);
    return response.data;
  }
};

export default recipeService;