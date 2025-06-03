const ProductCard = ({ title, price, image, original_price, discount_percentage, rating = 4.5 }) => {
    const imageUrl = image.startsWith('http') ? image : `http://127.0.0.1:5000${image}`;
    console.log(`Image URL for ${title}: ${imageUrl}`);

    const isOnSale = discount_percentage > 0 && original_price;

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-200">
            {/* Sale Badge */}
            {isOnSale && (
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    SALE
                </div>
            )}

            {/* Image Container */}
            <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium shadow-lg hover:bg-gray-50 transition-colors duration-200">
                            Quick View
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Rating */}
                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'fill-gray-200'}`}
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({rating})</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {title}
                </h3>

                {/* Price Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                            ${price}
                        </span>
                        {original_price && original_price > price && (
                            <span className="text-sm text-gray-500 line-through">
                                ${original_price}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Discount Percentage */}
                {discount_percentage > 0 && (
                    <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                            Save {discount_percentage}%
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom Border Animation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
};

export default ProductCard;