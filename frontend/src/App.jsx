import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './pages/Inicio';
import Buscar from './pages/Buscar';
import Reportar from './pages/Reportar';
import Persona from './pages/Persona';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/persona/:id" element={<Persona />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
