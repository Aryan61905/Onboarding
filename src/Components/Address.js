import React from 'react';
import PropTypes from 'prop-types';
import './Address.css';

const Address = ({ value = {}, onChange }) => {
  
  const { street = '', city = '', state = '', zip = '' } = value;

  const handleChange = (e) => {
    const { name, value: fieldValue } = e.target;
    onChange({
      ...value,
      [name]: fieldValue
    });
  };

  return (
    <div className="address-container">
      <h3>Address Information</h3>
      <div className="form-group">
        <label>Street Address</label>
        <input
          type="text"
          name="street"
          value={street}
          onChange={handleChange}
          placeholder="123 Main St"
        />
      </div>
      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={city}
          onChange={handleChange}
          placeholder="New York"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={handleChange}
            placeholder="NY"
            maxLength="2"
          />
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            name="zip"
            value={zip}
            onChange={handleChange}
            placeholder="10001"
            maxLength="5"
          />
        </div>
      </div>
    </div>
  );
};

Address.propTypes = {
  value: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired
};

Address.defaultProps = {
  value: {
    street: '',
    city: '',
    state: '',
    zip: ''
  }
};

export default Address;