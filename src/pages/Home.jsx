import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local image
import imgPhoneMockup from '../assets/homepage/Mercy_Mini_Store.png';

// Image assets from Figma
const imgLogo = "https://www.figma.com/api/mcp/asset/8883f7ec-b2ee-455c-90fa-4e0e753246c8";
const imgShoppingCart = "https://www.figma.com/api/mcp/asset/c196b1f5-0b9d-48b6-bbf3-eca799630b35";
const imgStoreIcon = "https://www.figma.com/api/mcp/asset/6ed0198f-8a46-42e2-b1db-b2864d5d9e25";
const imgServicesPhone = "https://www.figma.com/api/mcp/asset/e4bb6d12-3e35-48b6-ab6d-e2ff65e16660";
const imgGlobe = "https://www.figma.com/api/mcp/asset/09e8bbcc-2347-419f-b9f4-ce203388ee3b";
const imgRocket = "https://www.figma.com/api/mcp/asset/7b733e24-cb92-4740-98a6-bba3b44ee057";
const imgPackageIcon = "https://www.figma.com/api/mcp/asset/f0696107-64f3-4c26-a7d5-bec4fa6b2515";
const imgScanIcon = "https://www.figma.com/api/mcp/asset/5bcd8bf0-c4aa-4cb8-aeb5-2aecc182ec2c";
const imgChartIcon = "https://www.figma.com/api/mcp/asset/643ade5f-15df-4ec0-a09e-2469c15114e5";
const imgBellIcon = "https://www.figma.com/api/mcp/asset/0334d997-4da4-4b22-9e1e-24750e7cb241";
const imgLinkedin = "https://www.figma.com/api/mcp/asset/3182a5ab-936f-4bd6-8b7f-8e7a22f2a45e";
const imgInstagram = "https://www.figma.com/api/mcp/asset/3c6df939-da0d-4da9-9fd0-90657ccb30ee";
const imgFacebook = "https://www.figma.com/api/mcp/asset/7c39ade0-1b6a-4bda-8dba-b0522bdcab0b";

function Home() {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('Overview');

    const navItems = ['Overview', 'Services', 'Reviews', 'Contact'];

    const services = [
        {
            icon: imgPackageIcon,
            title: 'Inventory',
            subtitle: 'Control'
        },
        {
            icon: imgScanIcon,
            title: 'Easy',
            subtitle: 'Point of Sale'
        },
        {
            icon: imgBellIcon,
            title: 'Low Stock',
            subtitle: 'Alerts'
        },
        {
            icon: imgChartIcon,
            title: 'Sales',
            subtitle: 'Insights'
        }
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Reviews Carousel State
    const [currentReview, setCurrentReview] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [startPos, setStartPos] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const cardRef = useRef(null);

    const reviews = [
        {
            name: "Mercedes Lim",
            role: "Owner - Mercy Store",
            text: "KaaBUY completely changed how I manage my store. I can now track inventory in real time, organize products by category, and receive alerts before items run out."
        },
        {
            name: "Juan dela Cruz",
            role: "Owner - JD Store",
            text: "The Point of Sale system is so easy to use! My sales processing is much faster now, and my customers are happy with the quick service."
        },
        {
            name: "Maria Santos",
            role: "Owner - Santos Mart",
            text: "I love the low stock alerts. I never run out of best-selling items anymore. It's like having a smart assistant for my business."
        },
        {
            name: "Aling Nena",
            role: "Owner - Nena's Sari-Sari",
            text: "Dati ang hirap maglista ng utang. Ngayon may record na lahat sa KaaBUY! Hindi na ako nalilito kung sino ang may balance pa."
        },
        {
            name: "Mang Boy",
            role: "Owner - Boy's Corner",
            text: "Start-up pa lang tindahan ko pero professional na tingnan dahil sa receipts. Ang bilis din mag inventory, scan lang ng scan!"
        },
        {
            name: "Susan Reyes",
            role: "Owner - Susan's Minimart",
            text: "The analytics feature helps me know which products to restock. My profit increased by 30% because I always have what customers need."
        }
    ];

    const nextReview = () => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const getReviewIndex = (offset) => {
        return (currentReview + offset + reviews.length) % reviews.length;
    };

    // Drag Handlers
    const handleDragStart = (clientX) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartPos(clientX);
    };

    const handleDragMove = (clientX) => {
        if (!isDragging) return;
        const currentPosition = clientX;
        const diff = currentPosition - startPos;
        setCurrentTranslate(diff);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 50; // Simple pixel threshold

        if (currentTranslate < -threshold) {
            // Swiped left - go to next
            nextReview();
        } else if (currentTranslate > threshold) {
            // Swiped right - go to previous
            prevReview();
        }

        // Reset translate - the CSS transition will animate smoothly
        setCurrentTranslate(0);
    };

    // Touch Events
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();

    // Mouse Events
    const onMouseDown = (e) => handleDragStart(e.clientX);
    const onMouseMove = (e) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onMouseLeave = () => {
        if (isDragging) handleDragEnd();
    };

    // Calculate dynamic styles for side cards
    const getCardStyle = (position) => {
        // -1 = Left, 0 = Center, 1 = Right
        if (!cardRef.current) return {};
        const cardWidth = cardRef.current.offsetWidth + 24;
        const progress = currentTranslate / cardWidth;

        // Interpolate scale and opacity
        let targetScale = 0.95; // Subtler resizing
        let targetOpacity = 0.7; // Subtler fading


        if (position === 0) {
            targetScale = 1 - Math.abs(progress) * 0.05;
            targetOpacity = 1 - Math.abs(progress) * 0.3;
        } else if (position === -1) { // Prev
            if (progress > 0) {
                targetScale = 0.95 + progress * 0.05;
                targetOpacity = 0.7 + progress * 0.3;
            }
        } else if (position === 1) { // Next
            if (progress < 0) {
                targetScale = 0.95 + Math.abs(progress) * 0.05;
                targetOpacity = 0.7 + Math.abs(progress) * 0.3;
            }
        }

        return {
            transform: `scale(${Math.max(0.9, Math.min(1, targetScale))})`,
            opacity: Math.max(0.4, Math.min(1, targetOpacity))
        };
    };

    return (
        <div className="bg-white min-h-screen font-outfit overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-white z-50 h-[100px] flex items-center px-10 shadow-sm">
                <div className="flex items-center gap-4 w-[188px]">
                    <img src={imgLogo} alt="KaaBUY Logo" className="h-[77px] w-[88px] object-contain" />
                    <h1 className="font-league font-semibold text-[26px] text-black">
                        Kaa<span className="text-[#ff6a3e]">BUY</span>
                    </h1>
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-[70px]">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    setActiveNav(item);
                                    scrollToSection(item.toLowerCase());
                                }}
                                className={`font-medium text-[18px] transition-colors ${activeNav === item ? 'text-[#ff6a3e]' : 'text-black hover:text-[#ff6a3e]'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => navigate('/register')}
                    className="bg-[#ff6a3e] text-white font-medium text-[20px] px-[22px] py-[10px] rounded-lg hover:bg-[#e55a30] transition-colors"
                >
                    Register
                </button>
            </nav>

            {/* Hero Section */}
            <section id="overview" className="bg-[#f7f7f7] pt-[100px] min-h-screen relative overflow-hidden">
                {/* Orange Circle Ring */}
                <div
                    className="absolute right-[-100px] top-[130px] w-[964px] h-[964px] rounded-full border-[130px] border-[#ffb89c] opacity-50"
                />

                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[175px] relative">
                    <div className="flex justify-between items-start">
                        {/* Left Content */}
                        <div className="max-w-[819px] z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[rgba(255,106,62,0.2)] px-4 py-1.5 rounded">
                                <span className="font-medium text-[16px] text-[#ff6a3e]">Sari-Sari Store Ready</span>
                                <img src={imgStoreIcon} alt="" className="w-6 h-6" />
                            </div>

                            {/* Headline */}
                            <div className="mt-8">
                                <p className="font-light text-[50px] text-black leading-tight">
                                    We simplify <span className="text-[#ff6a3e]">income</span>
                                </p>
                                <h2 className="font-bold text-black leading-none">
                                    <span className="text-[96px]">in</span>
                                    <span className="text-[128px] font-medium"> Kaa<span className="text-[#ff6a3e]">BUY.</span></span>
                                </h2>
                            </div>

                            {/* Subheadline */}
                            <p className="font-league font-normal text-[32px] text-black mt-4 max-w-[643px]">
                                The all in one sari-sari store app that grows your income.
                            </p>

                            {/* CTA Button */}
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-8 bg-[#ff6a3e] text-white font-medium text-[20px] px-[24px] py-[14px] rounded-lg hover:bg-[#e55a30] transition-colors"
                            >
                                Manage your Store
                            </button>

                            {/* Follow Us */}
                            <div className="mt-[100px]">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[18px] text-[#ff6a3e]">Follow Us</span>
                                    <div className="w-[112px] h-[2px] bg-[#ff6a3e]" />
                                </div>
                                <div className="flex items-center gap-[46px] mt-8">
                                    <a href="#" className="bg-[#ff6a3e] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#e55a30] transition-colors">
                                        <img src={imgLinkedin} alt="LinkedIn" className="w-4 h-4" />
                                    </a>
                                    <a href="#" className="bg-[#ff6a3e] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#e55a30] transition-colors">
                                        <img src={imgInstagram} alt="Instagram" className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="bg-[#ff6a3e] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#e55a30] transition-colors">
                                        <img src={imgFacebook} alt="Facebook" className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Phone Mockup */}
                        <div className="absolute right-[50px] top-[100px] z-10">
                            <div className="relative">
                                <img
                                    src={imgPhoneMockup}
                                    alt="Phone Mockup"
                                    className="w-[432px] h-auto"
                                />
                                <img
                                    src={imgShoppingCart}
                                    alt="Shopping Basket"
                                    className="absolute -bottom-[50px] -right-[100px] w-[350px] h-auto rotate-[-8deg]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-white py-20 relative overflow-hidden">
                {/* Orange Circle Ring */}
                <div
                    className="absolute -left-[100px] top-[35px] w-[500px] h-[500px] rounded-full border-[70px] border-[#ffb89c] opacity-40"
                />

                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] relative">
                    <div className="flex items-start gap-20">
                        {/* Left - Phone Image */}
                        <div className="flex-shrink-0 z-10">
                            <img
                                src={imgServicesPhone}
                                alt="Services"
                                className="w-[753px] h-[753px] object-contain"
                            />
                        </div>

                        {/* Right - Content */}
                        <div className="flex-1 pt-[77px]">
                            {/* Badge */}
                            <div className="inline-flex items-center bg-[rgba(255,106,62,0.2)] px-4 py-1.5 rounded">
                                <span className="font-medium text-[18px] text-[#ff6a3e]">OUR SERVICES</span>
                            </div>

                            {/* Headline */}
                            <p className="font-light text-[44px] text-black mt-4">
                                We extend our <span className="text-[#ff6a3e]">services</span>
                            </p>
                            <p className="font-medium text-[62px] text-black leading-tight">
                                to all <span className="text-[#ff6a3e]">sari-sari </span>stores
                            </p>

                            {/* Description */}
                            <p className="font-normal text-[20px] text-black mt-6 max-w-[562px]">
                                At KaaBUY, we provide smart, efficient, and user-friendly tools designed to help small business owners manage their stores with confidence.
                            </p>

                            {/* Service Cards Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-12">
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-[#ff6a3e] rounded-xl p-4 w-[254px] h-[164px] flex items-center gap-3 hover:shadow-lg transition-shadow"
                                    >
                                        <img src={service.icon} alt="" className="w-[80px] h-[80px] object-contain" />
                                        <div>
                                            <p className="font-normal text-[24px] text-black leading-tight">{service.title}</p>
                                            <p className="font-normal text-[24px] text-[#ff6a3e] leading-tight">{service.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reach Section */}
            <section className="bg-[#f7f7f7] py-20 relative overflow-hidden">
                {/* Orange Circle Ring */}
                <div
                    className="absolute right-[100px] top-0 w-[500px] h-[500px] rounded-full border-[70px] border-[#ffb89c] opacity-40"
                />

                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] relative">
                    <div className="flex items-center gap-10">
                        {/* Left - Content */}
                        <div className="flex-1 z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center bg-[rgba(255,106,62,0.2)] px-4 py-1.5 rounded">
                                <span className="font-medium text-[18px] text-[#ff6a3e]">OUR REACH</span>
                            </div>

                            {/* Headline */}
                            <p className="font-light text-[48px] text-black mt-4">
                                We are <span className="text-[#ff6a3e]">present</span>
                            </p>
                            <p className="font-medium text-[68px] text-black leading-tight">
                                all over the
                            </p>
                            <p className="font-medium text-[170px] text-[#ff6a3e] leading-none">
                                world.
                            </p>

                            {/* Description */}
                            <p className="font-normal text-[20px] text-black mt-6 max-w-[515px]">
                                KaaBUY is built to serve sari-sari stores worldwide. Our platform allows store owners to manage inventory, monitor products, and grow without limitations—keeping you connected and in control wherever you operate.
                            </p>
                        </div>

                        {/* Right - Globe Image */}
                        <div className="relative z-10">
                            <img
                                src={imgGlobe}
                                alt="Globe"
                                className="w-[838px] h-[838px] object-contain ml-[150px]"
                            />
                            <img
                                src={imgRocket}
                                alt="Rocket"
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[287px] h-[287px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section - Updated */}
            <section id="reviews" className="bg-[#f7f7f7] py-20 select-none overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center bg-[rgba(255,106,62,0.2)] px-4 py-1.5 rounded">
                        <span className="font-medium text-[18px] text-[#ff6a3e]">REVIEWS</span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-medium text-[40px] md:text-[70px] text-black mt-4 leading-tight">
                        What <span className="text-[#ff6a3e]">people</span> say about us!
                    </h2>

                    {/* Subheadline */}
                    <p className="font-normal text-[18px] md:text-[21.5px] text-black mt-4">
                        Why sari-sari store owners choose KaaBUY as their trusted partner in smarter selling.
                    </p>

                    {/* Review Cards Carousel */}
                    <div
                        className="relative mt-16 h-[300px] flex justify-center items-center cursor-grab active:cursor-grabbing"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                    >
                        {/* Track */}
                        <div
                            className="flex items-center justify-center gap-6 w-max"
                            style={{
                                transform: `translateX(${currentTranslate}px)`,
                                transition: isDragging ? 'none' : 'transform 0.4s ease-out'
                            }}
                        >
                            {/* Left Card (Previous) */}
                            <div
                                style={getCardStyle(-1)}
                                className="w-[300px] md:w-[428px] h-[300px] border-2 border-[#ff6a3e] rounded-2xl bg-white/50 transition-all duration-0"
                            >
                                <div className="p-8 h-full flex items-center justify-center">
                                    <p className="text-black/40 text-lg line-clamp-4 select-none pointer-events-none">{reviews[getReviewIndex(-1)].text}</p>
                                </div>
                            </div>

                            {/* Center Card (Active) */}
                            <div
                                ref={cardRef}
                                style={getCardStyle(0)}
                                className="w-[300px] md:w-[428px] h-[300px] border-2 border-[#ff6a3e] rounded-2xl shadow-lg relative overflow-hidden bg-white z-10 transition-all duration-0"
                            >
                                <p className="font-extralight text-[160px] text-[#ff6a3e] absolute -top-4 left-4 leading-none select-none pointer-events-none">"</p>
                                <div className="pt-24 px-8 h-full flex flex-col">
                                    <p className="font-normal text-[16px] md:text-[20px] text-black text-center line-clamp-4 select-none pointer-events-none">
                                        {reviews[currentReview].text}
                                    </p>
                                    <div className="mt-auto pb-8">
                                        <p className="font-medium text-[20px] text-[#ff6a3e] text-center select-none pointer-events-none">
                                            {reviews[currentReview].name}
                                        </p>
                                        <p className="font-normal text-[14px] text-black/60 text-center select-none pointer-events-none">
                                            {reviews[currentReview].role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Card (Next) */}
                            <div
                                style={getCardStyle(1)}
                                className="w-[300px] md:w-[428px] h-[300px] border-2 border-[#ff6a3e] rounded-2xl bg-white/50 transition-all duration-0"
                            >
                                <div className="p-8 h-full flex items-center justify-center">
                                    <p className="text-black/40 text-lg line-clamp-4 select-none pointer-events-none">{reviews[getReviewIndex(1)].text}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-3 mt-10">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentReview(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentReview === index ? 'bg-[#ff6a3e] scale-125' : 'bg-[#ff6a3e]/30 hover:bg-[#ff6a3e]/50'
                                    }`}
                                aria-label={`Go to review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Start CTA Section */}
            <section className="bg-[#f7f7f7] py-20">
                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center bg-[rgba(255,106,62,0.2)] px-4 py-1.5 rounded">
                        <span className="font-medium text-[18px] text-[#ff6a3e]">START</span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-medium text-[70px] text-black mt-4">
                        Time to <span className="text-[#ff6a3e]">shoot</span> your income <span className="text-[#ff6a3e]">upwards!</span>
                    </h2>

                    {/* Subheadline */}
                    <p className="font-normal text-[21.5px] text-black mt-4">
                        Smarter inventory. Faster sales. Better profits.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate('/register')}
                        className="mt-12 bg-[#ff6a3e] text-white font-medium text-[40px] px-[24px] py-[14px] rounded-[40px] w-[384px] h-[137px] hover:bg-[#e55a30] transition-colors shadow-lg hover:shadow-xl"
                    >
                        Start Now!
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-[#f7f7f7] pt-8 relative overflow-hidden">
                {/* Large Orange Circle Background - Centered at bottom with fading gradient */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[70%] w-[1468px] h-[1468px] rounded-full z-0"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,184,156,0.5) 0%, rgba(255,212,196,0.3) 40%, rgba(255,212,196,0) 70%)'
                    }}
                />

                {/* Top Border Line */}
                <div className="w-full h-[3px] bg-[#ff6a3e]/20 mb-8" />

                <div className="max-w-[1440px] mx-auto px-[16px] md:px-[32px] relative z-10 py-12">
                    <div className="flex justify-between">
                        {/* Left Column - Brand Info */}
                        <div className="max-w-[310px]">
                            <h3 className="font-medium text-[32px] text-black">
                                Kaa<span className="text-[#ff6a3e]">BUY</span>
                            </h3>
                            <p className="font-normal text-[18px] text-black mt-1">
                                Where sari-sari stores meet innovation
                            </p>

                            <div className="mt-12">
                                <p className="font-medium text-[18px] text-black">Address:</p>
                                <p className="font-normal text-[14px] text-black/70 mt-1">
                                    San Fernando City,<br />
                                    La Union
                                </p>
                            </div>

                            <div className="mt-8">
                                <p className="font-medium text-[18px] text-black">Contact Details:</p>
                                <p className="font-normal text-[14px] text-black/70 mt-1">
                                    +63 954 972 2405<br />
                                    +63 962 856 2435<br />
                                    kaabuynaka@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="flex gap-[70px]">
                            {/* Resources */}
                            <div>
                                <h4 className="font-medium text-[20px] text-[#ff6a3e] mb-4">Resources</h4>
                                <ul className="space-y-2">
                                    {['Demo', 'Updates', 'Documentation', 'Solution', 'Partners'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="font-medium text-[18px] text-black hover:text-[#ff6a3e] transition-colors">
                                                • {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Help */}
                            <div>
                                <h4 className="font-medium text-[20px] text-[#ff6a3e] mb-4">Help</h4>
                                <ul className="space-y-2">
                                    {['FAQ', 'Get Help', 'Report a Concern', 'User Guide', 'Send Us Feedback'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="font-medium text-[18px] text-black hover:text-[#ff6a3e] transition-colors">
                                                • {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="font-medium text-[20px] text-[#ff6a3e] mb-4">Legal</h4>
                                <ul className="space-y-2">
                                    {['Contact', 'Privacy Policy', 'Terms and Conditions'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="font-medium text-[18px] text-black hover:text-[#ff6a3e] transition-colors">
                                                • {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Social Icons - Right Side */}
                        <div className="self-end">
                            <div className="flex items-center gap-3">
                                <a href="#" className="bg-[#ff6a3e] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#e55a30] transition-colors">
                                    <img src={imgLinkedin} alt="LinkedIn" className="w-4 h-4" />
                                </a>
                                <a href="#" className="bg-[#ff6a3e] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#e55a30] transition-colors">
                                    <img src={imgInstagram} alt="Instagram" className="w-5 h-5" />
                                </a>
                                <a href="#" className="bg-[#ff6a3e] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#e55a30] transition-colors">
                                    <img src={imgFacebook} alt="Facebook" className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="bg-[#ff6a3e] py-3 mt-8">
                    <p className="text-center font-medium text-[16px] text-white">
                        © 2025, KaaBUY. All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
