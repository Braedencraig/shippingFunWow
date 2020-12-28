import { useEffect, useState } from "react";
import logo from "./logo.svg";
import { getCredentials, getBands, getAllRecentOrders, getOrdersUnshipped } from './apis/bandcamp'
import { createShipment } from './apis/chitchats'
import Spinner from './spinner.gif'
import "./App.css";
require('dotenv').config()
// ADD TRY CATCHES TO ALL API CALLS

function App() {
  const [unfilledOrders, setUnfilledOrders] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const clientCreds = await getCredentials();
      const accessTkn = clientCreds?.data.access_token;
      const bands = await getBands(accessTkn);
     
      const ordersUnshipped  = await getOrdersUnshipped(accessTkn, bands)
      const ordersRecent  = await getAllRecentOrders(accessTkn, bands)
      setUnfilledOrders(ordersUnshipped?.data.items)
    }
    fetchData()
    
    console.log(unfilledOrders)
  }, [unfilledOrders])

  return (
    <div className="App">
      <div className="toBeShipped">
        <h2>Orders To Be Shipped</h2>
        {unfilledOrders === null ? ( <img src={Spinner} alt=""/>) : unfilledOrders.map(orderToBeShipped => {
        return (
          <div className="order">
            <p>Name: {orderToBeShipped.ship_to_name}</p>
            <p>Address: {orderToBeShipped.ship_to_street}</p>
            {orderToBeShipped.ship_to_street_2 !== null ?  <p>Address2: {orderToBeShipped.ship_to_street_2}</p> : '' }
            <p>City: {orderToBeShipped.ship_to_city}</p>
            <p>State/Province: {orderToBeShipped.ship_to_state}</p>
            <p>Country: {orderToBeShipped.ship_to_country}</p>
            <p>Zip-Postal: {orderToBeShipped.ship_to_zip}</p>
            <p>Phone: {orderToBeShipped.buyer_phone}</p>
            <p>Email: {orderToBeShipped.buyer_email}</p>
            <button onClick={() => createShipment(orderToBeShipped)}>Create Shipment</button>
          </div>
        )
      })}
      </div>
    </div>
  );
}

export default App;
