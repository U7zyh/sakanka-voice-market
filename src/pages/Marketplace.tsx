import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { ProductCard } from '@/components/ProductCard';
import { toast } from 'sonner';
import { LogOut, Plus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Marketplace = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    try {
      toast.loading('Searching...');
      
      const response = await supabase.functions.invoke('search-products', {
        body: { query: text }
      });

      if (response.error) throw response.error;
      
      toast.dismiss();
      setProducts(response.data.products || []);
      toast.success(`Found ${response.data.count} products`);
    } catch (error: any) {
      toast.dismiss();
      toast.error('Search failed. Please try again.');
    }
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      const response = await supabase.functions.invoke('search-products', {
        body: { query: searchQuery }
      });

      if (response.error) throw response.error;
      
      setProducts(response.data.products || []);
      toast.success(`Found ${response.data.count} products`);
    } catch (error: any) {
      toast.error('Search failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 gradient-primary shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">Sakanka</h1>
          <Button variant="ghost" onClick={handleSignOut} className="text-primary-foreground hover:bg-white/20">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            {userRole === 'seller' && <TabsTrigger value="sell">Sell</TabsTrigger>}
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
              />
              <Button onClick={handleTextSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Voice Search</h2>
              <p className="text-muted-foreground">
                Speak to search for products in your language
              </p>
              <VoiceRecorder onTranscription={handleVoiceSearch} />
            </div>

            {products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {userRole === 'seller' && (
            <TabsContent value="sell">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">List Your Product</h2>
                <p className="text-muted-foreground">
                  Speak to describe what you're selling
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/sell')}
                  className="gradient-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  List New Product
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Marketplace;