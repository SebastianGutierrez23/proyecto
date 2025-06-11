const BASE_URL = 'http://127.0.0.1:8000/alojamientos/';

export const alojamientoService = {
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener alojamientos');
    return res.json();
  },
  async create(data) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear alojamiento');
    return res.json();
  },
  async update(id, data) {
    const res = await fetch(`${BASE_URL}${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar alojamiento');
    return res.json();
  },
  async remove(id) {
    const res = await fetch(`${BASE_URL}${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar alojamiento');
    return true;
  }
};