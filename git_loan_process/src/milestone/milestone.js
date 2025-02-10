/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';

const Milestone = ({ currentStep, steps }) => {
    <Milestone currentStep={2} steps={['Step 1', 'Step 2', 'Step 3']} />

  return (
    <div className="milestone">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index === currentStep ? 'active' : ''}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

Milestone.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Milestone;
