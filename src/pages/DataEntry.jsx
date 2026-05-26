import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, FileText, Save, Trash2 } from 'lucide-react';

const DataEntry = () => {
  const [tenants, setTenants] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [tenantName, setTenantName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [billingMonth, setBillingMonth] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [prevReading, setPrevReading] = useState('');
  const [currReading, setCurrReading] = useState('');

  const fetchTenants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tenants');
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
      await axios.post('http://localhost:5000/api/tenants', {
        name: tenantName,
        room_number: roomNumber,
        phone_number: phoneNumber
      });
      setStatusMsg({ text: 'Tenant added!', type: 'success' });
      setTenantName(''); setRoomNumber(''); setPhoneNumber('');
      fetchTenants();
    } catch (error) {
      setStatusMsg({ text: 'Error adding tenant.', type: 'error' });
    }
  };

  const handleDeleteTenant = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/tenants/${id}`);
        fetchTenants();
      } catch (error) {
        alert('Cannot delete: This tenant may have existing bills.');
      }
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bills', {
        tenant_id: selectedTenant,
        billing_month: billingMonth + '-01',
        rent_amount: rentAmount,
        previous_water_reading: prevReading,
        current_water_reading: currReading
      });
      setStatusMsg({ text: 'Bill saved!', type: 'success' });
    } catch (error) {
      setStatusMsg({ text: 'Error saving bill.', type: 'error' });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Tenant Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Tenant</h2>
          <form onSubmit={handleAddTenant} className="space-y-4">
            <input type="text" placeholder="Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="w-full p-2 border rounded" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Tenant</button>
          </form>
        </div>

        {/* Log Bill Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Log Monthly Bill</h2>
          <form onSubmit={handleAddBill} className="space-y-4">
            <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} className="w-full p-2 border rounded" required>
              <option value="">Select Tenant</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input type="month" value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)} className="w-full p-2 border rounded" required />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Bill</button>
          </form>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Existing Tenants</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-2">Name</th>
              <th className="p-2">Room</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.room_number}</td>
                <td className="p-2">
                  <button onClick={() => handleDeleteTenant(t.id, t.name)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataEntry;