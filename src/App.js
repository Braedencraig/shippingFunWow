import React, { useEffect, useState } from "react";
import { action, createStore, StoreProvider, useStoreState } from 'easy-peasy'
import { getCredentials, getBands, getOrdersUnshipped } from './apis/bandcamp'
import Card from './components/Card'
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
      // setUnfilledOrders(ordersUnshipped?.data.items)

      const result = ordersUnshipped.data.items.reduce(function (r, a) {
        r[a.payment_id] = r[a.payment_id] || [];
        r[a.payment_id].push(a);
        return r;
      }, Object.create(null));
      // HERE WHERE WE LEFT OFF
      const sortedByPaymentId = Object.values(result)
      setUnfilledOrders(sortedByPaymentId)
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
            // THIS IS FINE, CREATE EXCEPTION FOR INDIVIDUAL ORDER PROCESSING BY CHANGING CONFIRMCREATESHIPMENT PROP
          }}>CLICK HERE</button>

          {unfilledOrders === null ? ( <img src={Spinner} alt=""/>) : unfilledOrders.map((orderToBeShipped, idx) => { 
            return (
                <Card idx={idx} orderToBeShipped={orderToBeShipped} confirmCreateShipment={confirmCreateShipment} />
            )
          })}
          <Button />
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
