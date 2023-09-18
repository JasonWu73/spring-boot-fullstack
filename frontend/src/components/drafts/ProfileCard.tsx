const skills = [
  {
    name: 'HTML+CSS',
    level: 90
  },
  {
    name: 'JavaScript',
    level: 90
  },
  {
    name: 'Web Design',
    level: 90
  },
  {
    name: 'Git and GitHub',
    level: 80
  },
  {
    name: 'React',
    level: 90
  },
  {
    name: 'svelte',
    level: 30
  }
];

export default function ProfileCard() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[30rem] border-2 border-black rounded">
        <Avatar />
        <div className="p-2">
          <Intro />
          <SkillList />
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return <img src="https://pbs.twimg.com/media/D425Vu-XsAEMZoI.jpg:large" alt="Jonas Schmedtmann" />;
}

function Intro() {
  return (
    <div>
      <h1 className="my-4 text-4xl font-bold">Jonas Schmedtmann</h1>
      <p className="mb-4">Full Stack Developer and teacher at Udemy. When not coding or preparing a course, I like to
        play board games,
        to cook (and eat), or to just enjoy the portuguese sun at the beach.
      </p>
    </div>
  );
}

function SkillList() {
  return (
    <div className="flex flex-wrap gap-4">
      {skills.map((skill) => (
        <Skill key={skill.name} name={skill.name} level={skill.level} />
      ))}
    </div>
  );
}

function Skill({ name, level }: typeof skills[0]) {
  return (
    <div className="w-44 px-4 py-2 bg-sky-500 rounded flex gap-2">
      <span>{name}</span>
      <span>{getLevelIcon(level)}</span>
    </div>
  );
}

function getLevelIcon(level: number) {
  if (level >= 90) {
    return '💪';
  }

  if (level >= 80) {
    return '👍';
  }

  if (level <= 50) {
    return '👶';
  }
}
