const API_URL = "http://localhost:3001/solicitudes";

// Helper reutilizable para centralizar las peticiones HTTP.
export async function helpFetch(endpoint = "", options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: no fue posible completar la petición.`);
  }

  if (response.status === 204) return null;
  return response.json();
}