import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Plus, Gift, UserPlus, Ban, Check, X } from 'lucide-react';
import './Admin.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBonusModal, setShowBonusModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [bonusData, setBonusData] = useState({ creditAmount: '', note: '' });
    const [createData, setCreateData] = useState({ username: '', email: '', password: '', bonusCredits: '100', role: 'USER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getUsers({ search });
            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers();
    };

    const handleAddBonus = async () => {
        setError('');
        try {
            await adminAPI.addBonus(selectedUser.id, {
                creditAmount: parseFloat(bonusData.creditAmount),
                note: bonusData.note
            });
            setSuccess(`Added ${bonusData.creditAmount} credits to ${selectedUser.username}`);
            setShowBonusModal(false);
            setBonusData({ creditAmount: '', note: '' });
            loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateUser = async () => {
        setError('');
        try {
            await adminAPI.createUser(createData);
            setSuccess(`User ${createData.username} created successfully`);
            setShowCreateModal(false);
            setCreateData({ username: '', email: '', password: '', bonusCredits: '100', role: 'USER' });
            loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await adminAPI.updateUser(user.id, { isActive: !user.isActive });
            loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="admin-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="admin-users">
            <div className="page-header">
                <div>
                    <h1>Users</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage user accounts and credits</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <UserPlus size={18} />
                    Create User
                </button>
            </div>

            {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            {success && <div className="referral-notice" style={{ marginBottom: '1rem' }}><Check size={18} />{success}</div>}

            <form className="search-box" onSubmit={handleSearch}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-primary">Search</button>
            </form>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Credits</th>
                        <th>Points</th>
                        <th>VIP</th>
                        <th>Games</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <div>
                                    <strong>{user.username}</strong>
                                    {user.email && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{user.email}</div>}
                                </div>
                            </td>
                            <td style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{user.bonusCredits.toFixed(2)}</td>
                            <td>{user.loyaltyPoints}</td>
                            <td>
                                <span className={`vip-badge vip-${user.vipTier.toLowerCase()}`} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-xs)' }}>
                                    {user.vipTier}
                                </span>
                            </td>
                            <td>{user.gamesPlayed}</td>
                            <td>
                                <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        className="action-btn"
                                        title="Add Bonus"
                                        onClick={() => { setSelectedUser(user); setShowBonusModal(true); }}
                                    >
                                        <Gift size={16} />
                                    </button>
                                    <button
                                        className="action-btn danger"
                                        title={user.isActive ? 'Deactivate' : 'Activate'}
                                        onClick={() => handleToggleStatus(user)}
                                    >
                                        {user.isActive ? <Ban size={16} /> : <Check size={16} />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Bonus Modal */}
            {showBonusModal && (
                <div className="modal-overlay" onClick={() => setShowBonusModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Add Bonus to {selectedUser?.username}</h2>

                        <div className="form-group">
                            <label className="form-label">Credit Amount</label>
                            <input
                                type="number"
                                className="form-input"
                                value={bonusData.creditAmount}
                                onChange={(e) => setBonusData({ ...bonusData, creditAmount: e.target.value })}
                                placeholder="Enter amount"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Note (Optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={bonusData.note}
                                onChange={(e) => setBonusData({ ...bonusData, note: e.target.value })}
                                placeholder="Reason for bonus"
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowBonusModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddBonus}>Add Bonus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Create New User</h2>

                        <div className="form-group">
                            <label className="form-label">Username *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={createData.username}
                                onChange={(e) => setCreateData({ ...createData, username: e.target.value })}
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email (Optional)</label>
                            <input
                                type="email"
                                className="form-input"
                                value={createData.email}
                                onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password *</label>
                            <input
                                type="password"
                                className="form-input"
                                value={createData.password}
                                onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                                placeholder="Enter password"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-input"
                                value={createData.role}
                                onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Initial Bonus Credits</label>
                            <input
                                type="number"
                                className="form-input"
                                value={createData.bonusCredits}
                                onChange={(e) => setCreateData({ ...createData, bonusCredits: e.target.value })}
                                placeholder="100"
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreateUser}>Create User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
