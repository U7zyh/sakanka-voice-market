import { MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    quantity: number;
    location: string;
    created_at: string;
    profiles?: {
      full_name: string;
      phone_number: string | null;
    };
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 gradient-card border-0 animate-scale-in">
      <CardHeader className="pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {product.title}
          </CardTitle>
          <Badge className="shrink-0 bg-primary text-primary-foreground shadow-md px-3 py-1 text-sm font-bold">
            {formatPrice(product.price)}
          </Badge>
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{product.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Qty:</span>
              <span className="text-muted-foreground">{product.quantity}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatDate(product.created_at)}</span>
            </div>
          </div>
        </div>
        
        {product.profiles && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                {product.profiles.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{product.profiles.full_name}</p>
                <p className="text-xs text-muted-foreground">Seller</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {product.profiles?.phone_number && (
        <CardFooter className="pt-0">
          <Button 
            variant="default" 
            className="w-full gradient-primary hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
            onClick={() => window.location.href = `tel:${product.profiles?.phone_number}`}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Seller
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};