import React from 'react';

const AboutMe = ({ value, onChange }) => {
  return (
    <div className="about-me-container">
      <h3>About Me</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tell us about yourself..."
        rows={8}
      />
    </div>
  );
};

export default AboutMe;