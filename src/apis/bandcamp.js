import axios from "axios";

export const getCredentials = async() => {
    try {
        const client_id = process.env.REACT_APP_BANDCAMP_CLIENT_ID;
        const client_secret = process.env.REACT_APP_BANDCAMP_CLIENT_SECRET;
        const dataType = "json";
        const grant_type = "client_credentials";
        const credentials = await axios.post(`/oauth_token`, null, {
            params: {
                client_id,
                client_secret,
                dataType,
                grant_type,
            },
        });
        if (credentials.status === 200) {
            return credentials;
        }
    } catch (error) {
        console.log(error);
        return "error";
    }
};

export const getBands = async(token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const getBands = await axios.post("/api/account/1/my_bands", null, config);
        return getBands;
    } catch (error) {
        console.log(error);
    }
};

export const getOrdersUnshipped = async(token, bands) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const params = {
            band_id: bands.data.bands[1].band_id,
            unshipped_only: true,
        };
        const allOrders = await axios.post("/api/merchorders/3/get_orders", params, config);
        return allOrders;
    } catch (error) {
        console.log(error);
    }
};

// export const getAllRecentOrders = async(token, bands) => {
//     try {
//         const config = {
//             headers: { Authorization: `Bearer ${token}` },
//         };
//         const oneMonthsAgo = new Date();
//         oneMonthsAgo.setMonth(oneMonthsAgo.getMonth() - 1);
//         const recentDateFrom = `${oneMonthsAgo.getFullYear()}-${oneMonthsAgo.getMonth()}-01`;

//         const params = {
//             band_id: bands.data.bands[2].band_id,
//             start_time: recentDateFrom,
//         };
//         const allRecentOrders = await axios.post("/api/merchorders/3/get_orders", params, config);
//         return allRecentOrders;
//     } catch (error) {
//         console.log(error);
//     }
// };

export const markAsShipped = async(token, id, trackingUrl) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const params = {
            items: [{
                id: id,
                id_type: "p",
                shipped: true,
                tracking_code: trackingUrl,
                notification: true,
            }, ],
        };
        const res = await axios.post("/api/merchorders/2/update_shipped", params, config);
        if (res.status === 200) {
            return res;
        }
    } catch (error) {
        console.log(error);
    }
};