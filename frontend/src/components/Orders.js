import React, { useState, useEffect } from 'react';
import { getOrders, getOrder, createOrder, deleteOrder, getProducts, getCustomers } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: '', items: [{ product_id: '', quantity: '' }] });
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch orders');
    }
  };

  const fetchFormData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([getProducts(), getCustomers()]);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (err) {
      showMessage('error', 'Failed to load form data');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleOpenForm = () => {
    fetchFormData();
    setShowForm(true);
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getOrder(id);
      setShowDetail(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch order details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      customer_id: parseInt(form.customer_id),
      items: form.items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity)
      }))
    };

    try {
      await createOrder(data);
      showMessage('success', 'Order created successfully');
      resetForm();
      fetchOrders();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to create order';
      showMessage('error', detail);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id);
      showMessage('success', 'Order deleted successfully');
      fetchOrders();
    } catch (err) {
      showMessage('error', 'Failed to delete order');
    }
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: '', quantity: '' }] });
  };

  const removeItem = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: items.length ? items : [{ product_id: '', quantity: '' }] });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const resetForm = () => {
    setForm({ customer_id: '', items: [{ product_id: '', quantity: '' }] });
    setShowForm(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={handleOpenForm}>+ Create Order</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer</label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
                  <option value="">Select a customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
                </select>
              </div>
              <h3 style={{ margin: '1rem 0 0.5rem' }}>Order Items</h3>
              {form.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label>Product</label>
                    <select value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)} required>
                      <option value="">Select product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity_in_stock})</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Qty</label>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} required />
                  </div>
                  {form.items.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-sm" onClick={addItem} style={{ marginTop: '0.5rem' }}>+ Add Item</button>
              <div className="form-actions">
                <button type="button" className="btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Order #{showDetail.id}</h2>
            <p><strong>Customer ID:</strong> {showDetail.customer_id}</p>
            <p><strong>Status:</strong> {showDetail.status}</p>
            <p><strong>Total:</strong> ${showDetail.total_amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(showDetail.created_at).toLocaleDateString()}</p>
            <h3 style={{ margin: '1rem 0 0.5rem' }}>Items</h3>
            <table>
              <thead><tr><th>Product ID</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
              <tbody>
                {showDetail.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.product_id}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={() => setShowDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_id}</td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleViewDetail(order.id)} style={{ marginRight: '0.5rem' }}>View</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
