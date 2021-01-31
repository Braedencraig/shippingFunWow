import React, { useState, useEffect, useRef } from 'react'
import { useStoreState } from 'easy-peasy'
import PdfGenerator from '../components/PdfGenerator'



const Button = () => {
    const [count, setCount] = useState(0);
    const [confirm, setConfirm] = useState(false)
    const prevCountRef = useRef();
    useEffect(() => {
        prevCountRef.current = count;
    }, [setCount, setConfirm]);
    const prevCount = prevCountRef.current;

    let todo = useStoreState((state) => state.pngs.urls);
    let todoInfo = useStoreState((state) => state.pngs.info);

    return (
        <div className="pdfGeneration">
            <button onClick={() => {
                setCount(prevState => prevState + 1)
                const result = window.confirm('Process PDFSs and Packing Slips For All Selected Shipments?')
                setConfirm(result)
            }}>
                Create Shipping Download For All Orders
            </button>
            {count > 0 && confirm && (<PdfGenerator todo={todo} todoInfo={todoInfo} />)}
        </div>
    )
}

export default Button