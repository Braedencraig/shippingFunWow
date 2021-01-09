import axios from "axios";
// ADD TRY CATCHES TO ALL API CALLS AND DO ERROR HANDLING FOR THE APPLICATION

const chitChatTkn = process.env.REACT_APP_CHITCHATS_API_SECRET_STAGING
const chitChatClientId = process.env.REACT_APP_CHITCHATS_API_CLIENT_ID_STAGING

export const createShipment = async (orderToBeShipped) => {
    const {ship_to_name, ship_to_street, ship_to_street_2, ship_to_city, ship_to_state, ship_to_country_code, ship_to_zip, buyer_phone,  buyer_email, sub_total, currency, paypal_id} = orderToBeShipped

    const postageType = () => {
        if(ship_to_country_code === 'CA') {
            // currently having issues on staging with this postage type
            return "chit_chats_canada_tracked"
        } else if(ship_to_country_code === 'US') {
            // currently having issues on staging with this postage type
            return "usps_media_mail"
        } else {
            return "asendia_priority_tracked"
        }
    }
    const postage = postageType()

    const shipmentBody = {
        name: ship_to_name,
        address_1: ship_to_street,
        address_2: ship_to_street_2,
        city: ship_to_city,
        province_code: ship_to_state,
        postal_code: ship_to_zip,
        country_code: ship_to_country_code,
        phone: buyer_phone,
        package_contents: "merchandise",
        description: "Phonographic Record",
        value: sub_total,
        value_currency: currency,
        order_store: "other",
        order_id: paypal_id,
        package_type: "parcel",
        size_x: 33,
        size_y: 33,
        size_z: 4,
        weight: 1.2,
        size_unit: "cm",
        weight_unit: "lb",
        signature_requested: false,
        insurance_requested: 'no',
        ship_date: "today",
        postage_type: postage
    }
    // weight is 0.6 + # recs x 0.6 NEED TO SEE WHAT THIS LOOKS LIKE
    // change rest based on vinyl or other GO BACK TO MVP AND LOOK AT WHAT IS NEEDED

    const res = await axios.post(`/clients/${chitChatClientId}/shipments`,
    shipmentBody,
     {
        headers: {
            Authorization: chitChatTkn
        }
    })

    return {
        id: res.data.shipment.id,
        tracking: res.data.shipment.tracking_url
    }
}

export const buyShipment = async (shipmentId) => {
    const res = await axios.patch(`/clients/${chitChatClientId}/shipments/${shipmentId}/buy`, null, {
        headers: {
            Authorization: chitChatTkn
        }
    })
    if(res.status === 200) {
        return true
    }
}
