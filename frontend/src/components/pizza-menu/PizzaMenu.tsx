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
  return <footer className="my-4">{new Date().toLocaleTimeString()} 现已开放购买</footer>;
}
