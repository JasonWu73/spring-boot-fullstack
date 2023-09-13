import{aG as i,aF as e,R as m,aO as h,bB as u,aP as p}from"./SuspenseLoading-261fce6d.js";const _="/assets/favicon-b74bfe65.png",N="/assets/logo-white-97b6e7cb.png",n="a-active";let r=null;function l(a){a.preventDefault(),r&&r.classList.remove(n);const d=a.target.getAttribute("href"),s=document.querySelector(d);s.scrollIntoView({behavior:"smooth"}),s.classList.add(n),r=s}function g(){return i("header",{className:"tour-header",children:[e("div",{className:"tour-header__logo-box",children:e("img",{src:N,alt:"Logo",className:"tour-header__logo"})}),i("div",{className:"tour-header__text-box",children:[i("h1",{className:"tour-heading-primary",children:[e("span",{className:"tour-heading-primary--main",children:"户外运动"}),e("span",{className:"tour-heading-primary--sub",children:"是生活发生的地方"})]}),e("a",{href:"#section-tours",className:"btn btn--white btn--animated",onClick:l,children:"发现我们的旅行"})]})]})}const f="/assets/nat-1-large-2f1114b9.jpg",b="/assets/nat-2-large-ce25097b.jpg",v="/assets/nat-3-large-e2a9fad0.jpg";const y=[{icon:"icon-basic-world",title:"探索世界",body:"在大自然的怀抱中，我们可以栉风沐雨，临山观水；可以聆听鸟鸣欢歌，松涛海浪；可以感受来自田园的清新馨香的自然之风；在大自然的怀抱中我们不需要隐匿什么，也不需要雕饰什么，一切都是那样的自如随意；在大自然的怀抱中，我们可以暂时摆脱一切烦恼。"},{icon:"icon-basic-compass",title:"遇见大自然",body:"面对着奔涌的江流，江水拍击着堤岸，感受着大自然中时光的流逝，犹如这东逝的水一般，昙花的一现，告诉我们，越是美丽的事物，它的美才是最值得珍惜的，错过了，无需感伤，杨柳枯了，有再青的时候；花儿谢了，也有再开的时候，这便是自然的轮回。"},{icon:"icon-basic-map",title:"找到你的方式",body:"你可以登上高高的山冈，找一片空地躺下，对着蓝天，吸吮着它的深邃，它的一尘不染的芳馥。闭上双眼，嘴里潇洒地衔着一片被季节遗弃的枫叶，任微笑的阳光拂过，拂过那没有一丝皴皱的心田。清风吹拂，摇曳大自然的风铃；黄莺歌咏，鸣啭着大自然的心音。"},{icon:"icon-basic-heart",title:"更健康的生活",body:"远离屏幕，将为您的心理健康和家人的安宁创造奇迹。在户外共度美好时光也是加深家庭纽带和留下独特回忆的好方法。在大自然中度过的时间是值得的。它不仅可以减轻压力，而且自然环境还可以改善您的情绪并改善身心健康。外面时间的价值怎么强调都不为过。"}];function x(){return e("section",{className:"tour-section-features",children:e("div",{className:"row",children:y.map(a=>e("div",{className:"col-1-of-4",children:i("div",{className:"feature-box",children:[e("i",{className:`feature-box__icon ${a.icon}`}),e("h3",{className:"tour-heading-tertiary u-margin-bottom-small",children:a.title}),e("p",{className:"feature-box__text",children:a.body})]})},a.icon))})})}const k=[{id:1,title:"海洋探险家",details:["3 日游","最多 30 人","2 名导游","睡在舒适的酒店","难度：容易"],price:"1,782"},{id:2,title:"森林旅行者",details:["7 日游","最多 40 人","6 名导游","睡在提供的帐篷","难度：中等"],price:"2,479"},{id:3,title:"雪地冒险家",details:["5 日游","最多 15 人","3 名导游","睡在提供的帐篷","难度：困难"],price:"5,262"}];function T(){return i("section",{className:"tour-section-tours",id:"section-tours",children:[e("div",{className:"u-center-text u-margin-bottom-big",children:e("h2",{className:"tour-heading-secondary",children:"最受欢迎的旅游"})}),e("div",{className:"row",children:k.map(a=>e("div",{className:"col-1-of-3",children:i("div",{className:"card",children:[i("div",{className:"card__side card__side--front",children:[e("div",{className:`card__picture card__picture--${a.id}`,children:" "}),e("h4",{className:"card__heading",children:e("span",{className:`card__heading-span card__heading-span--${a.id}`,children:a.title})}),e("div",{className:"card__details",children:e("ul",{children:a.details.map(c=>e("li",{children:c},c))})})]}),e("div",{className:`card__side card__side--back card__side--back-${a.id}`,children:i("div",{className:"card__action",children:[i("div",{className:"card__price-box",children:[e("p",{className:"card__price-only",children:"仅需"}),i("p",{className:"card__price-value",children:["¥",a.price]})]}),e("a",{href:"#popup",onClick:l,className:"btn btn--white",children:"立即预订"})]})})]})},a.id))}),e("div",{className:"u-center-text u-margin-top-big",children:e("a",{href:"#",onClick:a=>a.preventDefault(),className:"btn btn--green",children:"发现所有旅游"})})]})}const o="/assets/nat-8-5066b07f.jpg",t="/assets/nat-9-e4231cab.jpg",S="/assets/video-c394461d.mp4",w="/assets/video-72ffe039.webm",C=[{id:1,person:"叶蔷薇",title:"我和家人度过了最美好的一周",body:"工作别太疲惫，心情别太郁闷，没事多喝点水，周末多多聚会，友情最为珍贵，朋友真心相对，生活添点趣味，天天快乐相随!",imgSrc:o},{id:2,person:"吴仙杰",title:"哇！我的生活现次变得不同了",body:"一个人，只有永远拥有充满梦想和激-情的心灵，才能真正懂得生活的意义，也才能从真正的意义上享受生活！",imgSrc:t}];function F(){return i("section",{className:"tour-section-stories",children:[e("div",{className:"background-video",children:i("video",{className:"background-video__content",autoPlay:!0,muted:!0,loop:!0,children:[e("source",{src:S,type:"video/mp4"}),e("source",{src:w,type:"video/webm"}),"抱歉，您的浏览器版本过低不支持播放 MP4 或 Webm 格式视频！"]})}),e("div",{className:"u-center-text u-margin-bottom-big",children:e("h2",{className:"tour-heading-secondary",children:"为人们带来真正的快乐"})}),C.map(a=>e("div",{className:"row",children:i("div",{className:"story",children:[i("figure",{className:"story__shape",children:[e("img",{src:a.imgSrc,alt:"旅游的人",className:"story__img"}),e("figcaption",{className:"story__caption",children:a.person})]}),i("div",{className:"story__text",children:[e("h3",{className:"tour-heading-tertiary u-margin-bottom-small",children:a.title}),e("p",{children:a.body})]})]})},a.id)),e("div",{className:"u-center-text u-margin-top-big",children:e("a",{href:"#",onClick:a=>a.preventDefault(),className:"btn-text",children:"发现所有故事 →"})})]})}function A(){return e("section",{className:"tour-section-book",children:e("div",{className:"row",children:e("div",{className:"tour-book",children:e("div",{className:"tour-book__form",children:i("form",{action:"#",className:"form",autoComplete:"off",onSubmit:a=>a.preventDefault(),children:[e("div",{className:"u-margin-bottom-medium",children:e("h2",{className:"tour-heading-secondary",children:"立即预订"})}),i("div",{className:"form__group",children:[e("input",{type:"text",className:"form__input",placeholder:"姓名",id:"name",required:!0}),e("label",{htmlFor:"name",className:"form__label",children:"姓名"})]}),i("div",{className:"form__group",children:[e("input",{type:"email",className:"form__input",placeholder:"邮箱",id:"email",required:!0}),e("label",{htmlFor:"email",className:"form__label",children:"邮箱"})]}),i("div",{className:"form__group u-margin-bottom-medium",children:[i("div",{className:"form__radio-group",children:[e("input",{type:"radio",className:"form__radio-input",id:"small",name:"size"}),i("label",{htmlFor:"small",className:"form__radio-label",children:[e("span",{className:"form__radio-button"}),"小型旅行团"]})]}),i("div",{className:"form__radio-group",children:[e("input",{type:"radio",className:"form__radio-input",id:"large",name:"size"}),i("label",{htmlFor:"large",className:"form__radio-label",children:[e("span",{className:"form__radio-button"}),"大型旅行团"]})]})]}),e("div",{className:"form__group",children:e("button",{className:"btn btn--green",children:"下一步 →"})})]})})})})})}const O=[{title:"大自然的五彩缤纷",body:"大自然是一个神奇的魔术师，把世界万物变得五颜六色。每个季节都十分美丽，但春姑娘的颜色是最多的。这都是大自然给的。大自然给予了春天许许多多的东西。是大自然把枯萎的树皮洒满了红、白、绿等不同的颜色；是大自然把山坡点缀得五彩缤纷；是大自然把森林协奏曲谱上了乐章；是大自然为花儿穿上美丽、鲜艳的衣裳，喷上馥郁的清香，使它们个个争妍斗艳，好不美丽。"},{title:"大自然好像一首曲",body:"大自然好像一首曲，一首无边无际的曲，每个音符都带有动听的音律，每个音节都带着欢快的节奏，每个音段都带有柔美和安适，歌曲自然而不失感点，多似水中有动的鱼儿，自由，愉快。这首曲载着倾听者无虑的梦想，使倾听者感受曲中大自然的鸟语花香，大自然的多彩芬芳，思绪沉沦在大自然如此令人向往之中。"}],D=[{src:f,alt:"Photo 1",id:"p1"},{src:b,alt:"Photo 2",id:"p2"},{src:v,alt:"Photo 3",id:"p3"}];function E(){return i("main",{children:[i("section",{className:"tour-section-about",children:[e("div",{className:"u-center-text u-margin-bottom-big",children:e("h2",{className:"tour-heading-secondary",children:"为喜欢冒险的人而准备的激动人心的旅行"})}),i("div",{className:"row",children:[i("div",{className:"col-1-of-2",children:[O.map(a=>i(m.Fragment,{children:[e("h3",{className:"tour-heading-tertiary u-margin-bottom-small",children:a.title}),e("p",{className:"tour-paragraph",children:a.body})]},a.title)),e("a",{href:"#",className:"btn-text",onClick:a=>a.preventDefault(),children:"了解更多 →"})]}),e("div",{className:"col-1-of-2",children:e("div",{className:"composition",children:D.map(a=>e("img",{src:a.src,alt:a.alt,className:`composition__photo composition__photo--${a.id}`},a.id))})})]})]}),e(x,{}),e(T,{}),e(F,{}),e(A,{})]})}const P="/assets/logo-green-2x-e38f391f.png",j=[{id:1,href:"#",name:"公司"},{id:2,href:"#",name:"联系我们"},{id:3,href:"#",name:"街道"},{id:4,href:"#",name:"隐私政策"},{id:5,href:"#",name:"条款"}];function I(){return i("footer",{className:"footer",children:[e("div",{className:"footer__logo-box",children:e("img",{src:P,alt:"大 Logo",className:"footer__logo"})}),i("div",{className:"row",children:[e("div",{className:"col-1-of-2",children:e("div",{className:"footer__navigation",children:e("ul",{className:"footer__list",children:j.map(a=>e("li",{className:"footer__item",children:e("a",{href:a.href,onClick:c=>c.preventDefault(),className:"footer__link",children:a.name})},a.id))})})}),e("div",{className:"col-1-of-2",children:i("p",{className:"footer__copyright",children:["由 ",e("a",{href:"#",onClick:a=>a.preventDefault(),className:"footer__link",children:"Jonas Schmedtmann"})," 为他的课程设计。你可以将此页面设计用途个人或商业用途，但不可声明此设计的作者是你自己！"]})})]})]})}const L=[{id:"01",name:"关于旅行"},{id:"02",name:"你的优势"},{id:"03",name:"热门旅游"},{id:"04",name:"旅行故事"},{id:"05",name:"立即预订"}];function $(){return i("section",{className:"navigation",children:[e("input",{type:"checkbox",className:"navigation__checkbox",id:"navigation-toggle"}),e("label",{htmlFor:"navigation-toggle",className:"navigation__button",children:e("span",{className:"navigation__icon",children:" "})}),e("div",{className:"navigation__background",children:" "}),e("nav",{className:"navigation__nav",children:e("ul",{className:"navigation__list",children:L.map(a=>e("li",{className:"navigation__item",children:i("a",{href:"#",className:"navigation__link",onClick:c=>c.preventDefault(),children:[e("span",{children:a.id}),a.name]})},a.id))})})]})}function R(){return e("div",{className:"popup",id:"popup",children:i("div",{className:"popup__content",children:[i("div",{className:"popup__left",children:[e("img",{src:o,alt:"游行照片",className:"popup__img"}),e("img",{src:t,alt:"游行照片",className:"popup__img"})]}),i("div",{className:"popup__right",children:[e("a",{href:"#section-tours",className:"popup__close",onClick:l,children:"×"}),e("h2",{className:"tour-heading-secondary u-margin-bottom-small",children:"开始预订"}),e("h3",{className:"tour-heading-tertiary u-margin-bottom-small",children:"重要 – 请阅读相关条款"}),e("p",{className:"popup__text",children:"只想进行一场漫无目的的旅行，在一个有花有海、安静缓慢的地方晒着太阳无所事事。我在时间的轨迹上徘徊，踏上每一列经过的车。沿途的风景在渐渐远去，我举着那快叫思念的车牌，等待着最后一站——故乡。那时，青年人不断思考，却什么答案也得不到，于是他们去流浪;这天，青年人不去思考，无数答案和观点就已将我们包围，于是我们去旅游。一颗说走就走的心，一个会拍照的情侣，一段甜蜜的旅程。我和西藏之间，只隔着一张火车票!每个人心中，都会有一个古镇情怀，流水江南，烟笼人家。人生至少要有两次冲动，一为奋不顾身的爱情，一为说走就走的旅行。旅行是一种病，当你把身边的人都传染了，而你自己根本不想从中跑出来。出去旅行，不是去看风景，而是去寻回自己——最本真的自己。一辈子是场修行，短的是旅行，长的是人生。"}),e("div",{className:"btn btn--green",children:"立即预订"})]})]})})}function V(){return h("去旅行吧 🏝️"),u(_),i(p,{children:[e($,{}),e(g,{}),e(E,{}),e(I,{}),e(R,{})]})}export{V as default};