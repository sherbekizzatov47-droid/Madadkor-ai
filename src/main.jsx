import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n.js'
import './index.css'

// Vapi / Voiceflow kabi browser SDK'lari development paytida ikki marta
// initialize bo‘lib ketmasligi uchun StrictMode ishlatilmayapti.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
