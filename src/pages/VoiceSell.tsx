import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VoiceSell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState('english');
  const [productData, setProductData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell products",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setUser(user);
  };

  const handleProductExtracted = (data: any) => {
    setProductData(data);
    toast({
      title: "Product Understood!",
      description: "I've captured your product details. Review and confirm?",
    });
  };

  const handleConfirmListing = async () => {
    if (!productData || !user) return;

    try {
      const { error } = await supabase.from('products').insert({
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price) || 0,
        quantity: parseInt(productData.quantity) || 1,
        location: productData.location || '',
        seller_id: user.id,
        status: 'active',
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your product has been listed on the marketplace.",
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error listing product:', error);
      toast({
        title: "Error",
        description: "Could not list your product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/sell')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Options
        </Button>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Voice Selling Assistant</CardTitle>
            <CardDescription>
              Speak naturally about your product. I'll help you list it on the marketplace.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Your Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="twi">Twi</SelectItem>
                  <SelectItem value="ga">Ga</SelectItem>
                  <SelectItem value="hausa">Hausa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <VoiceAssistant 
              language={language} 
              onProductExtracted={handleProductExtracted}
            />

            {productData && (
              <Card className="bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-semibold">Product:</span> {productData.title}
                  </div>
                  <div>
                    <span className="font-semibold">Description:</span> {productData.description}
                  </div>
                  <div>
                    <span className="font-semibold">Price:</span> GHS {productData.price}
                  </div>
                  <div>
                    <span className="font-semibold">Quantity:</span> {productData.quantity}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span> {productData.location}
                  </div>
                  
                  <Button 
                    onClick={handleConfirmListing}
                    className="w-full mt-4"
                    size="lg"
                  >
                    Confirm & List Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceSell;
