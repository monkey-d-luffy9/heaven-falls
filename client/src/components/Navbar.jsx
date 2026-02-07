import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Gamepad2,
    Gift,
    User,
    LogOut,
    Menu,
    X,
    Crown,
    LayoutDashboard,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const VIPBadge = ({ tier }) => {
        const tierClass = `vip-badge vip-${tier.toLowerCase()}`;
        return (
            <span className={tierClass}>
                <Crown size={14} />
                {tier}
            </span>
        );
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Gamepad2 size={32} />
                    <span>Loyalty Hub</span>
                </Link>

                {/* Desktop Menu */}
                <div className="navbar-menu">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/games" className="navbar-link">Games</Link>
                    <Link to="/how-it-works" className="navbar-link">How It Works</Link>
                    <Link to="/support" className="navbar-link">Support</Link>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <div className="navbar-credits">
                                <Gift size={18} />
                                <span>{user?.bonusCredits?.toFixed(2) || '0.00'}</span>
                            </div>

                            <VIPBadge tier={user?.vipTier || 'Bronze'} />

                            <div className="navbar-dropdown">
                                <button className="navbar-user">
                                    <User size={20} />
                                    <span>{user?.username}</span>
                                </button>
                                <div className="navbar-dropdown-menu">
                                    <Link to="/dashboard" className="dropdown-item">
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                    <Link to="/dashboard/profile" className="dropdown-item">
                                        <User size={16} />
                                        Profile
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" className="dropdown-item">
                                            <Settings size={16} />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/games" onClick={() => setMobileMenuOpen(false)}>Games</Link>
                    <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                    <Link to="/support" onClick={() => setMobileMenuOpen(false)}>Support</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                            <Link to="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                            {isAdmin && (
                                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
                            )}
                            <button onClick={handleLogout} className="mobile-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
