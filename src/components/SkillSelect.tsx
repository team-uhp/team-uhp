/* Renders a single skill for selection. See project-page/page.tsx. */
import React from 'react';

const SkillSelect = ({ skill, isSelected: isSelected, onChange }: { skill: string, isSelected: boolean, onChange: () => void }) => (
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
      {skill}
    </span>
  </label>
);

export default SkillSelect;
