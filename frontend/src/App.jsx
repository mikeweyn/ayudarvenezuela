import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header, { BottomNav } from './components/Header';
import Inicio from './pages/Inicio';
import Buscar from './pages/Buscar';
import Reportar from './pages/Reportar';
import Persona from './pages/Persona';
import Emergencias from './pages/Emergencias';
import Hospital from './pages/Hospital';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ paddingBottom: '4.5rem' }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/persona/:id" element={<Persona />} />
          <Route path="/emergencias" element={<Emergencias />} />
          <Route path="/hospital" element={<Hospital />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}
