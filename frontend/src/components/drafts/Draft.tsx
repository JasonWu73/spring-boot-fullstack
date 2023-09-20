import classNames from "classnames";

const initialItems = [
  {
    id: 1,
    description: "Passports",
    quantity: 2,
    packed: false
  },
  {
    id: 2,
    description: "Socks",
    quantity: 12,
    packed: false
  },
  {
    id: 3,
    description: "Charger",
    quantity: 1,
    packed: false
  }
];

type ItemProps = {
  item: typeof initialItems[0];
};

export default function Draft() {
  return (
    <div className="min-h-screen flex flex-col">
      <Logo />
      <Form />
      <PackingList />
      <Stats />
    </div>
  );
}

function Logo() {
  return (
    <div className="bg-amber-500 text-gray-800 h-20 flex justify-center items-center">
      <h1 className="text-4xl font-extrabold tracking-widest">🏝️ Far Away</h1>
    </div>
  );
}

function Form() {
  return (
    <div className="bg-orange-500 text-gray-800 h-16 flex justify-center items-center">
      <h3 className="text-2xl font-bold tracking-wider">What do you need for your 🥰 trip?</h3>
    </div>
  );
}

function PackingList() {
  return (
    <div className="self-stretch flex-grow bg-amber-900 text-slate-50 h-16 py-4 text-lg">
      <ul className="mx-24 flex gap-80">
        {initialItems.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function Item({ item }: ItemProps) {
  return (
    <li className="flex items-center">
      <span className={classNames({ "line-through": item.packed })}>
        ${item.quantity} {item.description}
      </span>
      <button className="ml-3 text-xs block">❌</button>
    </li>
  );
}

function Stats() {
  return (
    <footer className="bg-cyan-500 text-gray-800 h-16 flex justify-center items-center">
      <em className="text-lg font-semibold">💼 You have X items on your list, and you already packed X (X%)</em>
    </footer>
  );
}
