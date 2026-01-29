import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trophy, Fire, Trash, Check, X, CalendarCheck } from '@phosphor-icons/react';
import { differenceInDays, format, addDays, subDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export function GoalsPage() {
    const { goals, addGoal, deleteGoal, toggleGoalDay, theme } = useApp();
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDays, setNewGoalDays] = useState(30);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const isLight = theme === 'light';

    // Theme-aware colors
    const inputBg = isLight ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.03)';
    const inputBorder = isLight ? '1px solid var(--border-glass)' : '1px solid rgba(255,255,255,0.1)';
    const iconBg = isLight ? 'rgba(184, 134, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)';
    const iconColor = isLight ? '#b8860b' : '#8b5cf6';
    const buttonBg = isLight ? 'var(--bg-hover)' : 'rgba(255,255,255,0.05)';
    const progressBarBg = isLight ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.05)';
    const inactiveDayBg = isLight ? 'rgba(139, 90, 43, 0.05)' : 'rgba(255,255,255,0.02)';
    const missedDayBg = isLight ? 'rgba(220, 38, 38, 0.15)' : 'rgba(239, 68, 68, 0.2)';
    const todayBg = isLight ? 'rgba(184, 134, 11, 0.15)' : 'rgba(139, 92, 246, 0.2)';
    const checkedDayBg = 'rgba(16, 185, 129, 0.3)';

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        addGoal(newGoalTitle, newGoalDays);
        setNewGoalTitle('');
        setNewGoalDays(30);
        setShowAddGoal(false);
    };

    const getGoalStats = (goal) => {
        const startDate = new Date(goal.startDate);
        const today = new Date();
        const currentDay = Math.max(1, differenceInDays(today, startDate) + 1);
        const endDate = addDays(startDate, goal.durationDays);
        const progressPercent = Math.min((currentDay / goal.durationDays) * 100, 100);
        const totalChecked = goal.progress?.length || 0;
        const missedDays = currentDay - 1 - totalChecked;
        const streakPercent = currentDay > 1 ? Math.round((totalChecked / (currentDay - 1)) * 100) : 0;
        const todayStr = format(today, 'yyyy-MM-dd');
        const isCheckedToday = goal.progress?.includes(todayStr);

        return {
            currentDay: Math.min(currentDay, goal.durationDays),
            endDate,
            progressPercent,
            totalChecked,
            missedDays: Math.max(0, missedDays),
            streakPercent,
            isCheckedToday,
            startDate
        };
    };

    const getLast7Days = (goal) => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = subDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const goalStart = new Date(goal.startDate);
            goalStart.setHours(0, 0, 0, 0);
            date.setHours(0, 0, 0, 0);

            const isActive = date >= goalStart;
            const isChecked = goal.progress?.includes(dateStr);
            const isTodayDate = i === 0;

            days.push({ date, dateStr, isActive, isChecked, isTodayDate });
        }
        return days;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '32px', marginBottom: '8px' }}>My Goals</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track your commitments with daily check-ins</p>
                </div>
                <button onClick={() => setShowAddGoal(true)} className="btn-primary">
                    <Plus weight="bold" /> New Goal
                </button>
            </div>

            <AnimatePresence>
                {showAddGoal && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel"
                        style={{ padding: '24px', borderRadius: '16px' }}
                    >
                        <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g., Exercise every day, Learn Spanish, Read 30 mins..."
                                value={newGoalTitle}
                                onChange={(e) => setNewGoalTitle(e.target.value)}
                                style={{
                                    flex: '1 1 200px',
                                    background: inputBg,
                                    border: inputBorder,
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '15px'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={newGoalDays}
                                    onChange={(e) => setNewGoalDays(parseInt(e.target.value) || 30)}
                                    style={{
                                        width: '70px',
                                        background: inputBg,
                                        border: inputBorder,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        fontSize: '15px',
                                        textAlign: 'center'
                                    }}
                                />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>days</span>
                            </div>
                            <button type="submit" className="btn-primary">Start Goal</button>
                            <button
                                type="button"
                                onClick={() => setShowAddGoal(false)}
                                style={{ padding: '12px', background: 'transparent', border: inputBorder, color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {goals.map(goal => {
                    const stats = getGoalStats(goal);
                    const last7Days = getLast7Days(goal);

                    return (
                        <motion.div
                            key={goal.id}
                            layout
                            className="glass-panel"
                            style={{ padding: '16px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <div style={{ width: '36px', height: '36px', background: iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trophy size={18} color={iconColor} weight="duotone" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        padding: '3px 8px',
                                        borderRadius: '12px',
                                        background: stats.missedDays > 5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: stats.missedDays > 5 ? 'var(--danger)' : 'var(--success)'
                                    }}>
                                        <Fire weight="fill" size={10} style={{ marginRight: '3px' }} />
                                        {stats.streakPercent}%
                                    </div>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        style={{
                                            background: buttonBg,
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '5px',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Delete goal"
                                    >
                                        <Trash size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Title & Progress */}
                            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{goal.title}</h3>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                Started {format(stats.startDate, 'MMM dd, yyyy')} • Ends {format(stats.endDate, 'MMM dd, yyyy')}
                            </div>

                            {/* Day Counter */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
                                <span style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1' }}>Day {stats.currentDay}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>of {goal.durationDays} days</span>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ background: progressBarBg, height: '5px', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                                <div style={{ width: `${stats.progressPercent}%`, background: 'var(--accent-gradient)', height: '100%', transition: 'width 0.3s' }}></div>
                            </div>

                            {/* Last 7 Days Visualization */}
                            <div style={{ marginBottom: '10px' }}>
                                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '5px' }}>Last 7 days</p>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {last7Days.map((day, i) => (
                                        <div
                                            key={day.dateStr}
                                            onClick={() => day.isActive && toggleGoalDay(goal.id, day.date)}
                                            style={{
                                                flex: 1,
                                                aspectRatio: '1',
                                                borderRadius: '5px',
                                                background: !day.isActive
                                                    ? inactiveDayBg
                                                    : day.isChecked
                                                        ? checkedDayBg
                                                        : day.isTodayDate
                                                            ? todayBg
                                                            : missedDayBg,
                                                border: day.isTodayDate ? '2px solid var(--accent-primary)' : '1px solid transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: day.isActive ? 'pointer' : 'default',
                                                opacity: day.isActive ? 1 : 0.3,
                                                transition: 'all 0.2s'
                                            }}
                                            title={`${format(day.date, 'MMM d')} - ${day.isChecked ? 'Completed' : day.isTodayDate ? 'Today' : 'Missed'}`}
                                        >
                                            {day.isActive && (
                                                day.isChecked ? (
                                                    <Check size={12} color="var(--success)" weight="bold" />
                                                ) : !day.isTodayDate ? (
                                                    <X size={12} color="var(--danger)" weight="bold" />
                                                ) : null
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Check-in Button */}
                            <button
                                onClick={() => toggleGoalDay(goal.id, new Date())}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: stats.isCheckedToday ? 'rgba(16, 185, 129, 0.15)' : 'var(--accent-gradient)',
                                    color: stats.isCheckedToday ? 'var(--success)' : 'white',
                                    border: stats.isCheckedToday ? '1px solid var(--success)' : 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {stats.isCheckedToday ? (
                                    <><Check weight="bold" size={14} /> Done!</>
                                ) : (
                                    <><CalendarCheck weight="fill" size={14} /> Check in</>)}
                            </button>

                            {/* Stats */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-glass)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--success)' }}>{stats.totalChecked}</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Done</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--danger)' }}>{stats.missedDays}</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Missed</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{goal.durationDays - stats.currentDay}</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Left</div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {goals.length === 0 && !showAddGoal && (
                    <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', border: '2px dashed var(--border-glass)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Trophy size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '16px' }}>No active goals yet</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                            Start a challenge to build lasting habits
                        </p>
                        <button onClick={() => setShowAddGoal(true)} className="btn-primary">
                            <Plus weight="bold" /> Create Your First Goal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
