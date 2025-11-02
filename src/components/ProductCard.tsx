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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{product.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {formatPrice(product.price)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{product.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Qty: {product.quantity}
          </span>
          <span className="text-muted-foreground">
            {formatDate(product.created_at)}
          </span>
        </div>
        
        {product.profiles && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">{product.profiles.full_name}</p>
          </div>
        )}
      </CardContent>
      
      {product.profiles?.phone_number && (
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full"
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