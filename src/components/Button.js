import React, { useState, useEffect, useRef } from "react";
import { useStoreState } from "easy-peasy";
import PdfGenerator from "../components/PdfGenerator";
import PdfGeneratorWebflow from "../components/PdfGeneratorWebflow";


const Button = ({ webflow }) => {
  const [count, setCount] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  }, [setCount, setConfirm]);
  const prevCount = prevCountRef.current;

  let urls = useStoreState((state) => state.pngs.urls);
  let info = useStoreState((state) => state.pngs.info);

  return (
    <div className="pdfGeneration">
      <button
        onClick={() => {
          setCount((prevState) => prevState + 1);
          const result = window.confirm(
            "Process PDFSs and Packing Slips For All Selected Shipments?"
          );
          setConfirm(result);
        }}
      >
        Create Shipping Download For All Orders
      </button>
      {webflow && count > 0 && confirm && <PdfGeneratorWebflow urls={urls} info={info} /> }
      {!webflow && count > 0 && confirm && <PdfGenerator urls={urls} info={info} />}
    </div>
  );
};

export default Button;
