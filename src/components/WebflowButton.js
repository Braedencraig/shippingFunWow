// import React from "react";
// import { markAsShippedWebflow } from "../apis/webflow";

// export default function WebflowButton({ unfilledOrders, shipments }) {
//   if (shipments) {
//     return (
//       <button className="webflowBtn"
//         onClick={async () => {
//           const result = window.confirm(
//             "Mark All Shipments With A Status Of Inducted/Recevied/Released As Shipped Via Bandcamp?"
//           );
//           if (result) {
//             shipments.data.map((shipment) => {
//               if (shipment.status === "inducted" || shipment.status === "received" || shipment.status === "released" || shipment.status === "delivered") {
//                 markAsShippedWebflow(shipment.order_id, shipment.tracking_url);
//               }
//             });
//             document.getElementsByClassName('webflowBtn')[0].innerHTML = 'Refresh Window In a Few Seconds'
//           }
//         }}
//       >
//         Send Confirmation and Mark As Shipped
//       </button>
//     );
//   } else {
//     return false;
//   }
// }