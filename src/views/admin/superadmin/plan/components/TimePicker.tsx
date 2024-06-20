// TimePicker.tsx
import React from 'react';
import TimePickerLib from 'react-time-picker';

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <TimePickerLib onChange={onChange} value={value} />
    </div>
  );
};

export default TimePicker;
