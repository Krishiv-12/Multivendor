import { useState, useRef, useEffect } from "react";

const cloudinaryOptimize = (url, width = 400) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},dpr_auto/`);
};

const LazyImage = ({ src, alt, className = "", imgClassName = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "150px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const optimizedSrc = cloudinaryOptimize(Array.isArray(src) ? src[0] : src, 400);

  return (
    <div
      ref={ref}
      className={`relative w-full h-full bg-gray-100 dark:bg-slate-700 overflow-hidden ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 shimmer-bg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      )}
      {inView && (
        <img
          src={optimizedSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default LazyImage;
