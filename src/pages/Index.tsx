import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Search, ShoppingBag, Users, Zap, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-[90vh] flex items-center justify-center px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Mic className="h-4 w-4" />
            <span className="text-sm font-medium">Voice-First Marketplace</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Trade with Your{' '}
            <span className="gradient-primary bg-clip-text text-transparent">Voice</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Sakanka connects Ghana's informal market traders through voice-powered technology.
            Buy and sell in Twi, Ga, or Hausa - no typing needed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gradient-primary text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started
              <Mic className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="text-lg px-8 py-6"
            >
              Browse Products
              <Search className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
            <div>
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Voice-Powered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Typing Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How Sakanka Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-2xl gradient-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Speak Your Listing</h3>
              <p className="text-muted-foreground">
                Describe what you're selling in your own language. Our AI understands Twi, Ga, and Hausa.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl gradient-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Voice Search</h3>
              <p className="text-muted-foreground">
                Find products by simply speaking. No need to type or spell complicated words.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl gradient-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Connect & Trade</h3>
              <p className="text-muted-foreground">
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
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Sakanka. Empowering Ghana's informal market traders.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
