/* Renders a single skill for selection. See project-page/page.tsx. */

const SkillSelect = ({ skill, value, onChange }: { skill: string, value: boolean, onChange: () => void }) => (
  <label
    htmlFor={`skill-${skill}`}
    style={{
      backgroundColor: value ? 'lightblue' : 'darkblue',
      borderColor: value ? 'lightblue' : 'darkblue',
      color: 'white',
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
      checked={value}
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
