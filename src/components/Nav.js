import React from "react";

export default function Nav({ children }) {
  return (
    <div className="menubar">
      <h1>Shipping Dashboard</h1>
      <div className="menubtns">{children}</div>
    </div>
  );
}
