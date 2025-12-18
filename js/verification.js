/**
 * ============================================================================
 * VERIFICATION PAGE JAVASCRIPT
 * ============================================================================
 * 
 * @file        verification.js
 * @description Interactive functionality for identity verification page
 * @version     1.0.0
 * @author      Development Team
 * 
 * ----------------------------------------------------------------------------
 * PURPOSE
 * ----------------------------------------------------------------------------
 * 
 * This module handles:
 * - Multi-step verification flow navigation
 * - Camera access and photo capture for facial recognition
 * - ID document upload and preview functionality
 * - Form validation and error handling
 * - Progress tracking through verification steps
 * - API communication for verification processing
 * 
 * ----------------------------------------------------------------------------
 * SECURITY CONSIDERATIONS
 * ----------------------------------------------------------------------------
 * 
 * - All sensitive data is handled securely
 * - Camera permissions are properly requested
 * - File uploads are validated for type and size
 * - Error states provide user-friendly feedback
 * - No sensitive data is stored in localStorage
 * 
 */

class VerificationManager {
    constructor() {
        this.currentStep = 'intro';
        this.idType = null;
        this.idImage = null;
        this.selfieImage = null;
        this.stream = null;
        this.video = null;
        this.canvas = null;
        this.context = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupCamera();
        this.showStep('intro');
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
        
        // Intro section events
        document.getElementById('startVerificationBtn')?.addEventListener('click', () => this.startVerification());
        
        // ID Upload section events
        document.querySelectorAll('.id-type-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectIdType(e.target.closest('.id-type-card')));
        });
        
        document.getElementById('cameraBtn')?.addEventListener('click', () => this.openCamera('id'));
        document.getElementById('galleryBtn')?.addEventListener('click', () => this.openGallery());
        document.getElementById('retakeIdBtn')?.addEventListener('click', () => this.retakeId());
        document.getElementById('continueToSelfieBtn')?.addEventListener('click', () => this.continueToSelfie());
        
        // File input
        document.getElementById('fileInput')?.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Selfie section events
        document.getElementById('startCameraBtn')?.addEventListener('click', () => this.startCamera());
        document.getElementById('captureBtn')?.addEventListener('click', () => this.captureSelfie());
        document.getElementById('retakeSelfieBtn')?.addEventListener('click', () => this.retakeSelfie());
        document.getElementById('proceedBtn')?.addEventListener('click', () => this.proceedToProcessing());
        
        // Modal events
        document.getElementById('helpModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideHelp();
            }
        });
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.hideHelp());
        
        // Back to intro button
        document.getElementById('backToIntroBtn')?.addEventListener('click', () => this.backToIntro());
        
        // Success section events
        document.getElementById('continueBtn')?.addEventListener('click', () => this.completeVerification());
    }
    
    /**
     * ====================================================================
     * STEP NAVIGATION
     * ====================================================================
     */
    
    showStep(step) {
        // Hide all sections
        document.querySelectorAll('.verification-content > div').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show current step
        const currentSection = document.getElementById(step + 'Section');
        if (currentSection) {
            currentSection.style.display = 'block';
        }
        
        this.currentStep = step;
        this.updateBackButton();
    }
    
    updateBackButton() {
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.style.display = this.currentStep === 'intro' ? 'none' : 'flex';
        }
    }
    
    goBack() {
        switch (this.currentStep) {
            case 'upload':
                this.showStep('intro');
                break;
            case 'selfie':
                this.showStep('upload');
                break;
            case 'processing':
                this.showStep('selfie');
                break;
            case 'success':
                this.showStep('intro');
                break;
        }
    }
    
    startVerification() {
        // Navigate to user information page instead of showing upload step
        window.location.href = './user-information.html';
    }
    
    continueToSelfie() {
        if (!this.validateIdUpload()) return;
        this.showStep('selfie');
    }
    
    proceedToProcessing() {
        if (!this.validateSelfie()) return;
        this.showStep('processing');
        this.startProcessing();
    }
    
    backToIntro() {
        this.resetVerification();
        this.showStep('intro');
    }
    
    completeVerification() {
        // Navigate to main app or dashboard
        window.location.href = '/pages/order-tracking.html';
    }
    
    /**
     * ====================================================================
     * ID UPLOAD FUNCTIONALITY
     * ====================================================================
     */
    
    selectIdType(card) {
        // Remove active class from all cards
        document.querySelectorAll('.id-type-card').forEach(c => c.classList.remove('active'));
        
        // Add active class to selected card
        card.classList.add('active');
        
        // Store selected ID type
        this.idType = card.dataset.type;
        
        // Update UI based on selection
        this.updateIdTypeSelection();
    }
    
    updateIdTypeSelection() {
        const uploadArea = document.getElementById('uploadArea');
        const uploadTitle = uploadArea?.querySelector('.upload-title');
        
        if (uploadTitle && this.idType) {
            const typeNames = {
                'drivers-license': 'Driver\'s License',
                'passport': 'Passport',
                'national-id': 'National ID Card'
            };
            uploadTitle.textContent = `Upload your ${typeNames[this.idType]}`;
        }
    }
    
    openCamera(type) {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                } 
            })
            .then(stream => {
                this.handleCameraSuccess(stream, type);
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                this.showError('Unable to access camera. Please try uploading from gallery instead.');
            });
        } else {
            this.showError('Camera access is not supported by your browser.');
        }
    }
    
    handleCameraSuccess(stream, type) {
        // Create a temporary video element for capture
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
            
            // Capture after a short delay
            setTimeout(() => {
                context.drawImage(video, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                
                // Stop stream
                stream.getTracks().forEach(track => track.stop());
                
                // Process captured image
                if (type === 'id') {
                    this.handleIdCapture(imageData);
                }
            }, 100);
        });
    }
    
    openGallery() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image file is too large. Please select a file under 5MB.');
            return;
        }
        
        // Read and process file
        const reader = new FileReader();
        reader.onload = (e) => {
            this.handleIdCapture(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    handleIdCapture(imageData) {
        this.idImage = imageData;
        this.showIdPreview(imageData);
        this.updateContinueButton();
    }
    
    showIdPreview(imageData) {
        const uploadArea = document.getElementById('uploadArea');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');
        
        if (uploadArea && uploadPreview && previewImage) {
            uploadArea.style.display = 'none';
            uploadPreview.style.display = 'block';
            previewImage.src = imageData;
        }
    }
    
    retakeId() {
        this.idImage = null;
        
        const uploadArea = document.getElementById('uploadArea');
        const uploadPreview = document.getElementById('uploadPreview');
        
        if (uploadArea && uploadPreview) {
            uploadArea.style.display = 'block';
            uploadPreview.style.display = 'none';
        }
        
        this.updateContinueButton();
    }
    
    validateIdUpload() {
        if (!this.idType) {
            this.showError('Please select your ID type.');
            return false;
        }
        
        if (!this.idImage) {
            this.showError('Please upload or capture an image of your ID.');
            return false;
        }
        
        return true;
    }
    
    /**
     * ====================================================================
     * FACIAL RECOGNITION FUNCTIONALITY
     * ====================================================================
     */
    
    setupCamera() {
        this.video = document.getElementById('selfieVideo');
        this.canvas = document.getElementById('selfieCanvas');
        
        if (this.canvas) {
            this.context = this.canvas.getContext('2d');
        }
    }
    
    startCamera() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 640 }
                } 
            })
            .then(stream => {
                this.stream = stream;
                if (this.video) {
                    this.video.srcObject = stream;
                    this.video.addEventListener('loadedmetadata', () => {
                        this.showCameraInterface();
                    });
                }
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                this.showError('Unable to access camera. Please check your camera permissions and try again.');
            });
        } else {
            this.showError('Camera access is not supported by your browser.');
        }
    }
    
    showCameraInterface() {
        const placeholder = document.getElementById('cameraPlaceholder');
        const cameraFrame = document.querySelector('.camera-frame');
        const faceOutline = document.querySelector('.face-outline');
        const captureControls = document.getElementById('captureControls');
        const startControls = document.getElementById('startControls');
        
        if (placeholder) placeholder.style.display = 'none';
        if (faceOutline) faceOutline.style.display = 'block';
        if (this.video) this.video.style.display = 'block';
        if (captureControls) captureControls.style.display = 'flex';
        if (startControls) startControls.style.display = 'none';
    }
    
    captureSelfie() {
        if (!this.video || !this.canvas || !this.context) return;
        
        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Draw current video frame to canvas
        this.context.drawImage(this.video, 0, 0);
        
        // Get image data
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        this.selfieImage = imageData;
        
        // Show preview
        this.showSelfiePreview(imageData);
        
        // Stop camera stream
        this.stopCamera();
    }
    
    showSelfiePreview(imageData) {
        const selfiePreview = document.getElementById('selfiePreview');
        const selfiePreviewImg = document.getElementById('selfiePreviewImg');
        const captureControls = document.getElementById('captureControls');
        const retakeControls = document.getElementById('retakeControls');
        
        if (selfiePreview && selfiePreviewImg) {
            selfiePreview.style.display = 'block';
            selfiePreviewImg.src = imageData;
        }
        
        if (captureControls) captureControls.style.display = 'none';
        if (retakeControls) retakeControls.style.display = 'flex';
        
        this.updateProceedButton();
    }
    
    retakeSelfie() {
        this.selfieImage = null;
        
        const selfiePreview = document.getElementById('selfiePreview');
        const retakeControls = document.getElementById('retakeControls');
        const startControls = document.getElementById('startControls');
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        const faceOutline = document.querySelector('.face-outline');
        
        if (selfiePreview) selfiePreview.style.display = 'none';
        if (retakeControls) retakeControls.style.display = 'none';
        if (startControls) startControls.style.display = 'flex';
        if (cameraPlaceholder) cameraPlaceholder.style.display = 'flex';
        if (faceOutline) faceOutline.style.display = 'none';
        if (this.video) this.video.style.display = 'none';
        
        this.updateProceedButton();
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
    
    validateSelfie() {
        if (!this.selfieImage) {
            this.showError('Please capture a selfie to continue.');
            return false;
        }
        
        return true;
    }
    
    /**
     * ====================================================================
     * PROCESSING FUNCTIONALITY
     * ====================================================================
     */
    
    startProcessing() {
        // Reset processing steps
        this.resetProcessingSteps();
        
        // Start processing simulation
        this.processStep1();
    }
    
    resetProcessingSteps() {
        const steps = document.querySelectorAll('.processing-step');
        steps.forEach((step, index) => {
            step.classList.remove('completed', 'active');
            const icon = step.querySelector('.step-check, .step-spinner, .step-circle');
            
            if (icon) {
                icon.className = 'step-circle';
                icon.innerHTML = '';
            }
        });
    }
    
    processStep1() {
        // Analyzing ID document
        this.setStepActive(0);
        
        setTimeout(() => {
            this.setStepCompleted(0);
            this.processStep2();
        }, 2000);
    }
    
    processStep2() {
        // Verifying facial recognition
        this.setStepActive(1);
        
        setTimeout(() => {
            this.setStepCompleted(1);
            this.processStep3();
        }, 2500);
    }
    
    processStep3() {
        // Finalizing verification
        this.setStepActive(2);
        
        setTimeout(() => {
            this.setStepCompleted(2);
            this.completeProcessing();
        }, 1500);
    }
    
    setStepActive(index) {
        const steps = document.querySelectorAll('.processing-step');
        if (steps[index]) {
            steps[index].classList.add('active');
            const icon = steps[index].querySelector('.step-circle');
            if (icon) {
                icon.className = 'step-spinner';
            }
        }
    }
    
    setStepCompleted(index) {
        const steps = document.querySelectorAll('.processing-step');
        if (steps[index]) {
            steps[index].classList.remove('active');
            steps[index].classList.add('completed');
            const icon = steps[index].querySelector('.step-spinner, .step-circle');
            if (icon) {
                icon.className = 'step-check';
                icon.innerHTML = '<i class="fas fa-check" style="font-size: 12px;"></i>';
            }
        }
    }
    
    completeProcessing() {
        // Simulate API call success
        setTimeout(() => {
            this.showStep('success');
        }, 1000);
    }
    
    /**
     * ====================================================================
     * UI HELPER METHODS
     * ====================================================================
     */
    
    updateContinueButton() {
        const continueBtn = document.getElementById('continueToSelfieBtn');
        if (continueBtn) {
            continueBtn.disabled = !this.idImage || !this.idType;
        }
    }
    
    updateProceedButton() {
        const proceedBtn = document.getElementById('proceedBtn');
        if (proceedBtn) {
            proceedBtn.disabled = !this.selfieImage;
        }
    }
    
    showError(message) {
        // Create or update error message
        let errorElement = document.getElementById('errorMessage');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'errorMessage';
            errorElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #ff4757;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
                z-index: 10000;
                animation: errorSlideDown 0.3s ease-out;
            `;
            document.body.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.animation = 'errorSlideUp 0.3s ease-out forwards';
                setTimeout(() => {
                    if (errorElement && errorElement.parentNode) {
                        errorElement.parentNode.removeChild(errorElement);
                    }
                }, 300);
            }
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
    
    resetVerification() {
        // Reset all data
        this.currentStep = 'intro';
        this.idType = null;
        this.idImage = null;
        this.selfieImage = null;
        
        // Stop camera if active
        this.stopCamera();
        
        // Reset UI
        this.resetIdSection();
        this.resetSelfieSection();
        this.resetProcessingSteps();
    }
    
    resetIdSection() {
        // Reset ID type selection
        document.querySelectorAll('.id-type-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Reset upload area
        const uploadArea = document.getElementById('uploadArea');
        const uploadPreview = document.getElementById('uploadPreview');
        
        if (uploadArea) uploadArea.style.display = 'block';
        if (uploadPreview) uploadPreview.style.display = 'none';
        
        this.updateContinueButton();
    }
    
    resetSelfieSection() {
        // Reset camera interface
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        const selfiePreview = document.getElementById('selfiePreview');
        const startControls = document.getElementById('startControls');
        const captureControls = document.getElementById('captureControls');
        const retakeControls = document.getElementById('retakeControls');
        const faceOutline = document.querySelector('.face-outline');
        
        if (cameraPlaceholder) cameraPlaceholder.style.display = 'flex';
        if (selfiePreview) selfiePreview.style.display = 'none';
        if (startControls) startControls.style.display = 'flex';
        if (captureControls) captureControls.style.display = 'none';
        if (retakeControls) retakeControls.style.display = 'none';
        if (faceOutline) faceOutline.style.display = 'none';
        if (this.video) this.video.style.display = 'none';
        
        this.updateProceedButton();
    }
}

/**
 * ====================================================================
 * ERROR ANIMATIONS (CSS-in-JS for dynamic error messages)
 * ====================================================================
 */

// Add error animations to document head
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    @keyframes errorSlideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes errorSlideUp {
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
document.head.appendChild(errorStyles);

/**
 * ====================================================================
 * INITIALIZATION
 * ====================================================================
 */

// Initialize verification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.verificationManager = new VerificationManager();
});

/**
 * ====================================================================
 * CLEANUP ON PAGE UNLOAD
 * ====================================================================
 */

// Clean up camera stream when leaving page
window.addEventListener('beforeunload', () => {
    if (window.verificationManager) {
        window.verificationManager.stopCamera();
    }
});