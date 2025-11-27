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

  const validator = new OrderValidator();
  const repository = new OrderRepository();
  const orderService = new OrderService(validator, repository);

  try {
    const order1 = orderService.createOrder(
      'ORD-001',
      'João Silva',
      ['Produto A', 'Produto B'],
      150.00
    );

    const order2 = orderService.createOrder(
      'ORD-002',
      'Maria Santos',
      ['Produto C'],
      75.50
    );

    console.log('Orders created successfully:');
    console.log(JSON.stringify(order1.getOrderInfo(), null, 2));
    console.log(JSON.stringify(order2.getOrderInfo(), null, 2));

    console.log('\nAll orders in repository:');
    const allOrders = orderService.getAllOrders();
    allOrders.forEach(order => {
      console.log(`Order ${order.id}: ${order.customerName} - R$ ${order.total}`);
    });

    console.log('\nSearching for order ORD-001:');
    const foundOrder = orderService.getOrder('ORD-001');
    if (foundOrder) {
      console.log(JSON.stringify(foundOrder.getOrderInfo(), null, 2));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
