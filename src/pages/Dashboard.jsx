import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DollarSign, Droplets, TrendingUp, Trash2, Search, LayoutTemplate } from 'lucide-react';

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalRent: 0, totalWater: 0 });
  const [chartData, setChartData] = useState([]);
  
  // New State for Search and Chart Type
  const [searchTerm, setSearchTerm] = useState('');
  const [chartType, setChartType] = useState('bar');

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('https://rent-tracker-backend-gvom.onrender.com/api/bills');
      const data = res.data;
      setBills(data);

      let rent = 0;
      let water = 0;
      const groupedData = {};

      data.forEach(bill => {
        const rentAmt = Number(bill.rent_amount) || 0;
        const waterAmt = Number(bill.water_bill_amount) || 0;
        rent += rentAmt;
        water += waterAmt;

        const date = new Date(bill.billing_month);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        if (!groupedData[monthYear]) {
          groupedData[monthYear] = { name: monthYear, Rent: 0, Water: 0 };
        }
        groupedData[monthYear].Rent += rentAmt;
        groupedData[monthYear].Water += waterAmt;
      });

      setStats({ totalRevenue: rent + water, totalRent: rent, totalWater: water });
      setChartData(Object.values(groupedData));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record? This cannot be undone.");
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://rent-tracker-backend-gvom.onrender.com/api/bills/${id}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete the record.');
    }
  };

  // Filter the bills based on the search term
  const filteredBills = bills.filter((bill) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const monthStr = new Date(bill.billing_month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase();
    const tenantName = (bill.name || '').toLowerCase();
    const roomNum = (bill.room_number || '').toLowerCase();

    return monthStr.includes(searchLower) || tenantName.includes(searchLower) || roomNum.includes(searchLower);
  });

  // Helper function to render the correct chart type
  const renderChart = () => {
    if (chartData.length === 0) {
      return <div className="h-full flex items-center justify-center text-gray-400">No revenue data available yet.</div>;
    }

    const commonAxes = (
      <>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Ksh ${value}`} />
        <Tooltip cursor={{ fill: '#F3F4F6' }} formatter={(value) => `Ksh ${value.toLocaleString()}`} />
        <Legend iconType="circle" />
      </>
    );

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
            {commonAxes}
            <Bar dataKey="Rent" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Water" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
            {commonAxes}
            <Line type="monotone" dataKey="Rent" stroke="#3B82F6" strokeWidth={3} />
            <Line type="monotone" dataKey="Water" stroke="#06B6D4" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
            {commonAxes}
            <Area type="monotone" dataKey="Rent" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
            <Area type="monotone" dataKey="Water" stackId="1" stroke="#06B6D4" fill="#06B6D4" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">Ksh {stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Rent</p>
            <h3 className="text-2xl font-bold text-gray-900">Ksh {stats.totalRent.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-cyan-100 rounded-lg">
            <Droplets className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Water</p>
            <h3 className="text-2xl font-bold text-gray-900">Ksh {stats.totalWater.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
          
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <LayoutTemplate className="w-4 h-4 text-gray-500 ml-2" />
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Graph</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>
        
        <div className="h-80 w-full">
          {renderChart()}
        </div>
      </div>

      {/* Recent Records Table with Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Billing History</h2>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search month, tenant, room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Month</th>
                <th className="p-4 font-medium">Tenant</th>
                <th className="p-4 font-medium">Room</th>
                <th className="p-4 font-medium">Rent</th>
                <th className="p-4 font-medium">Water Units</th>
                <th className="p-4 font-medium text-cyan-700">Water Bill</th>
                <th className="p-4 font-medium text-green-700">Total Bill</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-800 whitespace-nowrap">
                    {new Date(bill.billing_month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
                    {bill.name || 'Unnamed Tenant'}
                  </td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">{bill.room_number}</td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">Ksh {Number(bill.rent_amount).toLocaleString()}</td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">{bill.water_units_consumed}</td>
                  <td className="p-4 text-cyan-700 font-medium whitespace-nowrap">Ksh {Number(bill.water_bill_amount).toLocaleString()}</td>
                  <td className="p-4 font-bold text-green-700 whitespace-nowrap">Ksh {Number(bill.total_amount).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(bill.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">
                    {searchTerm ? `No records found matching "${searchTerm}"` : 'No billing history found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;