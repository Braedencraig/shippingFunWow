import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import Button from './Button'
import { createShipment, buyShipment, getShipment } from "../apis/chitchats";
import { markAsShipped } from "../apis/bandcamp";

import Spinner from "../logoidee.svg";
import PropTypes from "prop-types";

const Card = ({ confirmCreateShipment, orderToBeShipped, idx, shipments, token }) => {
  const [rates, setRates] = useState([]);
  const [shipId, setShipId] = useState("");
  const [name, setName] = useState("");
  const [invalidRate, setInvalidRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedShip, setCheckedShip] = useState(false);
  const [removeShip, setRemoveShip] = useState(false);

  const [complete, setComplete] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [preorder, setPreorder] = useState(false);
  const [cannotProcess, setCannotProcess] = useState(false);
  const [added, setAdded] = useState(false)


  const handleClick = () => setChecked(!checked);
  const handleClickShip = () => setCheckedShip(!checkedShip);

  const add = useStoreActions((actions) => actions.pngs.add);
  const addInfo = useStoreActions((actions) => actions.pngs.addInfo);

  // TEST NUMBER
  const addError = useStoreActions((actions) => actions.todos.add);

  const item = orderToBeShipped.map((item) => {
    return (
      <li key={item.sale_item_id}>
        <span className={item.quantity > 1 ? "highlight" : ""}>
          {item.quantity}{" "}
        </span>
        {item.item_name}
      </li>
    );
  });

  const createShipmentFunc = async (orderToBeShipped) => {
    const shipment = await createShipment(orderToBeShipped);
    if(shipment === "Something went wrong" || shipment === undefined) {
      addError('Error')
      setCannotProcess(true)
    } else {
      if (shipment.id) {
        setLoading(true);
        setTimeout(() => {
          const shipmentBought = buyShipment(shipment.id);
          shipmentBought.then((res) => {
            if (res) {
              setTimeout(() => {
                const getShipmentInfo = getShipment(shipment.id);
                getShipmentInfo.then((info) => {
                  setLoading(false);
                  add(info.data.shipment.postage_label_png_url);
                  addInfo(orderToBeShipped);
                  setComplete(true);
                });
              }, 10000);
            }
          });
        }, 9000);
      }
    }
  };

  useEffect(() => {
    orderToBeShipped.map((item) => {
      if(item.item_name.includes("(Pre-order)")) {
        setPreorder(true)
      }
    })
      
    if (confirmCreateShipment) {
      setChecked(true);
    }
    if (checked) {
      createShipmentFunc(orderToBeShipped);
      // addInfo(orderToBeShipped); TESTING RED
    }

    if(checkedShip) {
      shipments.data.map(async (shipment) => {
        if(orderToBeShipped[0].payment_id == shipment.order_id) {
          markAsShipped(token, orderToBeShipped[0].payment_id, shipment.tracking_url)
        }
        // setRemoveShip(true)
        // console.log(shipment.tracking_url)
        // if (shipment.status === "inducted" || shipment.status === "received" || shipment.status === "released") {
        //   const test = await markAsShipped(token, orderToBeShipped[0].payment_id, shipment.tracking_url);
        //   if(test) {
        //     setRemoveShip(true)
        //   }
        // }
      });
    }
    // REMOVE FOR STAGING HERE
    if (shipments) {
      shipments.data.map((test) => {
        if (parseInt(test.order_id) === orderToBeShipped[0].payment_id) {
          setNoShow(true);
          if(test.status == "refund_approved" || test.status == "refund_requested") {
            setNoShow(false);
          }
        }
      });
    }
  }, [
    setRates,
    setShipId,
    confirmCreateShipment,
    setName,
    setInvalidRate,
    setLoading,
    setChecked,
    checked,
    checkedShip,
    removeShip,
    setRemoveShip,
    setCheckedShip,
    setComplete,
    setNoShow,
    setConfirm,
    setPreorder
  ]);

  if(cannotProcess) {
    return (
      <div key={orderToBeShipped[0].sale_item_id} className={`order manual-complete`}>
        <span className="date">{orderToBeShipped[0].order_date.substring(0, orderToBeShipped[0].order_date.length - 12)}</span>
        <p>Name: {orderToBeShipped[0].ship_to_name}</p>
        <p>Country: {orderToBeShipped[0].ship_to_country}</p>
        <div className="flexContainer">
          <p>Items</p>
          <ul>{item}</ul>
        </div>
      </div>
    );
  }

  // if(preorder) {
  //   return (
  //       <div key={orderToBeShipped[0].sale_item_id} className={`order blank-out`}>
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

  if (noShow) {
    return (
      <div key={orderToBeShipped[0].sale_item_id} className={`order complete`}>
        <span className="date">{orderToBeShipped[0].order_date.substring(0, orderToBeShipped[0].order_date.length - 12)}</span>
        <p>Name: {orderToBeShipped[0].ship_to_name}</p>
        <p>Country: {orderToBeShipped[0].ship_to_country}</p>
        <div className="flexContainer">
          <p>Items</p>
          <ul>{item}</ul>
        </div>
        <button class="tiny-btn" disabled={added} onClick={() => {
          shipments.data.map((ship) => {
            if (parseInt(ship.order_id) === orderToBeShipped[0].payment_id) {
              const getShipmentInfo = getShipment(ship.id);
              getShipmentInfo.then((info) => {
                add(info.data.shipment.postage_label_png_url);
                addInfo(orderToBeShipped)
                setAdded(true)
              });
            }
          });
        }}>{!added ? 'Add label for download' : 'Added'}</button>
        {!removeShip && (
          <div className="individualShip">
            <>
                <p className="tinyText">Mark Order As Shipped</p>
                <input
                  className="checkbox"
                  onClick={handleClickShip}
                  checked={checkedShip}
                  disabled={checkedShip}
                  type="checkbox"
                />
            </>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order">
        <img src={Spinner} alt="" />
      </div>
    )
  } else {
    return (
      <div
        key={orderToBeShipped[0].sale_item_id}
        className={`order ${complete ? "complete" : ""} ${checked ? 'pdf-ready' : ''} ${preorder ? "blank-out" : ''}`}
      >
        <span className="date">{orderToBeShipped[0].order_date.substring(0, orderToBeShipped[0].order_date.length - 12)}</span>
        <p>Name: {orderToBeShipped[0].ship_to_name}</p>
        <p>Country: {orderToBeShipped[0].ship_to_country}</p>
        <div className="flexContainer">
          <ul>{item}</ul>
        </div>
        <div className="individualShip">
          <>
              <p className="tinyText">Process Individual Shipment</p>
              <input
                className="checkbox"
                onClick={handleClick}
                onChange={() => (confirmCreateShipment = true)}
                checked={checked}
                type="checkbox"
              />
          </>
        </div>
        <div>
    </div>
      </div>
    );
  }
};

Card.propTypes = {};

export default Card;
