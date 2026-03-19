import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Admin Page Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                    <h2>Something went wrong in the Admin Dashboard.</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', textAlign: 'left' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                        Reload Page
                    </button>
                    <button onClick={() => { localStorage.removeItem('pj_rooms_data'); window.location.reload(); }} style={{ marginTop: '1rem', marginLeft: '1rem', padding: '0.5rem 1rem' }}>
                        Clear Data & Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const AdminContent = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Notification Modal State
    const [selectedNotif, setSelectedNotif] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const itemsPerPage = 5;

    // Fetch rooms and notifications
    useEffect(() => {
        fetchRooms();
        fetchNotifications();
        // Poll every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch('/api/rooms');
            if (!response.ok) throw new Error('Failed to fetch rooms');
            const data = await response.json();

            // Map DB snake_case to frontend camelCase if needed
            // Or just use the DB structure directly. Let's map for consistency with existing UI code.
            const mappedRooms = data.map(r => ({
                id: r.id,
                status: r.status,
                guestName: r.guest_name || '',
                phone: r.phone || '',
                idCard: r.id_card || '',
                email: r.email || '',
                checkIn: r.check_in || '',
                checkOut: r.check_out || '',
                bookingDate: r.booking_date || '',
                note: r.note || '',
                refundBankName: r.refund_bank_name || '',
                refundAccountNumber: r.refund_account_number || '',
                refundAccountName: r.refund_account_name || ''
            }));

            setRooms(mappedRooms);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/admin/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await fetch(`/api/admin/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark read', err);
        }
    };

    const handleNotificationClick = (notif) => {
        setSelectedNotif(notif);
        if (!notif.read) {
            handleMarkRead(notif.id);
        }
    };

    const handleClearAllNotifications = async () => {
        if (!window.confirm('ต้องการล้างการแจ้งเตือนทั้งหมด?')) return;
        try {
            await fetch('/api/admin/notifications/clear', { method: 'DELETE' });
            setNotifications([]);
        } catch (err) {
            console.error('Failed to clear notifications', err);
        }
    };

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setEditForm({ ...room });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const updatedRoom = {
                status: editForm.status,
                guest_name: editForm.guestName,
                phone: editForm.phone,
                id_card: editForm.idCard,
                email: editForm.email || null,
                check_in: editForm.checkIn || null,
                check_out: editForm.checkOut || null,
                booking_date: editForm.bookingDate || null,
                note: editForm.note
            };

            // Optimistic update
            setRooms(prevRooms => prevRooms.map(room =>
                room.id === editForm.id ? { ...editForm } : room
            ));
            setIsModalOpen(false);

            // API Call
            const response = await fetch(`/api/rooms/${editForm.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRoom),
            });

            if (!response.ok) throw new Error('Failed to update room');

            // Re-fetch to ensure sync (optional)
            // fetchRooms();

        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save changes to database');
            fetchRooms(); // Revert on failure
        }
    };

    const handleCheckOut = async () => {
        if (!window.confirm(`ยืนยันการเช็คเอาท์ห้อง ${editForm.id}?`)) return;

        try {
            const resetRoom = {
                status: 'available',
                guest_name: '',
                phone: '',
                id_card: '',
                email: '',
                check_in: null,
                check_out: null,
                booking_date: null,
                note: ''
            };

            // Optimistic update
            setRooms(prevRooms => prevRooms.map(room =>
                room.id === editForm.id ? { ...room, ...resetRoom, id: room.id } : room
            ));
            setIsModalOpen(false);

            // API Call
            const response = await fetch(`/api/rooms/${editForm.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resetRoom),
            });

            if (!response.ok) throw new Error('Failed to check out');

        } catch (err) {
            console.error('Check-out failed:', err);
            alert('Failed to check out');
            fetchRooms();
        }
    };

    const handleCheckIn = async () => {
        if (!window.confirm(`ยืนยันการเช็คอินห้อง ${editForm.id}?`)) return;

        try {
            const updatedRoom = {
                status: 'occupied',
                guest_name: editForm.guestName,
                phone: editForm.phone,
                id_card: editForm.idCard,
                email: editForm.email || null,
                check_in: editForm.checkIn || null,
                check_out: editForm.checkOut || null,
                booking_date: editForm.bookingDate || null,
                note: editForm.note
            };

            // Optimistic update
            setRooms(prevRooms => prevRooms.map(room =>
                room.id === editForm.id ? { ...room, status: 'occupied' } : room
            ));
            setIsModalOpen(false);

            // API Call
            const response = await fetch(`/api/rooms/${editForm.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRoom),
            });

            if (!response.ok) throw new Error('Failed to check in');

        } catch (err) {
            console.error('Check-in failed:', err);
            alert('Failed to check in');
            fetchRooms();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'occupied': return 'var(--color-red, #ef4444)';
            case 'booked': return 'var(--color-purple, #8b5cf6)';
            case 'maintenance': return 'var(--color-yellow, #eab308)';
            case 'monthly': return 'var(--color-blue, #3b82f6)';
            default: return 'var(--color-green, #22c55e)';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'occupied': return 'รายวัน';
            case 'booked': return 'ติดจอง';
            case 'maintenance': return 'ปิดปรับปรุง';
            case 'monthly': return 'รายเดือน';
            default: return 'ว่าง';
        }
    };

    if (loading) return <div className="admin-loading">Loading data...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    // Stats
    const totalRooms = 36;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const booked = rooms.filter(r => r.status === 'booked').length;
    const maintenance = rooms.filter(r => r.status === 'maintenance').length;
    const monthly = rooms.filter(r => r.status === 'monthly').length;
    const available = totalRooms - occupied - booked - maintenance - monthly;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-container">
                    <div className="admin-header__content">
                        <div className="brand">
                            <img src="/images/logo.png" alt="PJ Residence" className="brand-logo" />
                            <h1>Admin Management</h1>
                        </div>

                        <div className="admin-header-actions">
                            {/* Notification Bell */}
                            <div className="notification-bell-container">
                                <button
                                    className="btn-bell"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    🔔
                                    {notifications.some(n => !n.read) && (
                                        <span className="bell-badge">
                                            {notifications.filter(n => !n.read).length}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="notification-dropdown">
                                        <div className="dropdown-header">
                                            <h3>การแจ้งเตือน</h3>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={handleClearAllNotifications} className="btn-icon-refresh" title="ล้างทั้งหมด" style={{ color: '#ef4444' }}>🗑️</button>
                                                <button onClick={fetchNotifications} className="btn-icon-refresh" title="รีเฟรช">🔄</button>
                                            </div>
                                        </div>
                                        <div className="dropdown-list">
                                            {notifications.length === 0 ? (
                                                <p className="no-notif-dropdown">ไม่มีการแจ้งเตือน</p>
                                            ) : (
                                                notifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(notif => (
                                                    <div
                                                        key={notif.id}
                                                        className={`dropdown-item ${notif.read ? 'read' : 'unread'} ${notif.type}`}
                                                        onClick={() => {
                                                            handleNotificationClick(notif);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <div className="dropdown-item-icon">
                                                            {notif.type === 'viewing' ? '👀' : '📝'}
                                                        </div>
                                                        <div className="dropdown-item-content">
                                                            <h4>{notif.title}</h4>
                                                            <span className="dropdown-time">{new Date(notif.created_at).toLocaleString('th-TH')}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {/* Pagination in Dropdown */}
                                        {notifications.length > itemsPerPage && (
                                            <div className="dropdown-pagination">
                                                <button
                                                    disabled={currentPage === 1}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(prev - 1, 1)); }}
                                                >
                                                    &lt;
                                                </button>
                                                <span>{currentPage}</span>
                                                <button
                                                    disabled={currentPage === Math.ceil(notifications.length / itemsPerPage)}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(prev + 1, Math.ceil(notifications.length / itemsPerPage))); }}
                                                >
                                                    &gt;
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link to="/" className="btn-back">
                                <span className="icon">↩</span> กลับหน้าหลัก
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="admin-main">
                <div className="admin-container">
                    {/* Stats Cards */}

                    {/* Stats Cards */}
                    <div className="admin-stats">
                        <div className="stat-card">
                            <div className="stat-icon icon-total">🏢</div>
                            <div className="stat-info">
                                <h3>ห้องทั้งหมด</h3>
                                <div className="stat-value">{totalRooms}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon icon-green">✅</div>
                            <div className="stat-info">
                                <h3>ว่าง</h3>
                                <div className="stat-value text-green">{available}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon icon-red">🛌</div>
                            <div className="stat-info">
                                <h3>รายวัน</h3>
                                <div className="stat-value text-red">{occupied}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon icon-blue">📅</div>
                            <div className="stat-info">
                                <h3>รายเดือน</h3>
                                <div className="stat-value text-blue">{monthly}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon icon-yellow">🔧</div>
                            <div className="stat-info">
                                <h3>ปิดปรับปรุง</h3>
                                <div className="stat-value text-yellow">{maintenance}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>📋</div>
                            <div className="stat-info">
                                <h3>ติดจอง</h3>
                                <div className="stat-value" style={{ color: '#8b5cf6' }}>{booked}</div>
                            </div>
                        </div>
                    </div>

                    {/* Room Grid - Grouped by Floor */}
                    <div className="room-grid-container">
                        <h2>ผังห้องพัก</h2>
                        {[2, 3, 4, 5].map(floor => {
                            const floorRooms = rooms.filter(room => room.id.startsWith(floor.toString()));
                            if (floorRooms.length === 0) return null;
                            return (
                                <div key={floor} className="floor-section">
                                    <h3 className="floor-label">ชั้น {floor}</h3>
                                    <div className="room-grid">
                                        {floorRooms.map(room => (
                                            <button
                                                key={room.id}
                                                className={`room-item ${room.status}`}
                                                onClick={() => handleRoomClick(room)}
                                            >
                                                <span className="room-id">{room.id}</span>
                                                <span className="room-status-badge">{getStatusText(room.status)}</span>
                                                {(room.status === 'occupied' || room.status === 'monthly') && (
                                                    <span className="room-guest">{room.guestName || '-'}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>จัดการห้อง {selectedRoom.id}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>สถานะการจอง</label>
                                <div className="status-options">
                                    {(selectedRoom.status === 'available' || selectedRoom.status === 'occupied') && (
                                        <button
                                            className={`status-btn occupied ${editForm.status === 'occupied' ? 'active' : ''}`}
                                            onClick={() => setEditForm(prev => ({ ...prev, status: 'occupied' }))}
                                        >
                                            รายวัน
                                        </button>
                                    )}
                                    {(selectedRoom.status === 'available' || selectedRoom.status === 'monthly') && (
                                        <button
                                            className={`status-btn monthly ${editForm.status === 'monthly' ? 'active' : ''}`}
                                            onClick={() => setEditForm(prev => ({ ...prev, status: 'monthly' }))}
                                        >
                                            รายเดือน
                                        </button>
                                    )}
                                    {(selectedRoom.status === 'available' || selectedRoom.status === 'maintenance') && (
                                        <button
                                            className={`status-btn maintenance ${editForm.status === 'maintenance' ? 'active' : ''}`}
                                            onClick={() => setEditForm(prev => ({ ...prev, status: 'maintenance' }))}
                                        >
                                            ปิดปรับปรุง
                                        </button>
                                    )}
                                </div>
                            </div>

                            {editForm.status !== 'maintenance' && (
                                <div className="guest-info-grid">
                                    <div className="form-group">
                                        <label>ชื่อ-นามสกุล / ชื่อลูกค้า</label>
                                        <input
                                            type="text"
                                            name="guestName"
                                            value={editForm.guestName || ''}
                                            onChange={handleInputChange}
                                            placeholder="เช่น สมชาย ใจดี"
                                            disabled={editForm.status === 'available'}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>เลขบัตรประชาชน / Passport</label>
                                        <input
                                            type="text"
                                            name="idCard"
                                            value={editForm.idCard || ''}
                                            onChange={handleInputChange}
                                            placeholder="ระบุเลขบัตรประชาชน 13 หลัก"
                                            disabled={editForm.status === 'available'}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>เบอร์โทรศัพท์</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editForm.phone || ''}
                                            onChange={handleInputChange}
                                            placeholder="0xx-xxx-xxxx"
                                            disabled={editForm.status === 'available'}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>อีเมล</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email || ''}
                                            onChange={handleInputChange}
                                            placeholder="example@email.com"
                                            disabled={editForm.status === 'available'}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>วันที่จอง</label>
                                            <input
                                                type="date"
                                                name="bookingDate"
                                                value={editForm.bookingDate ? editForm.bookingDate.split('T')[0] : ''}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                style={{ backgroundColor: '#f3f4f6' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>เช็คอิน</label>
                                            <input
                                                type="date"
                                                name="checkIn"
                                                value={editForm.checkIn ? editForm.checkIn.split('T')[0] : ''}
                                                onChange={handleInputChange}
                                                disabled={editForm.status === 'available'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>เช็คเอาท์</label>
                                            <input
                                                type="date"
                                                name="checkOut"
                                                value={editForm.checkOut ? editForm.checkOut.split('T')[0] : ''}
                                                onChange={handleInputChange}
                                                disabled={editForm.status === 'available'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>รายละเอียดเพิ่มเติม</label>
                                <textarea
                                    name="note"
                                    value={editForm.note || ''}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="หมายเหตุเพิ่มเติม..."
                                ></textarea>
                            </div>

                            {/* Bank Account for Refund Section */}
                            {(selectedRoom.status === 'booked' || selectedRoom.status === 'occupied') && selectedRoom.refundBankName && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #fde047',
                                    marginTop: '1rem'
                                }}>
                                    <h4 style={{ color: '#854d0e', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        🏦 บัญชีธนาคารสำหรับคืนเงินมัดจำ
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                                        <div>
                                            <span style={{ color: '#a16207', fontWeight: '500' }}>ธนาคาร:</span>
                                            <p style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>{selectedRoom.refundBankName}</p>
                                        </div>
                                        <div>
                                            <span style={{ color: '#a16207', fontWeight: '500' }}>เลขที่บัญชี:</span>
                                            <p style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>{selectedRoom.refundAccountNumber}</p>
                                        </div>
                                        <div>
                                            <span style={{ color: '#a16207', fontWeight: '500' }}>ชื่อบัญชี:</span>
                                            <p style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>{selectedRoom.refundAccountName}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {selectedRoom.status === 'booked' && (
                                    <>
                                        <button className="btn-save" style={{ backgroundColor: '#8b5cf6', color: 'white' }} onClick={handleCheckIn}>
                                            ✓ เช็คอิน
                                        </button>
                                        <button className="btn-cancel" style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={handleCheckOut}>
                                            ✕ ยกเลิกจอง
                                        </button>
                                    </>
                                )}
                                {(selectedRoom.status === 'occupied' || selectedRoom.status === 'monthly') && (
                                    <button className="btn-save" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={handleCheckOut}>
                                        ✓ เช็คเอาท์
                                    </button>
                                )}
                                {selectedRoom.status === 'maintenance' && (
                                    <button className="btn-save" style={{ backgroundColor: '#22c55e', color: 'white' }} onClick={handleCheckOut}>
                                        ✓ เปิดห้อง
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ปิด</button>
                                <button className="btn-save" onClick={handleSave}>💾 บันทึก</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Notification Detail Modal */}
            {selectedNotif && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>{selectedNotif.title}</h2>
                            <button className="close-btn" onClick={() => setSelectedNotif(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#374151' }}>
                                {selectedNotif.message}
                            </p>
                            <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#9ca3af', textAlign: 'right' }}>
                                {new Date(selectedNotif.created_at).toLocaleString('th-TH')}
                            </div>
                        </div>
                        <div className="modal-footer" style={{ gridTemplateColumns: '1fr' }}>
                            <button className="btn-cancel" onClick={() => setSelectedNotif(null)} style={{ width: '100%' }}>
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Admin = () => {
    return (
        <ErrorBoundary>
            <AdminContent />
        </ErrorBoundary>
    );
};

export default Admin;
