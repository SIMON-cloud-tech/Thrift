import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../css/ProductManage.css';

const CATEGORIES = [
  { value: 'sneakers',     label: 'Sneakers' },
  { value: 'timberland',   label: 'Timberland' },
  { value: 'office-shoes', label: 'Office Shoes' },
];
const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const BADGES = ['', 'Best Seller', 'New', 'Limited', 'Sale'];
const EMPTY = {
  name: '', price: '', description: '', category: 'sneakers',
  sizes: [], badge: '', images: [], existingImages: [],
};

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.data || data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  /* ---------- helpers ---------- */
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const onChange = e => set(e.target.name, e.target.value);

  const reset = () => {
    form.images.forEach(img => URL.revokeObjectURL(img.preview));
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
  };

  const toggleSize = s => set('sizes',
    form.sizes.includes(s)
      ? form.sizes.filter(x => x !== s)
      : [...form.sizes, s].sort((a, b) => a - b)
  );

  const onImages = e => {
    const slots = 4 - form.images.length - form.existingImages.length;
    const picked = Array.from(e.target.files).slice(0, slots)
      .map(file => ({ file, preview: URL.createObjectURL(file) }));
    if (picked.length) set('images', [...form.images, ...picked]);
    e.target.value = ''; // allow re-picking the same file
  };

  const removeImage = (type, idx) => {
    if (type === 'new') URL.revokeObjectURL(form.images[idx].preview);
    const key = type === 'existing' ? 'existingImages' : 'images';
    set(key, form[key].filter((_, i) => i !== idx));
  };

  /* ---------- actions ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sizes.length) return alert('Please select at least one size.');

    const fd = new FormData();
    ['name', 'price', 'description', 'category', 'badge'].forEach(k => fd.append(k, form[k]));
    fd.append('sizes', JSON.stringify(form.sizes));
    fd.append('existingImages', JSON.stringify(form.existingImages));
    form.images.forEach(({ file }) => fd.append('images', file));

    try {
      const res = await fetch(editingId ? `/api/products/${editingId}` : '/api/products', {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error('Save failed');
      await fetchProducts();
      reset();
    } catch (err) { console.error(err); alert('Could not save product.'); }
  };

  const handleDelete = async (id) => {
    if (confirmId !== id) return setConfirmId(id);
    setConfirmId(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '', price: String(p.price ?? ''), description: p.description || '',
      category: p.category || 'sneakers', sizes: p.sizes || [], badge: p.badge || '',
      images: [],
      existingImages: p.images?.length ? p.images : p.image ? [p.image] : [],
    });
    setShowForm(true);
  };

  /* ---------- render ---------- */
  if (loading) return <div className="product-loading">Loading products...</div>;

  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const totalImages = form.images.length + form.existingImages.length;

  return (
    <div className="product-manage">
      <div className="product-header">
        <div className="header-actions">
          {hasMore && <button className="load-more-btn" onClick={() => setVisibleCount(v => v + 6)}>Load More</button>}
          <button className="add-btn" onClick={() => setShowForm(true)}><FiPlus /> Add Product</button>
        </div>
      </div>

      <div className="product-grid">
        {visible.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-image">
              {p.image ? <img src={p.image} alt={p.name} /> : <div className="placeholder-image">No Image</div>}
              {p.badge && <span className="product-badge">{p.badge}</span>}
            </div>
            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="product-category">{p.category}</p>
              <p className="product-price">KES {Number(p.price).toLocaleString()}</p>
              <p className="product-description">{p.description}</p>
              {p.sizes?.length > 0 && <p className="product-sizes">Sizes: {p.sizes.join(', ')}</p>}
            </div>
            <div className="product-actions">
              <button className="edit-btn" onClick={() => handleEdit(p)}><FiEdit /> Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                <FiTrash2 /> {confirmId === p.id ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!visible.length && (
        <div className="no-products"><p>No products yet. Click "Add Product" to create one.</p></div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={reset}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
              <button className="close-modal" onClick={reset}><FiX /></button>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Product Name</label>
                <input name="name" value={form.name} onChange={onChange}
                  placeholder="e.g. Air Zoom Runner" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={onChange} required>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (KES)</label>
                  <input type="number" step="1" name="price" value={form.price}
                    onChange={onChange} placeholder="4500" required />
                </div>
              </div>

              <div className="form-group">
                <label>Badge (optional)</label>
                <select name="badge" value={form.badge} onChange={onChange}>
                  {BADGES.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={onChange}
                  rows="3" required />
              </div>

              <div className="form-group">
                <label>Sizes Available</label>
                <div className="sizes-grid">
                  {ALL_SIZES.map(s => (
                    <button key={s} type="button"
                      className={`size-chip ${form.sizes.includes(s) ? 'is-active' : ''}`}
                      onClick={() => toggleSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Product Images (up to 4)</label>
                <div className="file-upload-wrapper">
                  <input type="file" id="image-upload" className="file-upload-input"
                    accept="image/*" multiple onChange={onImages}
                    disabled={totalImages >= 4} />
                  <label htmlFor="image-upload" className="file-upload-label">
                    <FiPlus /> Choose Images
                  </label>
                  <span className="file-name">{totalImages} / 4 selected</span>
                </div>
                {totalImages > 0 && (
                  <div className="image-preview-grid">
                    {form.existingImages.map((url, i) => (
                      <div key={`e-${i}`} className="image-preview-item">
                        <img src={url} alt="" />
                        <button type="button" className="remove-image"
                          onClick={() => removeImage('existing', i)}><FiX /></button>
                      </div>
                    ))}
                    {form.images.map((img, i) => (
                      <div key={`n-${i}`} className="image-preview-item">
                        <img src={img.preview} alt="" />
                        <button type="button" className="remove-image"
                          onClick={() => removeImage('new', i)}><FiX /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={reset}>Cancel</button>
                <button type="submit" className="save-btn">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManage;