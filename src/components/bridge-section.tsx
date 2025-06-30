import Image from "next/image";

export default function BridgeSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Bridge Image */}
      <div className="absolute inset-0">
        <Image
          src="/bridge-night.svg"
          alt="Night bridge with statue"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-baskerville font-light mb-4">
            Connecting Brands
          </h2>
          <p className="text-xl md:text-2xl font-montserrat font-light tracking-wide">
            With Their Perfect Audience
          </p>
        </div>
      </div>
    </section>
  );
}
