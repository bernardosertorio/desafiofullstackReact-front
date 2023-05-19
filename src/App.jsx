import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EmpresasProvider } from './contexts/empresas.context';
import { FornecedoresProvider } from './contexts/fornecedores.context';
import Manager from './pages/managerPage';

function App() {
  return (
    <Router>
      <EmpresasProvider>
        <FornecedoresProvider>
          <Routes>
            <Route path="/" element={<Manager />} />
          </Routes>
        </FornecedoresProvider>
      </EmpresasProvider>
    </Router>
  );
}

export default App;