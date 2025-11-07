import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Search, ShoppingBag, Users, Zap, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none -z-10"></div>
        <div className="container mx-auto text-center space-y-10 relative z-10 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary mb-4 shadow-sm">
            <Mic className="h-4 w-4" />
            <span className="text-sm font-semibold">Voice-First Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Trade with Your{' '}
            <span className="gradient-primary bg-clip-text text-transparent">Voice</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sakanka connects Ghana's informal market traders through voice-powered technology.
            Buy and sell in <span className="font-semibold text-foreground">Twi, Ga, or Hausa</span> - no typing needed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gradient-primary text-lg px-10 py-7 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started
              <Mic className="ml-2 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="text-lg px-10 py-7 border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
            >
              Browse Products
              <Search className="ml-2 h-6 w-6" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16">
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">3</div>
              <div className="text-base text-muted-foreground mt-2 font-medium">Languages Supported</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">100%</div>
              <div className="text-base text-muted-foreground mt-2 font-medium">Voice-Powered</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">0</div>
              <div className="text-base text-muted-foreground mt-2 font-medium">Typing Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              How Sakanka Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start trading with your voice
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group text-center space-y-5 p-8 rounded-3xl gradient-card hover:shadow-2xl transition-all duration-300 border-0">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mic className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Speak Your Listing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe what you're selling in your own language. Our AI understands Twi, Ga, and Hausa.
              </p>
            </div>

            <div className="group text-center space-y-5 p-8 rounded-3xl gradient-card hover:shadow-2xl transition-all duration-300 border-0">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Voice Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find products by simply speaking. No need to type or spell complicated words.
              </p>
            </div>

            <div className="group text-center space-y-5 p-8 rounded-3xl gradient-card hover:shadow-2xl transition-all duration-300 border-0">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Connect & Trade</h3>
              <p className="text-muted-foreground leading-relaxed">
                Direct contact with sellers via phone. Arrange your own delivery and payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 gradient-hero">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Traders Love Sakanka
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4 p-6 bg-card rounded-xl shadow">
              <div className="shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Literacy Required</h3>
                <p className="text-sm text-muted-foreground">
                  Fully voice-powered interface means anyone can participate in digital commerce.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-xl shadow">
              <div className="shrink-0">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Local Languages</h3>
                <p className="text-sm text-muted-foreground">
                  Trade comfortably in Twi, Ga, or Hausa - speak naturally in your own language.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-xl shadow">
              <div className="shrink-0">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Expand Your Market</h3>
                <p className="text-sm text-muted-foreground">
                  Reach customers beyond your physical market location.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-xl shadow">
              <div className="shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Join the Voice Revolution?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start trading today. No complicated setup, no lengthy forms - just your voice.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="gradient-primary text-lg px-8 py-6 shadow-lg"
          >
            Start Trading Now
            <Mic className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <p className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">Sakanka</p>
                <p className="text-xs text-muted-foreground">Voice Marketplace</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Sakanka. Empowering Ghana's informal market traders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
