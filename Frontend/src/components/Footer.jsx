import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 pt-16 pb-8 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-900 dark:from-gray-400 dark:to-white">Verse</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Elevating your shopping experience with curated premium products from top-tier vendors globally.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Icons Placeholder */}
              {["Twitter", "Instagram", "GitHub"].map((platform) => (
                <a key={platform} href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                  <span className="sr-only">{platform}</span>
                  <div className="w-5 h-5 bg-current rounded-sm" style={{ WebkitMask: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"12\" cy=\"12\" r=\"12\"/></svg>') center/contain no-repeat" }}></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/shop" className="hover:text-gray-900 dark:hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Featured</Link></li>
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Offers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Stay Updated</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-white text-sm transition-all"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
            © {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-500 font-medium">
            <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  