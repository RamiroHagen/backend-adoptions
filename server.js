
import 'dotenv/config';
import app from './src/app.js';
import './src/config/db.js';

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
