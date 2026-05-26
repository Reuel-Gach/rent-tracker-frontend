import { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplets, Calculator, Loader2 } from 'lucide-react';

const WaterCalculator = () => {
  const [previousReading, setPreviousReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [waterRate, setWaterRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the live water rate from the database
  useEffect(() => {
    const fetchWaterRate = async () => {
      try {
        const res = await axios.get('https://rent-tracker-backend-gvom.onrender.com/api/settings/water-rate');
        setWaterRate(res.data.rate);
      } catch (error) {
        console.error('Error fetching water rate:', error);
        // Fallback just in case the server is asleep
        setWaterRate(110); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaterRate();
  }, []);

  // Calculate units, ensuring it doesn't drop below zero if inputs are flipped
  const prev = parseInt(previousReading) || 0;
  const curr = parseInt(currentReading) || 0;
  const unitsConsumed = curr > prev ? curr - prev : 0;
  
  // Dynamic rate calculation
  const totalCost = unitsConsumed * waterRate;

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="text-blue-500 w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold text-blue-900">Monthly Water Calculator</h2>
          </div>
          {isLoading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
        </div>

        <div className="p-6 space-y-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Meter Reading
              </label>
              <input
                type="number"
                value={previousReading}
                onChange={(e) => setPreviousReading(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g., 1050"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Meter Reading
              </label>
              <input
                type="number"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g., 1065"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Units Consumed:</span>
              <span className="font-semibold text-gray-900">{unitsConsumed} units</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Rate per Unit:</span>
              <span className="font-semibold text-gray-900">
                {isLoading ? 'Loading...' : `Ksh ${waterRate}`}
              </span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-800 font-medium flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-600" />
                Total Bill
              </span>
              <span className="text-2xl font-bold text-green-600">
                Ksh {totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterCalculator;