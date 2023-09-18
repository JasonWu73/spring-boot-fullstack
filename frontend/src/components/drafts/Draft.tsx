const skills = [
  {
    skill: "HTML+CSS",
    level: "advanced",
    color: "#2662EA"
  },
  {
    skill: "JavaScript",
    level: "advanced",
    color: "#EFD81D"
  },
  {
    skill: "Web Design",
    level: "advanced",
    color: "#C3DCAF"
  },
  {
    skill: "Git and GitHub",
    level: "intermediate",
    color: "#E84F33"
  },
  {
    skill: "React",
    level: "advanced",
    color: "#60DAFB"
  },
  {
    skill: "Svelte",
    level: "beginner",
    color: "#FF3B00"
  }
];

export default function Draft() {
  return (
    <div>
      <SkillList />
    </div>
  );
}

function SkillList() {
  return (
    <ul className="m-8 flex flex-col items-center gap-4">
      {skills.map(({ skill, level, color }) => (
        <Skill skill={skill} level={level} color={color} key={skill} />
      ))}
    </ul>
  );
}

function Skill({ skill, level, color }: typeof skills[0]) {
  return (
    <li style={{ backgroundColor: color }} className="w-44">
      <span>{skill}</span>
      <span>
        {level === 'advanced' && '💪'}
        {level === 'intermediate' && '👍'}
        {level === 'beginner' && '👶'}
      </span>
    </li>
  );
}
