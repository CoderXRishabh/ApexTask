import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ToggleLeft, ToggleRight, User, Sun, Moon, Clock, Target, SunHorizon, Sparkle, Play } from '@phosphor-icons/react';

export function SettingsPage() {
    const {
        notificationsEnabled,
        requestNotificationPermission,
        theme,
        toggleTheme,
        notificationSettings,
        updateNotificationSettings,
        sendTestNotification
    } = useApp();

    const inputStyle = {
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-glass)',
        borderRadius: '8px',
        padding: '8px 12px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        minWidth: '80px'
    };

    const selectStyle = {
        ...inputStyle,
        cursor: 'pointer',
        appearance: 'none',
        paddingRight: '28px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center'
    };

    const cardStyle = {
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '16px'
    };

    const testButtonStyle = {
        padding: '6px 12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)',
        borderRadius: '6px',
        color: 'var(--text-secondary)',
        fontSize: '11px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 className="title-gradient" style={{ fontSize: '32px' }}>Settings</h1>

            {/* Main Notifications Toggle */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bell /> Notifications
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontWeight: '500' }}>Enable Desktop Notifications</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            Get reminded about your daily tasks, goals, and routines
                        </div>
                    </div>
                    <button
                        onClick={requestNotificationPermission}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: notificationsEnabled ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                    >
                        {notificationsEnabled ? (
                            <ToggleRight size={48} weight="fill" />
                        ) : (
                            <ToggleLeft size={48} weight="fill" />
                        )}
                    </button>
                </div>

                {notificationsEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Task Notifications */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                                        <Clock size={18} color="var(--accent-primary)" weight="duotone" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>📋 Task Reminders</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get nudges about your pending tasks</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => sendTestNotification('tasks')}
                                        style={testButtonStyle}
                                        title="Send test notification"
                                    >
                                        <Play size={12} weight="fill" /> Test
                                    </button>
                                    <button
                                        onClick={() => updateNotificationSettings('tasks', { enabled: !notificationSettings.tasks.enabled })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: notificationSettings.tasks.enabled ? 'var(--success)' : 'var(--text-muted)' }}
                                    >
                                        {notificationSettings.tasks.enabled ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                    </button>
                                </div>
                            </div>
                            {notificationSettings.tasks.enabled && (
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Remind every</label>
                                        <select
                                            value={notificationSettings.tasks.intervalMinutes}
                                            onChange={(e) => updateNotificationSettings('tasks', { intervalMinutes: parseInt(e.target.value) })}
                                            style={selectStyle}
                                        >
                                            <option value={30}>30 minutes</option>
                                            <option value={60}>1 hour</option>
                                            <option value={120}>2 hours</option>
                                            <option value={180}>3 hours</option>
                                            <option value={240}>4 hours</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Preferred time</label>
                                        <select
                                            value={notificationSettings.tasks.reminderTime}
                                            onChange={(e) => updateNotificationSettings('tasks', { reminderTime: e.target.value })}
                                            style={selectStyle}
                                        >
                                            <option value="morning">🌅 Morning (6AM-12PM)</option>
                                            <option value="afternoon">☀️ Afternoon (12PM-5PM)</option>
                                            <option value="evening">🌙 Evening (5PM-10PM)</option>
                                            <option value="all">🔔 All day</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Goal Notifications */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px' }}>
                                        <Target size={18} color="#ec4899" weight="duotone" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>🎯 Goal Check-ins</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily reminders to maintain your streaks</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => sendTestNotification('goals')}
                                        style={testButtonStyle}
                                        title="Send test notification"
                                    >
                                        <Play size={12} weight="fill" /> Test
                                    </button>
                                    <button
                                        onClick={() => updateNotificationSettings('goals', { enabled: !notificationSettings.goals.enabled })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: notificationSettings.goals.enabled ? 'var(--success)' : 'var(--text-muted)' }}
                                    >
                                        {notificationSettings.goals.enabled ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                    </button>
                                </div>
                            </div>
                            {notificationSettings.goals.enabled && (
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Reminder time</label>
                                        <input
                                            type="time"
                                            value={notificationSettings.goals.reminderTime}
                                            onChange={(e) => updateNotificationSettings('goals', { reminderTime: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                                        <input
                                            type="checkbox"
                                            id="streakAlerts"
                                            checked={notificationSettings.goals.streakAlerts}
                                            onChange={(e) => updateNotificationSettings('goals', { streakAlerts: e.target.checked })}
                                            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
                                        />
                                        <label htmlFor="streakAlerts" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            🔥 Streak milestone alerts
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Routine Notifications */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                                        <SunHorizon size={18} color="#10b981" weight="duotone" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>☀️ Routine Nudges</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Morning kickstart & evening wrap-up</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => sendTestNotification('routines')}
                                        style={testButtonStyle}
                                        title="Send test notification"
                                    >
                                        <Play size={12} weight="fill" /> Test
                                    </button>
                                    <button
                                        onClick={() => updateNotificationSettings('routines', { enabled: !notificationSettings.routines.enabled })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: notificationSettings.routines.enabled ? 'var(--success)' : 'var(--text-muted)' }}
                                    >
                                        {notificationSettings.routines.enabled ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                    </button>
                                </div>
                            </div>
                            {notificationSettings.routines.enabled && (
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>🌅 Morning reminder</label>
                                        <input
                                            type="time"
                                            value={notificationSettings.routines.morningTime}
                                            onChange={(e) => updateNotificationSettings('routines', { morningTime: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>🌙 Evening summary</label>
                                        <input
                                            type="time"
                                            value={notificationSettings.routines.eveningTime}
                                            onChange={(e) => updateNotificationSettings('routines', { eveningTime: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Motivational Notifications */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                                        <Sparkle size={18} color="#f59e0b" weight="duotone" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>💫 Motivation Boosts</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Inspirational messages to keep you going</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => sendTestNotification('motivation')}
                                        style={testButtonStyle}
                                        title="Send test notification"
                                    >
                                        <Play size={12} weight="fill" /> Test
                                    </button>
                                    <button
                                        onClick={() => updateNotificationSettings('motivation', { enabled: !notificationSettings.motivation.enabled })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: notificationSettings.motivation.enabled ? 'var(--success)' : 'var(--text-muted)' }}
                                    >
                                        {notificationSettings.motivation.enabled ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                    </button>
                                </div>
                            </div>
                            {notificationSettings.motivation.enabled && (
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Send every</label>
                                        <select
                                            value={notificationSettings.motivation.intervalHours}
                                            onChange={(e) => updateNotificationSettings('motivation', { intervalHours: parseInt(e.target.value) })}
                                            style={selectStyle}
                                        >
                                            <option value={1}>1 hour</option>
                                            <option value={2}>2 hours</option>
                                            <option value={3}>3 hours</option>
                                            <option value={4}>4 hours</option>
                                            <option value={6}>6 hours</option>
                                            <option value={8}>8 hours</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Appearance */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User /> Appearance
                </h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontWeight: '500' }}>Theme</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            Switch between dark and light mode
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => theme === 'light' && toggleTheme()}
                            style={{
                                padding: '10px 16px',
                                background: theme === 'dark' ? 'var(--accent-gradient)' : 'var(--bg-hover)',
                                border: theme === 'dark' ? 'none' : '1px solid var(--border-glass)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: theme === 'dark' ? 'white' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Moon size={16} weight={theme === 'dark' ? 'fill' : 'regular'} />
                            Dark
                        </button>
                        <button
                            onClick={() => theme === 'dark' && toggleTheme()}
                            style={{
                                padding: '10px 16px',
                                background: theme === 'light' ? 'var(--accent-gradient)' : 'var(--bg-hover)',
                                border: theme === 'light' ? 'none' : '1px solid var(--border-glass)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: theme === 'light' ? 'white' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Sun size={16} weight={theme === 'light' ? 'fill' : 'regular'} />
                            Light
                        </button>
                    </div>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Version 1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}
