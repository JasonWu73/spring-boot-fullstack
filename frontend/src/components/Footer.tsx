function Footer() {
  return (
    <footer className="sticky top-[100vh] bg-slate-800 text-snow-1">
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} 吴仙杰 v0.1.0
        </p>
      </div>
    </footer>
  )
}

export { Footer }
