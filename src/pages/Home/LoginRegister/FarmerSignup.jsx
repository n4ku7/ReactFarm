import React, { useState } from 'react';

const FarmerSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        farmName: '',
        farmLocation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div>
            <h2>Farmer Signup</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Farm Name:</label>
                    <input type="text" name="farmName" value={formData.farmName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Farm Location:</label>
                    <input type="text" name="farmLocation" value={formData.farmLocation} onChange={handleChange} required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default FarmerSignup;