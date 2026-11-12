import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, EyeOff, LogOut, X } from 'lucide-react';

export default function Dashboard() {
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    worker_name: '',
    permit_status: 'Active',
    start_date: '',
    expiry_date: '',
    beneficiary_name: '',
    beneficiary_no: '',
    recruitment_company: '',
    recruitment_no: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const fetchWorkers = async () => {
    try {
      const { data } = await API.get('/workers');
      setWorkers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await API.put(`/workers/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post('/workers', form);
      }
      setForm({
        worker_name: '',
        permit_status: '',
        start_date: '',
        expiry_date: '',
        beneficiary_name: '',
        beneficiary_no: '',
        recruitment_company: '',
        recruitment_no: '',
      });
      setShowForm(false);
      fetchWorkers();
    } catch (err) {
      alert('Error saving worker');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      worker_name: '',
      permit_status: '',
      start_date: '',
      expiry_date: '',
      beneficiary_name: '',
      beneficiary_no: '',
      recruitment_company: '',
      recruitment_no: '',
    });
    setShowForm(true);
  };

  const handleEdit = (worker) => {
    setEditingId(worker._id);
    const { status, _id, createdAt, updatedAt, __v, ...rest } = worker;
    setForm(rest);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await API.delete(`/workers/${id}`);
      fetchWorkers();
    }
  };

  const handleView = (worker) => {
    window.open(`/verification?worker=${worker._id}`, '_blank');
  };

  const handleToggleStatus = async (id) => {
    await API.patch(`/workers/${id}/status`);
    fetchWorkers();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const inputClass =
    'p-2.5 bg-black text-white placeholder-gray-500 rounded-md border border-gray-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition';

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage worker permits</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddClick}
            className="cursor-pointer bg-white text-black px-4 py-2.5 rounded-md hover:bg-gray-200 flex items-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Worker
          </button>
          <button
            onClick={handleLogout}
            className="cursor-pointer bg-transparent border border-gray-700 text-gray-300 px-4 py-2.5 rounded-md hover:bg-gray-900 hover:text-white hover:border-gray-500 flex items-center gap-2 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#0d0d0d] border border-gray-800 p-6 sm:p-8 rounded-xl w-full max-w-4xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Worker' : 'Add Worker'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(form).map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="text"
                    placeholder={key.replace(/_/g, ' ').toUpperCase()}
                    value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              ))}
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer flex-1 bg-white text-black hover:bg-gray-200 p-2.5 rounded-md font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <span className="mr-2 flex h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingId ? 'Update Worker' : 'Add Worker'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer px-5 bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workers Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-left bg-[#0d0d0d]">
          <thead className="bg-[#161616] text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Worker Name</th>
              <th className="p-4 font-semibold">Permit Status</th>
              <th className="p-4 font-semibold">Beneficiary</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {workers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  No workers found.
                </td>
              </tr>
            ) : (
              workers.map((w) => (
                <tr key={w._id} className="hover:bg-[#161616] transition-colors">
                  <td className="p-4 font-medium text-white">{w.worker_name}</td>
                  <td className="p-4 text-gray-300">{w.permit_status}</td>
                  <td className="p-4 text-gray-300">
                    {w.beneficiary_name} <span className="text-gray-500">({w.beneficiary_no})</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        w.status === 'active'
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-gray-400 border-gray-600'
                      }`}
                    >
                      {w.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(w)}
                        className="cursor-pointer p-2 rounded-md bg-transparent border border-gray-700 text-gray-300 hover:bg-white hover:text-black hover:border-white transition"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(w)}
                        className="cursor-pointer p-2 rounded-md bg-transparent border border-gray-700 text-gray-300 hover:bg-white hover:text-black hover:border-white transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(w._id)}
                        className="cursor-pointer p-2 rounded-md bg-transparent border border-gray-700 text-gray-300 hover:bg-white hover:text-black hover:border-white transition"
                        title={w.status === 'active' ? 'Hide' : 'Activate'}
                      >
                        {w.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(w._id)}
                        className="cursor-pointer p-2 rounded-md bg-transparent border border-gray-700 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}