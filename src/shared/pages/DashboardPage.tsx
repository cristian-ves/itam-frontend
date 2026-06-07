import { Link } from "react-router-dom";

export const DashboardPage = () => {
  return (
    <>
      <div>
        <h1>Control De Activos</h1>
      </div>
      <div>
        <h2>username</h2>
        <button>Carga Masiva</button>
      </div>
      <div>
        <ul>
          <li>
            <Link to="/laboratorios">Laboratorios</Link>
          </li>
          <li>
            <Link to="/servidores">Servidores</Link>
          </li>
          <li>
            <Link to="/proyectores">Proyectores</Link>
          </li>
          <li>
            <Link to="/licencias">Licencias de Software</Link>
          </li>
        </ul>
      </div>
    </>
  );
};
