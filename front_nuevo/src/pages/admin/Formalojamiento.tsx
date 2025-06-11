import React, { useState, useEffect } from 'react';

interface Props {
  onGuardar: (alojamiento: any) => void;
}

const FormAlojamiento: React.FC<Props> = ({ onGuardar }) => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    capacity: 1,
    price: '',
    status: 'available'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre: <input name="name" value={form.name} onChange={handleChange} required /></label><br />
      <label>Tipo: <input name="type" value={form.type} onChange={handleChange} required /></label><br />
      <label>Capacidad: <input name="capacity" type="number" value={form.capacity} onChange={handleChange} min={1} required /></label><br />
      <label>Precio: <input name="price" value={form.price} onChange={handleChange} required /></label><br />
      <label>Estado:
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="available">Disponible</option>
          <option value="unavailable">No disponible</option>
        </select>
      </label><br />
      <button type="submit">Guardar</button>
    </form>
  );
};

function FormActualizarAlojamiento({ onGuardar, onCerrar, initialId = '', initialData = {} }: { onGuardar: any; onCerrar: () => void; initialId?: string; initialData?: any }) {
  const [updateId, setUpdateId] = useState(initialId);
  const [updateForm, setUpdateForm] = useState({
    nombre: initialData.nombre || '',
    estado: initialData.estado || 'disponible',
    capacidad: initialData.capacidad || '',
    tipo: initialData.tipo || '',
    comodidades: initialData.comodidades || '',
    precio_por_noche: initialData.precio_por_noche || ''
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (updateId && !dataLoaded) {
      fetch(`http://127.0.0.1:8000/alojamientos/alojamientos/${updateId}`)
        .then(res => {
          if (!res.ok) throw new Error('No encontrado');
          return res.json();
        })
        .then(data => {
          setUpdateForm({
            nombre: data.nombre || '',
            estado: data.estado || 'disponible',
            capacidad: data.capacidad || '',
            tipo: data.tipo || '',
            comodidades: data.comodidades || '',
            precio_por_noche: data.precio_por_noche || ''
          });
          setDataLoaded(true);
        })
        .catch(() => {
          setUpdateMessage('No se pudo cargar el alojamiento.');
        });
    }
  }, [updateId, dataLoaded]);

  useEffect(() => {
    setDataLoaded(false);
    setUpdateMessage('');
  }, [updateId]);

  const handleUpdateChange = (e: any) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };
  const handleUpdateAlojamiento = async (e: any) => {
    e.preventDefault();
    const alojamiento = {
      nombre: updateForm.nombre,
      estado: updateForm.estado,
      capacidad: updateForm.capacidad,
      tipo: updateForm.tipo,
      comodidades: updateForm.comodidades,
      precio_por_noche: updateForm.precio_por_noche
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/alojamientos/alojamientos/${updateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alojamiento)
      });
      if (response.ok) {
        alert('Alojamiento actualizado correctamente');
        if (onGuardar) onGuardar({ updateId, ...alojamiento });
        setUpdateId('');
        setUpdateForm({ nombre: '', estado: 'disponible', capacidad: '', tipo: '', comodidades: '', precio_por_noche: '' });
      } else {
        const error = await response.json();
        alert('Error al actualizar alojamiento: ' + (error.detail || ''));
      }
    } catch (error) {
      alert('Error de conexión al backend');
    }
  };
  return (
    <form onSubmit={handleUpdateAlojamiento} className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4">
      <button className="mb-4 float-right text-red-500" onClick={onCerrar} type="button">Cerrar ✖</button>
      <label className="block mb-2 font-semibold text-yellow-700">Actualizar alojamiento por ID:</label>
      {!initialId && (
        <input
          type="text"
          name="updateId"
          value={updateId}
          onChange={e => setUpdateId(e.target.value)}
          placeholder="ID del alojamiento"
          className="border px-3 py-2 rounded-lg mb-2 w-full"
          required
        />
      )}
      <input
        type="text"
        name="nombre"
        value={updateForm.nombre}
        onChange={handleUpdateChange}
        placeholder="Nombre"
        className="border px-3 py-2 rounded-lg mb-2 w-full"
        required
      />
      <input
        type="text"
        name="tipo"
        value={updateForm.tipo}
        onChange={handleUpdateChange}
        placeholder="Tipo"
        className="border px-3 py-2 rounded-lg mb-2 w-full"
        required
      />
      <input
        type="text"
        name="capacidad"
        value={updateForm.capacidad}
        onChange={handleUpdateChange}
        placeholder="Capacidad"
        className="border px-3 py-2 rounded-lg mb-2 w-full"
        required
      />
      <input
        type="text"
        name="precio_por_noche"
        value={updateForm.precio_por_noche}
        onChange={handleUpdateChange}
        placeholder="Precio por noche"
        className="border px-3 py-2 rounded-lg mb-2 w-full"
        required
      />
      <input
        type="text"
        name="comodidades"
        value={updateForm.comodidades}
        onChange={handleUpdateChange}
        placeholder="Comodidades"
        className="border px-3 py-2 rounded-lg mb-2 w-full"
      />
      <select
        name="estado"
        value={updateForm.estado}
        onChange={handleUpdateChange}
        className="border px-3 py-2 rounded-lg mb-2 w-full"
      >
        <option value="disponible">Disponible</option>
        <option value="no disponible">No disponible</option>
      </select>
      <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition">Actualizar</button>
      {updateMessage && <div className="mt-2 text-yellow-800">{updateMessage}</div>}
    </form>
  );
}

export default FormAlojamiento;
export { FormActualizarAlojamiento };
