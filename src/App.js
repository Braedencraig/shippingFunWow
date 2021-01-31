import React, { useEffect, useState } from "react";
import { action, createStore, StoreProvider, useStoreState } from "easy-peasy";
import { getCredentials, getBands, getOrdersUnshipped } from "./apis/bandcamp";
import { getAllShipments } from "./apis/chitchats";

import Card from "./components/Card";
import Button from "./components/Button";
import BandcampButton from "./components/BandcampButton";

import Spinner from "./spinner.gif";
import "./App.css";

require("dotenv").config();

function App() {
  const [unfilledOrders, setUnfilledOrders] = useState(null);
  const [confirmCreateShipment, setConfirmCreateShipment] = useState(false);
  const [token, setToken] = useState("");
  const [getShip, setGetShip] = useState(null);
  const [bandcampError, setBandcampError] = useState(false);

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
      const ship = await getAllShipments();
      setGetShip(ship);
      const clientCreds = await getCredentials();
      if (clientCreds === "error") {
        setBandcampError(true);
      } else {
        const accessTkn = clientCreds?.data.access_token;
        setToken(accessTkn);
        const bands = await getBands(accessTkn);
        const ordersUnshipped = await getOrdersUnshipped(accessTkn, bands);
        const result = ordersUnshipped.data.items.reduce(function (r, a) {
          r[a.payment_id] = r[a.payment_id] || [];
          r[a.payment_id].push(a);
          return r;
        }, Object.create(null));
        const sortedByPaymentId = Object.values(result);
        const filteredOutSkip = sortedByPaymentId.filter(order => order[0].ship_notes === null || order[0].ship_notes.indexOf("skip") === -1)
        console.log(filteredOutSkip)
        setUnfilledOrders(filteredOutSkip);
        // setUnfilledOrders(sortedByPaymentId);
        var todayDate = new Date().toISOString().slice(0,10);
        console.log(todayDate)
      }
    }
    fetchData();
  }, [setToken, setUnfilledOrders, setGetShip, setBandcampError]);

  console.log(getShip);

  if (bandcampError) {
    return <h2>Error with Bandcamp API Secret, Please Refresh</h2>;
  }

  if (unfilledOrders === null) {
    return (
      <div className="loadingDisplay">
        <h2>Gathering Unshipped Orders</h2>
        <img src={Spinner} alt="" />
      </div>
    );
  }

  return (
    <div className="App">
      <StoreProvider store={store}>
        <div className="toBeShipped">
          <h2>
            Orders To Be Shipped:{" "}
            {unfilledOrders === null ? "" : unfilledOrders.length}
          </h2>
          <div className="btn">
            <button
              onClick={() => {
                const result = window.confirm("Select all shipments?");
                setConfirmCreateShipment(result);
              }}
            >
              Select All Shipments For Processing
            </button>
          </div>
          <div className="orderFlex">
            {unfilledOrders &&
              unfilledOrders.map((orderToBeShipped, idx) => {
                return (
                  <Card
                    key={orderToBeShipped[0].sale_item_id}
                    orderToBeShipped={orderToBeShipped}
                    idx={idx}
                    shipments={getShip}
                    confirmCreateShipment={confirmCreateShipment}
                  />
                );
              })}
          </div>
          <div className="serious">
            <Button />
            <BandcampButton
              unfilledOrders={unfilledOrders}
              token={token}
              shipments={getShip}
            />
          </div>
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
