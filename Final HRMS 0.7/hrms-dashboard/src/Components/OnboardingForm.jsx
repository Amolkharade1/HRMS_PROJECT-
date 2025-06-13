import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './OnboardingForm.css';

const OnboardingForm = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [duplicates, setDuplicates] = useState([]);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        department: '',
        sourceOfHire: '',
        joiningDate: '',
        panCard: '',
        aadhaarCard: '',
        uanNumber: '',
        currentLocation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required field checks
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
        if (!formData.department) newErrors.department = "Department is required";
        if (!formData.sourceOfHire) newErrors.sourceOfHire = "Source of hire is required";
        if (!formData.joiningDate) newErrors.joiningDate = "Joining date is required";
        if (!formData.panCard.trim()) newErrors.panCard = "PAN Card number is required";
        if (!formData.aadhaarCard.trim()) newErrors.aadhaarCard = "Aadhaar Card number is required";
        if (!formData.currentLocation.trim()) newErrors.currentLocation = "Current location is required";

        // Pattern validations
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (formData.email && !emailPattern.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number must be exactly 10 digits";
        }

        if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panCard)) {
            newErrors.panCard = "PAN number must be valid (e.g. ABCDE1234F)";
        }

        if (formData.aadhaarCard && !/^\d{12}$/.test(formData.aadhaarCard)) {
            newErrors.aadhaarCard = "Aadhaar number must be a 12-digit number";
        }

        if (formData.uanNumber && formData.uanNumber.length > 0 && !/^\d{12}$/.test(formData.uanNumber)) {
            newErrors.uanNumber = "UAN number must be a 12-digit number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDuplicates([]);
        setShowDuplicateModal(false);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await axios.post('http://localhost:8000/api/candidates', formData);
            
            if (response.data.success) {
                alert("Candidate submitted successfully!");
                navigate("/onboarding");
            } else {
                console.error("Submission failed:", response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Handle duplicate values
                const duplicateFields = error.response.data.duplicates || [];
                setDuplicates(duplicateFields);
                setShowDuplicateModal(true);
            } else if (error.response && error.response.data.errors) {
                // Handle validation errors from server
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    const field = err.path;
                    serverErrors[field] = err.message;
                });
                setErrors(serverErrors);
            } else {
                console.error("Submit error:", error);
                alert("Error submitting form. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDuplicateMessage = () => {
        if (duplicates.length === 0) return '';
        
        const fieldNames = {
            'email': 'Email address',
            'mobile': 'Mobile number',
            'PAN card': 'PAN card number',
            'Aadhaar card': 'Aadhaar card number',
            'UAN number': 'UAN number'
        };
        
        const formattedFields = duplicates.map(field => fieldNames[field] || field);
        
        if (formattedFields.length === 1) {
            return `${formattedFields[0]} already exists in our system.`;
        }
        
        return `${formattedFields.slice(0, -1).join(', ')} and ${formattedFields.slice(-1)} already exist in our system.`;
    };

    return (
        <div className="onboarding-form-container">
            <h2 className="onboarding-form-title">
                <Link to="/onboarding">
                    <span className="onboarding-back-arrow">&lt;</span>
                </Link> New Candidate Onboarding
            </h2>

            {/* Duplicate Values Modal */}
            {showDuplicateModal && (
                <div className="onboarding-modal-overlay">
                    <div className="onboarding-modal">
                        <h3>Duplicate Information Found</h3>
                        <p>{getDuplicateMessage()}</p>
                        <p>Please correct the information and try again.</p>
                        <button 
                            className="onboarding-btn onboarding-btn-submit"
                            onClick={() => setShowDuplicateModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <form className="onboarding-form" onSubmit={handleSubmit}>
                <section className="onboarding-form-section">
                    <h3>Personal Information</h3>
                    <div className="onboarding-form-row">
                        <div className="onboarding-form-group">
                            <label>First Name <span>*</span></label>
                            <input 
                                type="text" 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handleChange} 
                                className={errors.firstName ? 'error' : ''}
                            />
                            {errors.firstName && <div className="onboarding-error-message">{errors.firstName}</div>}
                        </div>
                        <div className="onboarding-form-group">
                            <label>Last Name <span>*</span></label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={formData.lastName} 
                                onChange={handleChange} 
                                className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && <div className="onboarding-error-message">{errors.lastName}</div>}
                        </div>
                    </div>
                    <div className="onboarding-form-row">
                        <div className="onboarding-form-group">
                            <label>Email Address <span>*</span></label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <div className="onboarding-error-message">{errors.email}</div>}
                        </div>
                        <div className="onboarding-form-group">
                            <label>Mobile Number <span>*</span></label>
                            <input 
                                type="tel" 
                                name="mobile" 
                                value={formData.mobile} 
                                onChange={handleChange} 
                                className={errors.mobile ? 'error' : ''}
                            />
                            {errors.mobile && <div className="onboarding-error-message">{errors.mobile}</div>}
                        </div>
                    </div>
                </section>

                <section className="onboarding-form-section">
                    <h3>Professional Details</h3>
                    <div className="onboarding-form-row">
                        <div className="onboarding-form-group">
                            <label>Role <span>*</span></label>
                            <select 
                                name="department" 
                                value={formData.department} 
                                onChange={handleChange}
                                className={errors.department ? 'error' : ''}
                            >
                                <option value="">Select Department</option>
                                <option value="Software Developer">Software Developer</option>
                                <option value="Data Analyst">Data Analyst</option>
                                <option value="Software Testing">Software Testing</option>
                                <option value="AWS Cloud">AWS Cloud</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                            {errors.department && <div className="onboarding-error-message">{errors.department}</div>}
                        </div>
                        <div className="onboarding-form-group">
                            <label>Hiring Source<span>*</span></label>
                            <select 
                                name="sourceOfHire" 
                                value={formData.sourceOfHire} 
                                onChange={handleChange}
                                className={errors.sourceOfHire ? 'error' : ''}
                            >
                                <option value="">Select Source</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Company Website">Company Website</option>
                                <option value="Employee Referral">Employee Referral</option>
                                <option value="Job Portal">Job Portal</option>
                                <option value="Campus Recruitment">Campus Recruitment</option>
                                <option value="Walk-in">Walk-in</option>
                                <option value="Consultancy">Consultancy</option>
                            </select>
                            {errors.sourceOfHire && <div className="onboarding-error-message">{errors.sourceOfHire}</div>}
                        </div>
                    </div>
                    <div className="onboarding-form-row">
                        <div className="onboarding-form-group">
                            <label>Expected Joining Date <span>*</span></label>
                            <input 
                                type="date" 
                                name="joiningDate" 
                                value={formData.joiningDate} 
                                onChange={handleChange} 
                                className={errors.joiningDate ? 'error' : ''}
                            />
                            {errors.joiningDate && <div className="onboarding-error-message">{errors.joiningDate}</div>}
                        </div>
                    </div>
                </section>

                <section className="onboarding-form-section">
                    <h3>Document Information</h3>
                    <div className="onboarding-form-row">
                        <div className="onboarding-form-group">
                            <label>PAN Card Number <span>*</span></label>
                            <input 
                                type="text" 
                                name="panCard" 
                                value={formData.panCard} 
                                onChange={handleChange} 
                                className={errors.panCard ? 'error' : ''}
                            />
                            {errors.panCard && <div className="onboarding-error-message">{errors.panCard}</div>}
                        </div>
                        <div className="onboarding-form-group">
                            <label>Aadhaar Card Number <span>*</span></label>
                            <input 
                                type="text" 
                                name="aadhaarCard" 
                                value={formData.aadhaarCard} 
                                onChange={handleChange} 
                                className={errors.aadhaarCard ? 'error' : ''}
                            />
                            {errors.aadhaarCard && <div className="onboarding-error-message">{errors.aadhaarCard}</div>}
                        </div>
                    </div>
                    <div className="onboarding-form-row">
                        <div className="onboarding-form-group">
                            <label>UAN Number</label>
                            <input 
                                type="text" 
                                name="uanNumber" 
                                value={formData.uanNumber} 
                                onChange={handleChange} 
                                className={errors.uanNumber ? 'error' : ''}
                            />
                            {errors.uanNumber && <div className="onboarding-error-message">{errors.uanNumber}</div>}
                        </div>
                    </div>
                </section>

                <section className="onboarding-form-section">
                    <h3>Additional Information</h3>
                    <div className="onboarding-form-group">
                        <label>Current Location <span>*</span></label>
                        <input 
                            type="text" 
                            name="currentLocation" 
                            value={formData.currentLocation} 
                            onChange={handleChange} 
                            className={errors.currentLocation ? 'error' : ''}
                        />
                        {errors.currentLocation && <div className="onboarding-error-message">{errors.currentLocation}</div>}
                    </div>
                </section>

                <div className="onboarding-form-actions">
                    <Link to="/onboarding">
                        <button type="button" className="onboarding-btn onboarding-btn-draft">Cancel</button>
                    </Link>
                    <button 
                        type="submit" 
                        className="onboarding-btn onboarding-btn-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OnboardingForm;