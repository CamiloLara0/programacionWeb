import { useEffect, useState } from "react";
import { helpFetch } from "./helpers/helpFetch";

const formularioInicial = {
  cliente: "",
  telefono: "",
  tipoEvento: "Boda",
  fecha: "",
  invitados: "",
  presupuesto: "",
  estado: "Pendiente"
};

const moneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(Number(valor) || 0);

export default function Negocio() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [idEdicion, setIdEdicion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // READ: consulta la API al cargar el componente.
  const cargarSolicitudes = async () => {
    try {
      setError("");
      const datos = await helpFetch();
      setSolicitudes(datos);
    } catch (err) {
      setError("No se pudo conectar con la API. Verifica que json-server esté activo en el puerto 3001.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setIdEdicion(null);
  };

  // CREATE y UPDATE: guarda una nueva solicitud o actualiza la seleccionada.
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const datos = {
      ...formulario,
      invitados: Number(formulario.invitados),
      presupuesto: Number(formulario.presupuesto)
    };

    try {
      if (idEdicion !== null) {
        await helpFetch(`/${idEdicion}`, {
          method: "PUT",
          body: JSON.stringify(datos)
        });
        setMensaje("Solicitud actualizada correctamente.");
      } else {
        await helpFetch("", {
          method: "POST",
          body: JSON.stringify(datos)
        });
        setMensaje("Solicitud registrada correctamente.");
      }
      limpiarFormulario();
      await cargarSolicitudes();
    } catch (err) {
      setError(err.message || "No fue posible guardar la solicitud.");
    }
  };

  const prepararEdicion = (solicitud) => {
    setFormulario({
      cliente: solicitud.cliente,
      telefono: solicitud.telefono,
      tipoEvento: solicitud.tipoEvento,
      fecha: solicitud.fecha,
      invitados: String(solicitud.invitados),
      presupuesto: String(solicitud.presupuesto),
      estado: solicitud.estado
    });
    setIdEdicion(solicitud.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE: elimina el registro seleccionado de la API.
  const eliminarSolicitud = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta solicitud?")) return;
    try {
      await helpFetch(`/${id}`, { method: "DELETE" });
      setMensaje("Solicitud eliminada correctamente.");
      if (idEdicion === id) limpiarFormulario();
      await cargarSolicitudes();
    } catch (err) {
      setError(err.message || "No fue posible eliminar la solicitud.");
    }
  };

  return (
    <main className="container py-4">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <p className="text-uppercase small fw-bold text-secondary mb-1">Gestión comercial</p>
          <h1 className="h2 mb-1">Altiora Eventos</h1>
          <p className="text-secondary mb-0">Administración de solicitudes de eventos</p>
        </div>
        <span className="badge text-bg-dark fs-6 px-3 py-2">Panel CRUD</span>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && (
        <div className="alert alert-success alert-dismissible" role="alert">
          {mensaje}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMensaje("")}></button>
        </div>
      )}

      <section className="card shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h2 className="h5 mb-0">{idEdicion !== null ? "Editar solicitud" : "Registrar solicitud"}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={manejarEnvio}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="cliente">Nombre del cliente</label>
                <input className="form-control" id="cliente" name="cliente" value={formulario.cliente} onChange={manejarCambio} required maxLength="100" />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="telefono">Teléfono</label>
                <input className="form-control" id="telefono" name="telefono" type="tel" value={formulario.telefono} onChange={manejarCambio} required maxLength="20" />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="tipoEvento">Tipo de evento</label>
                <select className="form-select" id="tipoEvento" name="tipoEvento" value={formulario.tipoEvento} onChange={manejarCambio}>
                  <option>Boda</option>
                  <option>Cumpleaños</option>
                  <option>Evento empresarial</option>
                  <option>Grado</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="fecha">Fecha del evento</label>
                <input className="form-control" id="fecha" name="fecha" type="date" value={formulario.fecha} onChange={manejarCambio} required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="invitados">Número de invitados</label>
                <input className="form-control" id="invitados" name="invitados" type="number" min="1" value={formulario.invitados} onChange={manejarCambio} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="presupuesto">Presupuesto estimado (COP)</label>
                <input className="form-control" id="presupuesto" name="presupuesto" type="number" min="0" step="1000" value={formulario.presupuesto} onChange={manejarCambio} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="estado">Estado</label>
                <select className="form-select" id="estado" name="estado" value={formulario.estado} onChange={manejarCambio}>
                  <option>Pendiente</option>
                  <option>En cotización</option>
                  <option>Confirmada</option>
                  <option>Cancelada</option>
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-dark" type="submit">
                {idEdicion !== null ? "Guardar cambios" : "Crear solicitud"}
              </button>
              {idEdicion !== null && (
                <button className="btn btn-outline-secondary" type="button" onClick={limpiarFormulario}>Cancelar edición</button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">Solicitudes registradas</h2>
          <span className="badge text-bg-secondary">{solicitudes.length} registros</span>
        </div>
        <div className="card-body p-0">
          {cargando ? (
            <p className="p-4 mb-0">Cargando solicitudes...</p>
          ) : solicitudes.length === 0 ? (
            <p className="p-4 mb-0 text-secondary">Todavía no hay solicitudes registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cliente</th>
                    <th>Evento</th>
                    <th>Fecha</th>
                    <th>Invitados</th>
                    <th>Presupuesto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td>
                        <strong>{solicitud.cliente}</strong>
                        <div className="small text-secondary">{solicitud.telefono}</div>
                      </td>
                      <td>{solicitud.tipoEvento}</td>
                      <td>{solicitud.fecha}</td>
                      <td>{solicitud.invitados}</td>
                      <td>{moneda(solicitud.presupuesto)}</td>
                      <td><span className="badge text-bg-light border">{solicitud.estado}</span></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-dark" onClick={() => prepararEdicion(solicitud)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarSolicitud(solicitud.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <footer className="text-center text-secondary small mt-4">
        Laboratorio IV · Programación Web · React + Fetch + json-server
      </footer>
    </main>
  );
}