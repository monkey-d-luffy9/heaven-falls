import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Plus, Edit2, Check } from 'lucide-react';
import './Admin.css';

export default function AdminBonuses() {
    const [bonuses, setBonuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBonus, setEditingBonus] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        bonusType: 'daily_login',
        description: '',
        creditAmount: '10',
        pointAmount: '5',
        cooldownHours: '24'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadBonuses();
    }, []);

    const loadBonuses = async () => {
        try {
            const data = await adminAPI.getBonuses();
            setBonuses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingBonus(null);
        setFormData({
            name: '',
            bonusType: 'daily_login',
            description: '',
            creditAmount: '10',
            pointAmount: '5',
            cooldownHours: '24'
        });
        setShowModal(true);
    };

    const openEditModal = (bonus) => {
        setEditingBonus(bonus);
        setFormData({
            name: bonus.name,
            bonusType: bonus.bonusType,
            description: bonus.description,
            creditAmount: String(bonus.creditAmount),
            pointAmount: String(bonus.pointAmount),
            cooldownHours: String(bonus.cooldownHours || 24)
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const data = {
                ...formData,
                creditAmount: parseFloat(formData.creditAmount),
                pointAmount: parseInt(formData.pointAmount),
                cooldownHours: parseInt(formData.cooldownHours)
            };

            if (editingBonus) {
                await adminAPI.updateBonus(editingBonus.id, data);
                setSuccess('Bonus updated successfully');
            } else {
                await adminAPI.createBonus(data);
                setSuccess('Bonus created successfully');
            }

            setShowModal(false);
            loadBonuses();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggle = async (bonus) => {
        try {
            await adminAPI.updateBonus(bonus.id, { isActive: !bonus.isActive });
            loadBonuses();
        } catch (err) {
            setError(err.message);
        }
    };

    const getBonusTypeLabel = (type) => {
        const labels = {
            'daily_login': '📅 Daily Login',
            'weekly': '📆 Weekly',
            'event': '🎉 Event',
            'streak': '🔥 Streak'
        };
        return labels[type] || type;
    };

    if (loading) {
        return <div className="admin-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="admin-bonuses">
            <div className="page-header">
                <div>
                    <h1>Special Bonuses</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage daily, weekly, and event bonuses</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={18} />
                    Add Bonus
                </button>
            </div>

            {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            {success && <div className="referral-notice" style={{ marginBottom: '1rem' }}><Check size={18} />{success}</div>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Bonus</th>
                        <th>Type</th>
                        <th>Credits</th>
                        <th>Points</th>
                        <th>Cooldown</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bonuses.map(bonus => (
                        <tr key={bonus.id}>
                            <td>
                                <strong>{bonus.name}</strong>
                                {bonus.description && (
                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                        {bonus.description}
                                    </div>
                                )}
                            </td>
                            <td>{getBonusTypeLabel(bonus.bonusType)}</td>
                            <td style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{bonus.creditAmount}</td>
                            <td style={{ color: 'var(--primary)' }}>{bonus.pointAmount}</td>
                            <td>{bonus.cooldownHours}h</td>
                            <td>
                                <span className={bonus.isActive ? 'status-active' : 'status-inactive'}>
                                    {bonus.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button className="action-btn" onClick={() => openEditModal(bonus)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="action-btn" onClick={() => handleToggle(bonus)}>
                                        {bonus.isActive ? '⏸' : '▶'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editingBonus ? 'Edit Bonus' : 'Create Bonus'}</h2>

                        <div className="form-group">
                            <label className="form-label">Bonus Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bonus Type</label>
                            <select
                                className="form-input"
                                value={formData.bonusType}
                                onChange={(e) => setFormData({ ...formData, bonusType: e.target.value })}
                            >
                                <option value="daily_login">📅 Daily Login</option>
                                <option value="weekly">📆 Weekly</option>
                                <option value="event">🎉 Event</option>
                                <option value="streak">🔥 Streak</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Credit Amount</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.creditAmount}
                                    onChange={(e) => setFormData({ ...formData, creditAmount: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Point Amount</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.pointAmount}
                                    onChange={(e) => setFormData({ ...formData, pointAmount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Cooldown (hours)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.cooldownHours}
                                onChange={(e) => setFormData({ ...formData, cooldownHours: e.target.value })}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                {editingBonus ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
