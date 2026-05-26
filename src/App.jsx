import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileEdit } from 'lucide-react';
import WaterCalculator from './pages/WaterCalculator';
import DataEntry from './pages/DataEntry';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wider">Property Manager</h1>
            <div className="flex space-x-6">
              <Link to="/" className="flex items-center hover:text-blue-200 transition">
                <LayoutDashboard className="w-5 h-5 mr-1" />
                Dashboard
              </Link>
              <Link to="/calculator" className="flex items-center hover:text-blue-200 transition">
                <Calculator className="w-5 h-5 mr-1" />
                Water Calc
              </Link>
              <Link to="/entry" className="flex items-center hover:text-blue-200 transition">
                <FileEdit className="w-5 h-5 mr-1" />
                Add Record
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto mt-6 bg-white shadow rounded-lg min-h-[70vh]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calculator" element={<WaterCalculator />} />
            <Route path="/entry" element={<DataEntry />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;