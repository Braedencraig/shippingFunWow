import React, { useEffect, useState } from "react";
import { action, createStore, StoreProvider } from "easy-peasy";
import { getCredentials, getBands, getOrdersUnshipped } from "./apis/bandcamp";
import { getAllShipments } from "./apis/chitchats";
import Card from "./components/Card";
import Nav from "./components/Nav";
import Button from "./components/Button";
import Spinner from "./logoidee.svg";
import "./App.css";

require("dotenv").config();

function App() {
  // Setting up initial state
  const [unfilledOrders, setUnfilledOrders] = useState(null);
  const [token, setToken] = useState("");
  const [allShipments, setAllShipments] = useState(null);
  const [bandcampError, setBandcampError] = useState(false);

  // Setting up easy-peasy store to handle info/tracking pngs when creating shipment labels
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
    // webflowPngs: {
    //   urls: [],
    //   info: [],
    //   add: action((state, payload) => {
    //     state.urls.push(payload);
    //   }),
    //   addInfo: action((state, payload) => {
    //     state.info.push(payload);
    //   }),
    // },
    errors: {
      items: [],
      add: action((state, payload) => {
        state.items.push(payload);
      }),
    },
  });

  useEffect(() => {
    async function fetchData() {
      // Get all current shipments from chitchats account
      const allCurrentShipments = await getAllShipments();
      setAllShipments(allCurrentShipments);
      // Get bandcamp credentials
      const clientCreds = await getCredentials();
      if (clientCreds === "error") {
        setBandcampError(true);
      } else {
        const accessTkn = clientCreds?.data.access_token;
        setToken(accessTkn);
        // Get all active bands from the record labels bandcamp database
        const bands = await getBands(accessTkn);
        // Get all unshipped orders for all bands
        const ordersUnshipped = await getOrdersUnshipped(accessTkn, bands);
        // Here we are sorting the orders by payment id, if someone bought one record from one band and a shirt from another
        // They would show up as two separate orders, but we wouldn't want to create two shipments for that one customer
        // So we sort the unshipped orders by payment id
        const result = ordersUnshipped.data.items.reduce(function (r, a) {
          r[a.payment_id] = r[a.payment_id] || [];
          // push all orders sharing payment id into an array.
          r[a.payment_id].push(a);
          return r;
        }, Object.create(null));
        // Now we have all orders sorted by paymentId
        const sortedByPaymentId = Object.values(result);
        // If record label inputs the string "skip" in bandcamp database, we dont want to act upon that order. Filters em out.
        const filteredOutSkip = sortedByPaymentId.filter((order) => order[0].ship_notes === null || order[0].ship_notes.indexOf("skip") === -1);
        // Finally we set all unfilled orders here.
        setUnfilledOrders(filteredOutSkip);
      }
    }
    fetchData();
  }, []);

  // Bandcamp auth request every once in a while returns a 400, not sure why, but if it does happen
  // a quick refresh sorts it out.
  if (bandcampError) {
    window.location.reload();
    return (
      <div className="loadingDisplay">
        <h2>Error with Bandcamp API Secret, Please Refresh</h2>
      </div>
    );
  }

  // If we have no orders, show loading state
  if (unfilledOrders === null) {
    return (
      <div className="loadingDisplay">
        <h2>Gathering Unshipped Orders</h2>
        <img className="rotate" src={Spinner} alt="" />
      </div>
    );
  }

  return (
    <div className="App">
      <StoreProvider store={store}>
        <Nav>
          <Button />
        </Nav>
        <div className="toBeShipped">
          <h2>Idee Fixe Bandcamp: {unfilledOrders === null ? "" : unfilledOrders.length} orders</h2>
          <div className="orderFlex">
            {unfilledOrders &&
              unfilledOrders.map((orderToBeShipped, idx) => {
                return <Card key={orderToBeShipped[0].sale_item_id} orderToBeShipped={orderToBeShipped} shipments={allShipments} token={token} />;
              })}
          </div>
          {/* <div className="button">
            <Button />
          </div> */}
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
