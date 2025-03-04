import React, { useState } from "react";
import "./adminregistration.css"; // Import CSS file

const AdminRegistration = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        username: "",
        aadhar: "",
        store: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate the form
    const validate = () => {
        let newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone Number is required";
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.aadhar) newErrors.aadhar = "Aadhar Number is required";
        if (!formData.store) newErrors.store = "Store selection is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Form Submitted", formData);
            alert("Admin Registered Successfully!");
        }
    };

    return (
        <div className="container">
            <h2>Admin Registration</h2>
            <p>Create your store admin account</p>
            <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <label>Full Name <span>*</span></label>
                <input type="text" name="fullName" placeholder="Enter your full name" onChange={handleChange} className={errors.fullName ? "error" : ""} />
                {errors.fullName && <p className="error-message">{errors.fullName}</p>}

                {/* Email & Phone in Two Columns */}
                <div className="input-group">
                    <div>
                        <label>Email <span>*</span></label>
                        <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} className={errors.email ? "error" : ""} />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div>
                        <label>Phone Number <span>*</span></label>
                        <input type="text" name="phone" placeholder="Enter your phone number" onChange={handleChange} className={errors.phone ? "error" : ""} />
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>
                </div>

                {/* Username */}
                <label>Username <span>*</span></label>
                <input type="text" name="username" placeholder="Choose a username" onChange={handleChange} className={errors.username ? "error" : ""} />
                {errors.username && <p className="error-message">{errors.username}</p>}

                {/* Aadhar Card Number */}
                <label>Aadhar Card Number <span>*</span></label>
                <input type="text" name="aadhar" placeholder="Enter your 12-digit Aadhar number" onChange={handleChange} className={errors.aadhar ? "error" : ""} />
                {errors.aadhar && <p className="error-message">{errors.aadhar}</p>}

                {/* Store Name Dropdown */}
                <label>Store Name <span>*</span></label>
                <select name="store" onChange={handleChange} className={errors.store ? "error" : ""}>
                    <option value="">Select a store</option>
                    <option value="Store 1">Store 1</option>
                    <option value="Store 2">Store 2</option>
                    <option value="Store 3">Store 3</option>
                </select>
                {errors.store && <p className="error-message">{errors.store}</p>}

                {/* Password & Confirm Password in Two Columns */}
                <div className="input-group">
                    <div>
                        <label>Password <span>*</span></label>
                        <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} className={errors.password ? "error" : ""} />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    <div>
                        <label>Confirm Password <span>*</span></label>
                        <input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} className={errors.confirmPassword ? "error" : ""} />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit">Register Admin</button>
            </form>
        </div>
    );
};

export default AdminRegistration;
