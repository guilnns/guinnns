export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  recommend: boolean;
}

export interface TechSpec {
  cushioningType: string;
  tractionPattern: string;
  weightGrams: number;
  materials: string;
}

export interface MetricRatings {
  traction: number;      // 1-100
  cushioning: number;    // 1-100
  responsiveness: number; // 1-100
  support: number;       // 1-100
  durability: number;    // 1-100
}

export interface Product {
  id: string;
  name: string;
  athlete: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  longDescription: string;
  category: 'Power' | 'Speed' | 'Control' | 'Agility';
  tag: string;
  colors: { name: string; hex: string }[];
  sizes: number[];
  techSpecs: TechSpec;
  metrics: MetricRatings;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface OrderDetails {
  fullName: string;
  email: string;
  zipCode: string;
  street: string;
  city: string;
  paymentMethod: 'pix' | 'credit' | 'boleto';
  installments?: number;
}
