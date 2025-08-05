import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AboutMe from './AboutMe';
import Address from './Address';
import BirthDate from './BirthDate';
import { getAssignedComponents } from '../helpers/componentUtils';
import './Page2.css';

const Page2 = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, formData } = location.state || {};
    const assignedComponents = getAssignedComponents('page2');
  
    
    const [aboutMeText, setAboutMeText] = useState(formData?.aboutMeText || '');
    const [address, setAddress] = useState(formData?.address || {
      street: '',
      city: '',
      state: '',
      zip: ''
    });
    const [selectedYear, setSelectedYear] = useState(formData?.selectedYear || '');
    const [selectedMonth, setSelectedMonth] = useState(formData?.selectedMonth || '');
    const [selectedDay, setSelectedDay] = useState(formData?.selectedDay || '');
    const [message, setMessage] = useState('');

  const handleLogout = () => {
    navigate('/');
  };

  const handleSubmit = async () => {
    try {
   
      if (!aboutMeText || !address.street || !selectedYear) {
        setMessage('Please fill in all required fields');
        return;
      }
  
      const response = await fetch('http://localhost:8080/api/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          about_me: aboutMeText,
          street: address.street,
          city: address.city,
          state: address.state,
          zip_code: address.zip,
          birth_year: selectedYear,
          birth_month: selectedMonth,
          birth_day: selectedDay
        })
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save profile');
      
      navigate('/');
    } catch (error) {
      setMessage(error.message);
      console.error('Submission error:', error);
    }
  };

  const renderComponent = (name) => {
    switch(name) {
      case 'AboutMe': 
        return <AboutMe value={aboutMeText} onChange={(value) => setAboutMeText(value)} />;
      case 'Address': 
        return <Address 
          value={address} 
          onChange={(updatedAddress) => setAddress(updatedAddress)} 
        />;
      case 'BirthDate': 
        return <BirthDate 
          year={selectedYear} 
          month={selectedMonth} 
          day={selectedDay}
          onYearChange={(year) => setSelectedYear(year)}
          onMonthChange={(month) => setSelectedMonth(month)}
          onDayChange={(day) => setSelectedDay(day)}
        />;
      default: return null;
    }
  };

  return (
    <div className="page2-container">
      
      <div className="page2-header">
        <h1>Welcome to Page 2</h1>
        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout
        </button>
      </div>

      {user && (
        <div className="user-info">
          <p>Logged in as: <strong>{user.email}</strong></p>
        </div>
      )}

      {message && <div className="message">{message}</div>}

      <div className="page2-content">
        {assignedComponents.map(component => (
          <div key={component} className="component-wrapper">
            {renderComponent(component)}
          </div>
        ))}

       
        <div className="form-actions">
          <Link 
            to="/page1" 
            state={{ user }} 
            className="nav-button"
          >
            Back to Page 1
          </Link>
          <button 
            onClick={handleSubmit} 
            className="submit-button"
          >
            Submit
          </button>
        </div>

        
        {user?.email === 'admin@example.com' && (
          <div className="admin-link">
            <Link to="/admin" className="admin-button">
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page2;