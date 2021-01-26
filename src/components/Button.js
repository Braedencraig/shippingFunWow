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

    let todo = useStoreState((state) => state.pngs.urls);
    let todoInfo = useStoreState((state) => state.pngs.info);

    return (
        <>
        <button onClick={() => {
            setCount(prevState => prevState + 1)
        }}>
            Create shipping pdf/packing download
        </button>
        {count > 0 && (<PdfGenerator todo={todo} todoInfo={todoInfo} />)}
        </>
    )
}

export default Button