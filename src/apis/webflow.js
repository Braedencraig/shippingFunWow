import axios from "axios";

export const getOrdersUnshippedWebflow = async () => {
  const response = await axios.get(
    "https://cors-anywhere.herokuapp.com/https://api.webflow.com/sites/5fd7cabbf4d7129fb098a4db/orders?access_token=d6d489cda5a6d6c1b769ac8faf0e47ed66ef8ac3546962f2e859bc69800700f3"
  );
  const unfulfilled = await response.data.filter(
    (order) => order.status === "unfulfilled"
  );
  return unfulfilled;
};

export const markAsShippedWebflow = async (orderId, trackingUrl, url) => {
  try {
    const params = {
      sendOrderFulfilledEmail: true,
    };
    console.log(url);

    let headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append(
      "Authorization",
      "Bearer " +
        "d6d489cda5a6d6c1b769ac8faf0e47ed66ef8ac3546962f2e859bc69800700f3"
    );
    headers.append("Origin", "http://localhost:3000");

    fetch(url, {
      mode: "no-cors",
      credentials: "include",
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.log("Authorization failed: " + error.message));
    // const url = `https://api.webflow.com/sites/5fd7cabbf4d7129fb098a4db/order/${orderId}/fulfill`;
    // const fulfillOrder = await axios.post(url, params, { json: true });
    // return fulfillOrder;
  } catch (error) {
    console.log(error);
  }
};
