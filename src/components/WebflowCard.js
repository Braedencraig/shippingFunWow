// import React, { useState, useEffect } from "react";
// import { useStoreActions } from "easy-peasy";
// import { createShipmentWebflow, buyShipment, getShipment } from "../apis/chitchats";
// import Spinner from "../logoidee.svg";
// import PropTypes from "prop-types";

// const WebflowCard = ({ confirmCreateShipment, orderToBeShipped, idx, shipments }) => {
//   const [rates, setRates] = useState([]);
//   const [shipId, setShipId] = useState("");
//   const [name, setName] = useState("");
//   const [invalidRate, setInvalidRate] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [checked, setChecked] = useState(false);
//   const [complete, setComplete] = useState(false);
//   const [noShow, setNoShow] = useState(false);
//   const [confirm, setConfirm] = useState(false);
//   const [preorder, setPreorder] = useState(false);
//   const [cannotProcess, setCannotProcess] = useState(false);
//   const [added, setAdded] = useState(false)

//   const handleClick = () => setChecked(!checked);

//   const add = useStoreActions((actions) => actions.webflowPngs.add);
//   const addInfo = useStoreActions((actions) => actions.webflowPngs.addInfo);

//   const item = orderToBeShipped.purchasedItems.map((item) => {
//     return (
//       <li key={orderToBeShipped.orderId}>
//         <span className={item.count > 1 ? "highlight" : ""}>
//           {item.count}{" "}
//         </span>
//         {item.productName}
//       </li>
//     );
//   });

//   const createShipmentFunc = async () => {
//     const shipment = await createShipmentWebflow(orderToBeShipped);
//     if(shipment === "error" || shipment === undefined) {
//       setCannotProcess(true)
//     } else {
//       if (shipment.id) {
//         setLoading(true);
//         setTimeout(() => {
//           const shipmentBought = buyShipment(shipment.id);
//           shipmentBought.then((res) => {
//             if (res) {
//               setTimeout(() => {
//                 const getShipmentInfo = getShipment(shipment.id);
//                 getShipmentInfo.then((info) => {
//                   setLoading(false);
//                   add(info.data.shipment.postage_label_png_url);
//                   setComplete(true);
//                 });
//               }, 10000);
//             }
//           });
//         }, 9000);
//       }
//     }
//   };

//   useEffect(() => {
//     // orderToBeShipped.map((item) => {
//     //   if(item.item_name.includes("(Pre-order)")) {
//     //     setPreorder(true)
//     //   }
//     // })
//     if (confirmCreateShipment) {
//       setChecked(true);
//     }
//     if (checked) {
//       createShipmentFunc(orderToBeShipped);
//       addInfo(orderToBeShipped);
//     }
//     // REMOVE FOR STAGING HERE
//     if (shipments) {
//       shipments.data.map((test) => {
//         if (test.order_id === orderToBeShipped.orderId) {
//           setNoShow(true);
//           // if(orderToBeShipped.status == "refunded" || test.status == "refund_approved") {
//           //   setNoShow(false)
//           // }
//         }
//       });
//     }
//   }, [
//     setRates,
//     setShipId,
//     confirmCreateShipment,
//     setName,
//     setInvalidRate,
//     setLoading,
//     setChecked,
//     checked,
//     setComplete,
//     setNoShow,
//     noShow,
//     setConfirm,
//   ]);

//   if (noShow) {
//     return (
//       <div key={orderToBeShipped.orderId} className={`order complete`}>
//         <span className="date">{orderToBeShipped.acceptedOn.substring(0, orderToBeShipped.acceptedOn.length - 14)}</span>
//         <p>Name: {orderToBeShipped.shippingAddress.addressee}</p>
//         <p>Country: {orderToBeShipped.shippingAddress.country}</p>
//         <div className="flexContainer">
//           <p>Items</p>
//           <ul>{item}</ul>
//         </div>
//         <button class="tiny-btn" disabled={added} onClick={() => {
//           shipments.data.map((ship) => {
//             if(ship.order_id === orderToBeShipped.orderId) {
//               const getShipmentInfo = getShipment(ship.id);
//               getShipmentInfo.then((info) => {
//                 add(info.data.shipment.postage_label_png_url);
//                 addInfo(orderToBeShipped)
//                 setAdded(true)
//               })
//             }
//           });
//         }}>{!added ? 'Add label for download' : 'Added'}</button>
//       </div>
//     );
//   }

//   if(cannotProcess) {
//     return (
//       <div key={orderToBeShipped.orderId} className={`order manual-complete`}>
//         <span className="date">{orderToBeShipped.acceptedOn.substring(0, orderToBeShipped.acceptedOn.length - 14)}</span>
//         <p>Name: {orderToBeShipped.shippingAddress.addressee}</p>
//         <p>Country: {orderToBeShipped.shippingAddress.country}</p>
//         <div className="flexContainer">
//           <p>Items</p>
//           <ul>{item}</ul>
//         </div>
//       </div>
//     );
//   }

//   // if(preorder) {
//   //   return (
//   //       <div key={orderToBeShipped.orderId} className={`order blank-out`}>
//   //         {/* <span className="date">{orderToBeShipped[0].order_date.substring(0, orderToBeShipped[0].order_date.length - 12)}</span> */}
//   //         <p>Name: {orderToBeShipped.shippingAddress.addressee}</p>
//   //         <p>Country: {orderToBeShipped.shippingAddress.country}</p>
//   //         <div className="flexContainer">
//   //           <p>Items</p>
//   //           <ul>{item}</ul>
//   //         </div>
//   //       </div>
//   //     );
//   // }

//   if (loading) {
//     return (
//       <div className="order">
//         <img src={Spinner} alt="" />
//       </div>
//     )
//   } else {
//     return (
//       <div
//         key={orderToBeShipped.orderId}
//         className={`order ${complete ? "complete" : ""} ${checked ? 'pdfReady' : ''}`}
//       >
//         <span className="date">{orderToBeShipped.acceptedOn.substring(0, orderToBeShipped.acceptedOn.length - 14)}</span>
//         <p>Name: {orderToBeShipped.shippingAddress.addressee}</p>
//         <p>Country: {orderToBeShipped.shippingAddress.country}</p>
//         <div className="flexContainer">
//           <ul>{item}</ul>
//         </div>
//         <div className="individualShip">
//           <p className="tinyText">Process Individual Shipment</p>
//           <input
//             className="checkbox"
//             onClick={handleClick}
//             onChange={() => (confirmCreateShipment = true)}
//             checked={checked}
//             type="checkbox"
//           />
//         </div>
//       </div>
//     );
//   }
// };

// WebflowCard.propTypes = {};

// export default WebflowCard;