import '@/styles/globals.css'
import type { AppProps } from 'next/app'

function Xxx () {
  return(
    <h1>wefwefwefwefwef</h1>
  )
}

export default function App({ Component, pageProps }: AppProps) {


  return (
    <div>

    <Xxx/>
      <Component {...pageProps} />
    </div>
  )

}