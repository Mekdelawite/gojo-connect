// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentLanguage = 'en';
let properties = [];
let favorites = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('HomeDirect Ethiopia - Initializing...');
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Load properties
    loadProperties();
    
    // Load testimonials
    loadTestimonials();
    
    // Update stats
    updateStats();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load saved language preference
    loadLanguagePreference();
});

// ===== NAVIGATION =====
function navigateTo(page) {
    console.log('Navigating to:', page);
    
    switch(page) {
        case 'index':
            window.location.href = 'index.html';
            break;
        case 'buy':
            window.location.href = 'buy.html';
            break;
        case 'rent':
            window.location.href = 'rent.html';
            break;
        case 'sell':
            window.location.href = 'sell.html';
            break;
        case 'dashboard':
            if (currentUser) {
                window.location.href = 'dashboard.html';
            } else {
                openModal('login');
                showNotification('Please login first', 'warning');
            }
            break;
        case 'verification':
            if (currentUser) {
                window.location.href = 'verification.html';
            } else {
                openModal('login');
                showNotification('Please login to verify', 'warning');
            }
            break;
        case 'payment':
            if (currentUser) {
                window.location.href = 'payment.html';
            } else {
                openModal('login');
                showNotification('Please login to make payment', 'warning');
            }
            break;
        case 'agreements':
            if (currentUser) {
                window.location.href = 'agreements.html';
            } else {
                openModal('login');
                showNotification('Please login to create agreements', 'warning');
            }
            break;
        case 'messages':
            if (currentUser) {
                window.location.href = 'messages.html';
            } else {
                openModal('login');
                showNotification('Please login to chat', 'warning');
            }
            break;
        case 'property-detail':
            // Will handle with property ID
            break;
        default:
            window.location.href = page + '.html';
    }
}

// ===== AUTHENTICATION =====
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    // Update navigation
    const loginLinks = document.querySelectorAll('a[href="#"][onclick*="login"]');
    loginLinks.forEach(link => {
        if (currentUser) {
            link.innerHTML = currentUser.name.split(' ')[0];
            link.onclick = () => navigateTo('dashboard');
        }
    });
    
    // Update signup button
    const signupBtn = document.querySelector('button[onclick*="signup"]');
    if (signupBtn && currentUser) {
        signupBtn.innerHTML = '<i class="fas fa-user"></i> ' + currentUser.name.split(' ')[0];
        signupBtn.onclick = () => navigateTo('dashboard');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate API call
    setTimeout(() => {
        // Mock user data
        const user = {
            id: 'USR' + Math.floor(Math.random() * 10000),
            name: 'John Doe',
            email: email,
            phone: '+251 911 234 567',
            verified: false,
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        
        closeModal('login');
        updateUIForLoggedInUser();
        showNotification('Login successful! Welcome back!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => navigateTo('dashboard'), 1000);
    }, 1000);
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simulate API call
    setTimeout(() => {
        const user = {
            id: 'USR' + Math.floor(Math.random() * 10000),
            name: name,
            email: email,
            phone: phone,
            verified: false,
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        
        closeModal('signup');
        updateUIForLoggedInUser();
        showNotification('Account created successfully! Welcome to HomeDirect!', 'success');
        
        // Redirect to verification
        setTimeout(() => navigateTo('verification'), 1500);
    }, 1000);
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('Logged out successfully', 'info');
    setTimeout(() => window.location.reload(), 1000);
}

// ===== MODAL MANAGEMENT =====
function openModal(modalName) {
    closeAllModals();
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function switchModal(modalName) {
    closeAllModals();
    openModal(modalName);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// ===== PROPERTIES =====
function loadProperties() {
    // Mock properties data
    properties = [
        {
            id: 'PROP001',
            title: 'Modern 3 Bedroom Villa',
            price: 4500000,
            location: 'Bole, Addis Ababa',
            bedrooms: 3,
            bathrooms: 2,
            area: 180,
            type: 'sale',
            owner: {
                name: 'Alemitu Tadesse',
                verified: true,
                rating: 4.9
            },
            images: ['bole-villa.jpg'],
            featured: true
        },
        {
            id: 'PROP002',
            title: 'Luxury Apartment',
            price: 25000,
            priceType: 'month',
            location: 'Kazanchis, Addis Ababa',
            bedrooms: 2,
            bathrooms: 1,
            area: 120,
            type: 'rent',
            owner: {
                name: 'Biruk Demeke',
                verified: true,
                rating: 4.8
            },
            images: ['kazanchis-apt.jpg'],
            featured: true
        },
        {
            id: 'PROP003',
            title: 'Spacious Family Home',
            price: 6200000,
            location: 'CMC, Addis Ababa',
            bedrooms: 4,
            bathrooms: 3,
            area: 250,
            type: 'sale',
            owner: {
                name: 'Meron Girma',
                verified: true,
                rating: 5.0
            },
            images: ['cmc-home.jpg'],
            featured: true
        }
    ];
    
    // Display featured properties
    displayFeaturedProperties();
}

function displayFeaturedProperties() {
    const container = document.getElementById('featuredProperties');
    if (!container) return;
    
    const featured = properties.filter(p => p.featured);
    
    container.innerHTML = featured.map(property => `
        <div class="property-card" onclick="viewProperty('${property.id}')">
            <div class="property-image">
                <i class="fas fa-home"></i>
                <span class="property-tag">${property.type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                <span class="property-verified">
                    <i class="fas fa-check-circle"></i> Verified
                </span>
            </div>
            <div class="property-details">
                <div class="property-price">
                    ₿${property.price.toLocaleString()}
                    ${property.priceType ? `<small>/month</small>` : ''}
                </div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} Bed</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} Bath</span>
                    <span><i class="fas fa-vector-square"></i> ${property.area} sq.m</span>
                </div>
                <div class="owner-info">
                    <div class="owner-avatar">${property.owner.name.charAt(0)}</div>
                    <div>
                        <div style="font-weight: 600;">${property.owner.name}</div>
                        <div style="display: flex; gap: 0.5rem; font-size: 0.8rem;">
                            <span><i class="fas fa-star" style="color: #ffd700;"></i> ${property.owner.rating}</span>
                            ${property.owner.verified ? 
                                '<span class="verified-badge"><i class="fas fa-check-circle"></i> FaydaID Verified</span>' : 
                                ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function viewProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        localStorage.setItem('currentProperty', JSON.stringify(property));
        window.location.href = 'property-detail.html';
    }
}

function searchProperties() {
    const query = document.getElementById('searchInput').value;
    if (query.trim()) {
        localStorage.setItem('searchQuery', query);
        window.location.href = 'buy.html';
    }
}

// ===== TESTIMONIALS =====
function loadTestimonials() {
    const container = document.getElementById('testimonials');
    if (!container) return;
    
    const testimonials = [
        {
            name: 'Henok Tesfaye',
            avatar: 'HT',
            rating: 5,
            text: 'Saved ₿150,000 in brokerage! FaydaID verification gave me confidence. Payment via TeleBirr was smooth.',
            role: 'Bought home in Bole'
        },
        {
            name: 'Azeb Demeke',
            avatar: 'AD',
            rating: 5,
            text: 'Found tenant in 3 days. Digital agreement in Amharic saved lawyer fees. Highly recommended!',
            role: 'Landlord in Kazanchis'
        },
        {
            name: 'Birtukan Tsegaye',
            avatar: 'BT',
            rating: 5,
            text: 'As a tenant, I worried about scams. Every owner is FaydaID verified. Rent via M-Birr monthly. No broker!',
            role: 'Tenant in CMC'
        }
    ];
    
    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-rating">
                ${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}
            </div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">${t.avatar}</div>
                <div>
                    <div style="font-weight: 600;">${t.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-light);">${t.role}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== STATS UPDATE =====
function updateStats() {
    // Simulate live stats update
    setInterval(() => {
        const propertyCount = document.getElementById('propertyCount');
        const ownerCount = document.getElementById('ownerCount');
        const userCount = document.getElementById('userCount');
        
        if (propertyCount) {
            const current = parseInt(propertyCount.textContent.replace(',', ''));
            propertyCount.textContent = (current + Math.floor(Math.random() * 10)).toLocaleString();
        }
        
        if (ownerCount) {
            const current = parseInt(ownerCount.textContent.replace(',', ''));
            ownerCount.textContent = (current + Math.floor(Math.random() * 5)).toLocaleString();
        }
        
        if (userCount) {
            const current = parseInt(userCount.textContent.replace(',', ''));
            userCount.textContent = (current + Math.floor(Math.random() * 8)).toLocaleString();
        }
    }, 10000); // Update every 10 seconds
}

// ===== FAVORITES =====
function toggleFavorite(propertyId) {
    if (!currentUser) {
        openModal('login');
        showNotification('Please login to save favorites', 'warning');
        return;
    }
    
    const index = favorites.indexOf(propertyId);
    if (index === -1) {
        favorites.push(propertyId);
        showNotification('Added to favorites', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    
    // Mobile menu resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
}

// ===== LANGUAGE =====
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        switchLanguage(savedLang);
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(savedLang === 'en' ? 'English' : 'አማርኛ')) {
                btn.classList.add('active');
            }
        });
    }
}

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    const elements = document.querySelectorAll('[data-en][data-am]');
    
    elements.forEach(element => {
        if (lang === 'en') {
            if (element.placeholder !== undefined) {
                element.placeholder = element.getAttribute('data-en');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        } else {
            if (element.placeholder !== undefined) {
                element.placeholder = element.getAttribute('data-am');
            } else {
                element.textContent = element.getAttribute('data-am');
            }
        }
    });
    
    showNotification(lang === 'en' ? 'Switched to English' : 'ወደ አማርኛ ተቀይሯል', 'info');
}

// ===== PAYMENT FUNCTIONS =====
function initiatePayment(amount, purpose, propertyId) {
    if (!currentUser) {
        openModal('login');
        showNotification('Please login to make payment', 'warning');
        return;
    }
    
    // Store payment details
    const paymentDetails = {
        amount: amount,
        purpose: purpose,
        propertyId: propertyId,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentPayment', JSON.stringify(paymentDetails));
    window.location.href = 'payment.html';
}

function processPayment(method) {
    showNotification('Processing payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        showNotification('Payment successful! Transaction ID: ' + generateTransactionId(), 'success');
        
        // Redirect to success page
        setTimeout(() => {
            window.location.href = 'payment-success.html';
        }, 1500);
    }, 2000);
}

function generateTransactionId() {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

// ===== VERIFICATION FUNCTIONS =====
function startVerification() {
    if (!currentUser) {
        openModal('login');
        showNotification('Please login to verify', 'warning');
        return;
    }
    
    window.location.href = 'verification.html';
}

function verifyWithFaydaID(idNumber) {
    showNotification('Verifying with FaydaID...', 'info');
    
    // Simulate verification
    setTimeout(() => {
        currentUser.verified = true;
        currentUser.verificationDate = new Date().toISOString();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Verification successful! You are now a verified user.', 'success');
        
        // Update UI
        updateUIForLoggedInUser();
    }, 3000);
}

// ===== AGREEMENT FUNCTIONS =====
function createAgreement(type, propertyId) {
    if (!currentUser) {
        openModal('login');
        showNotification('Please login to create agreement', 'warning');
        return;
    }
    
    window.location.href = 'agreements.html?type=' + type + '&property=' + propertyId;
}

function generateAgreement(data) {
    showNotification('Generating agreement...', 'info');
    
    // ===== AUTHENTICATION MODULE =====

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 3600000; // 1 hour
        this.init();
    }
    
    init() {
        // Check for existing session
        this.checkSession();
        
        // Set up session checker
        setInterval(() => this.checkSession(), 60000); // Check every minute
    }
    
    checkSession() {
        const session = localStorage.getItem('session');
        if (session) {
            const sessionData = JSON.parse(session);
            
            // Check if session is expired
            if (Date.now() - sessionData.timestamp < this.sessionTimeout) {
                this.currentUser = sessionData.user;
                this.updateUI();
            } else {
                this.logout('Session expired');
            }
        }
    }
    
    async login(credentials) {
        try {
            // Validate input
            if (!this.validateEmail(credentials.email) && !this.validatePhone(credentials.email)) {
                throw new Error('Invalid email or phone format');
            }
            
            if (!this.validatePassword(credentials.password)) {
                throw new Error('Password must be at least 6 characters');
            }
            
            // Simulate API call
            const response = await this.mockLoginAPI(credentials);
            
            if (response.success) {
                this.setSession(response.user);
                this.currentUser = response.user;
                
                // Track login event
                analytics.trackEvent('login', { method: 'password' });
                
                return {
                    success: true,
                    user: response.user
                };
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async signup(userData) {
        try {
            // Validate all fields
            if (!this.validateName(userData.name)) {
                throw new Error('Name is required');
            }
            
            if (!this.validateEmail(userData.email)) {
                throw new Error('Invalid email format');
            }
            
            if (!this.validatePhone(userData.phone)) {
                throw new Error('Invalid phone number (must be 10 digits)');
            }
            
            if (!this.validatePassword(userData.password)) {
                throw new Error('Password must be at least 6 characters');
            }
            
            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            // Simulate API call
            const response = await this.mockSignupAPI(userData);
            
            if (response.success) {
                // Send welcome email
                this.sendWelcomeEmail(userData.email, userData.name);
                
                // Track signup
                analytics.trackEvent('signup', { method: 'email' });
                
                return {
                    success: true,
                    message: 'Account created successfully! Please check your email to verify.'
                };
            } else {
                throw new Error(response.error || 'Signup failed');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async verifyEmail(token) {
        try {
            // Simulate verification
            await this.mockDelay(1500);
            
            // Update user verification status
            if (this.currentUser) {
                this.currentUser.emailVerified = true;
                this.updateSession();
            }
            
            analytics.trackEvent('email_verified');
            
            return {
                success: true,
                message: 'Email verified successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Verification failed'
            };
        }
    }
    
    async verifyPhone(code) {
        try {
            // Simulate verification
            await this.mockDelay(1500);
            
            if (code === '123456') { // Mock valid code
                if (this.currentUser) {
                    this.currentUser.phoneVerified = true;
                    this.updateSession();
                }
                
                analytics.trackEvent('phone_verified');
                
                return {
                    success: true,
                    message: 'Phone verified successfully!'
                };
            } else {
                throw new Error('Invalid verification code');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async forgotPassword(email) {
        try {
            if (!this.validateEmail(email)) {
                throw new Error('Invalid email format');
            }
            
            // Simulate API call
            await this.mockDelay(1500);
            
            analytics.trackEvent('password_reset_request');
            
            return {
                success: true,
                message: 'Password reset link sent to your email'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async resetPassword(token, newPassword) {
        try {
            if (!this.validatePassword(newPassword)) {
                throw new Error('Password must be at least 6 characters');
            }
            
            // Simulate API call
            await this.mockDelay(1500);
            
            analytics.trackEvent('password_reset');
            
            return {
                success: true,
                message: 'Password reset successfully! Please login with your new password.'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    logout(reason = 'User logged out') {
        localStorage.removeItem('session');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        
        analytics.trackEvent('logout', { reason });
        
        this.updateUI();
        showNotification('Logged out successfully', 'info');
        
        // Redirect to home
        setTimeout(() => navigateTo('index'), 1000);
    }
    
    setSession(user) {
        const session = {
            user: user,
            timestamp: Date.now(),
            sessionId: 'SESS' + Date.now()
        };
        
        localStorage.setItem('session', JSON.stringify(session));
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    updateSession() {
        if (this.currentUser) {
            this.setSession(this.currentUser);
        }
    }
    
    updateUI() {
        // Update navigation based on auth status
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && this.currentUser) {
            // Replace login/signup with user menu
            const authLinks = navLinks.querySelectorAll('a[href="#"][onclick*="login"], button[onclick*="signup"]');
            authLinks.forEach(link => link.remove());
            
            // Add user menu
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <button class="btn btn-outline" onclick="toggleUserMenu()">
                    <i class="fas fa-user"></i> ${this.currentUser.name.split(' ')[0]}
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" onclick="navigateTo('dashboard')">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#" onclick="navigateTo('profile')">
                        <i class="fas fa-user-circle"></i> Profile
                    </a>
                    <a href="#" onclick="navigateTo('favorites')">
                        <i class="fas fa-heart"></i> Favorites
                    </a>
                    <a href="#" onclick="navigateTo('messages')">
                        <i class="fas fa-envelope"></i> Messages
                        <span class="badge" id="messageBadge"></span>
                    </a>
                    <hr>
                    <a href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            `;
            
            navLinks.appendChild(userMenu);
        }
    }
    
    // Validation methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePhone(phone) {
        const re = /^\+?251[0-9]{9}$|^0[0-9]{9}$/;
        return re.test(phone);
    }
    
    validateName(name) {
        return name && name.trim().length > 0;
    }
    
    validatePassword(password) {
        return password && password.length >= 6;
    }
    
    // Mock API methods
    async mockLoginAPI(credentials) {
        await this.mockDelay(1000);
        
        // Mock successful login
        if (credentials.email && credentials.password) {
            return {
                success: true,
                user: {
                    id: 'USR' + Math.floor(Math.random() * 10000),
                    name: credentials.email.split('@')[0],
                    email: credentials.email,
                    phone: '+251 911 234 567',
                    emailVerified: false,
                    phoneVerified: false,
                    verified: false,
                    joinDate: new Date().toISOString()
                }
            };
        } else {
            return {
                success: false,
                error: 'Invalid credentials'
            };
        }
    }
    
    async mockSignupAPI(userData) {
        await this.mockDelay(1500);
        
        return {
            success: true,
            userId: 'USR' + Math.floor(Math.random() * 10000)
        };
    }
    
    async sendWelcomeEmail(email, name) {
        console.log(`Sending welcome email to ${name} at ${email}`);
        // In production, this would call an email service
    }
    
    mockDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Make auth functions globally available
window.authManager = authManager;
window.logout = () => authManager.logout();
}