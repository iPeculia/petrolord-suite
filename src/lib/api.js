const BASE_URL = ''; 

    async function api(path, opts = {}) {
      const token = localStorage.getItem("token");
      
      const headers = { ...opts.headers };
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(BASE_URL + path, { ...opts, headers });
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        
        throw new Error("Unauthorized");
      }
      
      return response;
    }

    export default api;