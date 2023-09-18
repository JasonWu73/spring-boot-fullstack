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
      <Pizza />
      <Pizza />
      <Pizza />
    </>
  );
}

function Pizza() {
  const img = "/src/assets/pizzas/focaccia.jpg";
  return (
    <>
      <img src={img} alt="Pizza" />
      <h2 className="text-lg font-bold">佛卡夏</h2>
      <p className="mt-4">面包、盐、胡椒</p>
    </>
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
