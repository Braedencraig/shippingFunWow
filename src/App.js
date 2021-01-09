import { useEffect, useState } from "react";
import logo from "./logo.svg";
import { getCredentials, getBands, getAllRecentOrders, getOrdersUnshipped, markAsShipped } from './apis/bandcamp'
import { createShipment, buyShipment } from './apis/chitchats'
import Spinner from './spinner.gif'
import "./App.css";
import axios from "axios";

require('dotenv').config()

function App() {
  const [unfilledOrders, setUnfilledOrders] = useState(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    async function fetchData() {
      const clientCreds = await getCredentials();
      const accessTkn = clientCreds?.data.access_token;
      setToken(accessTkn)
      const bands = await getBands(accessTkn);
     
      const ordersUnshipped  = await getOrdersUnshipped(accessTkn, bands)
      // const ordersRecent  = await getAllRecentOrders(accessTkn, bands)
      // console.log(ordersRecent)
      // ordersUnshipped.data.items.map(items => {
      //   items['shipmentCompleted'] = false
      // })
      setUnfilledOrders(ordersUnshipped?.data.items)
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <div className="toBeShipped">
        <h2>Orders To Be Shipped</h2>
        {unfilledOrders === null ? ( <img src={Spinner} alt=""/>) : unfilledOrders.map((orderToBeShipped, i) => { 
          // can make this a card component
          return (
            <div key={i} className={`order`}>
              <p>Name: {orderToBeShipped.ship_to_name}</p>
              <p>Address: {orderToBeShipped.ship_to_street}</p>
              {orderToBeShipped.ship_to_street_2 !== null ?  <p>Address2: {orderToBeShipped.ship_to_street_2}</p> : '' }
              <p>City: {orderToBeShipped.ship_to_city}</p>
              <p>State/Province: {orderToBeShipped.ship_to_state}</p>
              <p>Country: {orderToBeShipped.ship_to_country}</p>
              <p>Zip-Postal: {orderToBeShipped.ship_to_zip}</p>
              <p>Phone: {orderToBeShipped.buyer_phone}</p>
              <p>Email: {orderToBeShipped.buyer_email}</p>
              <button onClick={async (e) => {
                const shipment = await createShipment(orderToBeShipped)
                const shipmentBought = await buyShipment(shipment.id)
                console.log(shipmentBought)
                e.target.style.backgroundColor = 'green'
                e.target.innerHTML = 'Shipment Created'
                
           
                // THIS WORKS
                // FIRE THIS 24 HOURS AFTER, easiest way, instead of when flag has changed in CC
                // const test = await markAsShipped(token, orderToBeShipped, shipment.tracking)
              }}>Create & Buy Shipment</button>
              {/* <div>{shipmentMade ? "shipment purchased successfully" : "shipment not purchased"}</div> */}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
