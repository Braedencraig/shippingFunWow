import React, { useEffect, useState } from "react";
import axios from "axios";

import { action, createStore, StoreProvider } from "easy-peasy";
import {
  getCredentials,
  getCredentialsTwo,
  getBands,
  getOrdersUnshipped,
  getOrdersUnshippedTwo,
} from "./apis/bandcamp";
import { getAllShipments } from "./apis/chitchats";
import { getOrdersUnshippedWebflow } from "./apis/webflow";
import Card from "./components/Card";
import WebflowCard from "./components/WebflowCard";
import Nav from "./components/Nav";
import Button from "./components/Button";
import Spinner from "./logoidee.svg";
import "./App.css";

require("dotenv").config();

function App() {
  const [loggedIn, isLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Setting up initial state
  const [unfilledOrders, setUnfilledOrders] = useState(null);
  const [token, setToken] = useState("");
  const [allShipments, setAllShipments] = useState(null);
  const [bandcampError, setBandcampError] = useState(false);
  // WEBFLOW STATE
  // const [unfilledOrdersWebflow, setUnfilledOrdersWebflow] = useState(null);
  // bandcamp two state
  const [unfilledOrdersTwo, setUnfilledOrdersTwo] = useState(null);
  const [tokenTwo, setTokenTwo] = useState("");
  // webflow state
  const [unfilledOrdersWebflow, setUnfilledOrdersWebflow] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        username === process.env.REACT_APP_USER &&
        password === process.env.REACT_APP_PASSWORD
      ) {
        console.log("IN HERE?!?!?");
        isLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(loggedIn, "asd");

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
    webflowPngs: {
      urls: [],
      info: [],
      add: action((state, payload) => {
        state.urls.push(payload);
      }),
      addInfo: action((state, payload) => {
        state.info.push(payload);
      }),
    },
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
      const clientCredsTwo = await getCredentialsTwo();

      if (clientCreds === "error" || clientCredsTwo === "error") {
        setBandcampError(true);
      } else {
        const accessTkn = clientCreds?.data.access_token;
        setToken(accessTkn);
        const accessTknTwo = clientCredsTwo?.data.access_token;
        setTokenTwo(accessTknTwo);
        // Get all active bands from the record labels bandcamp database
        const bands = await getBands(accessTkn);
        const bandsTwo = await getBands(accessTknTwo);

        // Get all unshipped orders for all bands
        const ordersUnshipped = await getOrdersUnshipped(accessTkn, bands);
        const ordersUnshippedTwo = await getOrdersUnshippedTwo(
          accessTknTwo,
          bandsTwo
        );

        // Here we are sorting the orders by payment id, if someone bought one record from one band and a shirt from another
        // They would show up as two separate orders, but we wouldn't want to create two shipments for that one customer
        // So we sort the unshipped orders by payment id
        const result = ordersUnshipped.data.items.reduce(function (r, a) {
          r[a.payment_id] = r[a.payment_id] || [];
          // push all orders sharing payment id into an array.
          r[a.payment_id].push(a);
          return r;
        }, Object.create(null));

        const resultTwo = ordersUnshippedTwo.reduce(function (r, a) {
          r[a.payment_id] = r[a.payment_id] || [];
          // push all orders sharing payment id into an array.
          r[a.payment_id].push(a);
          return r;
        }, Object.create(null));

        // console.log(resultTwo);
        // Now we have all orders sorted by paymentId
        const sortedByPaymentId = Object.values(result);
        const sortedByPaymentIdTwo = Object.values(resultTwo);

        // If record label inputs the string "skip" in bandcamp database, we dont want to act upon that order. Filters em out.
        const filteredOutSkip = sortedByPaymentId.filter(
          (order) =>
            order[0].ship_notes === null ||
            order[0].ship_notes.indexOf("skip") === -1
        );
        const filteredOutSkipTwo = sortedByPaymentIdTwo.filter(
          (order) =>
            order[0].ship_notes === null ||
            order[0].ship_notes.indexOf("skip") === -1
        );
        // Finally we set all unfilled orders here.
        setUnfilledOrders(filteredOutSkip);
        setUnfilledOrdersTwo(filteredOutSkipTwo);

        const webflowOrders = await getOrdersUnshippedWebflow();
        setUnfilledOrdersWebflow(webflowOrders);
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

  if (!loggedIn) {
    return (
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </form>
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
          <h2>
            IF Bandcamp: {unfilledOrders === null ? "0" : unfilledOrders.length}{" "}
            orders
          </h2>
          <div className="orderFlex">
            {unfilledOrders &&
              unfilledOrders.map((orderToBeShipped, idx) => {
                if (orderToBeShipped[0].payment_state !== "refunded") {
                  return (
                    <Card
                      key={orderToBeShipped[0].sale_item_id}
                      orderToBeShipped={orderToBeShipped}
                      shipments={allShipments}
                      token={token}
                    />
                  );
                }
              })}
          </div>
        </div>
        <div className="toBeShipped">
          <h2>
            IF Webflow:
            {unfilledOrdersWebflow === null
              ? "0"
              : unfilledOrdersWebflow.length}{" "}
            orders
          </h2>
          <div className="orderFlex">
            {unfilledOrdersWebflow &&
              unfilledOrdersWebflow.map((orderToBeShipped, idx) => {
                return (
                  <WebflowCard
                    key={orderToBeShipped.orderId}
                    orderToBeShipped={orderToBeShipped}
                    shipments={allShipments}
                    token={token}
                  />
                );
              })}
          </div>
          {/* <div className="button">
            <Button />
          </div> */}
        </div>
        <div className="toBeShipped">
          <h2>
            Ansible Bandcamp:{" "}
            {unfilledOrdersTwo === null ? "0" : unfilledOrdersTwo.length} orders
          </h2>
          <div className="orderFlex">
            {unfilledOrdersTwo &&
              unfilledOrdersTwo.map((orderToBeShipped, idx) => {
                return (
                  <Card
                    key={orderToBeShipped[0].sale_item_id}
                    orderToBeShipped={orderToBeShipped}
                    shipments={allShipments}
                    token={tokenTwo}
                  />
                );
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
