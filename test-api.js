import { getPublicProducts } from './client/src/services/mongoApi.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const products = await getPublicProducts();
    console.log(products.map(p => ({ name: p.name, stock: p.countInStock })));
  } catch (err) {
    console.error(err);
  }
})();
