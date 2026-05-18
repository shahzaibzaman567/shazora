import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ProductCard from '../components/ui/ProductCard';
import { getProducts } from '../services/api';
import { fashionProducts } from '../data/fashionData';

const Products = ({ category = 'all' }) => {
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceLimit, setPriceLimit] = useState(200);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'power2.out', delay: 0.2 }
        );
      }
    });
    return () => ctx.revert();
  }, [products]);

  const filteredProducts = products.filter((item) => {
    const matchesCategory = category === 'all' || item.category?.toLowerCase() === category.toLowerCase();
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = item.price <= priceLimit;
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="container mx-auto px-6 max-w-7xl py-12 text-slate-900 dark:text-gray-200">
      <motion.div 
        ref={headerRef}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-heading font-bold uppercase tracking-widest mb-4">
          {category === 'all' ? 'The Collection' : `${category} Collection`}
        </h1>
        <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass p-6 rounded-[2rem] border border-white/10">
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
            <div className="flex flex-col gap-2 items-start">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Under: ${priceLimit}</span>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="10"
                className="w-32 accent-accent cursor-pointer"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
              />
            </div>

            <select 
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 outline-none font-bold text-sm cursor-pointer text-slate-900 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest" className="text-slate-900 bg-white">Newest Arrivals</option>
              <option value="price-low" className="text-slate-900 bg-white">Price: Low to High</option>
              <option value="price-high" className="text-slate-900 bg-white">Price: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-50 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
          <p className="text-xl font-bold uppercase tracking-widest">No products found matching your criteria</p>
          <button onClick={() => { setSearchTerm(''); setPriceLimit(500); }} className="mt-4 text-accent underline underline-offset-4 text-xs font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
