import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileEdit } from 'lucide-react';
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
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
            
            {/* ONLY show navigation links and Profile Button if logged in */}
            <SignedIn>
              <div className="flex items-center space-x-6">
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
                
                {/* Clerk User Profile & Logout Button */}
                <div className="pl-4 border-l border-blue-400">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </SignedIn>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto mt-6 bg-white shadow rounded-lg min-h-[70vh] flex flex-col">
          
          {/* What to show if the user is NOT logged in */}
          <SignedOut>
            <div className="flex-grow flex justify-center items-center p-8">
              <SignIn />
            </div>
          </SignedOut>

          {/* What to show if the user IS logged in */}
          <SignedIn>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator" element={<WaterCalculator />} />
              <Route path="/entry" element={<DataEntry />} />
            </Routes>
          </SignedIn>
          
        </main>
      </div>
    </Router>
  );
}

export default App;