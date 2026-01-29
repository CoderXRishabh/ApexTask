import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, User } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';

export function ProfileModal({ isOpen, onClose }) {
    const { user, updateUser } = useApp();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const fileInputRef = useRef(null);

    const handleSave = () => {
        updateUser({ name: name.trim(), avatar });
        onClose();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-panel"
                    style={{
                        padding: '24px',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '320px',
                        position: 'relative'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex'
                        }}
                    >
                        <X size={18} />
                    </button>

                    <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
                        Your Profile
                    </h2>

                    {/* Avatar Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: avatar
                                    ? `url(${avatar}) center/cover`
                                    : 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 100%)',
                                border: '3px solid rgba(139, 92, 246, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s'
                            }}
                        >
                            {!avatar && <User size={32} color="var(--text-muted)" />}
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: 'var(--accent-primary)',
                                borderRadius: '50%',
                                padding: '6px',
                                display: 'flex'
                            }}>
                                <Camera size={12} color="white" weight="bold" />
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        {avatar && (
                            <button
                                onClick={handleRemoveAvatar}
                                style={{
                                    marginTop: '8px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Remove photo
                            </button>
                        )}
                    </div>

                    {/* Name Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                            Display Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px',
                                borderRadius: '10px',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                        Save Profile
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
