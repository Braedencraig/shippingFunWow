import React, { useState, useEffect, useRef } from 'react'
import { useStoreState } from 'easy-peasy'


const Button = () => {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();
    useEffect(() => {
        prevCountRef.current = count;
    });
    const prevCount = prevCountRef.current;

    let todo = useStoreState((state) => state.pngs.urls);
    let todoInfo = useStoreState((state) => state.pngs.info);
    let checkboxes = document.getElementsByName('createShipment')
    // MAP OVER THE CHECKBOXES HERE TO SELECT ALL select all checkboxes and deal with that in card, check if checked?!
    console.log(checkboxes)
    console.log(todo)
    console.log(todoInfo)

    // WE WILL GENERATE THE PDF FOR DOWNLOAD INSIDE OF THIS COMPONENT
    return (
        <button onClick={() => {
            setCount(prevState => prevState + 1)
        }}>
            Get all Shipping pngs
        </button>
    )
}

export default Button