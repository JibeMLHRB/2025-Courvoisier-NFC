import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ClipboardIcon from "@mui/icons-material/ContentPaste";
import { useState, useEffect, useRef } from "react";

function App() {
  const [activeButtons, setActiveButtons] = useState({});
  const [detectedTag, setDetectedTag] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const timersRef = useRef({});
  useEffect(() => {
    if (detectedTag === null) return;

    return () => {
      const timer = timersRef.current[detectedTag];
      if (timer) {
        clearTimeout(timer);
        delete timersRef.current[detectedTag];
      }
    };
  }, [detectedTag]);

  window.api.tagData((_, tagData) => {
    const newTag = "[" + tagData.tagArray.join(", ") + "]";
    setDetectedTag(newTag);
    console.log(tagData);
    if (tagData.product) {
      setProductInfo({ product: tagData.product, tied: true });
    } else {
      setProductInfo({ product: null, tied: false });
    }

    if (tagData.product) {
      const tagIndex = Number(tagData.product) - 1;

      setActiveButtons((prevState) => ({
        ...prevState,
        [tagIndex]: true,
      }));

      if (timersRef.current[tagIndex]) {
        clearTimeout(timersRef.current[tagIndex]);
      }

      const timer = setTimeout(() => {
        setActiveButtons((prevState) => ({
          ...prevState,
          [tagIndex]: false,
        }));
      }, 3000);

      timersRef.current[tagIndex] = timer;
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="body1"
          color="textSecondary"
          fontWeight="bold"
          sx={{
            margin: "10px",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          {detectedTag || "No tag detected"}
        </Typography>

        <Button
          onClick={() => {
            navigator.clipboard.writeText(detectedTag);
          }}
          variant="outlined"
          color="primary"
          startIcon={<ClipboardIcon />}
          disabled={!detectedTag} // Disable button if no tag is detected
        >
          Copy
        </Button>
      </Box>

      {productInfo ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <Box
            sx={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: productInfo?.tied ? "2px solid green" : "2px solid red",
              backgroundColor: productInfo?.tied
                ? "rgba(0, 255, 0, 0.1)"
                : "rgba(255, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              color={productInfo?.tied ? "green" : "red"}
              fontWeight="bold"
              sx={{ fontSize: "0.875rem" }}
            >
              {productInfo?.tied
                ? `Tied to product no. ${productInfo.product}`
                : "Not tied to any product"}
            </Typography>
          </Box>
        </Box>
      ) : null}
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Grid container spacing={3} display="flex" justifyContent="center">
          {Array(6)
            .fill()
            .map((_, i) => (
              <Grid item key={i}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: activeButtons[i]
                        ? "primary.main"
                        : "grey.300",
                    }}
                  ></Box>
                  <Box
                    mt={1}
                    sx={{ fontFamily: "sans-serif", fontSize: "0.875rem" }}
                  >
                    {i + 1}
                  </Box>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
}

export default App;
