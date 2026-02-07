import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
import './Admin.css';

export default function AdminGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        gameType: 'wheel',
        description: '',
        minBonus: '5',
        maxBonus: '100',
        cooldownHours: '24',
        vipTierRequired: 'Bronze'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            const data = await adminAPI.getGames();
            setGames(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingGame(null);
        setFormData({
            name: '',
            gameType: 'wheel',
            description: '',
            minBonus: '5',
            maxBonus: '100',
            cooldownHours: '24',
            vipTierRequired: 'Bronze'
        });
        setShowModal(true);
    };

    const openEditModal = (game) => {
        setEditingGame(game);
        setFormData({
            name: game.name,
            gameType: game.gameType,
            description: game.description,
            minBonus: String(game.minBonus),
            maxBonus: String(game.maxBonus),
            cooldownHours: String(game.cooldownHours),
            vipTierRequired: game.vipTierRequired
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const data = {
                ...formData,
                minBonus: parseFloat(formData.minBonus),
                maxBonus: parseFloat(formData.maxBonus),
                cooldownHours: parseInt(formData.cooldownHours)
            };

            if (editingGame) {
                await adminAPI.updateGame(editingGame.id, data);
                setSuccess('Game updated successfully');
            } else {
                await adminAPI.createGame(data);
                setSuccess('Game created successfully');
            }

            setShowModal(false);
            loadGames();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (gameId) => {
        if (!confirm('Are you sure you want to deactivate this game?')) return;

        try {
            await adminAPI.deleteGame(gameId);
            setSuccess('Game deactivated');
            loadGames();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggle = async (game) => {
        try {
            await adminAPI.updateGame(game.id, { isActive: !game.isActive });
            loadGames();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="admin-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="admin-games">
            <div className="page-header">
                <div>
                    <h1>Bonus Games</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage bonus games and their settings</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={18} />
                    Add Game
                </button>
            </div>

            {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            {success && <div className="referral-notice" style={{ marginBottom: '1rem' }}><Check size={18} />{success}</div>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Type</th>
                        <th>Bonus Range</th>
                        <th>Cooldown</th>
                        <th>VIP Required</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map(game => (
                        <tr key={game.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>
                                        {game.gameType === 'wheel' && '🎡'}
                                        {game.gameType === 'cookie' && '🥠'}
                                        {game.gameType === 'scratch' && '🎫'}
                                    </span>
                                    <strong>{game.name}</strong>
                                </div>
                            </td>
                            <td>{game.gameType}</td>
                            <td style={{ color: 'var(--accent-gold)' }}>{game.minBonus} - {game.maxBonus}</td>
                            <td>{game.cooldownHours}h</td>
                            <td>
                                <span className={`vip-badge vip-${game.vipTierRequired.toLowerCase()}`} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-xs)' }}>
                                    {game.vipTierRequired}
                                </span>
                            </td>
                            <td>
                                <span className={game.isActive ? 'status-active' : 'status-inactive'}>
                                    {game.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button className="action-btn" onClick={() => openEditModal(game)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="action-btn" onClick={() => handleToggle(game)}>
                                        {game.isActive ? '⏸' : '▶'}
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
                        <h2>{editingGame ? 'Edit Game' : 'Create Game'}</h2>

                        <div className="form-group">
                            <label className="form-label">Game Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Game Type</label>
                            <select
                                className="form-input"
                                value={formData.gameType}
                                onChange={(e) => setFormData({ ...formData, gameType: e.target.value })}
                            >
                                <option value="wheel">🎡 Wheel Spinner</option>
                                <option value="cookie">🥠 Cookie Breaker</option>
                                <option value="scratch">🎫 Scratch Card</option>
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
                                <label className="form-label">Min Bonus</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.minBonus}
                                    onChange={(e) => setFormData({ ...formData, minBonus: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Bonus</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.maxBonus}
                                    onChange={(e) => setFormData({ ...formData, maxBonus: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Cooldown (hours)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.cooldownHours}
                                    onChange={(e) => setFormData({ ...formData, cooldownHours: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">VIP Tier Required</label>
                                <select
                                    className="form-input"
                                    value={formData.vipTierRequired}
                                    onChange={(e) => setFormData({ ...formData, vipTierRequired: e.target.value })}
                                >
                                    <option value="Bronze">Bronze</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Platinum">Platinum</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                {editingGame ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
