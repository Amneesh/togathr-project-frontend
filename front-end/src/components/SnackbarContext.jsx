import React, { createContext, useContext, useState } from "react";
import { Snackbar, SnackbarContent, Box } from "@mui/material";
import Grow from "@mui/material/Grow";

const SnackbarContext = createContext();

function GrowTransition(props) {
  return <Grow {...props} />;
}

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState("Confirmation");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("#EAFBF2");

  const showSnackbar = (heading, message, color = '#EAFBF2') => {
    setHeading(heading);
    setMessage(message);
    setColor(color);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          message={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              sx={{
                alignItems: "flex-start",
                gap: "5px",
                padding: "8px",
                maxWidth: "300px", // Set max width for the Snackbar content
                whiteSpace: "normal",
              }}
            >
              {/* SVG Icon */}
              <div style={{display: color==="#FBECE7" ? 'none' : "flex"}}>
                <svg
                  width="24"
                  height="24"
                  margin='1px'
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
                    fill="#04ED98"
                  />
                </svg>
              </div>

              <div style={{display: color==="#FBECE7" ? "flex" : 'none'}}>
                <svg
                  width="20"
                  height="20"
                  margin='1px'
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM6.96963 6.96965C7.26252 6.67676 7.73739 6.67676 8.0303 6.96965L10 8.9393L11.9696 6.96967C12.2625 6.67678 12.7374 6.67678 13.0303 6.96967C13.3232 7.26256 13.3232 7.73744 13.0303 8.0303L11.0606 10L13.0303 11.9696C13.3232 12.2625 13.3232 12.7374 13.0303 13.0303C12.7374 13.3232 12.2625 13.3232 11.9696 13.0303L10 11.0607L8.0303 13.0303C7.73742 13.3232 7.26254 13.3232 6.96965 13.0303C6.67676 12.7374 6.67676 12.2625 6.96965 11.9697L8.9393 10L6.96963 8.0303C6.67673 7.73742 6.67673 7.26254 6.96963 6.96965Z"
                    fill="#D03D0E"
                  />
                </svg>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: 0 }}>{heading}</h5>
                <h6
                  style={{
                    margin: "4px 0 0 0",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {message}
                </h6>
              </div>
            </Box>
          }
          sx={{ backgroundColor: color, color: "black", padding: 0 }}
        />
      </Snackbar>

      {children}
    </SnackbarContext.Provider>
  );
};
