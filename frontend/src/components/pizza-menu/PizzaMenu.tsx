import data from "./data.json";

type Pizza = typeof data[0];

export default function PizzaMenu() {

  return (
    <main className="p-4 bg-amber-100 flex flex-col items-center justify-center">
      <Header />
      <Menu />
      <Footer />
    </main>
  );
}

function Menu() {
  return (
    <>
      <h2 className="mb-4 text-xl font-bold">我们的菜单</h2>

      <Pizza
        name="Focaccia"
        photoName="/pizzas/focaccia.jpg"
        ingredients="Bread with italian olive oil and rosemary"
        price={6}
      />

      <Pizza
        name="Pizza Margherita"
        photoName="/pizzas/margherita.jpg"
        ingredients="Tomato and mozarella"
        price={10}
      />
    </>
  );
}

function Pizza({ name, photoName, ingredients, price }: Pizza) {
  return (
    <div className="w-4/5 mb-4 flex items-center justify-center gap-4">
      <img
        src={photoName}
        alt={name}
        className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
      />
      <div className="w-2/5">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="mt-4">{ingredients}</p>
        <span>{price + 3}</span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1 className="mb-4 text-2xl font-bold uppercase">React 披萨公司</h1>
    </header>
  );
}

function Footer() {
  const time = new Date();
  const currentHour = time.getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = currentHour >= openHour && currentHour < closeHour;
  console.log(`是否处于营业时间: ${isOpen}`);

  return <footer className="my-4 pb-4 border-b-8 border-amber-500">{time.toLocaleTimeString()} 目前营业中</footer>;
}
