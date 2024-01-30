import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import UserRouter from './routes/user.route';
import ConnectDB from './db';
import CategoriesRouter from './routes/categories.route';
import CartRouter from './routes/cart.route';

dotenv.config();

ConnectDB();

const PORT = process.env.PORT;

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Crown Clothing - Backend',
        version: '1.0.0',
        description: 'Backend API for Crown Clothing website.',
      },
      servers: [
        {
          url: 'http://localhost:5000',
        },
      ],
    },
    apis: ['./routes/*.ts'],
  };

const server = express();
server.use(cors());
server.use(express.json());
server.use("/user", UserRouter);
server.use("/categories", CategoriesRouter);
server.use("/cart", CartRouter);

const swaggerDocs = swaggerJSDoc(swaggerOptions);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});