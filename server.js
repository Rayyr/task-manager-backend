import "dotenv/config" ;

import { connectDB } from "./src/config/db.js";
import { app } from "./src/app.js";
 

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
   
  });
};

start();
