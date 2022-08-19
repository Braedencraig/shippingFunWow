import React, { useState } from "react";
import { useStoreState } from "easy-peasy";
import PdfGenerator from "../components/PdfGenerator";
// import PdfGeneratorWebflow from "../components/PdfGeneratorWebflow";

const Button = () => {
  // Initial state
  const [confirm, setConfirm] = useState(false);

  // Data from store for shipping image urls and info.
  let urls = useStoreState((state) => state.pngs.urls);
  let info = useStoreState((state) => state.pngs.info);

  // let webflowurls = useStoreState((state) => state.webflowPngs.urls);
  // let webflowinfo = useStoreState((state) => state.webflowPngs.info);

  let errors = useStoreState((state) => state.errors.items);

  return (
    <div className={`pdfGeneration ${urls.length === 0 ? "pdfGenerationDisabled" : ""}`}>
      <button
        className="buttonRounded"
        onClick={() => {
          // On click we render the PdfGenerator
          setConfirm(true);
        }}
      >
        Generate Labels
      </button>
      {confirm && <PdfGenerator errors={errors} urls={urls} info={info} />}
    </div>
  );
};

export default Button;
