import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Gamepad2,
    Gift,
    Settings,
    Plus,
    TrendingUp
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import './Admin.css';

export default function AdminLayout() {
    const location = useLocation();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/games', icon: <Gamepad2 size={20} />, label: 'Games' },
        { path: '/admin/bonuses', icon: <Gift size={20} />, label: 'Bonuses' },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Settings size={24} />
                    <span>Admin Panel</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${item.exact
                                    ? location.pathname === item.path
                                    : location.pathname.startsWith(item.path)
                                        ? 'active' : ''
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {stats && (
                    <div className="sidebar-stats">
                        <div className="mini-stat">
                            <TrendingUp size={16} />
                            <span>{stats.totalUsers} Users</span>
                        </div>
                        <div className="mini-stat">
                            <Gift size={16} />
                            <span>{stats.todayCreditsGiven.toFixed(0)} Credits Today</span>
                        </div>
                    </div>
                )}

                <Link to="/dashboard" className="back-to-app">
                    ← Back to App
                </Link>
            </aside>

            <main className="admin-main">
                <Outlet context={{ stats, refreshStats: loadStats }} />
            </main>
        </div>
    );
}
