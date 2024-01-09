import NProgress from "nprogress";
import "nprogress/nprogress.css";

/**
 * NProgress 加载计数器，防止因多个异步请求导致 NProgress 过早结束。
 */
let counter = 0;

/**
 * 全局配置 NProgress。
 *
 * 1. 不显示 NProgress Spinner 图标
 */
export function configureNProgress() {
  NProgress.configure({
    showSpinner: false,
  });
}

/**
 * 开始 NProgress 加载。
 */
export function startNProgress() {
  counter++;
  NProgress.start();
}

/**
 * 结束 NProgress 加载。
 */
export function endNProgress() {
  counter--;

  if (counter > 0) return;

  counter = 0;
  NProgress.done();
}
