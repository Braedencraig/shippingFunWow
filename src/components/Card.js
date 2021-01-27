import React, { useState, useEffect } from 'react'
import ShipmentRates from './ShipmentRates'
import { useStoreActions } from 'easy-peasy'
import { createShipment, buyShipment, getShipment } from '../apis/chitchats'
import Spinner from '../spinner.gif'
import PropTypes from 'prop-types'


const Card = ({ confirmCreateShipment, idx, orderToBeShipped, orderToBeShipped: { ship_to_country_code, ship_to_name, ship_to_street, ship_to_street_2, ship_to_city, ship_to_state, ship_to_country, ship_to_zip, buyer_email, buyer_phone } }) => {
    const [rates, setRates] = useState([])
    const [shipId, setShipId] = useState('')
    const [name, setName] = useState('')
    const [invalidRate, setInvalidRate] = useState(false)
    const [loading, setLoading] = useState(false)

    const add = useStoreActions((actions) => actions.pngs.add)
    const addInfo = useStoreActions((actions) => actions.pngs.addInfo)

    const createShipmentFunc = async (orderToBeShipped) => {
        let namesOfRates = []
        const shipment = await createShipment(orderToBeShipped)
        console.log(shipment)
        shipment.rates.map(rate => namesOfRates.push(rate.postage_type))
        const hasAsendia = namesOfRates.includes('asendia_priority_tracked')
        setShipId(shipment.id)
        // if(!isNorthAmerica && !hasAsendia) {
        //     setInvalidRate(true)
        //     setRates(shipment.rates)
        // } else {
            if(shipment.id) {
                setLoading(true)
                setTimeout(() => {
                    const shipmentBought = buyShipment(shipment.id)
                    shipmentBought.then(res => {
                        if(res) {
                            setTimeout(() => {
                                const getShipmentInfo = getShipment(shipment.id)
                                getShipmentInfo.then(info => {
                                    setLoading(false)
                                    add(info.data.shipment.postage_label_png_url)
                                })
                            }, 10000)
                        }
                    })
                }, 9000)
            }
        // }
    }

    useEffect(() => {
        setName(ship_to_name)
        if(name && confirmCreateShipment) {
            createShipmentFunc(orderToBeShipped)
            addInfo(orderToBeShipped)
        }
    }, [setRates, setShipId, confirmCreateShipment, setName, setInvalidRate, setLoading])

    const isNorthAmerica = ship_to_country_code === 'CA' || ship_to_country_code === 'US'

    if(loading) {
        return (
            <img src={Spinner} alt=""/>
        )
    } else {
        return (
            <div key={idx} className={`order ${confirmCreateShipment && !invalidRate ? 'selected' : 'error'}`}>
            <p>Name: {ship_to_name}</p>
            <p>Address: {ship_to_street}</p>
            {ship_to_street_2 !== null ?  <p>Address2: {ship_to_street_2}</p> : '' }
            <p>City: {ship_to_city}</p>
            <p>State/Province: {ship_to_state}</p>
            <p>Country: {ship_to_country}</p>
            <p>Zip-Postal: {ship_to_zip}</p>
            <p>Phone: {buyer_phone}</p>
            <p>Email: {buyer_email}</p>
            {/* {!isNorthAmerica ? <ShipmentRates idx={idx} shipId={shipId} rates={rates} /> : ''} */}
            {/* <button className="btn" onClick={async (e) => {
                // const test = await markAsShipped(token, orderToBeShipped, shipment.tracking)
            }}>Create & Buy Shipment</button> */}
            </div>
        )
    }

}

Card.propTypes = {

}

export default Card

