import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from "react-helmet-async";
import './App.css'
import CreateInvoice from './pages/CreateInvoice'
import InvoiceListing from './pages/InvoiceListing'
import Invoice from './pages/Invoice'

import Layout from './components/Layout/Layout'

function App() {

  return (
    <>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route path='/' element={<CreateInvoice />} />
              <Route path='/invoices' element={<InvoiceListing />} />
              <Route path='/invoice/:id' element={<Invoice />} />
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  )
}

export default App
