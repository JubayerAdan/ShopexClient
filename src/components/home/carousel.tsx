"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Hero = () => {
  return (
    <section className="w-full max-w-6xl mx-auto max-h-screen mb-5">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="rounded-lg overflow-hidden"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative flex items-center justify-between bg-black text-white px-8 py-16 rounded-lg">
            {/* Left Side */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  alt="Apple"
                  className="w-6 h-6"
                />
                <span className="text-sm">iPhone 14 Series</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Up to 10% <br /> off Voucher
              </h1>
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-white border-b border-white hover:opacity-80"
              >
                Shop Now →
              </a>
            </div>

            {/* Right Side: iPhone Image */}
            <img
              src="https://mobilebuzzbd.com/wp-content/uploads/2023/07/iPhone-14-Pro.jpg"
              alt="iPhone 14 Pro"
              className="w-1/2 object-contain"
            />
          </div>
        </SwiperSlide>

        {/* Slide 2 (Example) */}
        <SwiperSlide>
          <div className="relative flex items-center justify-between bg-black text-white px-8 py-16 rounded-lg">
            {/* Left Side */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  alt="Apple"
                  className="w-6 h-6"
                />
                <span className="text-sm">MacBook Air</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Save Big on <br /> MacBook Air
              </h1>
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-white border-b border-white hover:opacity-80"
              >
                Shop Now →
              </a>
            </div>

         
            <img
              src="https://assets.gadgetandgear.com/upload/product/20201125_1606301857_210129.jpeg"
              alt="MacBook Air"
              className="w-1/2 object-contain"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Hero;
