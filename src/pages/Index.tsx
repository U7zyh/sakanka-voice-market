import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Search, ShoppingBag, Users, Zap, Globe, Menu } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Floating Shapes Background */}
      <div className="floating-shapes fixed inset-0 pointer-events-none">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black gradient-primary bg-clip-text text-transparent">SAKANKA</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Voice Marketplace</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">How It Works</a>
              <a href="#benefits" className="text-sm font-semibold hover:text-primary transition-colors">Benefits</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/marketplace')}
                className="hidden md:flex border-2 hover:scale-105 transition-transform"
              >
                Browse Market
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="gradient-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all pulse-glow"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Speaking
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="sm:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 space-y-3 animate-fade-in">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/marketplace')}
              >
                Browse Market
              </Button>
              <Button
                className="w-full gradient-primary"
                onClick={() => navigate('/auth')}
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Speaking
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 opacity-50"></div>
        
        <div className="container mx-auto text-center relative z-10 animate-scale-in">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/20 bg-primary/5 mb-8 hover:scale-105 transition-transform">
            <div className="voice-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
            <span className="text-sm font-bold text-primary">VOICE-FIRST REVOLUTION</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
            <span className="block mb-2">Trade with</span>
            <span className="gradient-primary bg-clip-text text-transparent drop-shadow-2xl">Your Voice</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Connect, buy, and sell through the power of voice. No typing, no reading—just speak in{' '}
            <span className="font-bold text-primary">Twi</span>,{' '}
            <span className="font-bold text-primary">Ga</span>, or{' '}
            <span className="font-bold text-primary">Hausa</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto gradient-primary text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all pulse-glow"
            >
              <Mic className="mr-2 h-5 w-5" />
              <span>Start Speaking Now</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 border-2 hover:scale-105 transition-all"
            >
              <Search className="mr-2 h-5 w-5" />
              <span>Explore Marketplace</span>
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="glass-card p-6 sm:p-8 hover:scale-105 transition-all card-3d">
              <div className="text-4xl sm:text-5xl font-black gradient-primary bg-clip-text text-transparent mb-2">3</div>
              <div className="text-sm sm:text-base font-semibold mb-1">Local Languages</div>
              <div className="text-xs text-muted-foreground">Twi, Ga, Hausa</div>
            </div>
            <div className="glass-card p-6 sm:p-8 hover:scale-105 transition-all card-3d">
              <div className="text-4xl sm:text-5xl font-black gradient-primary bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-sm sm:text-base font-semibold mb-1">Voice Powered</div>
              <div className="text-xs text-muted-foreground">No Typing Required</div>
            </div>
            <div className="glass-card p-6 sm:p-8 hover:scale-105 transition-all card-3d">
              <div className="text-4xl sm:text-5xl font-black gradient-primary bg-clip-text text-transparent mb-2">0%</div>
              <div className="text-sm sm:text-base font-semibold mb-1">Literacy Barrier</div>
              <div className="text-xs text-muted-foreground">Everyone Can Trade</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black gradient-primary bg-clip-text text-transparent mb-4 sm:mb-6">
              How Sakanka Works
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Three magical steps to transform your voice into trade opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group glass-card p-6 sm:p-8 hover:scale-105 transition-all card-3d text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Mic className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">Speak Your Listing</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Describe your products naturally in Twi, Ga, or Hausa. Our AI understands your local dialect perfectly.
              </p>
              <div className="mt-4 sm:mt-6 voice-wave justify-center">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>

            <div className="group glass-card p-6 sm:p-8 hover:scale-105 transition-all card-3d text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">Voice Search Magic</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Find exactly what you need by speaking. No spelling, no typing—just ask naturally.
              </p>
              <div className="mt-4 sm:mt-6 text-primary">
                <Zap className="h-8 w-8 mx-auto" />
              </div>
            </div>

            <div className="group glass-card p-6 sm:p-8 hover:scale-105 transition-all card-3d text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">Connect & Prosper</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Direct contact with buyers/sellers. Build trust and grow your business effortlessly.
              </p>
              <div className="mt-4 sm:mt-6 flex justify-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 sm:py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            Why Traders Love Sakanka
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4 p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">No Literacy Required</h3>
                <p className="text-sm text-muted-foreground">
                  Fully voice-powered interface means anyone can participate in digital commerce.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Local Languages</h3>
                <p className="text-sm text-muted-foreground">
                  Trade comfortably in Twi, Ga, or Hausa - speak naturally in your own language.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <ShoppingBag className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Expand Your Market</h3>
                <p className="text-sm text-muted-foreground">
                  Reach customers beyond your physical market location.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Simple & Direct</h3>
                <p className="text-sm text-muted-foreground">
                  Direct phone contact between buyers and sellers. No complicated payment systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6">
            Ready to Speak Your Success?
          </h2>
          <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of traders who are already growing their business with Sakanka
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
          >
            <Mic className="mr-2 h-5 w-5" />
            <span>Launch Your Voice Store</span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg gradient-primary bg-clip-text text-transparent">Sakanka</p>
                <p className="text-xs text-muted-foreground">Voice Marketplace</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-right">
              © 2025 Sakanka. Empowering Ghana's informal market traders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
