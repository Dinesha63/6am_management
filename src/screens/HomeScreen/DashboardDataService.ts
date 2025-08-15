export interface DashboardSummary {
  products: {
    total: number;
    subtitle: string;
  };
  customers: {
    total: number;
    subtitle: string;
  };
  wallet: {
    balance: number;
    subtitle: string;
  };
  postpaidDue: {
    amount: number;
    subtitle: string;
  };
}

export interface DeliveryStatus {
  completed: number;
  total: number;
  pending: number;
  skipped: number;
}

export interface Customer {
  id: string;
  name: string;
  location: string;
  products: string[];
  amountDue: number;
  walletBalance?: number;
  status?: 'active' | 'inactive';
  paymentType?: 'Prepaid' | 'Postpaid';
}

export interface DashboardData {
  summary: DashboardSummary;
  deliveries: DeliveryStatus;
  customers: Customer[];
  totalDue: number;
}

class DashboardDataService {
  private static instance: DashboardDataService;

  private constructor() {}

  public static getInstance(): DashboardDataService {
    if (!DashboardDataService.instance) {
      DashboardDataService.instance = new DashboardDataService();
    }
    return DashboardDataService.instance;
  }

  public getDashboardData(): DashboardData {
    return {
      summary: {
        products: {
          total: 1821,
          subtitle: 'today & tomorrow',
        },
        customers: {
          total: 9,
          subtitle: 'Vedapatti',
        },
        wallet: {
          balance: 450,
          subtitle: 'prepaid balance',
        },
        postpaidDue: {
          amount: 300,
          subtitle: 'amount due',
        },
      },
      deliveries: {
        completed: 12,
        total: 18,
        pending: 3,
        skipped: 3,
      },
      customers: [  
        {
          id: '1',
          name: 'Rajesh Kumar',
          location: 'Vedapatti',
          products: ['Milk 500ml', 'Curd 500ml'],
          amountDue: 0,
          walletBalance: 450,
          status: 'active',
          paymentType: 'Prepaid',
        },
        {
          id: '2',
          name: 'Amit Patel',
          location: 'Vedapatti',
          products: ['Milk 250ml', 'Butter 200g'],
          amountDue: 0,
          walletBalance: 200,
          status: 'active',
          paymentType: 'Prepaid',
        },
        {
          id: '3',
          name: 'Ravi Krishnan',
          location: 'Vedapatti',
          products: ['Milk 1L', 'Curd 500ml'],
          amountDue: 0,
          walletBalance: 600,
          status: 'active',
          paymentType: 'Prepaid',
        },
        {
          id: '4',
          name: 'Priya Sharma',
          location: 'Vedapatti',
          products: ['Milk 1L'],
          amountDue: 300,
          status: 'active',
          paymentType: 'Postpaid',
        },
        {
          id: '5',
          name: 'Sneha Reddy',
          location: 'Kovaipudur',
          products: ['Milk 500ml', 'Milk 1L'],
          amountDue: 150,
          status: 'active',
          paymentType: 'Postpaid',
        },
        {
          id: '6',
          name: 'Lakshmi Nair',
          location: 'Navavoor',
          products: ['Milk 250ml'],
          amountDue: 180,
          status: 'active',
          paymentType: 'Postpaid',
        },
        {
          id: '7',
          name: 'Meera Devi',
          location: 'Ponnaiahrajapuram',
          products: ['Milk 1L', 'Butter 200g'],
          amountDue: 220,
          status: 'active',
          paymentType: 'Postpaid',
        },
      ],
      totalDue: 850, 
    };
  }

  public getFilteredCustomers(location: string): Customer[] {
    const allCustomers = this.getDashboardData().customers;
    
    if (location === 'All Stores') {
      return allCustomers;
    }
    
    return allCustomers.filter(customer => customer.location === location);
  }

  public getTotalDueByLocation(location: string): number {
    const customers = this.getFilteredCustomers(location);
    return customers.reduce((total, customer) => total + customer.amountDue, 0);
  }

  public async refreshData(): Promise<DashboardData> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.getDashboardData();
  }
}

export default DashboardDataService;
