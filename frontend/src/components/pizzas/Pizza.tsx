export default function Pizza() {
  const img = '/src/assets/pizzas/focaccia.jpg';

  return (
    <div className="mt-8">
      <img src={img} alt="Pizza" />
      <h2 className="text-2xl font-bold">佛卡夏</h2>
      <p className="mt-4">Focaccia是一款正宗的意大利口味面包，用英文阐述就是“Italian Flat
        Bread”，可以看出，这不是一款像吐司一样，发的高高的面包，它的特点就是“平”，“很平”，有人说它“平”的像一个盘子一样……
      </p>
    </div>
  );
}
