import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BookOpen, PlusSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminNavbar: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const items = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/notes', label: 'Notes', icon: FileText },
        { path: '/admin/subjects', label: 'Subjects', icon: BookOpen },
        { path: '/admin/notes/create', label: 'Create Note', icon: PlusSquare },
    ];

    return (
        <div style={{
            marginBottom: '32px',
            borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            paddingBottom: '16px',
        }}>
            <nav style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            backgroundColor: isActive
                                ? (isDark ? '#374151' : '#eff6ff')
                                : 'transparent',
                            color: isActive
                                ? (isDark ? '#60a5fa' : '#3b82f6')
                                : (isDark ? '#9ca3af' : '#6b7280'),
                            transition: 'all 0.2s',
                        })}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminNavbar;
