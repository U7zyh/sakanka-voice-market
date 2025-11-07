import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { toast } from 'sonner';
import { Plus, Search, Package, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Marketplace = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
    setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');

    // Get user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData) {
      setUserRole(roleData.role);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles(
            full_name,
            phone_number
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = async (text: string) => {
    setIsSearching(true);
    try {
      const response = await supabase.functions.invoke('search-products', {
        body: { query: text }
      });

      if (response.error) throw response.error;
      
      setProducts(response.data.products || []);
      toast.success(`Found ${response.data.count} products`);
    } catch (error: any) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    setIsSearching(true);
    try {
      const response = await supabase.functions.invoke('search-products', {
        body: { query: searchQuery }
      });

      if (response.error) throw response.error;
      
      setProducts(response.data.products || []);
      toast.success(`Found ${response.data.count} products`);
    } catch (error: any) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <MarketplaceHeader userName={userName} onSignOut={handleSignOut} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-card shadow-md">
            <TabsTrigger value="browse" className="text-base font-medium">
              Browse
            </TabsTrigger>
            <TabsTrigger value="search" className="text-base font-medium">
              <Mic className="h-4 w-4 mr-2" />
              Voice Search
            </TabsTrigger>
            {userRole === 'seller' && (
              <TabsTrigger value="sell" className="text-base font-medium">
                Sell
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3 max-w-2xl mx-auto">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                className="h-12 text-base shadow-sm"
              />
              <Button 
                onClick={handleTextSearch} 
                size="lg"
                disabled={isSearching}
                className="gradient-primary shadow-md"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No Products Found"
                description="Try adjusting your search or check back later for new listings."
                actionLabel="Clear Search"
                onAction={() => {
                  setSearchQuery('');
                  fetchProducts();
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-8">
            <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
                <Mic className="h-4 w-4" />
                <span className="text-sm font-medium">Voice-Powered Search</span>
              </div>
              
              <h2 className="text-3xl font-bold">Speak to Find Products</h2>
              <p className="text-muted-foreground text-lg">
                Use your voice in Twi, Ga, or Hausa to search for what you need
              </p>
              
              <div className="py-8">
                <VoiceRecorder onTranscription={handleVoiceSearch} />
              </div>
            </div>

            {isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {!isSearching && products.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {userRole === 'seller' && (
            <TabsContent value="sell">
              <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Seller Tools</span>
                </div>
                
                <h2 className="text-3xl font-bold">List Your Products</h2>
                <p className="text-muted-foreground text-lg">
                  Use voice or manual entry to quickly list products for sale
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/voice-sell')}
                    className="gradient-primary h-20 text-lg shadow-lg hover:shadow-xl"
                  >
                    <Mic className="h-6 w-6 mr-2" />
                    Voice Listing
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/sell')}
                    className="h-20 text-lg border-2 hover:bg-accent"
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    Manual Entry
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Marketplace;