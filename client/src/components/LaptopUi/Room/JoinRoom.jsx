import React from "react";
import Room from "../../Room/Room";

function JoinRoom({ roomId, firstName, type }) {
  return (
    <div className="w-full h-full">
      <Room roomId={roomId} firstName={firstName} type={type} />
    </div>
  );
}

export default JoinRoom;
