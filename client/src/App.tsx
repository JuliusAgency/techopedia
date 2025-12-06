import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DesignDetail from './pages/DesignDetail';
import JuliusRedirect from './pages/JuliusRedirect';
import JuliusWelcomeProject from './components/JuliusWelcomeProject';

function App() {
  return (
    <BrowserRouter>
      <JuliusWelcomeProject />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/design/:id" element={<DesignDetail />} />
        <Route path="/we" element={<JuliusRedirect />} />
        <Route path="/are" element={<JuliusRedirect />} />
        <Route path="/Julius:)" element={<JuliusRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

