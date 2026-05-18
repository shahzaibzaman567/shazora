import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../services/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const pid = product.id || product._id;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: pid });
  };

  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1000}
      transitionSpeed={1000}
      scale={1.03}
      className="h-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        className="group glass rounded-[2.5rem] relative border border-white/5 overflow-hidden h-full flex flex-col p-2"
      >
        <div className="block overflow-hidden relative flex-grow">
          <Link to={`/product/${pid}`} className="block">
            <div className="aspect-[1/1.2] bg-slate-200 dark:bg-secondary rounded-[2rem] overflow-hidden relative">
              <motion.img
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:contrast-110"
                onError={(e) => {
                  const fallbacks = {
                    men: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
                    women: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800',
                  };
                  const cat = (product.category || 'men').toLowerCase();
                  e.target.onerror = null;
                  e.target.src = fallbacks[cat] || fallbacks.men;
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {(product.countInStock === 0 || product.count_in_stock === 0) && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] px-3 py-1 uppercase tracking-[0.2em] rounded-full font-black shadow-lg">
                  Sold Out
                </div>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          </Link>

          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link to={`/product/${pid}`}>
                  <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white truncate max-w-[150px] hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-[10px] text-accent uppercase font-black tracking-widest">
                  {product.category}
                </p>
              </div>
              <p className="font-heading font-black text-lg text-slate-900 dark:text-white">
                ${product.price}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.countInStock === 0 || product.count_in_stock === 0}
              className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] py-3.5 text-xs uppercase tracking-widest font-black hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default ProductCard;
