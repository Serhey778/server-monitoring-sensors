import express from 'express';
import cors from 'cors';

const PORT = 500;
const app = express();
app.use(cors());
app.use(express.json());

//app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
