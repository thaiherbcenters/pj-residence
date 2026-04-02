import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useLanguage } from '../context/LanguageContext';
import './Booking.css';

const Booking = () => {
    const { t, language } = useLanguage();
    const location = useLocation();
    const [hasSelected, setHasSelected] = useState(false);

    const [step, setStep] = useState(1);
    const [showMonthlyDetails, setShowMonthlyDetails] = useState(false);
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
    const [formData, setFormData] = useState({
        // Step 1: Room Selection
        roomType: 'daily',
        bookingType: 'reserve', // 'viewing' = นัดดูห้อง, 'reserve' = จองมัดจำล่วงหน้า
        checkIn: '',
        checkOut: '',
        guests: 1,
        rooms: 1,

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

    useEffect(() => {
        if (location.state?.roomType) {
            setFormData(prev => ({
                ...prev,
                roomType: location.state.roomType,
                bookingType: location.state.roomType === 'monthly' ? 'viewing' : 'reserve'
            }));
            setHasSelected(true);
        }
    }, [location.state]);

    const roomTypes = {
        th: [
            {
                id: 'daily',
                name: 'ห้องพักรายวัน',
                price: 850,
                priceUnit: 'บาท/คืน',
                popular: false,
                pricing: [
                    {
                        title: null,
                        items: [
                            { label: 'ค่าประกันห้อง', value: '1,000 บาท (1 คืน)' }
                        ]
                    }
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
            },
            {
                id: 'monthly',
                name: 'ห้องพักรายเดือน',
                price: '4,500',
                priceUnit: 'บาท/เดือน',
                popular: true,
                pricing: [
                    {
                        title: 'ค่าเช่า',
                        items: [
                            { label: 'ค่าเช่า', value: '4,500 บาท/เดือน' }
                        ]
                    },
                    {
                        title: 'ค่าประกันห้อง',
                        items: [
                            { label: 'ค่าประกัน', value: '8,000 บาท' }
                        ]
                    },
                    {
                        title: 'สาธารณูปโภค',
                        items: [
                            { label: 'ค่าน้ำ', value: '18 บาท/หน่วย' },
                            { label: 'ค่าไฟ', value: '8 บาท/หน่วย' },
                            { label: 'สัญญาเช่าขั้นต่ำ', value: '6 เดือน' }
                        ]
                    }
                ],
                amenities: [
                    { label: 'WiFi', value: 'ฟรี' },
                    { label: 'เฟอร์นิเจอร์ครบครัน' },
                    { label: 'เครื่องปรับอากาศ' },

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
                    {
                        title: null,
                        items: [
                            { label: 'Room Deposit', value: '1,000 THB (1 night)' }
                        ]
                    }
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
            },
            {
                id: 'monthly',
                name: 'Monthly Room',
                price: '4,500',
                priceUnit: 'THB/month',
                popular: true,
                pricing: [
                    {
                        title: 'Rent',
                        items: [
                            { label: 'Rent', value: '4,500 THB/month' }
                        ]
                    },
                    {
                        title: 'Room Deposit',
                        items: [
                            { label: 'Deposit', value: '8,000 THB' }
                        ]
                    },
                    {
                        title: 'Utilities',
                        items: [
                            { label: 'Water', value: '18 THB/unit' },
                            { label: 'Electricity', value: '8 THB/unit' },
                            { label: 'Minimum Contract', value: '6 Months' }
                        ]
                    }
                ],
                amenities: [
                    { label: 'WiFi', value: 'Free' },
                    { label: 'Fully Furnished' },
                    { label: 'Air Conditioning' },

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
                    {
                        title: null,
                        items: [
                            { label: '押金', value: '1,000 泰铢 (1晚)' }
                        ]
                    }
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
            },
            {
                id: 'monthly',
                name: '月租房',
                price: '4,500',
                priceUnit: '泰铢/月',
                popular: true,
                pricing: [
                    {
                        title: '租金',
                        items: [
                            { label: '租金', value: '4,500 泰铢/月' }
                        ]
                    },
                    {
                        title: '房间押金',
                        items: [
                            { label: '押金', value: '8,000 泰铢' }
                        ]
                    },
                    {
                        title: '水电费',
                        items: [
                            { label: '水费', value: '18 泰铢/度' },
                            { label: '电费', value: '8 泰铢/度' },
                            { label: '最短租期', value: '6 个月' }
                        ]
                    }
                ],
                amenities: [
                    { label: 'WiFi', value: '免费' },
                    { label: '家具齐全' },
                    { label: '空调' },

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
            heroTitle: 'ระบบจองห้องพัก',
            heroDescription: 'จองห้องพักกับเราง่ายๆ เพียงไม่กี่ขั้นตอน',
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
            refundBankName: 'ชื่อธนาคาร',
            refundAccountNumber: 'เลขที่บัญชี',
            refundAccountName: 'ชื่อบัญชี',
        },
        en: {
            heroSubtitle: 'Booking',
            heroTitle: 'Room Booking System',
            heroDescription: 'Book your room with us in just a few steps',
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
            refundBankName: 'Bank Name',
            refundAccountNumber: 'Account Number',
            refundAccountName: 'Account Holder Name',
        },
        cn: {
            heroSubtitle: '预订客房',
            heroTitle: '客房预订系统',
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
            refundBankName: '银行名称',
            refundAccountNumber: '账号',
            refundAccountName: '账户名',
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
                const formDataToSend = new FormData();
                Object.keys(formData).forEach(key => {
                    if (key === 'paymentSlip') {
                        if (formData[key]) {
                            formDataToSend.append('paymentSlip', formData[key]);
                        }
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                });
                formDataToSend.append('note', formData.specialRequests);

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

    const handleViewingSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            formDataToSend.append('checkIn', formData.viewingDate);
            formDataToSend.append('note', formData.specialRequests);

            const response = await fetch('/api/notify', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();
            if (result.success) {
                setStep(5);
                window.scrollTo(0, 0);
            } else {
                alert(result.message || 'การนัดดูห้องไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
            }
        } catch (error) {
            console.error('Notify failed', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsSubmitting(false);
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
        if (formData.checkIn && formData.checkOut && formData.roomType === 'daily') {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nights = diffDays > 0 ? diffDays : 1;
        }

        // Get deposit from pricing data
        let deposit = 0;
        if (formData.roomType === 'monthly') {
            deposit = 3000; // Booking deposit
        } else {
            deposit = 1000; // 1 night deposit
        }

        if (formData.extraBed) {
            extraCost += 500;
        }

        const roomCount = parseInt(formData.rooms) || 1;
        const roomTotal = (basePrice * nights * roomCount) + (extraCost * nights * roomCount);
        const totalPayable = roomTotal + deposit;

        return { basePrice, extraCost, deposit, roomTotal, totalPayable, nights, roomCount };
    };

    const { basePrice, extraCost, deposit, roomTotal, totalPayable, nights, roomCount } = calculatePrice();

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
        <div className="booking-page">
            <Header />

            {/* Hero Banner */}
            <section className="booking-hero">
                <div className="booking-hero__overlay"></div>
                <div className="booking-hero__content">
                    <span className="booking-hero__subtitle">{l.heroSubtitle}</span>
                    <h1 className="booking-hero__title">{l.heroTitle}</h1>
                    <p className="booking-hero__description">{l.heroDescription}</p>
                </div>
            </section>

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
                        {!hasSelected ? (
                            <div className="room-selection-screen">
                                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    {language === 'th' ? 'กรุณาเลือกประเภทห้องพักที่ต้องการจอง' : language === 'cn' ? '请选择房型' : 'Please select a room type'}
                                </h2>

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
                                        textAlign: 'center',
                                        maxWidth: '500px',
                                        margin: '0 auto 1.5rem auto'
                                    }}>
                                        <p style={{ color: '#dc2626', fontWeight: '600', margin: 0 }}>
                                            {language === 'th'
                                                ? '🚫 ขณะนี้ไม่สามารถจองห้องรายวันได้เนื่องจากห้องพักเต็ม กรุณาติดต่อเจ้าหน้าที่'
                                                : '🚫 Daily room booking is currently unavailable as all rooms are occupied. Please contact staff.'}
                                        </p>
                                        <p style={{ color: '#7f1d1d', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                            📞 062-469-8935
                                        </p>
                                    </div>
                                )}

                                <div className="room-selection-cards">
                                    {/* Daily Room Option */}
                                    <div
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, roomType: 'daily' }));
                                            setHasSelected(true);
                                        }}
                                        className="room-select-card"
                                        style={{
                                            background: '#fff',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid transparent',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.15)';
                                            e.currentTarget.style.borderColor = '#d4af37';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                    >
                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                src="/images/gallery__placeholder1.webp"
                                                alt="Daily Room"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'rgba(31, 41, 55, 0.9)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '50px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                color: '#fff',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                            }}>
                                                {language === 'th' ? 'เริ่มต้น 850฿' : 'Start 850฿'}
                                            </div>
                                        </div>
                                        <div style={{ padding: '2rem' }}>
                                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#1f2937', fontWeight: '700' }}>
                                                {language === 'th' ? 'ห้องพักรายวัน' : language === 'cn' ? '日租房' : 'Daily Room'}
                                            </h3>
                                            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                                {language === 'th' ? 'เหมาะสำหรับการพักผ่อนระยะสั้น พร้อมสิ่งอำนวยความสะดวกครบครัน' : language === 'cn' ? '适合短期住宿，设施齐全' : 'Perfect for short stays with fully furnished amenities.'}
                                            </p>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.5rem 1.5rem',
                                                background: '#1f2937',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                fontWeight: '500',
                                                fontSize: '0.9rem'
                                            }}>
                                                {language === 'th' ? 'เลือกห้องนี้ ➜' : 'Select This Room ➜'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Monthly Room Option */}
                                    <div
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, roomType: 'monthly', bookingType: 'viewing' }));
                                            setHasSelected(true);
                                        }}
                                        className="room-select-card"
                                        style={{
                                            background: '#fff',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid transparent',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.15)';
                                            e.currentTarget.style.borderColor = '#d4af37';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                    >
                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                src="/images/gallery__placeholder3.webp"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/images/gallery__placeholder2.webp" }}
                                                alt="Monthly Room"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'rgba(31, 41, 55, 0.9)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '50px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                color: '#fff',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                            }}>
                                                {language === 'th' ? 'เริ่มต้น 5,000฿/เดือน' : 'Start 5,000฿/mo'}
                                            </div>
                                        </div>
                                        <div style={{ padding: '2rem' }}>
                                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#1f2937', fontWeight: '700' }}>
                                                {language === 'th' ? 'ห้องพักรายเดือน' : language === 'cn' ? '月租房' : 'Monthly Room'}
                                            </h3>
                                            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                                {language === 'th' ? 'เหมาะสำหรับการอยู่อาศัยระยะยาว บรรยากาศเงียบสงบ' : language === 'cn' ? '适合长期居住，环境安静' : 'Ideal for long-term living in a peaceful environment.'}
                                            </p>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.5rem 1.5rem',
                                                background: '#1f2937',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                fontWeight: '500',
                                                fontSize: '0.9rem'
                                            }}>
                                                {language === 'th' ? 'เลือกห้องนี้ ➜' : 'Select This Room ➜'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form className="booking-form" onSubmit={handleSubmit}>
                                {/* Step 1: Room Selection */}
                                {step === 1 && (
                                    <div className="booking-form__step">
                                        <h2 className="booking-form__title">{l.step1}</h2>

                                        <div className="booking-form__group">
                                            <label>{l.selectRoom} <span className="required">*</span></label>
                                            <div className="booking-room-options">
                                                {rooms.filter(r => r.id === formData.roomType).map(room => (
                                                    <label
                                                        key={room.id}
                                                        className={`booking-room-option ${formData.roomType === room.id ? 'booking-room-option--selected' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="roomType"
                                                            value={room.id}
                                                            checked={formData.roomType === room.id}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                if (room.id === 'monthly') {
                                                                    setFormData(prev => ({ ...prev, bookingType: 'viewing' }));
                                                                } else {
                                                                    setFormData(prev => ({ ...prev, bookingType: 'reserve' }));
                                                                }
                                                            }}
                                                        />
                                                        <div className="booking-room-option__content">
                                                            {room.popular && <span className="booking-room-option__badge">⭐ ยอดนิยม</span>}
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
                                                                {/* Pricing Section - Grouped */}
                                                                {/* Pricing Section - Grouped */}
                                                                <div className="booking-room-option__pricing-container">
                                                                    {/* Always show the first group (Rent for Monthly, or Duplicate for Daily) */}
                                                                    {room.pricing.slice(0, 1).map((group, groupIdx) => (
                                                                        <div key={`main-${groupIdx}`} className="pricing-group" style={{ marginBottom: '1.25rem' }}>
                                                                            {group.title ? (
                                                                                <h5 className="pricing-group-title" style={{
                                                                                    fontSize: '0.95rem',
                                                                                    fontWeight: '600',
                                                                                    color: '#4b5563',
                                                                                    marginBottom: '0.5rem',
                                                                                    borderBottom: '1px solid #e5e7eb',
                                                                                    paddingBottom: '0.25rem'
                                                                                }}>
                                                                                    {group.title}
                                                                                </h5>
                                                                            ) : (
                                                                                <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: '0.5rem', paddingTop: '0.5rem' }}></div>
                                                                            )}
                                                                            <ul className="booking-room-option__pricing" style={{ paddingLeft: group.title ? '0.5rem' : '0' }}>
                                                                                {group.items.map((item, idx) => (
                                                                                    <li key={idx}>
                                                                                        <span className="pricing-label">{item.label}:</span>
                                                                                        <span className="pricing-value">{item.value}</span>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    ))}

                                                                    {/* For Monthly: Show Toggle Button and Hidden Details */}
                                                                    {room.id === 'monthly' ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                className="btn-text-only"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setShowMonthlyDetails(!showMonthlyDetails);
                                                                                }}
                                                                                style={{
                                                                                    fontSize: '0.9rem',
                                                                                    color: '#c9a962',
                                                                                    textDecoration: 'underline',
                                                                                    cursor: 'pointer',
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    padding: '0',
                                                                                    marginTop: '-0.5rem',
                                                                                    marginBottom: '1rem',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '0.5rem',
                                                                                    fontWeight: '500'
                                                                                }}
                                                                            >
                                                                                {showMonthlyDetails ? (language === 'th' ? 'ซ่อนรายละเอียด' : (language === 'cn' ? '隐藏详情' : 'Hide Details')) : (language === 'th' ? 'ดูรายละเอียดเพิ่มเติม' : (language === 'cn' ? '查看详情' : 'View Details'))}
                                                                                <span style={{ transform: showMonthlyDetails ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▼</span>
                                                                            </button>

                                                                            {showMonthlyDetails && (
                                                                                <div className="monthly-extra-details" style={{ animation: 'fadeIn 0.3s' }}>
                                                                                    {room.pricing.slice(1).map((group, groupIdx) => (
                                                                                        <div key={`extra-${groupIdx}`} className="pricing-group" style={{ marginBottom: '1.25rem' }}>
                                                                                            {group.title && (
                                                                                                <h5 className="pricing-group-title" style={{
                                                                                                    fontSize: '0.95rem',
                                                                                                    fontWeight: '600',
                                                                                                    color: '#4b5563',
                                                                                                    marginBottom: '0.5rem',
                                                                                                    borderBottom: '1px solid #e5e7eb',
                                                                                                    paddingBottom: '0.25rem'
                                                                                                }}>
                                                                                                    {group.title}
                                                                                                </h5>
                                                                                            )}
                                                                                            <ul className="booking-room-option__pricing" style={{ paddingLeft: group.title ? '0.5rem' : '0' }}>
                                                                                                {group.items.map((item, idx) => (
                                                                                                    <li key={idx}>
                                                                                                        <span className="pricing-label">{item.label}:</span>
                                                                                                        <span className="pricing-value">{item.value}</span>
                                                                                                    </li>
                                                                                                ))}
                                                                                            </ul>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        /* For everything else (Daily), show the rest usually (though daily has only 1 group currently) */
                                                                        room.pricing.slice(1).map((group, groupIdx) => (
                                                                            <div key={`other-${groupIdx}`} className="pricing-group" style={{ marginBottom: '1.25rem' }}>
                                                                                {group.title ? (
                                                                                    <h5 className="pricing-group-title" style={{
                                                                                        fontSize: '0.95rem',
                                                                                        fontWeight: '600',
                                                                                        color: '#4b5563',
                                                                                        marginBottom: '0.5rem',
                                                                                        borderBottom: '1px solid #e5e7eb',
                                                                                        paddingBottom: '0.25rem'
                                                                                    }}>
                                                                                        {group.title}
                                                                                    </h5>
                                                                                ) : (
                                                                                    <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: '0.5rem', paddingTop: '0.5rem' }}></div>
                                                                                )}
                                                                                <ul className="booking-room-option__pricing" style={{ paddingLeft: group.title ? '0.5rem' : '0' }}>
                                                                                    {group.items.map((item, idx) => (
                                                                                        <li key={idx}>
                                                                                            <span className="pricing-label">{item.label}:</span>
                                                                                            <span className="pricing-value">{item.value}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>

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



                                        {/* Monthly Booking Type Toggle - REMOVED as per request to have only Viewing for Monthly */}
                                        {/* {formData.roomType === 'monthly' && ( ... ) } */}

                                        {/* Daily Room OR Monthly with Reserve - Show full booking form */}
                                        {(formData.roomType === 'daily' || (formData.roomType === 'monthly' && formData.bookingType === 'reserve')) && (
                                            <>
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
                                                        <label htmlFor="checkOut">{formData.roomType === 'monthly' ? (language === 'th' ? 'ระยะเวลาเช่า' : language === 'cn' ? '租期' : 'Rental Period') : l.checkOut} <span className="required">*</span></label>
                                                        {formData.roomType === 'monthly' ? (
                                                            <select id="checkOut" name="rentalPeriod" value={formData.rentalPeriod || '6'} onChange={handleChange}>
                                                                <option value="6">{language === 'th' ? '6 เดือน' : language === 'cn' ? '6个月' : '6 months'}</option>
                                                                <option value="12">{language === 'th' ? '12 เดือน' : language === 'cn' ? '12个月' : '12 months'}</option>
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type="date"
                                                                id="checkOut"
                                                                name="checkOut"
                                                                value={formData.checkOut}
                                                                onChange={handleChange}
                                                                required
                                                                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="booking-form__row">
                                                    <div className="booking-form__group">
                                                        <label htmlFor="guests">{l.guests}</label>
                                                        <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
                                                            {[1, 2, 3, 4].map(n => (
                                                                <option key={n} value={n}>{n} {l.person}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="booking-form__group">
                                                        <label htmlFor="rooms">{l.rooms}</label>
                                                        <select id="rooms" name="rooms" value={formData.rooms} onChange={handleChange}>
                                                            {[1, 2, 3].map(n => (
                                                                <option key={n} value={n}>{n} {l.room}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Monthly with Viewing - Simplified form */}
                                        {formData.roomType === 'monthly' && formData.bookingType === 'viewing' && (
                                            <div className="booking-viewing-form">
                                                <div className="booking-viewing-info">
                                                    <span className="booking-viewing-icon">📅</span>
                                                    <p>{language === 'th' ? 'กรุณาเลือกวันที่สะดวกเข้าชมห้องพัก เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันนัดหมาย' : language === 'cn' ? '请选择方便参观的日期，工作人员会与您联系确认预约' : 'Please select a convenient date to visit. Our staff will contact you to confirm the appointment.'}</p>
                                                </div>
                                                <div className="booking-form__row">
                                                    <div className="booking-form__group">
                                                        <label htmlFor="viewingDate">{language === 'th' ? 'วันที่ต้องการเข้าชม' : language === 'cn' ? '预约看房日期' : 'Preferred Viewing Date'} <span className="required">*</span></label>
                                                        <input
                                                            type="date"
                                                            id="viewingDate"
                                                            name="viewingDate"
                                                            value={formData.viewingDate || ''}
                                                            onChange={handleChange}
                                                            required
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                    </div>
                                                    <div className="booking-form__group">
                                                        <label htmlFor="viewingTime">{language === 'th' ? 'ช่วงเวลาที่สะดวก' : language === 'cn' ? '方便的时间段' : 'Preferred Time'}</label>
                                                        <select id="viewingTime" name="viewingTime" value={formData.viewingTime || 'morning'} onChange={handleChange}>
                                                            <option value="morning">{language === 'th' ? 'เช้า (09:00 - 12:00)' : language === 'cn' ? '上午 (09:00 - 12:00)' : 'Morning (09:00 - 12:00)'}</option>
                                                            <option value="afternoon">{language === 'th' ? 'บ่าย (13:00 - 17:00)' : language === 'cn' ? '下午 (13:00 - 17:00)' : 'Afternoon (13:00 - 17:00)'}</option>
                                                            <option value="evening">{language === 'th' ? 'เย็น (17:00 - 19:00)' : language === 'cn' ? '傍晚 (17:00 - 19:00)' : 'Evening (17:00 - 19:00)'}</option>
                                                        </select>
                                                    </div>
                                                </div>


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
                                                            placeholder={language === 'th' ? 'ชื่อจริง' : language === 'cn' ? '名' : 'First name'}
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
                                                            placeholder={language === 'th' ? 'นามสกุล' : language === 'cn' ? '姓' : 'Last name'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="booking-form__row">
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
                                                    <div className="booking-form__group">
                                                        <label htmlFor="email">{l.email}</label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="email@example.com"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
                                        <h2 className="booking-form__title">
                                            {formData.roomType === 'monthly'
                                                ? (language === 'th' ? 'ข้อมูลเพิ่มเติม' : language === 'cn' ? '附加信息' : 'Additional Information')
                                                : l.step3}
                                        </h2>

                                        {/* Daily Room - Arrival Time & Services */}
                                        {formData.roomType === 'daily' && (
                                            <>
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
                                            </>
                                        )}

                                        {/* Monthly Room - Move-in Details */}
                                        {formData.roomType === 'monthly' && (
                                            <>
                                                <div className="booking-form__group">
                                                    <label htmlFor="moveInTime">{language === 'th' ? 'เวลาที่ต้องการเข้าพัก' : language === 'cn' ? '入住时间' : 'Preferred Move-in Time'}</label>
                                                    <select id="moveInTime" name="moveInTime" value={formData.moveInTime || '10:00'} onChange={handleChange}>
                                                        {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="booking-form__group">
                                                    <label htmlFor="occupation">{language === 'th' ? 'อาชีพ' : language === 'cn' ? '职业' : 'Occupation'}</label>
                                                    <select id="occupation" name="occupation" value={formData.occupation || 'employee'} onChange={handleChange}>
                                                        <option value="employee">{language === 'th' ? 'พนักงานบริษัท' : language === 'cn' ? '公司员工' : 'Company Employee'}</option>
                                                        <option value="student">{language === 'th' ? 'นักศึกษา' : language === 'cn' ? '学生' : 'Student'}</option>
                                                        <option value="freelance">{language === 'th' ? 'ฟรีแลนซ์' : language === 'cn' ? '自由职业' : 'Freelancer'}</option>
                                                        <option value="business">{language === 'th' ? 'เจ้าของกิจการ' : language === 'cn' ? '企业主' : 'Business Owner'}</option>
                                                        <option value="other">{language === 'th' ? 'อื่นๆ' : language === 'cn' ? '其他' : 'Other'}</option>
                                                    </select>
                                                </div>

                                                <div className="booking-form__group">
                                                    <label htmlFor="workplace">{language === 'th' ? 'สถานที่ทำงาน/เรียน' : language === 'cn' ? '工作/学习地点' : 'Workplace/School'}</label>
                                                    <input
                                                        type="text"
                                                        id="workplace"
                                                        name="workplace"
                                                        value={formData.workplace || ''}
                                                        onChange={handleChange}
                                                        placeholder={language === 'th' ? 'ชื่อบริษัท หรือ มหาวิทยาลัย' : language === 'cn' ? '公司或大学名称' : 'Company or University name'}
                                                    />
                                                </div>

                                                <div className="booking-form__group">
                                                    <label htmlFor="emergencyContact">{language === 'th' ? 'ผู้ติดต่อฉุกเฉิน (ชื่อ + เบอร์โทร)' : language === 'cn' ? '紧急联系人 (姓名 + 电话)' : 'Emergency Contact (Name + Phone)'}</label>
                                                    <input
                                                        type="text"
                                                        id="emergencyContact"
                                                        name="emergencyContact"
                                                        value={formData.emergencyContact || ''}
                                                        onChange={handleChange}
                                                        placeholder={language === 'th' ? 'ชื่อ - 08X-XXX-XXXX' : language === 'cn' ? '姓名 - 08X-XXX-XXXX' : 'Name - 08X-XXX-XXXX'}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="booking-form__group">
                                            <label htmlFor="specialRequests">{l.specialRequests}</label>
                                            <textarea
                                                id="specialRequests"
                                                name="specialRequests"
                                                value={formData.specialRequests}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder={formData.roomType === 'monthly'
                                                    ? (language === 'th' ? 'ความต้องการพิเศษ เช่น ต้องการห้องชั้นใด, มีสัตว์เลี้ยงหรือไม่' : 'Special requirements such as preferred floor, pets, etc.')
                                                    : ''}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Payment / Confirmation */}
                                {step === 4 && (
                                    <div className="booking-form__step">
                                        <h2 className="booking-form__title">
                                            {formData.roomType === 'monthly'
                                                ? (language === 'th' ? 'ยืนยันการจองมัดจำ' : language === 'cn' ? '确认押金预订' : 'Confirm Deposit Reservation')
                                                : l.step4}
                                        </h2>

                                        {/* Monthly - Deposit Payment Info */}
                                        {formData.roomType === 'monthly' && (
                                            <div className="booking-deposit-info">
                                                <div className="booking-deposit-summary">
                                                    <h4>{language === 'th' ? 'สรุปค่าใช้จ่าย' : language === 'cn' ? '费用摘要' : 'Cost Summary'}</h4>

                                                    <div className="booking-deposit-section">
                                                        <div className="booking-deposit-label">{language === 'th' ? '💳 ชำระวันนี้ (มัดจำจองห้อง)' : language === 'cn' ? '💳 今日支付 (订金)' : '💳 Pay Today (Booking Deposit)'}</div>
                                                        <div className="booking-deposit-row booking-deposit-highlight">
                                                            <span>{language === 'th' ? 'มัดจำจองห้อง' : language === 'cn' ? '订金' : 'Reservation Deposit'}</span>
                                                            <span>฿3,000</span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-deposit-section">
                                                        <div className="booking-deposit-label">{language === 'th' ? '🏠 ชำระวันทำสัญญา' : language === 'cn' ? '🏠 签约日支付' : '🏠 Pay on Contract Day'}</div>
                                                        <div className="booking-deposit-row">
                                                            <span>{language === 'th' ? 'ค่าห้องพัก (เดือนแรก)' : language === 'cn' ? '首月房租' : 'First Month Rent'}</span>
                                                            <span>฿4,500</span>
                                                        </div>
                                                        <div className="booking-deposit-row">
                                                            <span>{language === 'th' ? 'ค่าประกันห้อง' : language === 'cn' ? '押金' : 'Security Deposit'}</span>
                                                            <span>฿8,000</span>
                                                        </div>
                                                        <div className="booking-deposit-row">
                                                            <span>{language === 'th' ? 'หักมัดจำจอง' : language === 'cn' ? '减去订金' : 'Less Reservation Deposit'}</span>
                                                            <span>-฿3,000</span>
                                                        </div>
                                                        <div className="booking-deposit-row booking-deposit-subtotal">
                                                            <span>{language === 'th' ? 'ยอดชำระวันทำสัญญา' : language === 'cn' ? '签约日应付' : 'Balance Due on Contract Day'}</span>
                                                            <span>฿9,500</span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-deposit-row booking-deposit-total">
                                                        <span>{language === 'th' ? 'รวมทั้งหมด' : language === 'cn' ? '总计' : 'Grand Total'}</span>
                                                        <span>฿12,500</span>
                                                    </div>
                                                </div>
                                                <p className="booking-deposit-note">
                                                    {language === 'th'
                                                        ? '* มัดจำ ฿3,000 จะหักจากค่าใช้จ่ายในวันทำสัญญา | ค่าประกันห้องจะได้รับคืนเมื่อย้ายออกและห้องอยู่ในสภาพดี'
                                                        : language === 'cn'
                                                            ? '* 订金 ฿3,000 将从签约日费用中扣除 | 押金在退房时如房间状况良好将予以退还'
                                                            : '* The ฿3,000 deposit will be deducted from your contract day payment | Security deposit is refundable upon checkout if room is in good condition'}
                                                </p>
                                            </div>
                                        )}

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
                                                            {formData.roomType === 'monthly'
                                                                ? '3,000'
                                                                : deposit.toLocaleString()
                                                            }
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

                                        {/* Payment Method section removed as per request */}

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
                                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d0d0d0', width: '100%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="booking-important">
                                            <h4>⚠️ {l.important}</h4>
                                            {formData.roomType === 'monthly' ? (
                                                <>
                                                    <ul>
                                                        <li>{language === 'th' ? 'กรุณานำบัตรประชาชนตัวจริงมาในวันทำสัญญา' : language === 'cn' ? '签约当天请携带有效身份证件' : 'Please bring your ID card on contract signing day'}</li>
                                                        <li>{language === 'th' ? 'สัญญาเช่าขั้นต่ำ 6 เดือน' : language === 'cn' ? '最短租期6个月' : 'Minimum rental contract is 6 months'}</li>
                                                        <li>{language === 'th' ? 'เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง' : language === 'cn' ? '工作人员将在24小时内与您联系' : 'Our staff will contact you within 24 hours'}</li>
                                                    </ul>
                                                    <ul className="booking-critical-list">
                                                        <li>* {language === 'th' ? 'การทำรายการนี้ถือเป็นการยืนยันการจองห้องพักเรียบร้อยแล้ว' : language === 'cn' ? '此交易即确认为已完成客房预订' : 'This transaction confirms your room booking'}</li>
                                                        <li>* {language === 'th' ? 'กรุณาติดต่อแผนกต้อนรับเพื่อลงทะเบียนเข้าพักในวันที่กำหนด' : language === 'cn' ? '请在预定日期前往酒店前台办理入住手续' : 'Please proceed to the hotel reception for check-in on the scheduled date'}</li>
                                                        <li>* {language === 'th' ? 'ไม่มีค่าธรรมเนียมในการดำเนินการจอง' : language === 'cn' ? '本次预订不收取任何服务费' : 'No booking fees or service charges apply'}</li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <>
                                                    <ul>
                                                        <li>{l.checkInTime}</li>
                                                        <li>{l.checkOutTime}</li>
                                                    </ul>
                                                    <ul className="booking-critical-list">
                                                        <li>* {language === 'th' ? 'การทำรายการนี้ถือเป็นการยืนยันการจองห้องพักเรียบร้อยแล้ว' : language === 'cn' ? '此交易即确认为已完成客房预订' : 'This transaction confirms your room booking'}</li>
                                                        <li>* {language === 'th' ? 'กรุณาติดต่อแผนกต้อนรับเพื่อลงทะเบียนเข้าพักในวันที่กำหนด' : language === 'cn' ? '请在预定日期前往酒店前台办理入住手续' : 'Please proceed to the hotel reception for check-in on the scheduled date'}</li>
                                                        <li>* {language === 'th' ? 'ไม่มีค่าธรรมเนียมในการดำเนินการจอง' : language === 'cn' ? '本次预订不收取任何服务费' : 'No booking fees or service charges apply'}</li>
                                                    </ul>
                                                </>
                                            )}
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

                                        {/* Viewing Success */}
                                        {formData.roomType === 'monthly' && formData.bookingType === 'viewing' ? (
                                            <>
                                                <h2 className="booking-success__title">
                                                    {language === 'th' ? 'ส่งคำขอนัดดูห้องเรียบร้อย!' : language === 'cn' ? '预约请求已提交！' : 'Viewing Request Submitted!'}
                                                </h2>
                                                <p className="booking-success__message">
                                                    {language === 'th' ? 'เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมงเพื่อยืนยันนัดหมาย' : language === 'cn' ? '工作人员将在24小时内与您联系确认预约' : 'Our staff will contact you within 24 hours to confirm your appointment.'}
                                                </p>
                                                <div className="booking-success__number">
                                                    <span>{language === 'th' ? 'หมายเลขนัดหมาย' : language === 'cn' ? '预约编号' : 'Appointment No.'}:</span>
                                                    <strong>VW{Date.now().toString().slice(-8)}</strong>
                                                </div>
                                                <div className="booking-success__details">
                                                    <p><strong>{rooms.find(r => r.id === formData.roomType)?.name}</strong></p>
                                                    <p>📅 {formData.viewingDate} • {formData.viewingTime === 'morning' ? (language === 'th' ? 'เช้า' : 'Morning') : formData.viewingTime === 'afternoon' ? (language === 'th' ? 'บ่าย' : 'Afternoon') : (language === 'th' ? 'เย็น' : 'Evening')}</p>
                                                    <p>👤 {formData.firstName} {formData.lastName}</p>
                                                    <p>📱 {formData.phone}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="booking-success__title">{l.bookingSuccess}</h2>
                                                <p className="booking-success__message">{l.bookingSuccessMsg}</p>
                                                <div className="booking-success__number">
                                                    <span>{l.bookingNumber}:</span>
                                                    <strong>{generateBookingNumber()}</strong>
                                                </div>
                                                <div className="booking-success__details">
                                                    <p><strong>{rooms.find(r => r.id === formData.roomType)?.name}</strong></p>
                                                    <p>{formData.checkIn} → {formData.roomType === 'monthly' ? (language === 'th' ? `${formData.rentalPeriod || 6} เดือน` : `${formData.rentalPeriod || 6} months`) : formData.checkOut}</p>
                                                    <p>{formData.guests} {l.person} • {formData.rooms} {l.room}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                {step < 5 && (
                                    <div className="booking-form__actions">
                                        {step === 1 && (
                                            <button type="button" className="btn btn-outline-gold" onClick={() => {
                                                setHasSelected(false);
                                                window.scrollTo(0, 0);
                                            }}>
                                                {l.back}
                                            </button>
                                        )}
                                        {step > 1 && (
                                            <button type="button" className="btn btn-outline-gold" onClick={() => {
                                                setStep(step - 1);
                                                window.scrollTo(0, 0);
                                            }}>
                                                {l.back}
                                            </button>
                                        )}

                                        {/* For Monthly Viewing - Submit directly from Step 1 */}
                                        {formData.roomType === 'monthly' && formData.bookingType === 'viewing' && step === 1 ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleViewingSubmit}
                                            >
                                                {language === 'th' ? 'ส่งคำขอนัดดูห้อง' : language === 'cn' ? '提交预约' : 'Submit Viewing Request'}
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={(step === 1 && formData.roomType === 'daily' && availableRooms === 0) || (step === 4 && (!formData.agreeTerms || !formData.paymentSlip || !formData.refundBankName || !formData.refundAccountNumber || !formData.refundAccountName)) || isSubmitting}
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
                                        )}
                                    </div>
                                )}
                            </form>
                        )}

                        {/* Booking Summary Sidebar (Only on Step 4: Confirmation) */}
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
                                            <strong>{formData.checkIn}</strong>
                                        </div>
                                        <div>
                                            <span>{l.checkOut}</span>
                                            <strong>{formData.checkOut}</strong>
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
                                    <span>{language === 'th' ? 'ค่าบริการทั้งหมด' : language === 'cn' ? '总费用' : 'Total Cost'}</span>
                                    <span>฿{totalPayable.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Booking;
