import Logo from './logo.jpg'
import { Loading } from '@/components/ui/Loading'

function Home() {
  return (
    <div className="h-screen bg-slate-700 text-slate-50">
      <header className="flex flex-col items-center justify-center pt-28">
        <div className="flex items-center justify-center gap-4">
          <img src={Logo} alt="Logo" className="h-14 w-14" />
          <h1 className="text-4xl font-bold">乾冠国产化数字法庭服务</h1>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <em className="text-2xl">🎉 国产化数据迁移成功！</em>
        </div>
      </header>

      <main className="mt-8 flex flex-col items-center justify-center text-xl"></main>
    </div>
  )
}

function HomeBak2() {
  return (
    <div className="h-screen bg-slate-700 text-slate-50">
      <header className="flex flex-col items-center justify-center pt-28">
        <div className="flex items-center justify-center gap-4">
          <img src={Logo} alt="Logo" className="h-14 w-14" />
          <h1 className="text-4xl font-bold">乾冠国产化数字法庭服务</h1>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Loading />
          <em className="text-2xl">国产化数据迁移中，请耐心等待……</em>
        </div>
      </header>

      <main className="mt-8 flex flex-col items-center justify-center text-xl"></main>
    </div>
  )
}

function HomeBak() {
  return (
    <div className="h-screen bg-sky-700 text-slate-50">
      <header className="flex flex-col items-center justify-center pt-28">
        <div className="flex items-center justify-center gap-4">
          <img src={Logo} alt="Logo" className="h-14 w-14" />
          <h1 className="text-4xl font-bold">乾冠国产化数字法庭服务</h1>
        </div>
        <em className="text-2xl">国产化服务器适配说明</em>
      </header>

      <main className="mt-8 flex flex-col items-center justify-center text-xl">
        <ul>
          <li>
            <strong>国产化操作系统：</strong>
            统信服务器操作系统V20（1050u2）
          </li>
          <li>
            <strong>数据库：</strong>OB (OceanBase)
          </li>
          <li>
            <strong>中间件：</strong>无
          </li>
        </ul>
      </main>
    </div>
  )
}

export { Home }
