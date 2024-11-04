import app from './app';  // นำเข้า app จาก app.ts
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
