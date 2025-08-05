import React from 'react';
import './BirthDate.css';

const BirthDate = ({ year, month, day, onYearChange, onMonthChange, onDayChange }) => {
 
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 88 }, (_, i) => currentYear - 13 - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="birthdate-container">
      <h3>Date of Birth</h3>
      <div className="date-selector-row">
        <div className="date-selector-group">
          <label>Month</label>
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            <option value="">Month</option>
            {months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div className="date-selector-group">
          <label>Day</label>
          <select
            value={day}
            onChange={(e) => onDayChange(e.target.value)}
          >
            <option value="">Day</option>
            {days.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="date-selector-group">
          <label>Year</label>
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">Year</option>
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BirthDate;