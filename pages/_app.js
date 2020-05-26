import '../styles/global.css'

/* Podemos definir un estilo global. Los estilos globales se cargan en _app.js */
export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}