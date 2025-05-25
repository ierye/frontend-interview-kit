
import viteLogo from '/vite.svg'
import './App.css'

function getAssetsUrl(name: string) {
  return new URL(`./assets/${name}`, import.meta.url).href
}

function App() {

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={getAssetsUrl('react.svg')} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Trade App</h1>
      <a href='/'>Back</a>
    </>
  )
}

export default App
