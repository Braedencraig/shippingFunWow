import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { createShipment, buyShipment, getShipment } from "../apis/chitchats";
import Spinner from "../spinnerTwo.gif";
import PropTypes from "prop-types";

const Card = ({ confirmCreateShipment, orderToBeShipped, idx, shipments }) => {
  const [rates, setRates] = useState([]);
  const [shipId, setShipId] = useState("");
  const [name, setName] = useState("");
  const [invalidRate, setInvalidRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [complete, setComplete] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleClick = () => setChecked(!checked);

  const add = useStoreActions((actions) => actions.pngs.add);
  const addInfo = useStoreActions((actions) => actions.pngs.addInfo);

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
                setComplete(true);
              });
            }, 10000);
          }
        });
      }, 9000);
    }
  };

  useEffect(() => {
    if (confirmCreateShipment) {
      setChecked(true);
    }
    if (checked) {
      createShipmentFunc(orderToBeShipped);
      addInfo(orderToBeShipped);
    }

    if (shipments) {
      shipments.data.map((test) => {
        if (parseInt(test.order_id) === orderToBeShipped[0].payment_id) {
          setNoShow(true);
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
    setComplete,
    setNoShow,
    setConfirm,
  ]);

  if (noShow) {
    return (
      <div key={orderToBeShipped[0].sale_item_id} className={`order complete`}>
        <p>Name: {orderToBeShipped[0].ship_to_name}</p>
        <p>Country: {orderToBeShipped[0].ship_to_country}</p>
        <div className="flexContainer">
          <p>Items</p>
          <ul>{item}</ul>
        </div>
      </div>
    );
  }

  if (loading) {
    return <img src={Spinner} alt="" />;
  } else {
    return (
      <div
        key={orderToBeShipped[0].sale_item_id}
        className={`order ${complete ? "complete" : ""}`}
      >
        <p>Name: {orderToBeShipped[0].ship_to_name}</p>
        <p>Country: {orderToBeShipped[0].ship_to_country}</p>
        <div className="flexContainer">
          <ul>{item}</ul>
        </div>
        <div className="individualShip">
          {!confirm ? (
            <button
              className="processOrder"
              onClick={() => {
                const result = window.confirm(
                  "Do You Want To individually Process This Order?"
                );
                setConfirm(result);
              }}
            >
              Individually Process This Order?
            </button>
          ) : (
            <>
              <p className="tinyText">Process individual shipment</p>
              <input
                className="checkbox"
                onClick={handleClick}
                onChange={() => (confirmCreateShipment = true)}
                checked={checked}
                type="checkbox"
              />
            </>
          )}
        </div>
      </div>
    );
  }
};

Card.propTypes = {};

export default Card;
