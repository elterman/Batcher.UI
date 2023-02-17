import React from 'react';

const RadioButton = (props) => {
  const { checked, label, handleToggle, style, gap } = props;

  return (
    <div className="columns checkbox" style={{ ...style }} onClick={() => handleToggle(!checked)}>
      <div className="check-box radio-box" />
      {checked && <div className='radio' />}
      <div style={{ gridArea: '1/2', marginLeft: `${gap || 5}px` }}>{label}</div>
    </div>
  );
};

export default RadioButton;
