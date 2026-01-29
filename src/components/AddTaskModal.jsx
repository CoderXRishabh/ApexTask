import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Tag, Flag } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export function AddTaskModal() {
    const { isModalOpen, closeModal, addTask, modalSelectedDate } = useApp();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        if (isModalOpen) {
            // Default to today or selected date
            const defaultDate = modalSelectedDate
                ? format(new Date(modalSelectedDate), 'yyyy-MM-dd')
                : format(new Date(), 'yyyy-MM-dd');
            setDate(defaultDate);
            setTitle('');
            setPriority('medium');
        }
    }, [isModalOpen, modalSelectedDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask(title, date, priority);
        closeModal();
    };

    if (!isModalOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} onClick={closeModal}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel"
                style={{
                    width: '500px',
                    padding: '24px',
                    borderRadius: '24px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Add New Task</h2>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Title Input */}
                    <div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="What do you need to get done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '16px',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {/* Date Input */}
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                <Calendar /> Due Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-sans)',
                                }}
                            />
                        </div>

                        {/* Priority Select */}
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                <Flag /> Priority
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['low', 'medium', 'high'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: priority === p ? `1px solid var(--accent-primary)` : '1px solid rgba(255,255,255,0.1)',
                                            background: priority === p ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                            color: priority === p ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ padding: '12px 32px' }}
                        >
                            Create Task
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
