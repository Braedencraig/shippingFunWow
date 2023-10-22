/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { createShipment, buyShipment, getShipment } from "../apis/chitchats";
import { markAsShipped } from "../apis/bandcamp";
import Spinner from "../logoidee.svg";

const Card = ({ orderToBeShipped, shipments, token }) => {
  // Initial component state
  console.log(orderToBeShipped[0].sku, orderToBeShipped[0].buyer_name);
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

  const handleClick = () => setChecked(!checked);
  const handleClickShip = () => {
    setCheckedShip(!checkedShip);
    setNotificationSent(true);
    shipments.data.map(async (shipment) => {
      if (orderToBeShipped[0].payment_id === Number(shipment.order_id)) {
        markAsShipped(
          token,
          orderToBeShipped[0].payment_id,
          shipment.tracking_url
        );
      }
    });
  };

  // custom actions for redux store
  const add = useStoreActions((actions) => actions.pngs.add);
  const addInfo = useStoreActions((actions) => actions.pngs.addInfo);
  const addError = useStoreActions((actions) => actions.errors.add);

  // A small piece of UI to render the individual items from an order
  // Highlight the amount if quantity is more than 1 of a single thing.
  const items = orderToBeShipped.map((item) => {
    return (
      <li key={item.sale_item_id}>
        <span className={`${item.quantity > 1 ? "highlight" : ""} quantity`}>
          {item.quantity}
        </span>
        {item.item_name}
      </li>
    );
  });

  const createShipmentFunc = async (orderToBeShipped) => {
    // Create the shipment based on information from bandcamp.
    const shipment = await createShipment(orderToBeShipped);
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
        if (
          parseInt(test.order_id) === orderToBeShipped[0].payment_id &&
          (test.status === "ready" ||
            test.status === "exception" ||
            test.status === "received" ||
            test.status === "delivered" ||
            test.status === "inducted")
        ) {
          setPrice(test.purchase_amount);
          setAlreadyPurchased(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    // TODO: Create UI based on whether or not an item is a pre-order.
    orderToBeShipped.map((item) => {
      if (item.sku.includes("PO")) {
        setPreorder(true);
      }
    });

    // if individual card is checked, shipment is created
    if (checked) {
      createShipmentFunc(orderToBeShipped);
    }
    // Once shipment is purchased, if shipment checkbox is selected, order will be marked as shipped in bandcamp DB
    // and customer will get a confirmation email with tracking URL for their package.
    if (checkedShip) {
      shipments.data.map(async (shipment) => {
        if (orderToBeShipped[0].payment_id === shipment.order_id) {
          // markAsShipped(
          //   token,
          //   orderToBeShipped[0].payment_id,
          //   shipment.tracking_url
          // );
        }
      });
    }
  }, [checked, checkedShip]);

  // TODO: Create UI based on whether or not an item is a pre-order.
  // if(preorder) {
  //   return (
  //       <div key={orderToBeShipped[0].sale_item_id} className={`order blankOut`}>
  //         <span className="date">{orderToBeShipped[0].order_date.substring(0, orderToBeShipped[0].order_date.length - 12)}</span>
  //         <p>Name: {orderToBeShipped[0].ship_to_name}</p>
  //         <p>Country: {orderToBeShipped[0].ship_to_country}</p>
  //         <div className="flexContainer">
  //           <p>Items</p>
  //           <ul>{item}</ul>
  //         </div>
  //         <div className="individualShip">
  //         <>
  //             <p className="tinyText">Process Individual Shipment</p>
  //             <input
  //               className="checkbox"
  //               onClick={handleClick}
  //               onChange={() => (confirmCreateShipment = true)}
  //               checked={checked}
  //               type="checkbox"
  //             />
  //         </>
  //       </div>
  //       </div>
  //     );
  // }

  if (notificationSent) {
    return (
      <div key={orderToBeShipped[0].sale_item_id} className={`order note-sent`}>
        <div>
          <span className="date">
            <div>
              {orderToBeShipped[0].order_date.substring(
                0,
                orderToBeShipped[0].order_date.length - 12
              )}
            </div>
            {orderToBeShipped[0].paypal_id ===
              "collected to cover your revenue share balance"}
          </span>
        </div>
        <div>
          <p>{orderToBeShipped[0].ship_to_name}</p>
          <p>{orderToBeShipped[0].ship_to_country}</p>
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
      <div
        key={orderToBeShipped[0].sale_item_id}
        className={`order processing`}
      >
        <div>
          <span className="date">
            <div>
              {orderToBeShipped[0].order_date.substring(
                0,
                orderToBeShipped[0].order_date.length - 12
              )}
            </div>
            {orderToBeShipped[0].paypal_id ===
              "collected to cover your revenue share balance"}
          </span>
        </div>
        <div>
          <p>{orderToBeShipped[0].ship_to_name}</p>
          <p>{orderToBeShipped[0].ship_to_country}</p>
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
      <div
        key={orderToBeShipped[0].sale_item_id}
        className={`order manualComplete`}
      >
        <span className="date">
          <div>
            {orderToBeShipped[0].order_date.substring(
              0,
              orderToBeShipped[0].order_date.length - 12
            )}
          </div>
          {orderToBeShipped[0].paypal_id ===
            "collected to cover your revenue share balance"}
        </span>
        <div>
          <p>{orderToBeShipped[0].ship_to_name}</p>
          <p>{orderToBeShipped[0].ship_to_country}</p>
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

  // This is what renders if a shipment has already been created/purchased
  // if (alreadyPurchased) {
  //   return (
  //     <div key={orderToBeShipped[0].sale_item_id} className={`order completeOrder`}>
  //       <span className="date">{orderToBeShipped[0].order_date.substring(0, orderToBeShipped[0].order_date.length - 12)}</span>
  //       <div>
  //         <p>{orderToBeShipped[0].ship_to_name}</p>
  //         <p>{orderToBeShipped[0].ship_to_country}</p>
  //       </div>
  //       <div className="flexContainer">
  //         <ul>{items}</ul>
  //       </div>
  //       <div className="buttons">
  //         <button className="buttonRounded opacity">Purchased</button>
  // <button
  //   className="buttonRounded reprint"
  //   disabled={added}
  //   onClick={() => {
  //     shipments.data.map(async (ship) => {
  //       // If the order id matches the payment id we have our shipment.
  //       if (parseInt(ship.order_id) === orderToBeShipped[0].payment_id) {
  //         const getShipmentInfo = await getShipment(ship.id);
  //         if (getShipmentInfo.data.shipment.status === "ready") {
  //           // Update the store with the information for the shipment we want to print the label of.
  //           add(getShipmentInfo.data.shipment.postage_label_png_url);
  //           addInfo(orderToBeShipped);
  //           setAdded(true);
  //         }
  //       }
  //     });
  //   }}
  // >
  //   {!added ? "Reprint label" : "Added"}
  // </button>
  //         {!removeShip && (
  //           <button className="buttonRounded shipped" onClick={handleClickShip}>
  //             Mark Shipped
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // Default UI for cards
  // console.log(orderToBeShipped[0].ship_notes);
  return (
    <div
      style={{
        display: orderToBeShipped[0].ship_notes === "HIDDEN" ? "none" : "",
      }}
      key={orderToBeShipped[0].sale_item_id}
      className={`order ${alreadyPurchased && "completeOrder"} ${
        complete ? "complete" : ""
      } ${checked ? "pdfReady" : ""} ${preorder ? "blankOut" : ""}`}
    >
      <span className="date">
        <div>
          {orderToBeShipped[0].order_date.substring(
            0,
            orderToBeShipped[0].order_date.length - 12
          )}
        </div>
        {orderToBeShipped[0].paypal_id ===
        "collected to cover your revenue share balance"
          ? "Unavailable"
          : orderToBeShipped[0].paypal_id}
      </span>
      {alreadyPurchased && price !== null ? <div>${price}</div> : <div>-</div>}
      <div className="name">
        <p>{orderToBeShipped[0].ship_to_name}</p>
        <p>{orderToBeShipped[0].ship_to_country}</p>
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
              console.log(ship);
              if (
                parseInt(ship.order_id) === orderToBeShipped[0].payment_id &&
                (ship.status === "ready" || ship.status === "inducted")
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

export default Card;
