/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import {
  createShipmentWebflow,
  buyShipment,
  getShipment,
} from "../apis/chitchats";
import { markAsShippedWebflow } from "../apis/webflow";
import Spinner from "../logoidee.svg";

const WebflowCard = ({ orderToBeShipped, shipments, token }) => {
  // Initial component state
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedShip, setCheckedShip] = useState(false);
  const [removeShip, setRemoveShip] = useState(false);
  const [complete, setComplete] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [preorder, setPreorder] = useState(false);
  const [cannotProcess, setCannotProcess] = useState(false);
  const [added, setAdded] = useState(false);
  const [price, setPrice] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [tracking, setTracking] = useState("");

  const handleClick = () => setChecked(!checked);
  const handleClickShip = () => {
    setCheckedShip(!checkedShip);
    setNotificationSent(true);
    shipments.data.map(async (shipment) => {
      if (shipment.order_id === orderToBeShipped.orderId) {
        const url = `https://cors-anywhere.herokuapp.com/https://api.webflow.com/sites/5fd7cabbf4d7129fb098a4db/order/${orderToBeShipped.orderId}/fulfill?access_token=d6d489cda5a6d6c1b769ac8faf0e47ed66ef8ac3546962f2e859bc69800700f3`;
        markAsShippedWebflow(
          orderToBeShipped.orderId,
          shipment.tracking_url,
          url
        );
      }
    });
  };

  // custom actions for redux store
  const add = useStoreActions((actions) => actions.webflowPngs.add);
  const addInfo = useStoreActions((actions) => actions.webflowPngs.addInfo);
  const addError = useStoreActions((actions) => actions.errors.add);

  // A small piece of UI to render the individual items from an order
  // Highlight the amount if quantity is more than 1 of a single thing.
  const items = orderToBeShipped.purchasedItems.map((item) => {
    return (
      <li key={orderToBeShipped.orderId}>
        <span className={`${item.count > 1 ? "highlight" : ""} quantity`}>
          {item.count}
        </span>
        {item.variantName.replace("Physical:", "")}
      </li>
    );
  });

  const createShipmentFunc = async (orderToBeShipped) => {
    // Create the shipment based on information from bandcamp.
    const shipment = await createShipmentWebflow(orderToBeShipped);
    // Handle errors during shipment creation, if chitchats errors
    // We add the error to the store and update UI based on setCannotProcess
    if (shipment === "Something went wrong" || shipment === undefined) {
      addError("Error");
      setCannotProcess(true);
    } else {
      setLoading(true);
      const shipmentBought = await buyShipment(shipment.id);
      if (shipmentBought) {
        // When we get the shipment after purchase so soon, the postage_label_png_url value is null
        // We need to give chitchats time on their end to create that postage label and add it to the response object.
        // To avoid calling the api over and over until its there, for now i'm just using a setTimeout.
        setTimeout(async () => {
          const getShipmentInfo = await getShipment(shipment.id);
          setLoading(false);
          add(getShipmentInfo.data.shipment.postage_label_png_url);
          addInfo(orderToBeShipped);
          setComplete(true);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    // Go through all shipments on initial load and update state/render appropriate ui.
    if (shipments) {
      shipments.data.map((test) => {
        // console.log(test, orderToBeShipped[0].payment_id);
        // if (
        //   parseInt(test.order_id) === orderToBeShipped[0].payment_id &&
        //   (test.status === "ready" ||
        //     test.status === "exception" ||
        //     test.status === "received" ||
        //     test.status === "delivered" ||
        //     test.status === "inducted")
        // ) {
        //   setPrice(test.purchase_amount);
        //   setTracking(test.tracking_url);
        //   setAlreadyPurchased(true);
        // }
      });
    }
  }, []);

  useEffect(() => {
    // TODO: Create UI based on whether or not an item is a pre-order.
    orderToBeShipped.purchasedItems.map((item) => {
      console.log(item, "VARIANTSKU WEB");
      if (item.variantSKU !== null && item.variantSKU.includes("PO")) {
        setPreorder(true);
      }
    });
    // if individual card is checked, shipment is created
    if (checked) {
      createShipmentFunc(orderToBeShipped);
    }
    // Once shipment is purchased, if shipment checkbox is selected, order will be marked as shipped in bandcamp DB
    // and customer will get a confirmation email with tracking URL for their package.
    // if (checkedShip) {
    //   shipments.data.map(async (shipment) => {
    //     if (orderToBeShipped[0].payment_id === shipment.order_id) {
    //       console.log("IT IS SHIPPER");
    //       // markAsShipped(
    //       //   token,
    //       //   orderToBeShipped[0].payment_id,
    //       //   shipment.tracking_url
    //       // );
    //     }
    //   });
    // }
  }, [checked, checkedShip]);

  if (notificationSent) {
    return (
      <div key={orderToBeShipped.orderId} className={`order note-sent`}>
        <div>
          <span className="date">
            <div>
              {orderToBeShipped.acceptedOn.substring(
                0,
                orderToBeShipped.acceptedOn.length - 14
              )}
            </div>
            {orderToBeShipped.orderId}
            {tracking !== "" && (
              <a href={tracking} target="_blank" rel="noreferrer">
                Tracking Url
              </a>
            )}
          </span>
        </div>
        <div>
          <p>{orderToBeShipped.customerInfo.fullName}</p>
          <p>{orderToBeShipped.billingAddress.country}</p>
        </div>
        <div className="flexContainer">
          <ul>{items}</ul>
        </div>
        <div className="buttons">
          <button className="buttonRounded opacity">Purchased</button>
          <button className="buttonRounded opacity">Reprint label</button>
          <button className="buttonRounded button-proc">NOTE SENT</button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div key={orderToBeShipped.orderId} className={`order processing`}>
        <div>
          <span className="date">
            <div>
              {orderToBeShipped.acceptedOn.substring(
                0,
                orderToBeShipped.acceptedOn.length - 14
              )}
            </div>
            {orderToBeShipped.orderId}
          </span>
        </div>
        <div>
          <p>{orderToBeShipped.customerInfo.fullName}</p>
          <p>{orderToBeShipped.billingAddress.country}</p>
        </div>
        <div className="flexContainer">
          <ul>{items}</ul>
        </div>
        <div className="buttons">
          <button className="buttonRounded button-proc">Processing</button>
          <button className="buttonRounded opacity">Reprint label</button>
          <button className="buttonRounded opacity">Mark Shipped</button>
        </div>
      </div>
    );
  }

  // This is what renders if a shipment cannot be created/errors during shipment creation.
  if (cannotProcess) {
    return (
      <div key={orderToBeShipped.orderId} className={`order manualComplete`}>
        <span className="date">
          <div>
            {orderToBeShipped.acceptedOn.substring(
              0,
              orderToBeShipped.acceptedOn.length - 14
            )}
          </div>
          {orderToBeShipped.orderId}
        </span>
        <div>
          <p>{orderToBeShipped.customerInfo.fullName}</p>
          <p>{orderToBeShipped.billingAddress.country}</p>
        </div>
        <div className="flexContainer">
          <ul>{items}</ul>
        </div>
        <div className="buttons">
          <button className="buttonRounded error-btn">ERROR</button>
          <button className="buttonRounded opacity">Reprint label</button>
          <button className="buttonRounded opacity">Mark Shipped</button>
        </div>
      </div>
    );
  }

  return (
    <div
      key={orderToBeShipped.orderId}
      className={`order ${alreadyPurchased && "completeOrder"} ${
        complete ? "complete" : ""
      } ${checked ? "pdfReady" : ""} ${preorder ? "blankOut" : ""}`}
    >
      <span className="date">
        <div>
          {orderToBeShipped.acceptedOn.substring(
            0,
            orderToBeShipped.acceptedOn.length - 14
          )}
        </div>
        {orderToBeShipped.orderId}
        {tracking !== "" && (
          <a href={tracking} target="_blank" rel="noreferrer">
            Tracking Url
          </a>
        )}
      </span>
      {alreadyPurchased && price !== null ? <div>${price}</div> : <div>-</div>}
      <div className="name">
        <p>{orderToBeShipped.customerInfo.fullName}</p>
        <p>{orderToBeShipped.billingAddress.country}</p>
      </div>
      <div className="flexContainer">
        <ul>{items}</ul>
      </div>
      <div className="buttons">
        <button
          className={`buttonRounded ${
            alreadyPurchased ? "opacity" : "purchase"
          }`}
          onClick={() => handleClick()}
        >
          {alreadyPurchased ? "Purchased" : "Purchase Postage"}
        </button>
        <button
          className={`buttonRounded ${
            alreadyPurchased ? "reprint" : "opacity"
          }`}
          disabled={added}
          onClick={() => {
            shipments.data.map(async (ship) => {
              // If the order id matches the payment id we have our shipment.
              if (
                ship.order_id === orderToBeShipped.orderId &&
                ship.status === "ready"
              ) {
                const getShipmentInfo = await getShipment(ship.id);
                // if (getShipmentInfo.data.shipment.status === "ready") {
                // Update the store with the information for the shipment we want to print the label of.
                add(getShipmentInfo.data.shipment.postage_label_png_url);
                addInfo(orderToBeShipped);
                setAdded(true);
                // }
              }
            });
          }}
        >
          {!added ? "Reprint label" : "Added"}
        </button>
        <button
          className={`buttonRounded ${
            alreadyPurchased ? "shipped" : "opacity"
          }`}
          onClick={() => handleClickShip()}
        >
          Mark Shipped
        </button>
      </div>
    </div>
  );
};

export default WebflowCard;
