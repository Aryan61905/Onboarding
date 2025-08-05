import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AboutMe from './AboutMe';
import Address from './Address';
import BirthDate from './BirthDate';
import { getAssignedComponents } from '../helpers/componentUtils';
import './Page1.css'; 

const Page1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};
  const assignedComponents = getAssignedComponents('page1');

 
  const [aboutMeText, setAboutMeText] = useState('');
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: ''
  });
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handleLogout = () => navigate('/');

  const renderComponent = (name) => {
    switch(name) {
      case 'AboutMe': return <AboutMe value={aboutMeText} onChange={setAboutMeText} />;
      case 'Address': return <Address value={address} onChange={setAddress} />;
      case 'BirthDate': return <BirthDate 
        year={selectedYear} month={selectedMonth} day={selectedDay}
        onYearChange={setSelectedYear} onMonthChange={setSelectedMonth} onDayChange={setSelectedDay}
      />;
      default: return null;
    }
  };

  return (
    <div className="page1-container">
      {}
      <div className="page1-header">
        <h1>Welcome to Page 1</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {user && (
        <div className="user-info">
          <p>Logged in as: <strong>{user.email}</strong></p>
          
        </div>
      )}

      <div className="page1-content">
        {assignedComponents.map(component => (
          <div key={component} className="component-wrapper">
            {renderComponent(component)}
          </div>
        ))}

        {}
        <div className="form-actions">
          <Link 
            to="/page2" 
            state={{ 
              user,
              formData: { aboutMeText, address, selectedYear, selectedMonth, selectedDay }
            }} 
            className="nav-button"
          >
            Next Page
          </Link>
        </div>

        {}
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

export default Page1;