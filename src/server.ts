import app from "./app";
import config from "./config";

app.listen(config.PORT, () => {
  console.log("server is running on port 5000");
});

export default app;
