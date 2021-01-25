import React, { useEffect, useState } from "react";
import { action, createStore, StoreProvider, useStoreState } from 'easy-peasy'
import { getCredentials, getBands, getOrdersUnshipped } from './apis/bandcamp'
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import Card from './components/Card'
import PdfGenerator from './components/PdfGenerator'
import Button from './components/Button'
import Spinner from './spinner.gif'
import "./App.css";

require('dotenv').config()

function App() {
  const [unfilledOrders, setUnfilledOrders] = useState(null)
  const [confirmCreateShipment, setConfirmCreateShipment] = useState(false)

  const store = createStore({
    pngs: {
      urls: [],
      info: [],
      add: action((state, payload) => {
        state.urls.push(payload);
      }),
      addInfo: action((state, payload) => {
        state.info.push(payload);
      }),
    },
  });

  useEffect(() => {
    async function fetchData() {
      const clientCreds = await getCredentials();
      const accessTkn = clientCreds?.data.access_token;
      const bands = await getBands(accessTkn);
      const ordersUnshipped  = await getOrdersUnshipped(accessTkn, bands)
      setUnfilledOrders(ordersUnshipped?.data.items)
    }
    fetchData()
  }, [])
  
  return (
    <div className="App">
      <StoreProvider store={store}>
        <div className="toBeShipped">
          <h2>Orders To Be Shipped: {unfilledOrders === null ? '' : unfilledOrders.length}</h2>
          <h3>Create and purchsed shipments for all orders below in chitchats</h3>
          <button onClick={() => {
            const result = window.confirm('Are you sure?')
            setConfirmCreateShipment(result)
          }}>CLICK HERE</button>

          {unfilledOrders === null ? ( <img src={Spinner} alt=""/>) : unfilledOrders.map((orderToBeShipped, idx) => { 
            return (
                <Card idx={idx} orderToBeShipped={orderToBeShipped} confirmCreateShipment={confirmCreateShipment} />
            )
          })}
          <Button />
          {/* <PdfGenerator /> */}
          {/* <PDFDownloadLink document={<PdfGenerator />} fileName="somename.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
          </PDFDownloadLink> */}
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
