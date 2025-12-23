import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateForm from './CreateForm.jsx'
import Form from './Form.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}/>
      <Route path='/create' element={<CreateForm />}/>
      <Route path='/:filename/:sheetname' element={<Form />}/>
    </Routes>
  </BrowserRouter>
)
