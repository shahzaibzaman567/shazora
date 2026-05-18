import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ShoppingBag, ArrowRight, Play } from 'lucide-react';
import { getProducts } from '../services/api';
import { useCart } from '../services/CartContext';

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full text-slate-900 dark:text-gray-200">
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Video restored */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50 contrast-125 brightness-75 scale-105"
          >
            <source src="https://www.pexels.com/download/video/4265086/" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto" ref={textRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            New Spring Collection 2026
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 uppercase tracking-tighter leading-none text-white">
            Define Your <span className="text-gradient italic">Style</span> <br/>
            With Shazora
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Premium apparel designed for the modern individual. Quality fabrics, perfect fits, and timeless designs for every occasion.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              to="/products"
              className="group relative inline-flex items-center gap-3 bg-gradient-custom px-10 py-5 rounded-2xl text-sm uppercase tracking-widest font-bold overflow-hidden"
            >
              <span>Explore Shop</span>
              <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-sm uppercase tracking-widest font-bold border border-white/20 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Our Story <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-accent to-transparent p-[1px]">
            <div className="w-full h-full bg-primary/50" />
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-32 bg-slate-50 dark:bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-magenta/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-4">Latest Arrivals</h2>
              <p className="text-slate-500 dark:text-gray-400 max-w-md">Our freshest drops, carefully curated for your seasonal wardrobe needs.</p>
            </motion.div>
            
            <Link to="/products" className="group flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-sm py-2 group">
              See All Products 
              <span className="w-8 h-[2px] bg-accent group-hover:w-12 transition-all" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((item, idx) => (
              <motion.div
                key={item.id || item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden glass mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <Link 
                      to={`/product/${item.id || item._id}`}
                      className="flex justify-center w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all shadow-xl"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="text-accent font-bold">${item.price}</p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{item.category} Collection</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Promotion */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative h-[500px] rounded-[40px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" 
              className="w-full h-full object-cover"
              alt="Promo"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-12 md:p-24">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase mb-6 leading-tight">
                  Summer <br/>Essential <span className="text-accent italic">Sale</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8">Up to 40% off on our limited edition summer accessories and lightweight apparel.</p>
                <Link to="/products" className="inline-block bg-white text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:invert transition-all">
                  Shop the Sale
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
