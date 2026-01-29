import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, CalendarCheck, ChartLineUp, Gear, ChartPie, SunHorizon } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { isToday } from 'date-fns';

export function Sidebar() {
    const { tasks } = useApp();

    // Calculate real progress
    const todayTasks = tasks.filter(task => isToday(new Date(task.date)));
    const completedToday = todayTasks.filter(t => t.completed).length;
    const progress = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src="/apextask.svg" alt="ApexTask" className="sidebar-logo" />
                <h1 className="title-gradient sidebar-title">
                    ApexTask
                </h1>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <House weight="duotone" />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CalendarCheck weight="duotone" />
                    <span>Calendar</span>
                </NavLink>
                <NavLink to="/goals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ChartLineUp weight="duotone" />
                    <span>My Goals</span>
                </NavLink>
                <NavLink to="/routine" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <SunHorizon weight="duotone" />
                    <span>Daily Routine</span>
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ChartPie weight="duotone" />
                    <span>Analytics</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ marginTop: 'auto' }}>
                    <Gear weight="duotone" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-progress">
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Daily Progress</div>
                <div style={{ background: 'var(--bg-secondary)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${progress}%`, background: 'var(--accent-gradient)', height: '100%', transition: 'width 0.3s' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{completedToday}/{todayTasks.length} Tasks</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{progress}%</span>
                </div>
            </div>
        </div>
    );
}
