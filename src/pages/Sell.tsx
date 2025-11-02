import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

const Sell = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '1',
    location: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);

    // Check if user is a seller
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'seller')
      .single();

    if (!roleData) {
      toast.error('You need to be a seller to list products');
      navigate('/marketplace');
    }

    // Load user location from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('location')
      .eq('id', user.id)
      .single();

    if (profileData?.location) {
      setProductData(prev => ({ ...prev, location: profileData.location }));
    }
  };

  const handleVoiceTranscription = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await supabase.functions.invoke('extract-product-info', {
        body: {
          text,
          language: 'twi',
          action: 'sell'
        }
      });

      if (response.error) throw response.error;

      const extracted = response.data;
      setProductData({
        title: extracted.title || text.slice(0, 50),
        description: extracted.description || text,
        price: extracted.price?.toString() || '',
        quantity: extracted.quantity?.toString() || '1',
        location: extracted.location !== 'Not specified' ? extracted.location : productData.location,
      });

      toast.success('Product information extracted! Please review and submit.');
    } catch (error: any) {
      toast.error('Failed to process voice input. Please fill in manually.');
      setProductData(prev => ({ ...prev, description: text }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          title: productData.title,
          description: productData.description || null,
          price: parseFloat(productData.price),
          quantity: parseInt(productData.quantity),
          location: productData.location,
          status: 'active',
        });

      if (error) throw error;

      toast.success('Product listed successfully!');
      navigate('/marketplace');
    } catch (error: any) {
      toast.error(error.message || 'Failed to list product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">List Your Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Voice Input */}
              <div className="text-center space-y-4 py-6 border-b">
                <p className="text-sm text-muted-foreground">
                  Speak to describe your product
                </p>
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>

              {/* Manual Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    required
                    value={productData.title}
                    onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                    placeholder="e.g., Fresh Plantains"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (GHS) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      required
                      value={productData.quantity}
                      onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    required
                    value={productData.location}
                    onChange={(e) => setProductData({ ...productData, location: e.target.value })}
                    placeholder="e.g., Accra, Makola Market"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Listing Product...' : 'List Product'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sell;