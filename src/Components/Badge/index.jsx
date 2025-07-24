import React from "react";

const Badge = (props) => {
  return (
    <span
      className={`inline-block py-1 px-4 rounded-full text-[11px] capitalize ${
        props.status === "pending" && "bg-pink-500 text-white"
      } ${props.status === "confirm" && "bg-green-500 text-white"} ${props.status === "delivered" && "bg-green-700 text-white"}`}
    >
      {props.status}
    </span>
  );
};

export default Badge;
