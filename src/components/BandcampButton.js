import React from "react";
import { markAsShipped } from "../apis/bandcamp";

export default function BandcampButton({ token, unfilledOrders, shipments }) {
  const markShipped = async (token, order_id, tracking_url) => {
    const markShipped = await markAsShipped(token, order_id, tracking_url);
  };
  // DONT USE SHIPMENTS USE UNFILLLED ORTDERS

  console.log(unfilledOrders);

  if (shipments) {
    return (
      <button
        className="bandcampBtn"
        onClick={async () => {
          const result = window.confirm("Mark All Shipments With A Status Of Inducted/Recevied/Released As Shipped Via Bandcamp?");
          if (result) {
            // THIS NEEDS TO BE FIXED, DONT READ shipment.order_ID, read unfilledOrders.order_id ISSUE IS HERE
            shipments.data.map((shipment) => {
              if (shipment.status === "inducted" || shipment.status === "received" || shipment.status === "released") {
                markShipped(token, shipment.order_id, shipment.tracking_url);
              }
            });
            // document.getElementsByClassName('bandcampBtn')[0].innerHTML = 'Making calls...please wait'
            // setTimeout(() => {
            //   document.getElementsByClassName('bandcampBtn')[0].innerHTML = 'You may refresh the page now'
            // }, 30000)
          }
        }}
      >
        Send Confirmation and Mark As Shipped
      </button>
    );
  } else {
    return false;
  }
}
