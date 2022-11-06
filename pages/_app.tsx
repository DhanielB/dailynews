import "../styles/globals.css";
import Router from "next/router";
import Layout from "../components/Layout";
import { useState, useEffect } from "react"

export default function App({
  Component,
  pageProps
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };

    const end = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return ( 
    <div>
      {loading ? (
        <Layout>
          <p className="text-gray-400 top-[1rem] left-[8rem] md:top-[1rem] md:left-[27.5rem] absolute">
            Carregando...
          </p>
        </Layout>
      ) : (
        <Component {...pageProps}/>
      )}
    </div>
  );
}
