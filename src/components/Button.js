import React, { useState, useEffect, useRef } from 'react'
import { useStoreState } from 'easy-peasy'
import PdfGenerator from '../components/PdfGenerator'



const Button = () => {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();
    useEffect(() => {
        prevCountRef.current = count;
    }, [setCount]);
    const prevCount = prevCountRef.current;

    // let todo = useStoreState((state) => state.pngs.urls);
    // let todoInfo = useStoreState((state) => state.pngs.info);

    // console.log(todo)
    // console.log(todoInfo)

    const todo = ["https://staging.chitchats.com/labels/shipments/t65e86z7p3.png", "https://staging.chitchats.com/labels/shipments/p7a932d2b1.png", "https://staging.chitchats.com/labels/shipments/t4f2s03j8r.png", "https://staging.chitchats.com/labels/shipments/j0810d1s1u.png", "https://staging.chitchats.com/labels/shipments/a51d2g6m3t.png", "https://staging.chitchats.com/labels/shipments/h2s55e6j8j.png", "https://staging.chitchats.com/labels/shipments/t133e0q1s2.png", "https://staging.chitchats.com/labels/shipments/d6q5w40w6b.png", "https://staging.chitchats.com/labels/shipments/s94r5x4x6u.png", "https://staging.chitchats.com/labels/shipments/v3n7m5w3b9.png", "https://staging.chitchats.com/labels/shipments/w269b2n0j8.png", "https://staging.chitchats.com/labels/shipments/n14f9f7904.png", "https://staging.chitchats.com/labels/shipments/d7i72b4r9g.png", "https://staging.chitchats.com/labels/shipments/c0z4k7h6a3.png"]

    const todoInfo = {
        0: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        1: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        2: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        3: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        4: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        5: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        6: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        7: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        8: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        9: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        10: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        11: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        12: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        },
        13: {
            artist: "Shabason, Krgovich & Harris",
            buyer_email: "chrisherscovitch@gmail.com",
            buyer_name: "chris herscovitch",
            nullbuyer_phone: "+61 402909754",
            currency: "CAD",
            item_name: "Philadelphia: Limited Edition 12 Vinyl LP by Shabason etc." 
        }
    }

    return (
        <>
        <button onClick={() => {
            setCount(prevState => prevState + 1)
            console.log(todo)
            console.log(todoInfo)
        }}>
            Create shipping pdf/packing download
        </button>
        {count > 0 && (<PdfGenerator todo={todo} todoInfo={todoInfo} />)}
        </>
    )
}

export default Button