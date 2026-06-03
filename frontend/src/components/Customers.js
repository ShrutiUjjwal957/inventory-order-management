import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from '../services/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch customers');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer(form);
      showMessage('success', 'Customer created successfully');
      resetForm();
      fetchCustomers();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Operation failed';
      showMessage('error', detail);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      showMessage('success', 'Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      showMessage('error', 'Failed to delete customer');
    }
  };

  const resetForm = () => {
    setForm({ full_name: '', email: '', phone_number: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Customer</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone_number}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(customer.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No customers found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
