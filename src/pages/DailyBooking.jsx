import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useLanguage } from '../context/LanguageContext';
import './Booking.css';

const DailyBooking = () => {
    const { t, language } = useLanguage();
    const location = useLocation();
    const searchParams = location.state || {};

    const [step, setStep] = useState(1);
    const [isCustomGuests, setIsCustomGuests] = useState(false);
    const [isCustomRooms, setIsCustomRooms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableRooms, setAvailableRooms] = useState(null);

    // Fetch available room count
    useEffect(() => {
        const fetchRoomStats = async () => {
            try {
                const response = await fetch('/api/rooms/stats');
                const data = await response.json();
                setAvailableRooms(parseInt(data.available) || 0);
            } catch (err) {
                console.error('Failed to fetch room stats:', err);
            }
        };
        fetchRoomStats();
    }, []);

    // Check if initial values exceed standard options
    useEffect(() => {
        if (searchParams.guests > 10) setIsCustomGuests(true);
        if (searchParams.rooms > 10) setIsCustomRooms(true);
    }, []);

    const [formData, setFormData] = useState({
        // Step 1: Room Selection
        roomType: 'daily',
        bookingType: 'reserve',
        checkIn: searchParams.checkIn || '',
        checkOut: searchParams.checkOut || '',
        guests: searchParams.guests || 1,
        rooms: searchParams.rooms || 1,

        // Step 2: Guest Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idNumber: '',
        nationality: 'thai',

        // Step 3: Special Requests
        specialRequests: '',
        arrivalTime: '14:00',
        earlyCheckIn: false,
        lateCheckOut: false,
        extraBed: false,
        breakfastIncluded: true,

        // Step 4: Payment
        paymentMethod: 'bank_transfer',
        agreeTerms: false,
        isGovernment: false,
        isGoogleReview: false,
        paymentSlip: null,

        // Bank Account for Deposit Refund
        refundBankName: '',
        refundAccountNumber: '',
        refundAccountName: ''
    });

    const roomTypes = {
        th: [
            {
                id: 'daily',
                name: 'ห้องพักรายวัน',
                price: 850,
                priceUnit: 'บาท/คืน',
                popular: false,
                pricing: [
                    { label: 'ค่าประกันห้อง', value: '1,000 บาท (1 คืน)' }
                ],
                amenities: [
                    { label: 'WiFi', value: 'ฟรี' },
                    { label: 'ทำความสะอาด ทุกวัน' },
                    { label: 'เฟอร์นิเจอร์ครบครัน' },
                    { label: 'เครื่องปรับอากาศ' },
                    { label: 'กาแฟและเครื่องดื่ม ฟรี' },
                    { label: 'ทีวี' },
                    { label: 'เครื่องทำน้ำอุ่น' },
                    { label: 'ไมโครเวฟ' },
                    { label: 'ตู้เย็น' },
                    { label: 'ลิฟต์' },
                    { label: 'รองรับวีลแชร์' },
                    { label: 'รองรับผู้สูงอายุและผู้พิการ' }
                ]
            }
        ],
        en: [
            {
                id: 'daily',
                name: 'Daily Room',
                price: 850,
                priceUnit: 'THB/night',
                popular: false,
                pricing: [
                    { label: 'Room Deposit', value: '1,000 THB (1 night)' }
                ],
                amenities: [
                    { label: 'WiFi', value: 'Free' },
                    { label: 'Daily Cleaning' },
                    { label: 'Fully Furnished' },
                    { label: 'Air Conditioning' },
                    { label: 'Coffee & Drinks Free' },
                    { label: 'TV' },
                    { label: 'Water Heater' },
                    { label: 'Microwave' },
                    { label: 'Refrigerator' },
                    { label: 'Elevator' },
                    { label: 'Wheelchair Accessible' },
                    { label: 'Elderly & Disabled Friendly' }
                ]
            }
        ],
        cn: [
            {
                id: 'daily',
                name: '日租房',
                price: 850,
                priceUnit: '泰铢/晚',
                popular: false,
                pricing: [
                    { label: '押金', value: '1,000 泰铢 (1晚)' }
                ],
                amenities: [
                    { label: 'WiFi', value: '免费' },
                    { label: '每天清洁' },
                    { label: '家具齐全' },
                    { label: '空调' },
                    { label: '咖啡和饮料 免费' },
                    { label: '电视' },
                    { label: '热水器' },
                    { label: '微波炉' },
                    { label: '冰箱' },
                    { label: '电梯' },
                    { label: '轮椅通道' },
                    { label: '适宜老人和残疾人' }
                ]
            }
        ]
    };

    const labels = {
        th: {
            heroSubtitle: 'จองห้องพัก',
            heroTitle: 'ระบบจองห้องพัก (รายวัน)',
            heroDescription: 'จองห้องพักรายวันกับเราง่ายๆ เพียงไม่กี่ขั้นตอน',
            step1: 'เลือกห้องพัก',
            step2: 'ข้อมูลผู้เข้าพัก',
            step3: 'คำขอพิเศษ',
            step4: 'ยืนยันการจอง',
            selectRoom: 'เลือกประเภทห้องพัก',
            checkIn: 'วันที่เช็คอิน',
            checkOut: 'วันที่เช็คเอาท์',
            guests: 'จำนวนผู้เข้าพัก',
            rooms: 'จำนวนห้อง',
            firstName: 'ชื่อ',
            lastName: 'นามสกุล',
            email: 'อีเมล',
            phone: 'เบอร์โทรศัพท์',
            idNumber: 'เลขบัตรประชาชน / พาสปอร์ต',
            nationality: 'สัญชาติ',
            thai: 'ไทย',
            foreigner: 'ต่างชาติ',
            specialRequests: 'คำขอพิเศษ',
            arrivalTime: 'เวลาเข้าพักโดยประมาณ',
            earlyCheckIn: 'เช็คอินก่อนเวลา (ขึ้นอยู่กับห้องว่าง)',
            lateCheckOut: 'เช็คเอาท์ช้า (ขึ้นอยู่กับห้องว่าง)',
            extraBed: 'เพิ่มเตียงพิเศษ (+500 บาท/คืน)',
            breakfastIncluded: 'รวมอาหารเช้า',
            paymentMethod: 'วิธีการชำระเงิน',
            bankTransfer: 'โอนเงินผ่านธนาคาร',
            creditCard: 'บัตรเครดิต/เดบิต',
            payAtHotel: 'ชำระที่โรงแรม',
            bookingSummary: 'สรุปการจอง',
            roomCost: 'ค่าห้องพัก',
            extraServices: 'บริการเพิ่มเติม',
            total: 'รวมทั้งหมด',
            agreeTerms: 'ฉันยอมรับเงื่อนไขและข้อกำหนดการจอง',
            next: 'ถัดไป',
            back: 'ย้อนกลับ',
            confirmBooking: 'ยืนยันการจอง',
            bookingSuccess: 'จองห้องพักสำเร็จ!',
            bookingSuccessMsg: 'ขอบคุณสำหรับการจอง เราจะส่งรายละเอียดไปยังอีเมลของคุณ',
            bookingNumber: 'หมายเลขการจอง',
            important: 'สำคัญ',
            checkInTime: 'เวลาเช็คอิน: 14:00 น.',
            checkOutTime: 'เวลาเช็คเอาท์: 12:00 น.',
            depositNote: 'กรุณาชำระค่ามัดจำ 50% ภายใน 24 ชั่วโมงเพื่อยืนยันการจอง',
            required: 'จำเป็น',
            person: 'ท่าน',
            room: 'ห้อง',
            night: 'คืน',
            month: 'เดือน',
            scanToPay: 'สแกน QR Code เพื่อชำระเงินมัดจำ',
            depositAmount: 'ยอดเงินมัดจำที่ต้องชำระ',
            uploadSlip: 'แนบสลิปการโอนเงิน *',
            bankName: 'ธนาคารกรุงไทย',
            accountName: 'น.ส.กิรณา เลิศมณี',
            // Refund bank account labels
            refundBankInfo: 'ข้อมูลบัญชีธนาคารสำหรับคืนเงินมัดจำ',
            refundBankName: 'ชื่อธนาคาร *',
            refundAccountNumber: 'เลขที่บัญชี *',
            refundAccountName: 'ชื่อบัญชี *',
        },
        en: {
            heroSubtitle: 'Booking',
            heroTitle: 'Daily Room Booking',
            heroDescription: 'Book your daily room with us in just a few steps',
            step1: 'Select Room',
            step2: 'Guest Information',
            step3: 'Special Requests',
            step4: 'Booking Confirmation',
            selectRoom: 'Select Room Type',
            checkIn: 'Check-in Date',
            checkOut: 'Check-out Date',
            guests: 'Number of Guests',
            rooms: 'Number of Rooms',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone Number',
            idNumber: 'ID / Passport Number',
            nationality: 'Nationality',
            thai: 'Thai',
            foreigner: 'Foreigner',
            specialRequests: 'Special Requests',
            arrivalTime: 'Estimated Arrival Time',
            earlyCheckIn: 'Early Check-in (subject to availability)',
            lateCheckOut: 'Late Check-out (subject to availability)',
            extraBed: 'Extra Bed (+500 THB/night)',
            breakfastIncluded: 'Breakfast Included',
            paymentMethod: 'Payment Method',
            bankTransfer: 'Bank Transfer',
            creditCard: 'Credit/Debit Card',
            payAtHotel: 'Pay at Hotel',
            bookingSummary: 'Booking Summary',
            roomCost: 'Room Cost',
            extraServices: 'Extra Services',
            total: 'Total',
            agreeTerms: 'I agree to the booking terms and conditions',
            next: 'Next',
            back: 'Back',
            confirmBooking: 'Confirm Booking',
            bookingSuccess: 'Booking Successful!',
            bookingSuccessMsg: 'Thank you for your booking. Details will be sent to your email.',
            bookingNumber: 'Booking Number',
            important: 'Important',
            checkInTime: 'Check-in Time: 2:00 PM',
            checkOutTime: 'Check-out Time: 12:00 PM',
            depositNote: 'Please pay 50% deposit within 24 hours to confirm your booking',
            required: 'Required',
            person: 'person(s)',
            room: 'room(s)',
            night: 'night(s)',
            month: 'month(s)',
            scanToPay: 'Scan QR Code to Pay Deposit',
            depositAmount: 'Deposit Amount to Pay',
            uploadSlip: 'Upload Payment Slip *',
            bankName: 'Krungthai Bank',
            accountName: 'Ms. Kirana Lertmanee',
            // Refund bank account labels
            refundBankInfo: 'Bank Account for Deposit Refund',
            refundBankName: 'Bank Name *',
            refundAccountNumber: 'Account Number *',
            refundAccountName: 'Account Holder Name *',
        },
        cn: {
            heroSubtitle: '预订客房',
            heroTitle: '日租房预订',
            heroDescription: '只需几步即可轻松预订客房',
            step1: '选择客房',
            step2: '客人信息',
            step3: '特殊要求',
            step4: '确认预订',
            selectRoom: '选择房型',
            checkIn: '入住日期',
            checkOut: '退房日期',
            guests: '客人数量',
            rooms: '房间数量',
            firstName: '名',
            lastName: '姓',
            email: '邮箱',
            phone: '电话号码',
            idNumber: '身份证/护照号码',
            nationality: '国籍',
            thai: '泰国',
            foreigner: '外国',
            specialRequests: '特殊要求',
            arrivalTime: '预计到达时间',
            earlyCheckIn: '提前入住（视房间情况）',
            lateCheckOut: '延迟退房（视房间情况）',
            extraBed: '加床（+500泰铢/晚）',
            breakfastIncluded: '含早餐',
            paymentMethod: '付款方式',
            bankTransfer: '银行转账',
            creditCard: '信用卡/借记卡',
            payAtHotel: '到店支付',
            bookingSummary: '预订摘要',
            roomCost: '房费',
            extraServices: '额外服务',
            total: '总计',
            agreeTerms: '我同意预订条款和条件',
            next: '下一步',
            back: '返回',
            confirmBooking: '确认预订',
            bookingSuccess: '预订成功！',
            bookingSuccessMsg: '感谢您的预订，详情将发送到您的邮箱。',
            bookingNumber: '预订号',
            important: '重要',
            checkInTime: '入住时间: 下午2:00',
            checkOutTime: '退房时间: 中午12:00',
            depositNote: '请在24小时内支付50%定金以确认预订',
            required: '必填',
            person: '位客人',
            room: '间',
            night: '晚',
            month: '月',
            scanToPay: '扫描二维码支付定金',
            depositAmount: '需支付定金金额',
            uploadSlip: '上传转账凭证 *',
            bankName: '开泰银行',
            accountName: 'Ms. Kirana Lertmanee',
            // Refund bank account labels
            refundBankInfo: '退还押金银行账户信息',
            refundBankName: '银行名称 *',
            refundAccountNumber: '账号 *',
            refundAccountName: '账户名 *',
        }
    };

    const l = labels[language] || labels.th;
    const rooms = roomTypes[language] || roomTypes.th;

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 4) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            // Prevent duplicate submissions
            if (isSubmitting) return;
            setIsSubmitting(true);

            // Submit booking
            try {
                const bookingNumber = 'PJ' + Date.now().toString().slice(-8);
                const formDataToSend = new FormData();

                // Append all fields to FormData
                Object.keys(formData).forEach(key => {
                    if (key === 'paymentSlip') {
                        if (formData[key]) {
                            formDataToSend.append('paymentSlip', formData[key]);
                        }
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                });

                // Add calculated fields
                formDataToSend.append('totalPayable', totalPayable);
                formDataToSend.append('bookingNumber', bookingNumber);
                formDataToSend.append('note', formData.specialRequests);
                // Explicitly set bookingType to 'reserve' for daily bookings
                formDataToSend.set('bookingType', 'reserve');

                // Await the API response to ensure room is assigned
                const response = await fetch('/api/notify', {
                    method: 'POST',
                    body: formDataToSend
                });

                const result = await response.json();
                console.log('Booking result:', result);

                if (result.success) {
                    setStep(5);
                    window.scrollTo(0, 0);
                } else {
                    alert(result.message || 'การจองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
                }
            } catch (error) {
                console.error('Notify failed', error);
                alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const calculatePrice = () => {
        const selectedRoom = rooms.find(r => r.id === formData.roomType);

        let basePrice = selectedRoom?.price || 0;

        // Overlay Government Check (Removed auto-discount)
        // if (formData.roomType === 'daily' && (formData.isGovernment || formData.isGoogleReview)) {
        //    basePrice = 680;
        // }

        let extraCost = 0;

        // Calculate nights
        let nights = 1;
        if (formData.checkIn && formData.checkOut) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nights = diffDays > 0 ? diffDays : 1;
        }

        // Get deposit from pricing data
        let deposit = 1000 * formData.rooms; // 1000 per room

        if (formData.extraBed) {
            extraCost += 500;
        }

        const roomTotal = (basePrice * formData.rooms * nights) + (extraCost * nights);
        const totalPayable = roomTotal + deposit;

        return { basePrice, extraCost: extraCost * nights, deposit, roomTotal, totalPayable, nights };
    };

    const { basePrice, extraCost, deposit, roomTotal, totalPayable } = calculatePrice();

    const generateBookingNumber = () => {
        return 'PJ' + Date.now().toString().slice(-8);
    };

    // Format date from YYYY-MM-DD to DD/MM/YYYY (Thai format)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const thaiYear = parseInt(year) + 543; // Convert to Buddhist Era
        return `${day}/${month}/${thaiYear}`;
    };

    return (
        <div className="booking-page" >
            <Header />

            {/* Hero Banner */}
            <section className="booking-hero" >
                <div className="booking-hero__overlay"></div>
                <div className="booking-hero__content">
                    <span className="booking-hero__subtitle">{l.heroSubtitle}</span>
                    <h1 className="booking-hero__title">{l.heroTitle}</h1>
                    <p className="booking-hero__description">{l.heroDescription}</p>
                </div>
            </section >

            <main className="booking-main section">
                <div className="container">
                    {/* Progress Steps */}
                    {step < 5 && (
                        <div className="booking-steps">
                            <div className={`booking-step ${step >= 1 ? 'booking-step--active' : ''} ${step > 1 ? 'booking-step--completed' : ''}`}>
                                <div className="booking-step__number">1</div>
                                <span className="booking-step__label">{l.step1}</span>
                            </div>
                            <div className="booking-step__line"></div>
                            <div className={`booking-step ${step >= 2 ? 'booking-step--active' : ''} ${step > 2 ? 'booking-step--completed' : ''}`}>
                                <div className="booking-step__number">2</div>
                                <span className="booking-step__label">{l.step2}</span>
                            </div>
                            <div className="booking-step__line"></div>
                            <div className={`booking-step ${step >= 3 ? 'booking-step--active' : ''} ${step > 3 ? 'booking-step--completed' : ''}`}>
                                <div className="booking-step__number">3</div>
                                <span className="booking-step__label">{l.step3}</span>
                            </div>
                            <div className="booking-step__line"></div>
                            <div className={`booking-step ${step >= 4 ? 'booking-step--active' : ''}`}>
                                <div className="booking-step__number">4</div>
                                <span className="booking-step__label">{l.step4}</span>
                            </div>
                        </div>
                    )}

                    <div className={`booking-content ${step !== 4 ? 'booking-content--centered' : ''}`}>
                        <form className="booking-form" onSubmit={handleSubmit}>
                            {/* Step 1: Room Selection */}
                            {step === 1 && (
                                <div className="booking-form__step">
                                    <h2 className="booking-form__title">{l.step1}</h2>

                                    {/* Available Rooms Display */}
                                    {availableRooms !== null && (
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                            <div style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 2rem',
                                                borderRadius: '50px',
                                                background: availableRooms > 0 ? '#f0fdf4' : '#fef2f2',
                                                border: availableRooms > 0 ? '1px solid #86efac' : '1px solid #fecaca'
                                            }}>
                                                <span style={{
                                                    color: availableRooms > 0 ? '#166534' : '#dc2626',
                                                    fontWeight: '500',
                                                    fontSize: '0.95rem',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {language === 'th'
                                                        ? (availableRooms > 0 ? `ห้องว่าง ${availableRooms} ห้อง` : 'ห้องพักเต็ม')
                                                        : (availableRooms > 0 ? `${availableRooms} Rooms Available` : 'Fully Booked')}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Full Rooms Alert */}
                                    {availableRooms === 0 && (
                                        <div style={{
                                            background: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            marginBottom: '1.5rem',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ color: '#dc2626', fontWeight: '600', margin: 0 }}>
                                                {language === 'th'
                                                    ? '🚫 ขณะนี้ไม่สามารถจองได้เนื่องจากห้องพักเต็ม กรุณาติดต่อเจ้าหน้าที่'
                                                    : '🚫 Booking is currently unavailable as all rooms are occupied. Please contact staff.'}
                                            </p>
                                            <p style={{ color: '#7f1d1d', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                                📞 062-469-8935
                                            </p>
                                        </div>
                                    )}

                                    <div className="booking-form__group">
                                        <label>{l.selectRoom} <span className="required">*</span></label>
                                        <div className="booking-room-options">
                                            {rooms.map(room => (
                                                <label
                                                    key={room.id}
                                                    className={`booking-room-option ${formData.roomType === room.id ? 'booking-room-option--selected' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="roomType"
                                                        value={room.id}
                                                        checked={formData.roomType === room.id}
                                                        onChange={handleChange}
                                                        disabled={room.id !== 'daily'} // Force Daily Only
                                                    />
                                                    <div className="booking-room-option__content">
                                                        <img src={`/images/gallery__placeholder${room.id === 'daily' ? '1' : ''}.png`} alt={room.name} />
                                                        <div className="booking-room-option__info">
                                                            <h4>{room.name}</h4>
                                                            <span className="booking-room-option__price">
                                                                {room.price.toLocaleString()} {room.priceUnit}
                                                            </span>

                                                            {/* Government Official Checkbox (Only for Daily) */}
                                                            {room.id === 'daily' && (
                                                                <>
                                                                    <div className="gov-checkbox-wrapper" style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#166534', fontWeight: '600' }}>
                                                                            {language === 'th' ? 'ข้าราชการ/รัฐวิสาหกิจ (680 บาท/คืน)' : language === 'cn' ? '公务员/国企员工 (680 泰铢/晚)' : 'Gov. Official (680 THB/night)'}
                                                                            <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#15803d' }}>{language === 'th' ? '(*โปรดแสดงบัตร)' : language === 'cn' ? '(*请出示证件)' : '(*Show ID)'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="google-review-wrapper" style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#1e40af', fontWeight: '600' }}>
                                                                            {language === 'th' ? 'รีวิว Google Map 5 ดาว (680 บาท/คืน)' : language === 'cn' ? '谷歌地图 5 星好评 (680 泰铢/晚)' : 'Google Map 5-Star Review (680 THB/night)'}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Pricing Section */}
                                                            <ul className="booking-room-option__pricing">
                                                                {room.pricing.map((item, idx) => (
                                                                    <li key={idx}>
                                                                        <span className="pricing-label">{item.label}:</span>
                                                                        <span className="pricing-value">{item.value}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                            {/* Amenities Section */}
                                                            <div className="booking-room-option__amenities-title">สิ่งอำนวยความสะดวก</div>
                                                            <ul className="booking-room-option__amenities">
                                                                {room.amenities.map((item, idx) => (
                                                                    <li key={idx}>
                                                                        <span className="amenity-label">{item.label}</span>
                                                                        {item.value && <span className="amenity-value"> ({item.value})</span>}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Daily Room Form Parts */}
                                    <div className="booking-form__row">
                                        <div className="booking-form__group">
                                            <label htmlFor="checkIn">{l.checkIn} <span className="required">*</span></label>
                                            <input
                                                type="date"
                                                id="checkIn"
                                                name="checkIn"
                                                value={formData.checkIn}
                                                onChange={handleChange}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div className="booking-form__group">
                                            <label htmlFor="checkOut">{l.checkOut} <span className="required">*</span></label>
                                            <input
                                                type="date"
                                                id="checkOut"
                                                name="checkOut"
                                                value={formData.checkOut}
                                                onChange={handleChange}
                                                required
                                                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    <div className="booking-form__row">
                                        <div className="booking-form__group">
                                            <label htmlFor="guests">{l.guests}</label>
                                            {!isCustomGuests ? (
                                                <select
                                                    id="guests"
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'custom') {
                                                            setIsCustomGuests(true);
                                                            setFormData(p => ({ ...p, guests: '' }));
                                                        } else {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                        <option key={n} value={n}>{n} {l.person}</option>
                                                    ))}
                                                    <option value="custom">{t('contactPage.topics.other') || 'Other'}</option>
                                                </select>
                                            ) : (
                                                <div className="custom-input-group">
                                                    <input
                                                        type="number"
                                                        name="guests"
                                                        value={formData.guests}
                                                        onChange={handleChange}
                                                        placeholder={l.guests}
                                                        min="1"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-link"
                                                        onClick={() => setIsCustomGuests(false)}
                                                        style={{ fontSize: '0.8rem', marginLeft: '5px' }}
                                                    >
                                                        ↩
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="booking-form__group">
                                            <label htmlFor="rooms">{l.rooms}</label>
                                            {!isCustomRooms ? (
                                                <select
                                                    id="rooms"
                                                    name="rooms"
                                                    value={formData.rooms}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'custom') {
                                                            setIsCustomRooms(true);
                                                            setFormData(p => ({ ...p, rooms: '' }));
                                                        } else {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                        <option key={n} value={n}>{n} {l.room}</option>
                                                    ))}
                                                    <option value="custom">{language === 'th' ? 'อื่นๆ' : 'Other'}</option>
                                                </select>
                                            ) : (
                                                <div className="custom-input-group">
                                                    <input
                                                        type="number"
                                                        name="rooms"
                                                        value={formData.rooms}
                                                        onChange={handleChange}
                                                        placeholder={l.rooms}
                                                        min="1"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-link"
                                                        onClick={() => setIsCustomRooms(false)}
                                                        style={{ fontSize: '0.8rem', marginLeft: '5px' }}
                                                    >
                                                        ↩
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Guest Information */}
                            {step === 2 && (
                                <div className="booking-form__step">
                                    <h2 className="booking-form__title">{l.step2}</h2>

                                    <div className="booking-form__row">
                                        <div className="booking-form__group">
                                            <label htmlFor="firstName">{l.firstName} <span className="required">*</span></label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="booking-form__group">
                                            <label htmlFor="lastName">{l.lastName} <span className="required">*</span></label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="booking-form__row">
                                        <div className="booking-form__group">
                                            <label htmlFor="email">{l.email}</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="booking-form__group">
                                            <label htmlFor="phone">{l.phone} <span className="required">*</span></label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="08X-XXX-XXXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="booking-form__row">
                                        <div className="booking-form__group">
                                            <label htmlFor="idNumber">{l.idNumber}</label>
                                            <input
                                                type="text"
                                                id="idNumber"
                                                name="idNumber"
                                                value={formData.idNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="booking-form__group">
                                            <label htmlFor="nationality">{l.nationality}</label>
                                            <select id="nationality" name="nationality" value={formData.nationality} onChange={handleChange}>
                                                <option value="thai">{l.thai}</option>
                                                <option value="foreigner">{l.foreigner}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Special Requests / Additional Info */}
                            {step === 3 && (
                                <div className="booking-form__step">
                                    <h2 className="booking-form__title">{l.step3}</h2>

                                    <div className="booking-form__group">
                                        <label htmlFor="arrivalTime">{l.arrivalTime}</label>
                                        <select id="arrivalTime" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange}>
                                            {['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="booking-form__checkboxes">
                                        <label className="booking-checkbox">
                                            <input
                                                type="checkbox"
                                                name="earlyCheckIn"
                                                checked={formData.earlyCheckIn}
                                                onChange={handleChange}
                                            />
                                            <span className="booking-checkbox__mark"></span>
                                            <span className="booking-checkbox__label">{l.earlyCheckIn}</span>
                                        </label>

                                        <label className="booking-checkbox">
                                            <input
                                                type="checkbox"
                                                name="lateCheckOut"
                                                checked={formData.lateCheckOut}
                                                onChange={handleChange}
                                            />
                                            <span className="booking-checkbox__mark"></span>
                                            <span className="booking-checkbox__label">{l.lateCheckOut}</span>
                                        </label>

                                        <label className="booking-checkbox">
                                            <input
                                                type="checkbox"
                                                name="extraBed"
                                                checked={formData.extraBed}
                                                onChange={handleChange}
                                            />
                                            <span className="booking-checkbox__mark"></span>
                                            <span className="booking-checkbox__label">{l.extraBed}</span>
                                        </label>


                                    </div>

                                    <div className="booking-form__group">
                                        <label htmlFor="specialRequests">{l.specialRequests}</label>
                                        <textarea
                                            id="specialRequests"
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            rows="4"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Payment / Confirmation */}
                            {step === 4 && (
                                <div className="booking-form__step">
                                    <h2 className="booking-form__title">{l.step4}</h2>

                                    <div className="payment-section" style={{
                                        marginBottom: '2.5rem',
                                        padding: '2.5rem',
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                        borderRadius: '24px',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                                        border: '1px solid #e2e8f0',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Decorative gradient overlay */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #166534 0%, #22c55e 50%, #166534 100%)',
                                            borderRadius: '24px 24px 0 0'
                                        }}></div>

                                        <h3 style={{
                                            color: '#0f172a',
                                            marginBottom: '2rem',
                                            fontSize: '1.4rem',
                                            fontWeight: '500',
                                            textAlign: 'center',
                                            letterSpacing: '0.3px',
                                            fontFamily: "'Prompt', 'Kanit', sans-serif"
                                        }}>
                                            {l.scanToPay}
                                        </h3>

                                        <div className="payment-grid" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr', // Mobile default
                                            gap: '2rem',
                                            alignItems: 'start'
                                        }}>
                                            {/* Left Column: QR Code Only */}
                                            <div className="qr-column" style={{
                                                background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                                                padding: '1.5rem',
                                                borderRadius: '20px',
                                                border: '2px solid #bbf7d0',
                                                textAlign: 'center',
                                                maxWidth: '350px',
                                                margin: '0 auto',
                                                gridColumn: '1 / -1', // Default full width mobile
                                                boxShadow: '0 10px 25px -5px rgba(22, 101, 52, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                                            }}>
                                                <style>{`
                                                    @media (min-width: 768px) {
                                                        .payment-grid { grid-template-columns: 350px 1fr !important; text-align: left; }
                                                        .qr-column { grid-column: auto !important; margin: 0 !important; max-width: 350px !important; }
                                                        .details-column { text-align: left; }
                                                    }
                                                    @keyframes pulse-border {
                                                        0%, 100% { box-shadow: 0 10px 25px -5px rgba(22, 101, 52, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9); }
                                                        50% { box-shadow: 0 10px 25px -5px rgba(22, 101, 52, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 0 4px rgba(34, 197, 94, 0.1); }
                                                    }
                                                    .qr-column:hover { animation: pulse-border 2s ease-in-out infinite; }
                                                `}</style>

                                                <img
                                                    src="/images/qr-payment.jpg"
                                                    alt="QR Code Payment"
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '16px',
                                                        display: 'block',
                                                        boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.1)',
                                                        border: '3px solid #fff'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        try {
                                                            const response = await fetch('/images/qr-payment.jpg');
                                                            const blob = await response.blob();
                                                            const file = new File([blob], 'PJ-Residence-QR-Payment.jpg', { type: 'image/jpeg' });

                                                            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                                                await navigator.share({
                                                                    files: [file],
                                                                    title: 'PJ Residence Payment QR',
                                                                    text: 'Scan to pay deposit'
                                                                });
                                                            } else {
                                                                // Fallback for desktop or unsupported browsers
                                                                const link = document.createElement('a');
                                                                link.href = '/images/qr-payment.jpg';
                                                                link.download = 'PJ-Residence-QR-Payment.jpg';
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                            }
                                                        } catch (error) {
                                                            console.error('Error sharing/downloading:', error);
                                                            // Final fallback
                                                            window.open('/images/qr-payment.jpg', '_blank');
                                                        }
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        marginTop: '1rem',
                                                        padding: '0.75rem 1.5rem',
                                                        background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
                                                        color: '#fff',
                                                        borderRadius: '50px',
                                                        border: 'none',
                                                        outline: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '0.9rem',
                                                        boxShadow: '0 4px 15px rgba(22, 101, 52, 0.3)',
                                                        transition: 'all 0.3s ease',
                                                        width: '100%',
                                                        fontFamily: 'inherit'
                                                    }}
                                                >
                                                    📥 {language === 'th' ? 'บันทึก QR Code' : 'Save QR Code'}
                                                </button>
                                            </div>

                                            {/* Right Column: Bank Info & Deposit Amount */}
                                            <div className="details-column">
                                                {/* Bank Name Card */}
                                                <div style={{
                                                    marginBottom: '1rem',
                                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                                    padding: '1rem 1.25rem',
                                                    borderRadius: '14px',
                                                    boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)'
                                                }}>
                                                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                                                        {language === 'th' ? 'ธนาคาร' : 'Bank'}
                                                    </div>
                                                    <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.05rem' }}>{l.bankName}</div>
                                                </div>

                                                {/* Account Name Card */}
                                                <div style={{
                                                    marginBottom: '1rem',
                                                    background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                                                    padding: '1rem 1.25rem',
                                                    borderRadius: '14px',
                                                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
                                                }}>
                                                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                                                        {language === 'th' ? 'ชื่อบัญชี' : 'Account Name'}
                                                    </div>
                                                    <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.05rem' }}>{l.accountName}</div>
                                                </div>

                                                {/* Deposit Amount Card */}
                                                <div style={{
                                                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                                    padding: '1.5rem',
                                                    borderRadius: '16px',
                                                    border: '1px solid #bbf7d0',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}>
                                                    {/* Decorative circle */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '-20px',
                                                        right: '-20px',
                                                        width: '80px',
                                                        height: '80px',
                                                        background: 'rgba(34, 197, 94, 0.1)',
                                                        borderRadius: '50%'
                                                    }}></div>

                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.75rem'
                                                    }}>
                                                        <span style={{ fontSize: '1.25rem' }}>💰</span>
                                                        <span style={{ fontSize: '0.95rem', color: '#166534', fontWeight: '600' }}>{l.depositAmount}</span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '3rem',
                                                        fontWeight: '800',
                                                        color: '#166534',
                                                        lineHeight: 1,
                                                        letterSpacing: '-1px'
                                                    }}>
                                                        {deposit.toLocaleString()}
                                                        <span style={{ fontSize: '1.5rem', fontWeight: '600', marginLeft: '0.5rem', color: '#22c55e' }}>THB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Upload Section - Full Width Bottom Center */}
                                        <div className="upload-container" style={{
                                            marginTop: '2rem',
                                            background: '#fff',
                                            padding: '1.5rem',
                                            borderRadius: '16px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                            maxWidth: '600px',
                                            margin: '2rem auto 0 auto'
                                        }}>
                                            <label htmlFor="paymentSlip" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '1rem',
                                                color: '#334155',
                                                fontWeight: '700',
                                                fontSize: '1.1rem'
                                            }}>
                                                <span style={{ fontSize: '1.25rem' }}>📎</span>
                                                {l.uploadSlip} <span className="required" style={{ color: '#ef4444' }}>*</span>
                                            </label>

                                            <div className="custom-file-input" style={{
                                                position: 'relative',
                                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                                padding: '2rem',
                                                borderRadius: '12px',
                                                border: formData.paymentSlip ? '2px solid #22c55e' : '2px dashed #cbd5e1',
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                {formData.paymentSlip ? (
                                                    // Show preview when file is selected
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <img
                                                            src={URL.createObjectURL(formData.paymentSlip)}
                                                            alt="Payment Slip Preview"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '200px',
                                                                borderRadius: '8px',
                                                                objectFit: 'contain',
                                                                display: 'block',
                                                                margin: '0 auto'
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setFormData(prev => ({ ...prev, paymentSlip: null }));
                                                            }}
                                                            style={{
                                                                marginTop: '1rem',
                                                                padding: '0.5rem 1rem',
                                                                background: '#fee2e2',
                                                                color: '#dc2626',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.85rem',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {language === 'th' ? '❌ เปลี่ยนไฟล์' : '❌ Change file'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // Show upload prompt when no file
                                                    <>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <span style={{ fontSize: '2.5rem' }}>📤</span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            id="paymentSlip"
                                                            name="paymentSlip"
                                                            accept="image/*"
                                                            onChange={handleChange}
                                                            required
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                opacity: 0,
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                                                            {language === 'th' ? 'คลิกหรือลากไฟล์มาที่นี่' : 'Click or drag file here'}
                                                        </p>
                                                        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                                            {language === 'th' ? 'รองรับไฟล์ .jpg หรือ .png เท่านั้น' : 'Supports .jpg or .png files'}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Account for Deposit Refund Section */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid #fde047',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <h4 style={{
                                            color: '#854d0e',
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '1rem',
                                            fontWeight: '600'
                                        }}>
                                            🏦 {l.refundBankInfo}
                                        </h4>
                                        <p style={{ fontSize: '0.85rem', color: '#a16207', marginBottom: '1rem' }}>
                                            {language === 'th' ? 'กรุณากรอกข้อมูลบัญชีธนาคารของท่านเพื่อรับเงินค่ามัดจำคืนหลังเช็คเอาท์' :
                                                language === 'cn' ? '请填写您的银行账户信息以便退房后退还押金' :
                                                    'Please provide your bank account for deposit refund after checkout'}
                                        </p>
                                        <div className="booking-form__row" style={{ marginBottom: '1rem' }}>
                                            <div className="booking-form__group">
                                                <label>{l.refundBankName}</label>
                                                <select
                                                    name="refundBankName"
                                                    value={formData.refundBankName}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0' }}
                                                >
                                                    <option value="">{language === 'th' ? '-- เลือกธนาคาร --' : '-- Select Bank --'}</option>
                                                    <option value="กรุงเทพ">ธนาคารกรุงเทพ</option>
                                                    <option value="กสิกรไทย">ธนาคารกสิกรไทย</option>
                                                    <option value="กรุงไทย">ธนาคารกรุงไทย</option>
                                                    <option value="ไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                                                    <option value="กรุงศรี">ธนาคารกรุงศรี</option>
                                                    <option value="ทหารไทยธนชาต">ธนาคารทหารไทยธนชาต</option>
                                                    <option value="ออมสิน">ธนาคารออมสิน</option>
                                                    <option value="ธ.ก.ส.">ธนาคาร ธ.ก.ส.</option>
                                                    <option value="อื่นๆ">{language === 'th' ? 'อื่นๆ' : 'Other'}</option>
                                                </select>
                                            </div>
                                            <div className="booking-form__group">
                                                <label>{l.refundAccountNumber}</label>
                                                <input
                                                    type="text"
                                                    name="refundAccountNumber"
                                                    value={formData.refundAccountNumber}
                                                    onChange={handleChange}
                                                    placeholder={language === 'th' ? 'เลขที่บัญชี 10-12 หลัก' : 'Account number'}
                                                    required
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="booking-form__group">
                                            <label>{l.refundAccountName}</label>
                                            <input
                                                type="text"
                                                name="refundAccountName"
                                                value={formData.refundAccountName}
                                                onChange={handleChange}
                                                placeholder={language === 'th' ? 'ชื่อ-นามสกุล ตามบัญชีธนาคาร' : 'Account holder name'}
                                                required
                                                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', width: '100%' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="booking-important">
                                        <h4>⚠️ {l.important}</h4>
                                        <ul>
                                            <li>{l.checkInTime}</li>
                                            <li>{l.checkOutTime}</li>
                                        </ul>
                                        <ul className="booking-critical-list">
                                            <li>* {language === 'th' ? 'การทำรายการนี้ถือเป็นการยืนยันการจองห้องพักเรียบร้อยแล้ว' : language === 'cn' ? '此交易即确认为已完成客房预订' : 'This transaction confirms your room booking'}</li>
                                            <li>* {language === 'th' ? 'กรุณาติดต่อแผนกต้อนรับเพื่อลงทะเบียนเข้าพักในวันที่กำหนด' : language === 'cn' ? '请在预定日期前往酒店前台办理入住手续' : 'Please proceed to the hotel reception for check-in on the scheduled date'}</li>
                                            <li>* {language === 'th' ? 'ไม่มีค่าธรรมเนียมในการดำเนินการจอง' : language === 'cn' ? '本次预订不收取任何服务费' : 'No booking fees or service charges apply'}</li>
                                        </ul>
                                    </div>

                                    <label className="booking-checkbox booking-checkbox--terms">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="booking-checkbox__mark"></span>
                                        <span className="booking-checkbox__label">{l.agreeTerms} <span className="required">*</span></span>
                                    </label>
                                </div>
                            )}

                            {/* Step 5: Success */}
                            {step === 5 && (
                                <div className="booking-success">
                                    <div className="booking-success__icon">✅</div>
                                    <h2 className="booking-success__title">{l.bookingSuccess}</h2>
                                    <p className="booking-success__message">{l.bookingSuccessMsg}</p>
                                    <div className="booking-success__number">
                                        <span>{l.bookingNumber}:</span>
                                        <strong>{generateBookingNumber()}</strong>
                                    </div>
                                    <div className="booking-success__details">
                                        <p><strong>{rooms.find(r => r.id === formData.roomType)?.name}</strong></p>
                                        <p>{formatDate(formData.checkIn)} → {formatDate(formData.checkOut)}</p>
                                        <p>{formData.guests} {l.person} • {formData.rooms} {l.room}</p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            {step < 5 && (
                                <div className="booking-form__actions">
                                    {step > 1 && (
                                        <button type="button" className="btn btn-outline-gold" onClick={() => setStep(step - 1)}>
                                            {l.back}
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={(step === 1 && availableRooms === 0) || (step === 4 && (!formData.agreeTerms || !formData.paymentSlip || !formData.refundBankName || !formData.refundAccountNumber || !formData.refundAccountName)) || isSubmitting}
                                        style={isSubmitting ? { opacity: 0.7, cursor: 'wait' } : {}}
                                    >
                                        {isSubmitting ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span className="spinner" style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid #ffffff',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }}></span>
                                                กำลังดำเนินการ...
                                            </span>
                                        ) : (
                                            step === 4 ? l.confirmBooking : l.next
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Booking Summary Sidebar (Only on Step 4) */}
                        {step === 4 && (
                            <div className="booking-summary">
                                <h3 className="booking-summary__title">{l.bookingSummary}</h3>

                                <div className="booking-summary__room">
                                    <img src={`/images/gallery__placeholder${formData.roomType === 'daily' ? '1' : ''}.png`} alt="Room" />
                                    <div>
                                        <h4>{rooms.find(r => r.id === formData.roomType)?.name}</h4>
                                        <span>{formData.rooms} {l.room}</span>
                                    </div>
                                </div>

                                {formData.checkIn && formData.checkOut && (
                                    <div className="booking-summary__dates">
                                        <div>
                                            <span>{l.checkIn}</span>
                                            <strong>{formatDate(formData.checkIn)}</strong>
                                        </div>
                                        <div>
                                            <span>{l.checkOut}</span>
                                            <strong>{formatDate(formData.checkOut)}</strong>
                                        </div>
                                    </div>
                                )}

                                <div className="booking-summary__line"></div>

                                <div className="booking-summary__row">
                                    <span>{l.roomCost}</span>
                                    <span>฿{basePrice.toLocaleString()}</span>
                                </div>

                                {extraCost > 0 && (
                                    <div className="booking-summary__row">
                                        <span>{l.extraServices}</span>
                                        <span>฿{extraCost.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="booking-summary__row booking-summary__subtotal">
                                    <span>{language === 'th' ? 'รวมค่าห้อง' : language === 'cn' ? '房费小计' : 'Room Subtotal'}</span>
                                    <span>฿{roomTotal.toLocaleString()}</span>
                                </div>

                                <div className="booking-summary__line"></div>

                                <div className="booking-summary__row booking-summary__deposit">
                                    <span>{language === 'th' ? 'ค่าประกันห้อง' : language === 'cn' ? '押金' : 'Room Deposit'}</span>
                                    <span>฿{deposit.toLocaleString()}</span>
                                </div>
                                <div className="booking-summary__deposit-note">
                                    {language === 'th' ? '(ได้คืนเมื่อย้ายออก)' : language === 'cn' ? '(退房时退还)' : '(Refundable on checkout)'}
                                </div>

                                <div className="booking-summary__line"></div>

                                <div className="booking-summary__row booking-summary__total">
                                    <span>{language === 'th' ? 'ค่าบริการทั้งหมด' : language === 'cn' ? '总费用' : 'Total Service Cost'}</span>
                                    <span>฿{totalPayable.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div >
            </main >

            <Footer />
        </div >
    );
};

export default DailyBooking;
