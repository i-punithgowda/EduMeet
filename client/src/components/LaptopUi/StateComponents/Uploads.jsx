import React, { useState, useEffect } from "react";

function Uploads({ type, email, firstName, currentUser }) {
  const [loading, setLoading] = useState(false);

  if (type == "Host") {
    if (loading) {
      return <div>Loading...</div>;
    } else {
      return <div>Host</div>;
    }
  } else {
    if (loading) {
      return <div>Loading...</div>;
    } else {
      return <div>Guest</div>;
    }
  }
}

export default Uploads;
