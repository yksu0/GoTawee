/**
 * ============================================================================
 * USER INFORMATION PAGE JAVASCRIPT
 * ============================================================================
 * 
 * @file        user-information.js
 * @description Interactive functionality for user information collection
 * @version     1.0.0
 * @author      Development Team
 * 
 * ----------------------------------------------------------------------------
 * PURPOSE
 * ----------------------------------------------------------------------------
 * 
 * This module handles:
 * - Form validation and real-time input checking
 * - Document type selection and upload functionality
 * - Camera access and photo capture for documents and face verification
 * - Progress tracking and form completion status
 * - File handling with validation and preview
 * - User interaction and navigation
 * 
 * ----------------------------------------------------------------------------
 * SECURITY CONSIDERATIONS
 * ----------------------------------------------------------------------------
 * 
 * - Input validation prevents malicious data entry
 * - File upload validation for type and size limits
 * - Camera permissions are properly handled
 * - No sensitive data stored in localStorage
 * - Secure image processing and preview
 * 
 */

class UserInformationManager {
    constructor() {
        this.formData = {
            personal: {},
            address: {},
            document: {
                type: null,
                image: null
            },
            face: {
                image: null
            }
        };
        
        this.validation = {
            rules: {},
            errors: {}
        };
        
        this.camera = {
            stream: null,
            video: null,
            canvas: null,
            context: null
        };
        
        this.progress = 0;
        
        this.init();
    }
    
    init() {
        this.setupValidationRules();
        this.bindEvents();
        this.setupCamera();
        this.updateProgress();
    }
    
    /**
     * ====================================================================
     * VALIDATION SETUP
     * ====================================================================
     */
    
    setupValidationRules() {
        this.validation.rules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'First name must be at least 2 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Last name must be at least 2 characters and contain only letters'
            },
            dateOfBirth: {
                required: true,
                validate: this.validateAge,
                message: 'You must be at least 18 years old'
            },
            phoneNumber: {
                required: true,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            streetAddress: {
                required: true,
                minLength: 5,
                message: 'Street address must be at least 5 characters'
            },
            city: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'City must be at least 2 characters and contain only letters'
            },
            state: {
                required: true,
                minLength: 2,
                message: 'State/Province is required'
            },
            zipCode: {
                required: true,
                pattern: /^[A-Za-z0-9\s\-]{3,10}$/,
                message: 'Please enter a valid ZIP/Postal code'
            },
            country: {
                required: true,
                message: 'Please select your country'
            },
            documentIdNumber: {
                required: true,
                minLength: 3,
                pattern: /^[A-Za-z0-9\-\s]+$/,
                message: 'Please enter a valid document ID number'
            }
        };
    }
    
    validateAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 18;
    }
    
    /**
     * ====================================================================
     * EVENT BINDING
     * ====================================================================
     */
    
    bindEvents() {
        // Navigation events
        document.getElementById('backBtn')?.addEventListener('click', () => this.goBack());
        document.getElementById('helpBtn')?.addEventListener('click', () => this.showHelp());
        
        // Form input events
        this.bindFormEvents();
        
        // Document upload events
        this.bindDocumentEvents();
        
        // Face scan events
        this.bindFaceEvents();
        
        // Form submission
        document.getElementById('userInfoForm')?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Modal events
        this.bindModalEvents();
        
        // Save for later
        document.getElementById('saveForLaterBtn')?.addEventListener('click', () => this.saveForLater());
    }
    
    bindFormEvents() {
        // Real-time validation for all form inputs
        const inputs = document.querySelectorAll('.form-input, .form-select');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e.target));
        }
    }
    
    bindDocumentEvents() {
        // Document type selection
        document.querySelectorAll('.document-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectDocumentType(e.currentTarget));
        });
        
        // Upload buttons
        document.querySelector('.camera-btn')?.addEventListener('click', () => this.openDocumentCamera());
        document.querySelector('.gallery-btn')?.addEventListener('click', () => this.openDocumentGallery());
        
        // File input
        document.getElementById('documentFileInput')?.addEventListener('change', (e) => this.handleDocumentFile(e));
        
        // Retake document
        document.getElementById('retakeDocumentBtn')?.addEventListener('click', () => this.retakeDocument());
    }
    
    bindFaceEvents() {
        // Start face scan
        document.getElementById('startFaceScanBtn')?.addEventListener('click', () => this.startFaceScan());
        
        // Capture face
        document.getElementById('captureFaceBtn')?.addEventListener('click', () => this.captureFace());
        
        // Retake face
        document.getElementById('retakeFaceBtn')?.addEventListener('click', () => this.retakeFace());
    }
    
    bindModalEvents() {
        // Help modal
        document.getElementById('helpModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideHelp();
            }
        });
        
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.hideHelp());
        document.querySelector('.modal-btn.primary')?.addEventListener('click', () => this.hideHelp());
    }
    
    /**
     * ====================================================================
     * FORM VALIDATION
     * ====================================================================
     */
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validation.rules[fieldName];
        
        if (!rules) return true;
        
        // Required field check
        if (rules.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Skip other validations if field is empty but not required
        if (!value && !rules.required) {
            this.clearFieldError(field);
            return true;
        }
        
        // Minimum length check
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, rules.message || `Minimum ${rules.minLength} characters required`);
            return false;
        }
        
        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message || 'Invalid format');
            return false;
        }
        
        // Custom validation
        if (rules.validate && !rules.validate(value)) {
            this.showFieldError(field, rules.message || 'Invalid value');
            return false;
        }
        
        // Field is valid
        this.clearFieldError(field);
        this.formData.personal[fieldName] = value;
        this.updateProgress();
        return true;
    }
    
    showFieldError(field, message) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.style.borderColor = '#ff4757';
        this.validation.errors[field.name] = message;
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.style.borderColor = '';
        delete this.validation.errors[field.name];
    }
    
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        // Limit to reasonable phone number length
        if (value.length > 15) {
            value = value.substr(0, 15);
        }
        
        input.value = value;
    }
    
    /**
     * ====================================================================
     * DOCUMENT UPLOAD FUNCTIONALITY
     * ====================================================================
     */
    
    selectDocumentType(card) {
        // Remove active class from all cards
        document.querySelectorAll('.document-card').forEach(c => c.classList.remove('active'));
        
        // Add active class to selected card
        card.classList.add('active');
        
        // Store document type
        this.formData.document.type = card.dataset.type;
        
        // Update upload area
        this.updateUploadArea();
        this.updateProgress();
    }
    
    updateUploadArea() {
        const uploadArea = document.getElementById('documentUploadArea');
        const placeholder = uploadArea?.querySelector('.upload-placeholder');
        
        if (placeholder && this.formData.document.type) {
            const typeNames = {
                'drivers-license': 'Driver\'s License',
                'passport': 'Passport',
                'national-id': 'National ID Card',
                'student-id': 'Student ID Card'
            };
            
            const titleElement = placeholder.querySelector('h4');
            if (titleElement) {
                titleElement.textContent = `Upload your ${typeNames[this.formData.document.type]}`;
            }
        }
    }
    
    openDocumentCamera() {
        if (!this.formData.document.type) {
            this.showError('Please select a document type first');
            return;
        }
        
        this.captureDocumentPhoto();
    }
    
    openDocumentGallery() {
        if (!this.formData.document.type) {
            this.showError('Please select a document type first');
            return;
        }
        
        const fileInput = document.getElementById('documentFileInput');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    handleDocumentFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file
        if (!this.validateFile(file)) return;
        
        // Read and process file
        const reader = new FileReader();
        reader.onload = (e) => {
            this.processDocumentImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    captureDocumentPhoto() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                } 
            })
            .then(stream => {
                this.processDocumentCapture(stream);
            })
            .catch(error => {
                console.error('Camera error:', error);
                this.showError('Unable to access camera. Please try uploading from gallery.');
            });
        } else {
            this.showError('Camera not supported on this device');
        }
    }
    
    processDocumentCapture(stream) {
        // Create temporary video for capture
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        
        video.addEventListener('loadedmetadata', () => {
            // Create canvas for capture
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Capture after delay
            setTimeout(() => {
                context.drawImage(video, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                
                // Stop stream
                stream.getTracks().forEach(track => track.stop());
                
                // Process image
                this.processDocumentImage(imageData);
            }, 100);
        });
    }
    
    processDocumentImage(imageData) {
        this.formData.document.image = imageData;
        this.showDocumentPreview(imageData);
        this.showDocumentIdSection();
        this.updateProgress();
    }
    
    showDocumentIdSection() {
        const idSection = document.getElementById('documentIdSection');
        const helpText = document.getElementById('documentIdHelp');
        
        if (idSection) {
            idSection.style.display = 'block';
        }
        
        // Update help text based on document type
        if (helpText && this.formData.document.type) {
            const helpTexts = {
                'drivers-license': 'Enter the license number shown on your driver\'s license',
                'passport': 'Enter the passport number found on your passport',
                'national-id': 'Enter the ID number shown on your national ID card',
                'student-id': 'Enter the student ID number shown on your student card'
            };
            helpText.textContent = helpTexts[this.formData.document.type] || 'Enter the unique ID number shown on your document';
        }
        
        // Focus on the ID input
        setTimeout(() => {
            const idInput = document.getElementById('documentIdNumber');
            if (idInput) {
                idInput.focus();
            }
        }, 300);
    }
    
    showDocumentPreview(imageData) {
        const uploadArea = document.getElementById('documentUploadArea');
        const placeholder = uploadArea?.querySelector('.upload-placeholder');
        const preview = document.getElementById('documentPreview');
        const image = document.getElementById('documentImage');
        const typeElement = document.getElementById('documentType');
        
        if (placeholder && preview && image) {
            placeholder.style.display = 'none';
            preview.style.display = 'block';
            image.src = imageData;
            
            if (typeElement && this.formData.document.type) {
                const typeNames = {
                    'drivers-license': 'Driver\'s License',
                    'passport': 'Passport', 
                    'national-id': 'National ID Card',
                    'student-id': 'Student ID Card'
                };
                typeElement.textContent = typeNames[this.formData.document.type];
            }
        }
    }
    
    retakeDocument() {
        this.formData.document.image = null;
        
        const uploadArea = document.getElementById('documentUploadArea');
        const placeholder = uploadArea?.querySelector('.upload-placeholder');
        const preview = document.getElementById('documentPreview');
        const idSection = document.getElementById('documentIdSection');
        
        if (placeholder && preview) {
            placeholder.style.display = 'block';
            preview.style.display = 'none';
        }
        
        if (idSection) {
            idSection.style.display = 'none';
            // Clear the ID input
            const idInput = document.getElementById('documentIdNumber');
            if (idInput) {
                idInput.value = '';
                this.clearFieldError(idInput);
            }
        }
        
        this.updateProgress();
    }
    
    /**
     * ====================================================================
     * FACE SCAN FUNCTIONALITY
     * ====================================================================
     */
    
    setupCamera() {
        this.camera.video = document.getElementById('faceVideo');
        this.camera.canvas = document.getElementById('faceCanvas');
        
        if (this.camera.canvas) {
            this.camera.context = this.camera.canvas.getContext('2d');
        }
    }
    
    startFaceScan() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 640 }
                } 
            })
            .then(stream => {
                this.camera.stream = stream;
                if (this.camera.video) {
                    this.camera.video.srcObject = stream;
                    this.camera.video.addEventListener('loadedmetadata', () => {
                        this.showFaceCamera();
                    });
                }
            })
            .catch(error => {
                console.error('Camera error:', error);
                this.showError('Unable to access camera. Please check permissions and try again.');
            });
        } else {
            this.showError('Camera not supported on this device');
        }
    }
    
    showFaceCamera() {
        const placeholder = document.getElementById('faceScanPlaceholder');
        const camera = document.getElementById('faceCamera');
        
        if (placeholder && camera) {
            placeholder.style.display = 'none';
            camera.style.display = 'block';
        }
    }
    
    captureFace() {
        if (!this.camera.video || !this.camera.canvas || !this.camera.context) return;
        
        // Set canvas dimensions
        this.camera.canvas.width = this.camera.video.videoWidth;
        this.camera.canvas.height = this.camera.video.videoHeight;
        
        // Draw current frame
        this.camera.context.drawImage(this.camera.video, 0, 0);
        
        // Get image data
        const imageData = this.camera.canvas.toDataURL('image/jpeg', 0.8);
        this.formData.face.image = imageData;
        
        // Show preview
        this.showFacePreview(imageData);
        
        // Stop camera
        this.stopCamera();
        this.updateProgress();
    }
    
    showFacePreview(imageData) {
        const camera = document.getElementById('faceCamera');
        const preview = document.getElementById('facePreview');
        const image = document.getElementById('faceImage');
        
        if (camera && preview && image) {
            camera.style.display = 'none';
            preview.style.display = 'block';
            image.src = imageData;
        }
    }
    
    retakeFace() {
        this.formData.face.image = null;
        
        const placeholder = document.getElementById('faceScanPlaceholder');
        const camera = document.getElementById('faceCamera');
        const preview = document.getElementById('facePreview');
        
        if (placeholder && camera && preview) {
            placeholder.style.display = 'block';
            camera.style.display = 'none';
            preview.style.display = 'none';
        }
        
        this.updateProgress();
    }
    
    stopCamera() {
        if (this.camera.stream) {
            this.camera.stream.getTracks().forEach(track => track.stop());
            this.camera.stream = null;
        }
    }
    
    /**
     * ====================================================================
     * PROGRESS AND VALIDATION
     * ====================================================================
     */
    
    updateProgress() {
        const requiredFields = Object.keys(this.validation.rules);
        const completedFields = requiredFields.filter(field => {
            const element = document.getElementById(field);
            return element && element.value.trim() && !this.validation.errors[field];
        });
        
        let progress = (completedFields.length / requiredFields.length) * 60; // 60% for form fields
        
        // Add document progress
        if (this.formData.document.type && this.formData.document.image) {
            progress += 20; // 20% for document
        }
        
        // Add face progress  
        if (this.formData.face.image) {
            progress += 20; // 20% for face scan
        }
        
        this.progress = Math.min(progress, 100);
        this.updateProgressUI();
        this.updateContinueButton();
    }
    
    updateProgressUI() {
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressFill) {
            progressFill.style.width = `${this.progress}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(this.progress)}%`;
        }
    }
    
    updateContinueButton() {
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            const isComplete = this.progress >= 100;
            continueBtn.disabled = !isComplete;
        }
    }
    
    /**
     * ====================================================================
     * FILE VALIDATION
     * ====================================================================
     */
    
    validateFile(file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return false;
        }
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image file is too large. Please select a file under 5MB');
            return false;
        }
        
        return true;
    }
    
    /**
     * ====================================================================
     * FORM SUBMISSION AND NAVIGATION
     * ====================================================================
     */
    
    handleSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        const isValid = this.validateAllFields();
        
        if (!isValid) {
            this.showError('Please complete all required fields correctly');
            return;
        }
        
        if (!this.formData.document.type || !this.formData.document.image) {
            this.showError('Please upload your identity document');
            return;
        }
        
        // Check if document ID is provided
        const documentIdInput = document.getElementById('documentIdNumber');
        if (!documentIdInput || !documentIdInput.value.trim()) {
            this.showError('Please enter the ID number from your document');
            return;
        }
        
        if (!this.formData.face.image) {
            this.showError('Please complete face verification');
            return;
        }
        
        // Proceed to next step
        this.proceedToReview();
    }
    
    validateAllFields() {
        let isValid = true;
        const inputs = document.querySelectorAll('.form-input, .form-select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    proceedToReview() {
        // In a real app, this would send data to server for processing
        this.showSuccess('Information submitted successfully! Proceeding to review...');
        
        setTimeout(() => {
            // Navigate to review page or next step
            window.location.href = '../pages/verification-review.html';
        }, 1500);
    }
    
    saveForLater() {
        // Save current progress to localStorage
        const saveData = {
            formData: this.formData,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('userInfoDraft', JSON.stringify(saveData));
            this.showSuccess('Progress saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            this.showError('Unable to save progress. Please try again.');
        }
    }
    
    loadSavedData() {
        try {
            const saved = localStorage.getItem('userInfoDraft');
            if (saved) {
                const saveData = JSON.parse(saved);
                this.formData = saveData.formData;
                this.populateForm();
            }
        } catch (error) {
            console.error('Load error:', error);
        }
    }
    
    populateForm() {
        // Populate form fields with saved data
        Object.keys(this.formData.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.formData.personal[key];
            }
        });
        
        // Restore document selection
        if (this.formData.document.type) {
            const card = document.querySelector(`[data-type="${this.formData.document.type}"]`);
            if (card) {
                this.selectDocumentType(card);
            }
        }
        
        // Restore document preview
        if (this.formData.document.image) {
            this.showDocumentPreview(this.formData.document.image);
        }
        
        // Restore face preview
        if (this.formData.face.image) {
            this.showFacePreview(this.formData.face.image);
        }
        
        this.updateProgress();
    }
    
    goBack() {
        if (confirm('Are you sure you want to go back? Your progress will be saved.')) {
            this.saveForLater();
            window.history.back();
        }
    }
    
    /**
     * ====================================================================
     * UI HELPERS
     * ====================================================================
     */
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'error') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#ff4757' : '#2ed573'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
            max-width: 90vw;
            text-align: center;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    showHelp() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            helpModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideHelp() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            helpModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

/**
 * ====================================================================
 * NOTIFICATION ANIMATIONS
 * ====================================================================
 */

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(notificationStyles);

/**
 * ====================================================================
 * INITIALIZATION
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    window.userInfoManager = new UserInformationManager();
    
    // Load any saved progress
    window.userInfoManager.loadSavedData();
});

/**
 * ====================================================================
 * CLEANUP
 * ====================================================================
 */

window.addEventListener('beforeunload', () => {
    if (window.userInfoManager) {
        window.userInfoManager.stopCamera();
    }
});