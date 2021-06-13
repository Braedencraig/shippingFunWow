import React, { useState, useEffect, useRef } from "react";
import { useStoreState } from "easy-peasy";
import PdfGenerator from "../components/PdfGenerator";
import PdfGeneratorWebflow from "../components/PdfGeneratorWebflow";


const Button = ({ webflow, single }) => {
  const [count, setCount] = useState(0);
  const [confirm, setConfirm] = useState(true);
  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  }, [setCount, setConfirm]);
  const prevCount = prevCountRef.current;

  let urls = useStoreState((state) => state.pngs.urls);
  let info = useStoreState((state) => state.pngs.info);

  let webflowurls = useStoreState((state) => state.webflowPngs.urls);
  let webflowinfo = useStoreState((state) => state.webflowPngs.info);

  let errors = useStoreState((state) => state.todos.items);

  return (
    <div className="pdfGeneration">
      <button
        onClick={() => {
          setCount((prevState) => prevState + 1)
        }}
      >
        Create Shipping Download For All Orders
      </button>
      {webflow && count > 0 && confirm && <PdfGeneratorWebflow urls={webflowurls} info={webflowinfo} /> }
      {!webflow && count > 0 && confirm && <PdfGenerator errors={errors} urls={urls} info={info} />}
    </div>
  );
};

export default Button;
