import React, { useEffect, useState } from "react";
import { action, createStore, StoreProvider, useStoreState } from 'easy-peasy'
import { getCredentials, getBands, getOrdersUnshipped } from './apis/bandcamp'
import { getAllShipments } from './apis/chitchats'


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
  const [getShip, setGetShip] = useState(null)

//   const checkShipments = async (orderToBeShipped) => {
//     const ship = await getAllShipments()
//       ship.data.map(test => {
//         if(parseInt(test.order_id) === orderToBeShipped[0].payment_id) {
//           return <div>asdasdasdsads</div>
//         } else {
//           return (
//             <Card key={orderToBeShipped[0].sale_item_id} orderToBeShipped={orderToBeShipped} confirmCreateShipment={confirmCreateShipment} />
//           )
//         }
//       })
// }

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
      const ship = await getAllShipments()
      setGetShip(ship)
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
  }, [setToken, setUnfilledOrders, setGetShip])

  // if(unfilledOrders !== null) {
  //   console.log(getShip)
  //   unfilledOrders.map(orderToBeShipped => {
  //     getShip.data.map(test => {
  //       if(parseInt(test.order_id) === orderToBeShipped[0].payment_id) {
  //         return <div>IT SHOULDNT BE SHOW</div>
  //       } else {
  //         return (
  //           <Card key={orderToBeShipped[0].sale_item_id} orderToBeShipped={orderToBeShipped} shipments={getShip} confirmCreateShipment={confirmCreateShipment} />
  //         )
  //       }
  //     })
  //   })
  // }

  
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
                <Card key={orderToBeShipped[0].sale_item_id} orderToBeShipped={orderToBeShipped} idx={idx} shipments={getShip} confirmCreateShipment={confirmCreateShipment} />
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
