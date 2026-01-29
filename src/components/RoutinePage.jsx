import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, subDays, addDays } from 'date-fns';
import { Plus, Trash, Check, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

export function RoutinePage() {
    const { routines, routineChecks, addRoutine, deleteRoutine, toggleRoutineCheck, theme } = useApp();
    const [newRoutine, setNewRoutine] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const today = new Date();
    const [startDate, setStartDate] = useState(subDays(today, 6));

    const isLight = theme === 'light';

    // Generate date columns (7 days starting from startDate)
    const getDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = addDays(startDate, i);
            dates.push({
                date,
                dateStr: format(date, 'yyyy-MM-dd'),
                dayName: format(date, 'EEE'),
                dayNum: format(date, 'd'),
                monthName: format(date, 'MMM'),
                isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
                isFuture: date > today
            });
        }
        return dates;
    };

    const dates = getDates();

    const handleAddRoutine = (e) => {
        e.preventDefault();
        if (!newRoutine.trim()) return;
        addRoutine(newRoutine.trim());
        setNewRoutine('');
        setShowAdd(false);
    };

    const isChecked = (routineId, dateStr) => {
        return routineChecks[dateStr]?.includes(routineId) || false;
    };

    const handlePrevWeek = () => setStartDate(prev => subDays(prev, 7));
    const handleNextWeek = () => {
        const nextStart = addDays(startDate, 7);
        if (nextStart <= today) setStartDate(nextStart);
    };

    const canGoNext = addDays(startDate, 7) <= today;

    // Calculate stats
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayChecks = routineChecks[todayStr] || [];
    const completedToday = todayChecks.length;
    const progress = routines.length > 0 ? Math.round((completedToday / routines.length) * 100) : 0;

    // Theme-aware colors
    const borderColor = isLight ? 'var(--border-glass)' : 'rgba(255,255,255,0.1)';
    const cellBg = isLight ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.02)';
    const stickyBg = isLight ? 'var(--bg-card)' : 'rgba(24, 24, 27, 0.98)';
    const todayBg = isLight ? 'rgba(184, 134, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)';
    const todayCellBg = isLight ? 'rgba(184, 134, 11, 0.05)' : 'rgba(139, 92, 246, 0.05)';
    const checkboxBorder = isLight ? '2px solid var(--border-glass)' : '2px solid rgba(255,255,255,0.15)';
    const checkboxBg = isLight ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.03)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '28px', marginBottom: '6px' }}>Daily Routine</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Track your daily habits • {completedToday}/{routines.length} done today ({progress}%)
                    </p>
                </div>
                <button onClick={() => setShowAdd(true)} className="btn-primary">
                    <Plus weight="bold" /> Add Routine
                </button>
            </div>

            {/* Add Routine Form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel"
                        style={{ padding: '16px', borderRadius: '12px' }}
                    >
                        <form onSubmit={handleAddRoutine} style={{ display: 'flex', gap: '12px' }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g., Morning meditation, Exercise, Read 30 mins..."
                                value={newRoutine}
                                onChange={(e) => setNewRoutine(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'var(--bg-hover)',
                                    border: '1px solid var(--border-light)',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '13px'
                                }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Add</button>
                            <button
                                type="button"
                                onClick={() => setShowAdd(false)}
                                style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Week Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                    onClick={handlePrevWeek}
                    style={{
                        background: 'var(--bg-hover)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px'
                    }}
                >
                    <CaretLeft size={14} weight="bold" /> Prev Week
                </button>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d, yyyy')}
                </span>
                <button
                    onClick={handleNextWeek}
                    disabled={!canGoNext}
                    style={{
                        background: 'var(--bg-hover)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: canGoNext ? 'pointer' : 'not-allowed',
                        color: canGoNext ? 'var(--text-secondary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        opacity: canGoNext ? 1 : 0.5
                    }}
                >
                    Next Week <CaretRight size={14} weight="bold" />
                </button>
            </div>

            {/* Excel-like Table */}
            <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                {routines.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>No routines yet</p>
                        <p style={{ fontSize: '12px' }}>Add your daily habits to start tracking!</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                                    <th style={{
                                        textAlign: 'left',
                                        padding: '16px 20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'var(--text-secondary)',
                                        background: cellBg,
                                        position: 'sticky',
                                        left: 0,
                                        minWidth: '200px'
                                    }}>
                                        Routine
                                    </th>
                                    {dates.map(d => (
                                        <th
                                            key={d.dateStr}
                                            style={{
                                                padding: '12px 8px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                background: d.isToday ? todayBg : cellBg,
                                                minWidth: '60px',
                                                color: d.isToday ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                            }}
                                        >
                                            <div style={{ marginBottom: '2px' }}>{d.dayName}</div>
                                            <div style={{ fontSize: '14px', fontWeight: '700' }}>{d.dayNum}</div>
                                        </th>
                                    ))}
                                    <th style={{
                                        padding: '16px',
                                        width: '50px',
                                        background: cellBg
                                    }} />
                                </tr>
                            </thead>
                            <tbody>
                                {routines.map((routine, index) => (
                                    <tr
                                        key={routine.id}
                                        style={{
                                            borderBottom: index < routines.length - 1 ? `1px solid ${borderColor}` : 'none'
                                        }}
                                    >
                                        <td style={{
                                            padding: '14px 20px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: 'var(--text-primary)',
                                            position: 'sticky',
                                            left: 0,
                                            background: stickyBg,
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            {routine.title}
                                        </td>
                                        {dates.map(d => {
                                            const checked = isChecked(routine.id, d.dateStr);
                                            return (
                                                <td
                                                    key={d.dateStr}
                                                    style={{
                                                        padding: '10px',
                                                        textAlign: 'center',
                                                        background: d.isToday ? todayCellBg : 'transparent'
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => !d.isFuture && toggleRoutineCheck(routine.id, d.dateStr)}
                                                        disabled={d.isFuture}
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '6px',
                                                            border: checked ? 'none' : checkboxBorder,
                                                            background: checked ? 'var(--success)' : checkboxBg,
                                                            cursor: d.isFuture ? 'not-allowed' : 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.15s',
                                                            opacity: d.isFuture ? 0.3 : 1
                                                        }}
                                                    >
                                                        {checked && <Check size={14} color="white" weight="bold" />}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => deleteRoutine(routine.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    padding: '6px',
                                                    display: 'inline-flex',
                                                    borderRadius: '6px',
                                                    transition: 'color 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={10} color="white" weight="bold" />
                    </div>
                    Completed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: checkboxBorder, background: checkboxBg }} />
                    Not done
                </div>
            </div>
        </div>
    );
}
