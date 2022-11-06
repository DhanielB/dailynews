import "../styles/globals.css";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    router.isReady && setIsLoading(false)
  }, []) 

  return (
    <div>
      {isLoading ? (
        <>loading...</>
      ) : (
        <Component {...pageProps} />
      )}
    </div>
  )
}

export default MyApp
