import React from 'react'
import { markAsShipped } from '../apis/bandcamp'


export default function BandcampButton({ token, unfilledOrders, shipments }) {   
    const markShipped = async (token, order_id, tracking_url) => {
        const markShipped = await markAsShipped(token, order_id, tracking_url)
    }

    if(shipments) {
        return (
            <button onClick={async () => {
                const result = window.confirm('Mark All Shipments With A Status Of READY As Shipped Via Bandcamp?')
                if(result) {
                    shipments.data.map(shipment => {
                        // CHANGE THIS TO INDUCTED FOR PROD
                        // MARK AS SHIPPED IS MY ONLY QUESTION
                        //  MIGHT JUST HAVE TO DO THIS WHEN THE SHIPMENT IS CREATED AND DOWNLOADED INSTEAD
                        if(shipment.status === 'ready') {
                            markShipped(token, shipment.order_id, shipment.tracking_url)
                        }
                    })
                }
            }}>
                Send Confirmation and Mark As Shipped
            </button>
        )
    } else {
        return false
    }
}
