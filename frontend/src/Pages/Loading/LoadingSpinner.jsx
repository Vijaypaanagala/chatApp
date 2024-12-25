import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function LoadingSpinner() {
  return (
    <div style={styles.spinnerContainer}>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#007bff" />
    </div>
  );
}

const styles = {
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh", 
    width: "100%", 
  },
};

export default LoadingSpinner;
