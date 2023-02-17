import React from 'react';
import SvgCheck from './ICONS/SvgCheck';
import { WHITE } from './const';

const CheckBox = (props) => {
  const { checked, label, handleToggle, style, gap } = props;

  return (
    <div className="columns checkbox" style={{ ...style }} onClick={() => handleToggle(!checked)}>
      <div className="check-box" />
      {checked && <SvgCheck width={12} color={WHITE} style={{ gridArea: '1/1', justifySelf: 'center' }} />}
      <div style={{ gridArea: '1/2', marginLeft: `${gap || 0}px` }}>{label}</div>
    </div>
  );
};

export default CheckBox;
