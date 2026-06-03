import React, { useState, useEffect } from 'react';
import { getProducts, getCustomers, getOrders } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, lowStock: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        getProducts(),
        getCustomers(),
        getOrders()
      ]);
      const lowStock = productsRes.data.filter(p => p.quantity_in_stock < 10);
      setStats({
        products: productsRes.data.length,
        customers: customersRes.data.length,
        orders: ordersRes.data.length,
        lowStock
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-content"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <div className="stat-value">{stats.customers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.orders}</div>
        </div>
        <div className="stat-card warning">
          <h3>Low Stock Items</h3>
          <div className="stat-value">{stats.lowStock.length}</div>
        </div>
      </div>

      {stats.lowStock.length > 0 && (
        <div className="low-stock-section">
          <h3>⚠️ Low Stock Products (less than 10 units)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStock.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td style={{ color: '#d32f2f', fontWeight: 600 }}>{product.quantity_in_stock}</td>
                    <td>${product.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
