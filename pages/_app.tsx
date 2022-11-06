import "../styles/globals.css";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import pensador from "pensador"
function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    router.isReady && setIsLoading(false)
  }, []) 

  return (
    <div>
      {isLoading ? (
        <Layout>
          <p className="text-gray-400 top-[1rem] left-[8rem] md:top-[1rem] md:left-[27.5rem] absolute">
            Carregando... {pensador.getFromMotivacionais().then(result => result.message)}
          </p>
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </div>
  )
}

export default MyApp
