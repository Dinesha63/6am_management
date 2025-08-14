export interface Welcome {
    data: Data;
}

export interface Data {
    Category: string;
    products: Product[];
}

export interface Product {
    product_id:   string;
    product_Name: string;
    mrp_price:    string;
    today_price:  number;
    likes:        number;
    reviews:      number;
    measurement:  string;
    image_list:   ImageList[];
    description:  string;
    Nutrition:    string;
  }

export interface ImageList {
    image_url: string;
}

// --- Product Details Types ---
export interface ProductDetailImage {
  imageUrl: string;
  order: number;
}

export interface ProductDetailData {
  productSkuCode: string;
  productSkuName: string;
  mrp: number;
  price: number;
  description: string;
  nutrition: string;
  images: ProductDetailImage[];
}

export interface ProductDetailResponse {
  success: boolean;
  errors: any[];
  data: ProductDetailData;
  statusCode: number | null;
}

export interface ProductDetailsState {
  productDetail: ProductDetailData | null;
  loading: boolean;
  error: string | null;
}


// New types for Product Catalog API
export interface ProductCatalogResponse {
    success: boolean;
    errors: any[];
    data: ProductCatalogItem[];
    statusCode: number | null;
}

export interface ProductCatalogItem {
    code: string;
    name: string;
    isSku: boolean;
}

export interface ProductCatalogState {
    items: ProductCatalogItem[];
    loading: boolean;
    error: string | null;
}

// --- Product Catalog Types ---
export interface ProductSku {
  productSkuCode: string;
  productSkuName: string;
  mrp: number;
  price: number;
  review: number;
  imageUrl: string | null;
}

export interface ProductCatalogProduct {
  productCode: string;
  productName: string;
  imageUrl: string | null;
  productSku: ProductSku[];
}

export interface ProductCategory {
  categoryCode: string;
  categoryName: string;
  product: ProductCatalogProduct[];
}

export interface ProductCategoryListResponse {
  success: boolean;
  errors: string[];
  data: ProductCategory[];
  statusCode: number | null;
}
export interface ProductState {
  catalog: ProductCatalogState;
  details: ProductDetailsState;
}
