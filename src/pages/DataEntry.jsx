import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, FileText, Save, Trash2, Settings, Loader2 } from 'lucide-react';

const DataEntry = () => {
  const [tenants, setTenants] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true); // Tracks Render wake-up

  // Tenant Form State
  const [tenantName, setTenantName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Bill Form State
  const [selectedTenant, setSelectedTenant] = useState('');
  const [billingMonth, setBillingMonth] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [prevReading, setPrevReading] = useState('');
  const [currReading, setCurrReading] = useState('');

  // Settings State
  const [waterRate, setWaterRate] = useState('');
  const [isSavingRate, setIsSavingRate] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch Tenants
        const tenantRes = await axios.get('http://localhost:5000/api/tenants');
        if (Array.isArray(tenantRes.data)) setTenants(tenantRes.data);

        // Fetch current water rate
        const rateRes = await axios.get('http://localhost:5000/api/settings/water-rate');
        setWaterRate(rateRes.data.rate);
      } catch (error) {
        console.error('Error fetching data (Server might be waking up):', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateWaterRate = async (e) => {
    e.preventDefault();
    setIsSavingRate(true);
    try {
      await axios.post('http://localhost:5000/api/settings/water-rate', { rate: waterRate });
      setStatusMsg({ text: 'Water rate updated globally!', type: 'success' });
    } catch (error) {
      setStatusMsg({ text: 'Error updating water rate.', type: 'error' });
    } finally {
      setIsSavingRate(false);
    }
  };

  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tenants', {
        name: tenantName,
        room_number: roomNumber,
        phone_number: phoneNumber
      });
      setStatusMsg({ text: 'Tenant added successfully!', type: 'success' });
      setTenantName(''); setRoomNumber(''); setPhoneNumber('');
      
      // Refresh list
      const res = await axios.get('http://localhost:5000/api/tenants');
      setTenants(res.data);
    } catch (error) {
      setStatusMsg({ text: 'Error adding tenant.', type: 'error' });
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bills', {
        tenant_id: selectedTenant,
        billing_month: billingMonth + '-01',
        rent_amount: rentAmount || 0,
        previous_water_reading: prevReading,
        current_water_reading: currReading
      });
      setStatusMsg({ text: 'Monthly bill saved successfully!', type: 'success' });
      setSelectedTenant(''); setBillingMonth(''); setRentAmount(''); 
      setPrevReading(''); setCurrReading('');
    } catch (error) {
      setStatusMsg({ text: 'Error saving bill. Make sure a bill for this month does not already exist.', type: 'error' });
    }
  };

  const handleDeleteTenant = async (id, name) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/tenants/${id}`);
      setStatusMsg({ text: 'Tenant deleted successfully!', type: 'success' });
      const res = await axios.get('http://localhost:5000/api/tenants');
      setTenants(res.data);
    } catch (error) {
      setStatusMsg({ text: 'Cannot delete tenant. They likely have existing billing records.', type: 'error' });
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* NEW: Global Settings Section */}
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="p-4 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="text-indigo-600 w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold text-indigo-900">System Settings</h2>
          </div>
        </div>
        <form onSubmit={handleUpdateWaterRate} className="p-4 flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Water Rate (Per Unit)</label>
            <input type="number" required value={waterRate} onChange={(e) => setWaterRate(e.target.value)} className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>
          <button type="submit" disabled={isSavingRate || isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
            {isSavingRate ? 'Saving...' : 'Update Price'}
          </button>
        </form>
      </div>

      {/* Add New Tenant Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center">
          <UserPlus className="text-blue-500 w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold text-blue-900">Add New Tenant</h2>
        </div>
        <form onSubmit={handleAddTenant} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room/House Number</label>
            <input type="text" required value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., A1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 0712345678" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">
            <Save className="w-4 h-4 mr-2" /> Save Tenant
          </button>
        </form>
      </div>

      {/* Log Monthly Bill Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
        <div className="bg-green-50 p-4 border-b border-green-100 flex items-center">
          <FileText className="text-green-600 w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold text-green-900">Log Monthly Bill</h2>
        </div>
        <form onSubmit={handleAddBill} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
            <select required value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} disabled={isLoading} className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100">
              <option value="">{isLoading ? "Loading tenants..." : "-- Choose a tenant --"}</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name} (Room {t.room_number})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Month</label>
            <input type="month" required value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount Paid (Ksh)</label>
            <input type="number" required value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prev Water</label>
              <input type="number" required value={prevReading} onChange={(e) => setPrevReading(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Units" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curr Water</label>
              <input type="number" required value={currReading} onChange={(e) => setCurrReading(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Units" />
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex justify-center items-center">
            <Save className="w-4 h-4 mr-2" /> Save Monthly Record
          </button>
        </form>
      </div>

      {/* Status Notifications */}
      {statusMsg.text && (
        <div className={`col-span-1 md:col-span-2 p-4 rounded-lg text-center font-medium ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Existing Tenants Table */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Manage Tenants</h2>
          {isLoading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Room Number</th>
                <th className="p-4 font-medium">Phone Number</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && tenants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 animate-pulse">
                    Waking up database... this can take up to 50 seconds.
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-800 font-medium">{t.name}</td>
                    <td className="p-4 text-gray-600">{t.room_number}</td>
                    <td className="p-4 text-gray-600">{t.phone_number || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDeleteTenant(t.id, t.name)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && tenants.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
                    No tenants found. Add one above!
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

export default DataEntry;