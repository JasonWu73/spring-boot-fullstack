import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let usedBy = ''

function configureNProgress() {
  NProgress.configure({
    showSpinner: false
  })
}

function startNProgress(owner = '') {
  if (usedBy && usedBy !== owner) {
    return
  }

  usedBy = owner
  NProgress.start()
}

function endNProgress(owner = '') {
  if (usedBy && usedBy !== owner) {
    return
  }

  usedBy = ''
  NProgress.done()
}

export { configureNProgress, startNProgress, endNProgress }
