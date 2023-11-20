import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let counter = 0

function configureNProgress() {
  NProgress.configure({
    showSpinner: false
  })
}

function startNProgress() {
  counter++
  NProgress.start()
}

function endNProgress() {
  counter--

  if (counter > 0) return

  counter = 0
  NProgress.done()
}

export { configureNProgress, endNProgress, startNProgress }
