class Order {
  constructor(id, customerName, items, total) {
    this.id = id;
    this.customerName = customerName;
    this.items = items;
    this.total = total;
    this.status = 'pending';
  }

  getOrderInfo() {
    return {
      id: this.id,
      customer: this.customerName,
      items: this.items,
      total: this.total,
      status: this.status
    };
  }
}

class OrderValidator {
  validate(order) {
    if (!order.id || !order.customerName) {
      throw new Error('Order must have id and customer name');
    }
    if (!Array.isArray(order.items) || order.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    if (order.total <= 0) {
      throw new Error('Order total must be greater than zero');
    }
    return true;
  }
}

class OrderRepository {
  constructor() {
    this.orders = [];
  }

  save(order) {
    this.orders.push(order);
    return order;
  }

  findById(id) {
    return this.orders.find(o => o.id === id);
  }

  findAll() {
    return this.orders;
  }
}

class StrictOrderValidator extends OrderValidator {
  validate(order) {
    super.validate(order);
    if (order.total > 10000) {
      throw new Error('Order total exceeds maximum allowed value');
    }
    return true;
  }
}

class DatabaseOrderRepository extends OrderRepository {
  save(order) {
    console.log(`[Database] Saving order ${order.id} to database`);
    return super.save(order);
  }
}

class OrderService {
  constructor(validator, repository) {
    this.validator = validator;
    this.repository = repository;
  }

  createOrder(id, customerName, items, total) {
    const order = new Order(id, customerName, items, total);
    this.validator.validate(order);
    return this.repository.save(order);
  }

  getOrder(id) {
    return this.repository.findById(id);
  }

  getAllOrders() {
    return this.repository.findAll();
  }
}

function main() {
  console.log('=== SOLID Patterns Demonstration ===\n');
  console.log('Pattern 1: Single Responsibility Principle (SRP)');
  console.log('Each class has one reason to change:\n');
  console.log('- Order: represents order data');
  console.log('- OrderValidator: validates order data');
  console.log('- OrderRepository: handles data persistence');
  console.log('- OrderService: orchestrates business logic\n');
  
  console.log('Pattern 2: Open/Closed Principle (OCP)');
  console.log('Classes are open for extension, closed for modification:\n');
  console.log('- StrictOrderValidator extends OrderValidator without modifying it');
  console.log('- DatabaseOrderRepository extends OrderRepository without modifying it');
  console.log('- OrderService works with any validator/repository implementation\n');

  console.log('Using basic validator and repository:');
  const basicValidator = new OrderValidator();
  const basicRepository = new OrderRepository();
  const basicService = new OrderService(basicValidator, basicRepository);

  try {
    const order1 = basicService.createOrder(
      'ORD-001',
      'João Silva',
      ['Produto A', 'Produto B'],
      150.00
    );

    const order2 = basicService.createOrder(
      'ORD-002',
      'Maria Santos',
      ['Produto C'],
      75.50
    );

    console.log('Orders created successfully:');
    console.log(JSON.stringify(order1.getOrderInfo(), null, 2));
    console.log(JSON.stringify(order2.getOrderInfo(), null, 2));

    console.log('\nAll orders in repository:');
    const allOrders = basicService.getAllOrders();
    allOrders.forEach(order => {
      console.log(`Order ${order.id}: ${order.customerName} - R$ ${order.total}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('\nDemonstrating OCP - Using extended classes:');
    const strictValidator = new StrictOrderValidator();
    const dbRepository = new DatabaseOrderRepository();
    const extendedService = new OrderService(strictValidator, dbRepository);

    const order3 = extendedService.createOrder(
      'ORD-003',
      'Pedro Costa',
      ['Produto D'],
      200.00
    );

    console.log('\nOrder created with extended validator and repository:');
    console.log(JSON.stringify(order3.getOrderInfo(), null, 2));

    console.log('\nTrying to create order exceeding limit (demonstrating extended validation):');
    try {
      extendedService.createOrder(
        'ORD-004',
        'Ana Lima',
        ['Produto E'],
        15000.00
      );
    } catch (error) {
      console.log(`Validation error (as expected): ${error.message}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
