import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <main className="w-full px-4 lg:px-12 py-12">
        <div className="mb-10 text-center">
          <h1 className="brand-font text-4xl lg:text-5xl font-bold uppercase tracking-widest text-[#800020]">
            Wishlist
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-4"></div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-[#D4AF37]/10 rounded-lg py-20 px-4 text-center">
            <Icon
              icon="lucide:heart"
              className="text-6xl text-[#D4AF37]/30 mb-6"
            ></Icon>
            <h2 className="brand-font text-2xl text-[#800020] mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Save your favourite sarees and find them here later.
            </p>
            <Link
              to="/collection"
              className="inline-block bg-[#800020] px-8 py-4 text-[#D4AF37] font-bold uppercase tracking-widest"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-[#D4AF37]/10 shadow-sm"
              >
                <Link to={`/product/${item.slug}`} className="block aspect-[3/4]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="p-5">
                  <h3 className="brand-font text-lg text-[#800020] truncate">
                    {item.name}
                  </h3>
                  <p className="font-bold text-[#3D2817] mt-2">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="bg-[#800020] text-[#D4AF37] py-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Add Bag
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="border border-[#800020]/25 text-[#800020] py-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;

