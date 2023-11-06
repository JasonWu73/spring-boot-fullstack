import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function nprogressConfig() {
  NProgress.configure({
    showSpinner: false
  })
}

export { nprogressConfig }
