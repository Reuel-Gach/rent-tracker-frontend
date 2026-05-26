import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, FileText, Save } from 'lucide-react';

const DataEntry = () => {
  const [tenants, setTenants] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

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

  // Fetch tenants when page loads
  const fetchTenants = async () => {
    try {
      const res = await axios.get('https://rent-tracker-backend-gvom.onrender.com/api/tenants');
      setTenants(res.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://rent-tracker-backend-gvom.onrender.com/api/tenants', {
        name: tenantName,
        room_number: roomNumber,
        phone_number: phoneNumber
      });
      setStatusMsg({ text: 'Tenant added successfully!', type: 'success' });
      setTenantName(''); setRoomNumber(''); setPhoneNumber('');
      fetchTenants(); // Refresh dropdown list
    } catch (error) {
      setStatusMsg({ text: 'Error adding tenant.', type: 'error' });
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://rent-tracker-backend-gvom.onrender.com/api/bills', {
        tenant_id: selectedTenant,
        billing_month: billingMonth + '-01', // Format as YYYY-MM-01 for the database
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

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-green-50 p-4 border-b border-green-100 flex items-center">
          <FileText className="text-green-600 w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold text-green-900">Log Monthly Bill</h2>
        </div>
        <form onSubmit={handleAddBill} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
            <select required value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="">-- Choose a tenant --</option>
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

      {/* Current Tenants List */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="p-4 border-b font-semibold text-gray-800">Existing Tenants</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Room</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.room_number}</td>
                  <td className="p-3">
                    <button 
                      onClick={async () => {
                        if(window.confirm(`Delete ${t.name}?`)) {
                          await axios.delete(` https://rent-tracker-backend-gvom.onrender.com/api/tenants/${t.id}`);
                          fetchTenants(); // Refresh the list
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DataEntry;