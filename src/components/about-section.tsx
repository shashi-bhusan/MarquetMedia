import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, TrendingUp } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-baskerville font-light text-foreground mb-6">
            Who We Are
          </h2>
          <p className="text-xl font-montserrat text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We&apos;re a collective of creative minds, strategic thinkers, and digital innovators 
            passionate about elevating brands through authentic storytelling and meaningful connections.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-baskerville font-bold text-foreground mb-2">50+</h3>
            <p className="font-montserrat text-muted-foreground">Influencer Partners</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-baskerville font-bold text-foreground mb-2">200+</h3>
            <p className="font-montserrat text-muted-foreground">Creative Projects</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-baskerville font-bold text-foreground mb-2">300%</h3>
            <p className="font-montserrat text-muted-foreground">Average Growth</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="p-8 border border-border hover:border-primary/50 transition-all duration-300 group">
            <h3 className="text-2xl font-baskerville font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
              Influencer Collaborations
            </h3>
            <p className="font-montserrat text-muted-foreground mb-6 leading-relaxed">
              Strategic partnerships with authentic voices that resonate with your target audience, 
              creating genuine connections that drive engagement and conversion.
            </p>
            <Button variant="ghost" className="p-0 h-auto font-montserrat font-medium text-primary hover:text-primary/80">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="p-8 border border-border hover:border-primary/50 transition-all duration-300 group">
            <h3 className="text-2xl font-baskerville font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
              Graphic Design
            </h3>
            <p className="font-montserrat text-muted-foreground mb-6 leading-relaxed">
              Thoughtful visual identity and design solutions that capture your brand&apos;s essence 
              and communicate your values with clarity and sophistication.
            </p>
            <Button variant="ghost" className="p-0 h-auto font-montserrat font-medium text-primary hover:text-primary/80">
              View Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="p-8 border border-border hover:border-primary/50 transition-all duration-300 group">
            <h3 className="text-2xl font-baskerville font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
              Business Development
            </h3>
            <p className="font-montserrat text-muted-foreground mb-6 leading-relaxed">
              Strategic consulting and growth planning that aligns with your brand&apos;s vision, 
              helping you scale sustainably while maintaining authenticity.
            </p>
            <Button variant="ghost" className="p-0 h-auto font-montserrat font-medium text-primary hover:text-primary/80">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground font-montserrat font-medium px-12 py-4 text-lg rounded-none hover:bg-primary/90 transition-all"
          >
            Start Your Project
          </Button>
        </div>
      </div>
    </section>
  );
}
