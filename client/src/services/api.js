// Use environment variable in production, localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
};

// Auth API
export const authAPI = {
    register: (data) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => fetchAPI('/auth/me'),
    updateProfile: (data) => fetchAPI('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};

// Games API
export const gamesAPI = {
    getAll: () => fetchAPI('/games'),
    getStatus: () => fetchAPI('/games/status'),
    play: (gameId) => fetchAPI(`/games/${gameId}/play`, { method: 'POST' }),
};

// Bonuses API
export const bonusesAPI = {
    getAll: () => fetchAPI('/bonuses'),
    claim: (bonusId) => fetchAPI(`/bonuses/${bonusId}/claim`, { method: 'POST' }),
};

// User API
export const userAPI = {
    getTransactions: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/user?${query}`);
    },
    getAchievements: () => fetchAPI('/user/achievements'),
    getReferrals: () => fetchAPI('/user/referrals'),
    getVIP: () => fetchAPI('/user/vip'),
};

// Notifications API
export const notificationsAPI = {
    getAll: () => fetchAPI('/notifications'),
    markRead: (id) => fetchAPI(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => fetchAPI('/notifications/read-all', { method: 'PUT' }),
};

// Admin API
export const adminAPI = {
    getStats: () => fetchAPI('/admin/stats'),

    // Users
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/admin/users?${query}`);
    },
    getUser: (id) => fetchAPI(`/admin/users/${id}`),
    createUser: (data) => fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id, data) => fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    addBonus: (id, data) => fetchAPI(`/admin/users/${id}/bonus`, { method: 'POST', body: JSON.stringify(data) }),

    // Games
    getGames: () => fetchAPI('/admin/games'),
    createGame: (data) => fetchAPI('/admin/games', { method: 'POST', body: JSON.stringify(data) }),
    updateGame: (id, data) => fetchAPI(`/admin/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteGame: (id) => fetchAPI(`/admin/games/${id}`, { method: 'DELETE' }),

    // Bonuses
    getBonuses: () => fetchAPI('/admin/bonuses'),
    createBonus: (data) => fetchAPI('/admin/bonuses', { method: 'POST', body: JSON.stringify(data) }),
    updateBonus: (id, data) => fetchAPI(`/admin/bonuses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export default {
    authAPI,
    gamesAPI,
    bonusesAPI,
    userAPI,
    notificationsAPI,
    adminAPI,
};
