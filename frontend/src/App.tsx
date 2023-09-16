import React from 'react';

/**
 * 呈现主要应用程序组件。
 *
 * @return 呈现的应用程序组件
 */
export default function App() {
  // const time = new Date().toLocaleTimeString();
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return React.createElement("header", null, '你好 React: ' + time);

  // return (
  //   <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
  //     <h1 className="font-bold text-4xl underline">Hello World!</h1>
  //   </div>
  // );
}
