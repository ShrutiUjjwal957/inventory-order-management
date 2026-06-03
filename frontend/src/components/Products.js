import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity_in_stock: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch products');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      sku: form.sku,
      price: parseFloat(form.price),
      quantity_in_stock: parseInt(form.quantity_in_stock)
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        showMessage('success', 'Product updated successfully');
      } else {
        await createProduct(data);
        showMessage('success', 'Product created successfully');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Operation failed';
      showMessage('error', detail);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity_in_stock: product.quantity_in_stock.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      showMessage('success', 'Product deleted successfully');
      fetchProducts();
    } catch (err) {
      showMessage('error', 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setForm({ name: '', sku: '', price: '', quantity_in_stock: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Product</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>SKU / Code</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Quantity in Stock</label>
                <input type="number" min="0" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update' : 'Create'}</button>
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
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>${product.price.toFixed(2)}</td>
                <td style={{ color: product.quantity_in_stock < 10 ? '#d32f2f' : 'inherit', fontWeight: product.quantity_in_stock < 10 ? 600 : 400 }}>
                  {product.quantity_in_stock}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(product)} style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
