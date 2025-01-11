import React from "react";

const Loader = () => {
  const globeStyle = {
    width: "100px",
    height: "100px",
    animation: "spin 3s linear infinite",
  };

  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div>
      <style>{spinKeyframes}</style>
      <svg
        style={globeStyle}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75S17.385 21.75 12 21.75 2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 1.5a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5zm-.689 2.253l.037.003h.008A3.752 3.752 0 0 1 12.67 6h.005c.668 0 1.308.088 1.905.253-.562.085-1.112.205-1.644.36l-.13.037c-1.04.304-2.133.804-3.113 1.36a8.69 8.69 0 0 0-1.292.912l-.048.045c-.446.428-.79.959-.995 1.545a8.014 8.014 0 0 0-.286.957c-.183.733-.235 1.405-.13 1.94.087.456.31.875.642 1.145a2.666 2.666 0 0 1 1.403-.902l.13-.031c.65-.145 1.305-.228 1.96-.25.622-.019 1.243.002 1.864.062l.25.025a15.164 15.164 0 0 1 2.596.448l.15.036c.502.129.984.33 1.436.597l.136.079a8.78 8.78 0 0 1-.283 1.548l-.064.216c-.22.75-.555 1.454-.99 2.08l-.108.157a8.74 8.74 0 0 0 1.666-1.518 8.25 8.25 0 0 0-6.934-13.077h-.03z" />
      </svg>
    </div>
  );
};

export default Loader;

// ..............Simple Loader................

// import React from "react";

// const Loader = () => {
//   const loaderStyle = {
//     border: "4px solid rgba(0, 0, 0, 0.1)",
//     borderRadius: "50%",
//     borderTop: "4px solid #3498db",
//     width: "70px",
//     height: "70px",
//     animation: "spin 1s linear infinite",
//   };

//   const spinKeyframes = `
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `;

//   return (
//     <div>
//       <style>{spinKeyframes}</style>
//       <div style={loaderStyle}></div>
//     </div>
//   );
// };

// export default Loader;
