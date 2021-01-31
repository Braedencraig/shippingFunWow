import axios from "axios";
import axiosWithDelimiterFile from "../apis/axios";

const chitChatTkn = process.env.REACT_APP_CHITCHATS_API_SECRET_STAGING;
const chitChatClientId = process.env.REACT_APP_CHITCHATS_API_CLIENT_ID_STAGING;

export const createShipment = async (orderToBeShipped) => {
  try {
    let postageType = () => {
      if (orderToBeShipped[0].ship_to_country_code === "SI") {
        return "usps_first_class_package_international_service";
      } else if (orderToBeShipped[0].ship_to_country_code === "CA") {
        return "chit_chats_canada_tracked";
      } else if (orderToBeShipped[0].ship_to_country_code === "US") {
        return "usps_media_mail";
      } else {
        return "asendia_priority_tracked";
      }
    };

    let postage = postageType();

    let tshirt = false;
    let vinyl = false;
    let sizeX;
    let sizeY;
    let sizeZ;

    const description = orderToBeShipped.map((order) => {
      if (order.item_name.indexOf("Vinyl") > -1) {
        vinyl = true;
      } else if (order.item_name.indexOf("T-Shirt") > -1) {
        tshirt = true;
      }

      if (vinyl && tshirt) {
        sizeX = 33;
        sizeY = 33;
        sizeZ = 4;
        return "Phonographic Record & T-Shirt";
      }

      if (vinyl && !tshirt) {
        sizeX = 33;
        sizeY = 33;
        sizeZ = 4;
        return "Phonographic Record";
      }
      if (tshirt && !vinyl) {
        sizeX = 26;
        sizeY = 34;
        sizeZ = 4;
        return "T-Shirt";
      }
    });

    let total = 0;
    const amount = orderToBeShipped.map((order) => (total += order.quantity));
    const totalAmount = total * 25;

    if (total < 4) {
      sizeZ = 4;
    } else if (total >= 4 && total <= 20) {
      sizeZ = 13;
    } else if (total > 20) {
      sizeZ = 27;
    }

    const weight = () => {
      let totalWeight = 0;
      let vinylAmount = 0;
      let tShirtAmount = 0;
      orderToBeShipped.map((order) => {
        if (order.item_name.indexOf("Vinyl") > -1) {
          vinylAmount += order.quantity;
        } else if (order.item_name.indexOf("T-Shirt") > -1) {
          tShirtAmount += order.quantity;
        }
      });
      if (vinylAmount > 0) {
        totalWeight += 0.6;
      }
      totalWeight += vinylAmount * 0.6;
      totalWeight += tShirtAmount * 0.23;
      return totalWeight;
    };

    let shipmentBody = {
      name: orderToBeShipped[0].ship_to_name,
      address_1: orderToBeShipped[0].ship_to_street,
      address_2: orderToBeShipped[0].ship_to_street_2,
      city: orderToBeShipped[0].ship_to_city,
      province_code: orderToBeShipped[0].ship_to_state,
      postal_code: orderToBeShipped[0].ship_to_zip,
      country_code: orderToBeShipped[0].ship_to_country_code,
      phone: orderToBeShipped[0].buyer_phone,
      package_contents: "merchandise",
      description: description.slice(-1)[0],
      value: totalAmount,
      value_currency: orderToBeShipped[0].currency,
      order_store: "other",
      order_id: orderToBeShipped[0].payment_id,
      package_type: "parcel",
      size_x: sizeX,
      size_y: sizeY,
      size_z: sizeZ,
      weight: weight().toFixed(2),
      size_unit: "cm",
      weight_unit: "lb",
      signature_requested: false,
      insurance_requested: "no",
      ship_date: "today",
      postage_type: postage,
    };

    const res = await axios.post(
      `/clients/${chitChatClientId}/shipments`,
      shipmentBody,
      {
        headers: {
          Authorization: chitChatTkn,
        },
      }
    );

    return {
      id: res.data.shipment.id,
      tracking: res.data.shipment.tracking_url,
      rates: res.data.shipment.rates,
      name: orderToBeShipped[0].ship_to_name,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getShipment = async (id) => {
  try {
    const res = await axios.get(
      `/clients/${chitChatClientId}/shipments/${id}`,
      {
        headers: {
          Authorization: chitChatTkn,
        },
      }
    );
    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllShipments = async () => {
  try {
    const res = await axios.get(`/clients/${chitChatClientId}/shipments`, {
      headers: {
        Authorization: chitChatTkn,
      },
    });
    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const buyShipment = async (shipmentId) => {
  try {
    const res = await axiosWithDelimiterFile.patch(
      `/clients/${chitChatClientId}/shipments/${shipmentId}/buy`,
      null,
      {
        headers: {
          Authorization: chitChatTkn,
        },
      }
    );
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};
