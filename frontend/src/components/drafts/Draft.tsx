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
    <div className="self-stretch flex-grow bg-amber-700 text-slate-50 h-16 flex justify-center py-4">
      LIST
    </div>
  );
}

function Stats() {
  return (
    <footer className="bg-cyan-500 text-gray-800 h-16 flex justify-center items-center">
      <em className="text-lg font-semibold">💼 You have X items on your list, and you already packed X (X%)</em>
    </footer>
  );
}
