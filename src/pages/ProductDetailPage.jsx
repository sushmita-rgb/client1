import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import RelatedProducts from '../components/products/RelatedProducts';
import { Check, ShieldCheck, Heart, Sparkles, ArrowLeft, Instagram } from 'lucide-react';

const categoryBg = {
  'Bracelets':        'from-[#EBF3FA] via-[#F4EFE6] to-[#FAF7F2]',
  'Keychains':        'from-[#F4EFE6] via-[#FFFDF9] to-[#EBF3FA]',
  'Mobile Keychains': 'from-[#EBF3FA] via-[#FFFDF9] to-[#F0EBF8]',
  'Best Collection':  'from-[#FDF8E7] via-[#FAF7F2] to-[#EBF3FA]',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProduct(id);
      setProduct(data);
      if (data) {
        setSelectedImage(data.imageUrl);
      }
    } catch (e) {
      console.error('Error fetching product details:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#B8D4F0] border-t-[#4A607A] rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-[#5C728A]">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center text-center px-4">
        <div className="space-y-4 max-w-md">
          <h2 className="font-serif text-3xl text-[#2C3E50]">Product Not Found</h2>
          <p className="text-sm text-[#5C728A]">The requested ornament may have been removed or updated.</p>
          <Link
            to="/collections"
            className="inline-flex items-center text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full bg-[#4A607A] text-white hover:bg-[#2C3E50] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO COLLECTIONS
          </Link>
        </div>
      </div>
    );
  }

  const detailsList = [
    'Handmade individually with premium beads',
    'Lightweight & comfortable for daily wear',
    'Adjustable size / universal fitting',
    'Carefully packaged in signature AurelleCharmsss gift box',
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Back Link */}
        <Link
          to="/collections"
          className="inline-flex items-center text-xs font-semibold tracking-wider text-[#5C728A] hover:text-[#2C3E50] uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK TO COLLECTIONS
        </Link>

        {/* Product Details Section: Left Gallery + Right Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br ${categoryBg[product.category] || 'from-[#EBF3FA] via-[#FAF7F2] to-[#FFFDF9]'} border border-[#EBE3D5] shadow-soft-lg flex items-center justify-center`}>
              <img
                src={selectedImage || product.imageUrl}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain drop-shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Thumbnail */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setSelectedImage(product.imageUrl)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-gradient-to-br ${categoryBg[product.category] || 'from-[#EBF3FA] to-[#FAF7F2]'} flex items-center justify-center ${selectedImage === product.imageUrl ? 'border-[#4A607A]' : 'border-transparent opacity-70'}`}
              >
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-1 drop-shadow-sm" />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="space-y-6 sm:space-y-8 bg-[#FFFDF9] p-5 sm:p-8 lg:p-10 rounded-2xl border border-[#EBE3D5] shadow-soft-sm">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#4A607A] uppercase bg-[#EBF3FA] px-3 py-1 rounded-full border border-[#B8D4F0]">
                  {product.category}
                </span>
                {product.available ? (
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    IN STOCK & READY TO SHIP
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    MADE TO ORDER
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl text-[#2C3E50] font-normal leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline space-x-3">
                <span className="font-serif text-3xl font-bold text-[#2C3E50]">
                  ₹{product.price}
                </span>
                <span className="text-xs text-[#94A3B8]">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#FAF7F2] pt-6 space-y-2">
              <h3 className="text-xs font-semibold tracking-wider text-[#4A607A] uppercase">
                DESCRIPTION
              </h3>
              <p className="text-sm text-[#5C728A] font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Details Checklist */}
            <div className="border-t border-[#FAF7F2] pt-6 space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-[#4A607A] uppercase">
                PRODUCT DETAILS
              </h3>
              <ul className="space-y-2 text-sm text-[#5C728A]">
                {detailsList.map((detail, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="w-4 h-4 mr-2.5 text-[#D4AF37] shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ordering happens in Instagram DMs — nothing is recorded here. */}
            <div className="border-t border-[#FAF7F2] pt-6">
              <a
                href="https://instagram.com/aurellecharmsss"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase font-semibold text-white bg-[#4A607A] hover:bg-[#2C3E50] py-3.5 px-4 sm:px-6 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-300 text-center"
              >
                <Instagram className="w-4 h-4 shrink-0" />
                <span>Order on Instagram (@aurellecharmsss)</span>
              </a>
            </div>

            {/* Shipping & Guarantee Notes */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl flex items-center space-x-3 text-xs text-[#5C728A]">
              <ShieldCheck className="w-5 h-5 text-[#4A607A] shrink-0" />
              <span>Safe packaging guarantee & 100% authentic handmade craftsmanship.</span>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        <RelatedProducts currentProductId={product.$id || product.id} category={product.category} />

      </div>
    </div>
  );
}
