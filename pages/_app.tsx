import "../styles/globals.css";
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />;
      
      <Script src="//cdn.jsdelivr.net/npm/eruda"></Script>
      <Script>eruda.init();</Script>
    </div>
  )
}

export default MyApp;
