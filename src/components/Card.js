import React, { useState, useEffect } from 'react'
import ShipmentRates from './ShipmentRates'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { createShipment, buyShipment, getShipment } from '../apis/chitchats'
import PropTypes from 'prop-types'


const Card = ({ idx, pdf, orderToBeShipped, orderToBeShipped: { ship_to_country_code, ship_to_name, ship_to_street, ship_to_street_2, ship_to_city, ship_to_state, ship_to_country, ship_to_zip, buyer_email, buyer_phone } }) => {
    const [rates, setRates] = useState([])
    const [shipId, setShipId] = useState('')
    const [shipmentPurchased, setShipmentPurchased] = useState(false)
    const [png, setPng] = useState(null)
    const [toggle, setToggle] = useState(false)

    const add = useStoreActions((actions) => actions.pngs.add);
    const addInfo = useStoreActions((actions) => actions.pngs.addInfo);
    useEffect(() => {
        if(png !== null) {
            addInfo(orderToBeShipped)
            add(png)
        }
    }, [setRates, setShipId, setPng, png])

    const isNorthAmerica = ship_to_country_code === 'CA' || ship_to_country_code === 'US'
    return (
        <div key={idx} className={`order`}>
        <p>Name: {ship_to_name}</p>
        <p>Address: {ship_to_street}</p>
        {ship_to_street_2 !== null ?  <p>Address2: {ship_to_street_2}</p> : '' }
        <p>City: {ship_to_city}</p>
        <p>State/Province: {ship_to_state}</p>
        <p>Country: {ship_to_country}</p>
        <p>Zip-Postal: {ship_to_zip}</p>
        <p>Phone: {buyer_phone}</p>
        <p>Email: {buyer_email}</p>
        <div>{shipmentPurchased ? 'PURCHASED' : 'NOT PURCHASED'}</div>
        {!isNorthAmerica ? <ShipmentRates shipId={shipId} rates={rates} /> : ''}
        <button className="btn" onClick={async (e) => {
            // can use e to style
            let namesOfRates = []
            const shipment = await createShipment(orderToBeShipped)
            shipment.rates.map(rate => namesOfRates.push(rate.postage_type))
            const hasAsendia = namesOfRates.includes('asendia_priority_tracked')
            setShipId(shipment.id)
            // NEED SLOVENIAN USER TO TEST THIS
            if(!isNorthAmerica && !hasAsendia) {
                setRates(shipment.rates)
            }
            const shipmentBought = await buyShipment(shipment.id)
            if(shipmentBought) {
                setShipmentPurchased(true)
                // setTimeout necessary here to wait for the chitchats api to create the png
                setTimeout(() => {
                    const getShipmentInfo = getShipment(shipment.id)
                    getShipmentInfo.then(res => {
                        console.log(orderToBeShipped)
                        setPng(res.data.shipment.postage_label_png_url)
                    })
                }, 5000)
            }
            // NAME OF ITEM AND QUANTITY on other 
            // ADD CHECKBOX FUNCTIONALITY, SELECT ALL PREPARE FOR SHIPPING, or leave as is and click each individual to prepare.
            // CREATE PDFS
            // select all and print, file cue for all pdfs! so one click.
            // ORDERS TO GET MULLTIPLE ITEMS AND VARIATIONS
            // FIRE THIS 24 HOURS AFTER, easiest way, instead of when flag has changed in CC
            // const test = await markAsShipped(token, orderToBeShipped, shipment.tracking)
        }}>Create & Buy Shipment</button>
        <input onChange={() => {
            setToggle(prevState => !prevState)
            console.log('ITS HAPPENING')
            console.log(!toggle)
        }} type="checkbox" id="createShipment" name="createShipment" value="createShipment" />
        <label for="createShipment">Create Shipment</label>
        </div>
    )
}

Card.propTypes = {

}

export default Card

