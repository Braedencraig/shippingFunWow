import React, { useEffect, useState } from "react";
import { action, createStore, StoreProvider, useStoreState } from 'easy-peasy'
import { getCredentials, getBands, getOrdersUnshipped } from './apis/bandcamp'

import Card from './components/Card'
import Button from './components/Button'
import BandcampButton from './components/BandcampButton'

import Spinner from './spinner.gif'
import "./App.css";

require('dotenv').config()

function App() {
  const [unfilledOrders, setUnfilledOrders] = useState(null)
  const [confirmCreateShipment, setConfirmCreateShipment] = useState(false)
  const [token, setToken] = useState('')

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
      setToken(accessTkn)
      const bands = await getBands(accessTkn);
      const ordersUnshipped  = await getOrdersUnshipped(accessTkn, bands)
      const result = ordersUnshipped.data.items.reduce(function (r, a) {
        r[a.payment_id] = r[a.payment_id] || [];
        r[a.payment_id].push(a);
        return r;
      }, Object.create(null));
      const sortedByPaymentId = Object.values(result)
      setUnfilledOrders(sortedByPaymentId)
    }
    fetchData()
  }, [setToken])
  
  return (
    <div className="App">
      <StoreProvider store={store}>
        <div className="toBeShipped">
          <h2>Orders To Be Shipped: {unfilledOrders === null ? '' : unfilledOrders.length}</h2>
          <button onClick={() => {
            const result = window.confirm('Select all shipments?')
            setConfirmCreateShipment(result)
          }}>Select All Shipments For Processing</button>
          {unfilledOrders === null ? ( <img src={Spinner} alt=""/>) : unfilledOrders.map((orderToBeShipped, idx) => {   
            return (
                <Card key={orderToBeShipped[0].sale_item_id} orderToBeShipped={orderToBeShipped} idx={idx} confirmCreateShipment={confirmCreateShipment} />
            )
          })}
          <Button />
          <BandcampButton unfilledOrders={unfilledOrders} token={token} />
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
