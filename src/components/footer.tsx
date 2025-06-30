import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-baskerville font-bold mb-4">
              MARQUET
              <br />
              <span className="text-lg font-montserrat font-light tracking-[0.2em] text-background/70">
                MEDIA
              </span>
            </h3>
            <p className="font-montserrat text-background/80 mb-6 leading-relaxed max-w-md">
              Elevating brands through thoughtful marketing, creative design, 
              and strategic partnerships that create lasting impact.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 font-montserrat text-background/80">
              <li><a href="#home" className="hover:text-background transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-background transition-colors">About Us</a></li>
              <li><a href="#portfolio" className="hover:text-background transition-colors">Portfolio</a></li>
              <li><a href="#contact" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-montserrat font-semibold text-background mb-4">Services</h4>
            <ul className="space-y-2 font-montserrat text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Influencer Marketing</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Graphic Design</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Brand Strategy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Business Development</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-montserrat text-background/60 text-sm">
            © 2025 Marquet Media. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="font-montserrat text-background/60 text-sm hover:text-background transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-montserrat text-background/60 text-sm hover:text-background transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
