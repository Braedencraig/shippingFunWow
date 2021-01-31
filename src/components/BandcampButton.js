import React, { useState, useEffect } from 'react'
import { getAllShipments } from '../apis/chitchats'
import { markAsShipped } from '../apis/bandcamp'


export default function BandcampButton({ token, unfilledOrders }) {
    const [allShip, setAllShip] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const allShipments = await getAllShipments()
            setAllShip(allShipments)
        }
        fetchData()
    }, [setAllShip, allShip])

    const markShipped = async (token, order_id, tracking_url) => {
        const markShipped = await markAsShipped(token, order_id, tracking_url)
    }

    return (
        <button onClick={async () => {
            console.log(allShip)
            allShip.data.map(shipment => {
                // CHANGE THIS TO INDUCTED FOR PROD
                //  MIGHT JUST HAVE TO DO THIS WHEN THE SHIPMENT IS CREATED AND DOWNLOADED
                if(shipment.status === 'ready') {
                    markShipped(token, shipment.order_id, shipment.tracking_url)
                }
            })
        }}>
            Send confirmation email to customer and mark shipped bandcamp
        </button>
    )
}
