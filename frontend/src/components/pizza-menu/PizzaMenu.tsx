export default function PizzaMenu() {

  return (
    <div className="mt-4 mx-4">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

function Menu() {
  return (
    <>
      <h2 className="mb-4 text-1xl font-bold">我们的菜单</h2>
      <Pizza />
      <Pizza />
      <Pizza />
    </>
  );
}

function Pizza() {
  const img = '/src/assets/pizzas/focaccia.jpg';
  return (
    <>
      <img src={img} alt="Pizza" />
      <h2 className="text-2xl font-bold">佛卡夏</h2>
      <p className="mt-4">面包、盐、胡椒</p>
    </>
  );
}

function Header() {
  return <h1 className="mb-4 text-2xl font-bold">React 披萨公司</h1>;
}

function Footer() {
  const time = new Date();
  const currentHour = time.getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = currentHour >= openHour && currentHour < closeHour;
  console.log(`是否处于营业时间: ${isOpen}`);

  return <footer className="my-4">{time.toLocaleTimeString()} 目前营业中</footer>;
}
