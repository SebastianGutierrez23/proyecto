import React, { useState, useEffect } from 'react';
import FormAlojamiento from './Formalojamiento';

const DashboardAlojamientos = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [alojamientos, setAlojamientos] = useState([]);

  // Consultar alojamientos al cargar el componente
  useEffect(() => {
    const fetchAlojamientos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/alojamientos/');
        if (!res.ok) throw new Error('Error al consultar alojamientos');
        const data = await res.json();
        setAlojamientos(data);
      } catch (err) {
        alert('Error al consultar alojamientos');
      }
    };
    fetchAlojamientos();
  }, []);

  const handleAgregarClick = () => {
    setMostrarFormulario(true);
  };

  // Función para agregar un alojamiento con mejor formato visual en las alertas
  const handleGuardarAlojamiento = async (nuevo: any) => {
    try {
      const alojamiento = {
        nombre: String(nuevo.name || nuevo.nombre || '').trim(),
        estado: String(nuevo.status || nuevo.estado || 'disponible').trim(),
        capacidad: Number(nuevo.capacity || nuevo.capacidad || 1),
        tipo: String(nuevo.type || nuevo.tipo || '').trim(),
        comodidades: String(nuevo.comodidades || nuevo.amenities || ''),
        precio_por_noche: Number(nuevo.price || nuevo.precio_por_noche || 0)
      };
      // Validación básica
      if (
        !alojamiento.nombre ||
        !alojamiento.tipo ||
        alojamiento.capacidad <= 0 ||
        alojamiento.precio_por_noche <= 0
      ) {
        window.alert('⚠️ Por favor completa todos los campos obligatorios con valores válidos.');
        return;
      }
      // Cambia la URL para usar el endpoint correcto
      const res = await fetch('http://127.0.0.1:8000/alojamientos/alojamiento_insert/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alojamiento)
      });
      if (res.ok) {
        window.alert('✅ Alojamiento agregado correctamente');
      } else {
        const error = await res.json();
        window.alert('❌ Error al agregar alojamiento: ' + (error.detail || ''));
      }
    } catch (err) {
      window.alert('❌ Error al agregar alojamiento');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Dashboard de Alojamientos</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
          onClick={handleAgregarClick}
        >
          Agregar alojamiento
        </button>
      </div>
      {mostrarFormulario && (
        <div className="mb-8">
          <FormAlojamiento onGuardar={handleGuardarAlojamiento} />
        </div>
      )}
      {/* Mostrar lista de alojamientos como tarjetas */}
      {alojamientos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {alojamientos.map((aloj: any) => (
            <div
              key={aloj.id || aloj.IdAlojamiento || aloj.nombre || aloj.name}
              className="bg-white rounded-2xl shadow p-4 flex flex-col"
            >
              <div className="h-40 w-full rounded-xl bg-neutral-100 mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    aloj.imagen && typeof aloj.imagen === 'string' && aloj.imagen.startsWith('http')
                      ? aloj.imagen
                      : 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg'
                  }
                  alt={aloj.nombre || aloj.name || 'Alojamiento'}
                  className="object-cover w-full h-full"
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg';
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{aloj.nombre || aloj.name}</h3>
              <div className="text-neutral-600 mb-1">{aloj.tipo || aloj.type}</div>
              <div className="flex items-center text-neutral-600 mb-1 text-sm">
                <span className="mr-2">👥 Capacidad: {aloj.capacidad || aloj.capacity} personas</span>
              </div>
              <div className="text-neutral-600 text-sm mb-1">Precio por noche</div>
              <div className="text-lg font-bold mb-2">${aloj.precio_por_noche || aloj.price}</div>
              <div className="flex-1 text-neutral-600 text-sm mb-2">{aloj.comodidades || aloj.amenities}</div>
              <div className="flex items-center justify-between mt-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (aloj.estado || aloj.status) === 'disponible'
                    ? 'bg-green-100 text-green-800'
                    : (aloj.estado || aloj.status) === 'ocupado'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {(aloj.estado || aloj.status) === 'disponible'
                    ? 'Disponible'
                    : (aloj.estado || aloj.status) === 'ocupado'
                    ? 'Ocupado'
                    : 'Mantenimiento'}
                </span>
                <span className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                  ★ 4.8
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 border rounded-lg py-2 text-primary flex items-center justify-center gap-2 hover:bg-primary/10 transition">
                  <span className="material-icons text-base">edit</span> Editar
                </button>
                <button className="flex-1 border rounded-lg py-2 text-primary flex items-center justify-center gap-2 hover:bg-primary/10 transition">
                  <span className="material-icons text-base">photo_library</span> Galería
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-neutral-500 mt-8">No hay alojamientos registrados.</div>
      )}
    </div>
  );
};

export default DashboardAlojamientos;