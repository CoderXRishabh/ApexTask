import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { format } from 'date-fns';
import { Sidebar } from './Sidebar';
import { AddTaskModal } from './AddTaskModal';
import { ProfileModal } from './ProfileModal';
import { useApp } from '../context/AppContext';
import { User, Sun, Moon } from '@phosphor-icons/react';

export function Layout() {
    const { openModal, user, theme, toggleTheme } = useApp();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const today = format(new Date(), 'MMMM d, yyyy');

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <header className="header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{today}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--bg-hover)',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: 'var(--text-secondary)'
                            }}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} weight="duotone" /> : <Moon size={20} weight="duotone" />}
                        </button>

                        <button onClick={() => openModal()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                            + New Task
                        </button>

                        {/* Profile Avatar */}
                        <div
                            onClick={() => setIsProfileOpen(true)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: user?.avatar
                                    ? `url(${user.avatar}) center/cover`
                                    : 'var(--accent-gradient)',
                                border: '2px solid var(--border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, border-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                            }}
                            title="Edit Profile"
                        >
                            {!user?.avatar && <User size={20} color="white" />}
                        </div>
                    </div>
                </header>
                <div className="content-scroll-area">
                    <Outlet />
                </div>
            </div>
            <AddTaskModal />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}
