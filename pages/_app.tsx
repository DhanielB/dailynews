import "../styles/globals.css";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useState, useEffect } from "react"
import { Analytics } from '@vercel/analytics/react';

export default function App({
  Component,
  pageProps
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

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
      <Analytics/>
    </div>
  );
}
