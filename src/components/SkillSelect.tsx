/* Renders a single skill for selection. See project-page/page.tsx. */
import React from 'react';

type SkillSelectProps = {
  skill: string;
  isSelected: boolean;
  onChange: () => void;
  label?: string; // <-- add this
};

const SkillSelect: React.FC<SkillSelectProps> = ({ skill, isSelected, onChange, label }) => (
  <label 
    htmlFor={`skill-${skill}`}
    style={{
      backgroundColor: isSelected ? '#cfffdb' : '#f1f1f1',
      borderColor: isSelected ? 'lightblue' : 'darkblue',
      fontFamily: 'opensans, sans-serif',
      fontSize: '14px',
      color: '#111613',
      borderRadius: '20px',
    }}
    className={`
      px-4
      py-1
    `}
  >
    <input
      id={`skill-${skill}`}
      type="checkbox"
      checked={isSelected}
      onChange={onChange}
      className="w-4 h-4 rounded cursor-pointer"
      
    />
    <span className="text-sm">
      {' '}
      {label || skill}
    </span>
  </label>
);

export default SkillSelect;
