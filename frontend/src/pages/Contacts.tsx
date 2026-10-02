import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, MessageSquare, Download, User, Building2, MapPin, Tag, X, ChevronRight, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './pages.css';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  tags: string[];
  lastContact: string;
  totalInteractions: number;
  channel: 'voice' | 'chat' | 'email';
}

export const Contacts: React.FC = () => {
  const { apiFetch } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', company: '', location: '' });
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '', location: '' });
  const [loading, setLoading] = useState(true);

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiFetch('http://localhost:3001/api/contacts');
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (err) {
        console.error('Failed to fetch contacts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [apiFetch]);

  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = filterTag === 'All' || (c.tags && c.tags.includes(filterTag));
    return matchSearch && matchTag;
  });

  const ChannelIcon = ({ channel }: { channel: string }) => {
    if (channel === 'voice') return <Phone size={14} />;
    if (channel === 'chat') return <MessageSquare size={14} />;
    return <Mail size={14} />;
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Location', 'Tags', 'Last Contact', 'Total Interactions', 'Channel'];
    const rows = filteredContacts.map(c => [c.name, c.email, c.phone, c.company, c.location, c.tags?.join('; ') || '', c.lastContact, String(c.totalInteractions), c.channel]);
    const csv = [headers, ...rows].map(row => row.map(col => `"${col}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparktg_contacts_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email) return;
    
    try {
      const res = await apiFetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      });
      if (res.ok) {
        const addedContact = await res.json();
        setContacts(prev => [addedContact, ...prev]);
        setShowAddModal(false);
        setNewContact({ name: '', email: '', phone: '', company: '', location: '' });
      }
    } catch (err) {
      console.error('Failed to create contact', err);
    }
  };

  const startEdit = () => {
    if (!selectedContact) return;
    setEditForm({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      company: selectedContact.company,
      location: selectedContact.location,
    });
    setEditMode(true);
  };

  const saveEdit = async () => {
    if (!selectedContact) return;
    
    try {
      const res = await apiFetch(`http://localhost:3001/api/contacts/${selectedContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        // The backend PUT currently returns the pure Prisma Contact model (missing the extra joined fields).
        // So we merge it into the existing contact state to preserve tags, lastContact, totalInteractions, etc.
        const mergedContact = { ...selectedContact, ...updated };
        
        setContacts(prev => prev.map(c => c.id === mergedContact.id ? mergedContact : c));
        setSelectedContact(mergedContact);
        setEditMode(false);
      }
    } catch (err) {
      console.error('Failed to update contact', err);
    }
  };

  return (
    <div className="contacts-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">{contacts.length} total contacts in your CRM</p>
        </div>
        <div className="header-actions">
          <button className="btn bg-bg-hover text-text-primary" onClick={exportCSV}>
            <Download size={16} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Contact
          </button>
        </div>
      </div>

      <div className="contacts-layout">
        <div className="contacts-list-panel glass">
          <div className="contacts-toolbar">
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Search contacts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="filter-tags">
              {['All', 'Premium', 'Enterprise', 'Standard', 'VIP'].map(tag => (
                <button key={tag} className={`filter-chip ${filterTag === tag ? 'active' : ''}`} onClick={() => setFilterTag(tag)}>{tag}</button>
              ))}
            </div>
          </div>

          <div className="contacts-table-wrapper">
            <table className="data-table contacts-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Last Contact</th>
                  <th>Interactions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className={`contact-row ${selectedContact?.id === contact.id ? 'selected' : ''}`} onClick={() => { setSelectedContact(contact); setEditMode(false); }}>
                    <td>
                      <div className="contact-cell">
                        <div className="contact-avatar-table"><User size={16} /></div>
                        <div>
                          <span className="contact-name">{contact.name}</span>
                          <span className="contact-email">{contact.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><div className="company-cell"><Building2 size={14} /><span>{contact.company}</span></div></td>
                    <td className="text-muted text-sm">{contact.lastContact}</td>
                    <td><div className="interaction-count"><ChannelIcon channel={contact.channel} /><span>{contact.totalInteractions}</span></div></td>
                    <td><ChevronRight size={16} className="text-muted" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="contact-detail-panel glass">
          {!selectedContact ? (
            <div className="empty-panel">
              <User size={48} style={{ opacity: 0.15 }} />
              <p className="text-muted mt-4">Select a contact to view details</p>
            </div>
          ) : (
            <div className="contact-detail animate-fade-in">
              <div className="detail-header">
                <div className="detail-avatar"><User size={32} /></div>
                <div>
                  <h2>{selectedContact.name}</h2>
                  <p className="text-muted text-sm">{selectedContact.company}</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                  {!editMode && <button className="icon-btn" onClick={startEdit} title="Edit Contact"><Edit2 size={16} /></button>}
                  <button className="icon-btn" onClick={() => { setSelectedContact(null); setEditMode(false); }}><X size={18} /></button>
                </div>
              </div>

              {editMode ? (
                <div className="detail-section">
                  <h4>Edit Contact</h4>
                  <div className="edit-form">
                    <div className="form-group"><label>Name</label><input className="text-input full-width" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
                    <div className="form-group mt-4"><label>Email</label><input className="text-input full-width" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} /></div>
                    <div className="form-group mt-4"><label>Phone</label><input className="text-input full-width" value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} /></div>
                    <div className="form-group mt-4"><label>Company</label><input className="text-input full-width" value={editForm.company} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} /></div>
                    <div className="form-group mt-4"><label>Location</label><input className="text-input full-width" value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))} /></div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button className="btn btn-primary" onClick={saveEdit}><Save size={16} /> Save</button>
                      <button className="btn bg-bg-hover text-text-primary" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="detail-section">
                    <h4>Contact Information</h4>
                    <div className="detail-row"><Mail size={14} /> <span>{selectedContact.email}</span></div>
                    <div className="detail-row"><Phone size={14} /> <span>{selectedContact.phone}</span></div>
                    <div className="detail-row"><MapPin size={14} /> <span>{selectedContact.location}</span></div>
                    <div className="detail-row"><Building2 size={14} /> <span>{selectedContact.company}</span></div>
                  </div>
                  <div className="detail-section">
                    <h4>Tags</h4>
                    <div className="detail-tags">
                      {selectedContact.tags.map(tag => (
                        <span key={tag} className={`tag ${tag === 'Premium' || tag === 'VIP' ? 'premium' : ''}`}><Tag size={10} /> {tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-section">
                    <h4>Quick Stats</h4>
                    <div className="detail-stats">
                      <div className="stat-box"><span className="stat-value">{selectedContact.totalInteractions}</span><span className="stat-label">Total Interactions</span></div>
                      <div className="stat-box"><span className="stat-value">{selectedContact.lastContact}</span><span className="stat-label">Last Contact</span></div>
                    </div>
                  </div>
                  <div className="detail-actions mt-6">
                    <button className="btn btn-primary full-width"><Phone size={16} /> Call Now</button>
                    <button className="btn bg-bg-hover text-text-primary full-width mt-4"><MessageSquare size={16} /> Start Chat</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="command-palette-overlay" onClick={() => setShowAddModal(false)}>
          <div className="command-palette glass animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxHeight: 'none' }}>
            <div className="palette-search" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <Plus size={20} style={{ color: 'var(--primary-500)' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Add New Contact</h3>
              <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="form-group"><label>Full Name *</label><input className="text-input full-width" placeholder="Enter full name" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="form-group mt-4"><label>Email *</label><input className="text-input full-width" placeholder="email@company.com" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} /></div>
              <div className="form-group mt-4"><label>Phone</label><input className="text-input full-width" placeholder="+91 00000 00000" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} /></div>
              <div className="form-group mt-4"><label>Company</label><input className="text-input full-width" placeholder="Company name" value={newContact.company} onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))} /></div>
              <div className="form-group mt-4"><label>Location</label><input className="text-input full-width" placeholder="City" value={newContact.location} onChange={e => setNewContact(p => ({ ...p, location: e.target.value }))} /></div>
              <button className="btn btn-primary full-width mt-6" onClick={handleAddContact} disabled={!newContact.name || !newContact.email}>
                <Plus size={16} /> Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
