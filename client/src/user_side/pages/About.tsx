// src/pages/About.tsx
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header / Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          About M.Z Luxury Fragrance
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          "Perfume is the art that makes memory tangible." – A fragrance tells a story, and we craft each scent to make yours unforgettable.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            At M.Z Luxury Fragrance, we believe every scent evokes emotions and memories. From timeless classics to contemporary creations, our perfumes are designed to leave a lasting impression. We source the finest ingredients from around the world and craft fragrances that celebrate individuality.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Whether you are choosing a signature scent for yourself or a gift for a loved one, our carefully curated collection promises elegance, luxury, and sophistication in every bottle.
          </p>
        </div>
        <div className="flex justify-center w-[300px] h-[320px]">
          <img
            src="/carosel.jpg"
            alt="Perfume bottles"
            className="rounded-xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Quality Ingredients</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We use only premium natural oils and essences to craft exquisite fragrances.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Luxury Experience</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every bottle is designed to give you a premium and unforgettable experience.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Customer Satisfaction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We are committed to providing personalized service and ensuring our customers are delighted.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Your Signature Scent
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Explore our collection and find the fragrance that tells your story.
        </p>
        <button
          onClick={() => navigate("/web/men")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default About;
