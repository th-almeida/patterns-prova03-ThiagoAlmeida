class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      price: this.price
    };
  }
}

class OrderItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  getSubtotal() {
    return this.product.price * this.quantity;
  }

  getInfo() {
    return {
      product: this.product.getInfo(),
      quantity: this.quantity,
      subtotal: this.getSubtotal()
    };
  }
}

class Order {
  constructor(id, customerName) {
    this.id = id;
    this.customerName = customerName;
    this.items = [];
    this.status = 'pending';
  }

  addItem(product, quantity) {
    const item = new OrderItem(product, quantity);
    this.items.push(item);
    return this;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getInfo() {
    return {
      id: this.id,
      customer: this.customerName,
      items: this.items.map(item => item.getInfo()),
      total: this.getTotal(),
      status: this.status
    };
  }
}

class OrderValidator {
  validate(order) {
    if (!order.id || !order.customerName) {
      throw new Error('Order must have id and customer name');
    }
    if (order.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    return true;
  }
}

class DiscountCalculator {
  calculateDiscount(order) {
    const total = order.getTotal();
    if (total > 500) {
      return total * 0.1;
    }
    if (total > 200) {
      return total * 0.05;
    }
    return 0;
  }
}

class OrderService {
  constructor(validator, discountCalculator) {
    this.validator = validator;
    this.discountCalculator = discountCalculator;
  }

  createOrder(id, customerName) {
    return new Order(id, customerName);
  }

  finalizeOrder(order) {
    this.validator.validate(order);
    const discount = this.discountCalculator.calculateDiscount(order);
    const total = order.getTotal();
    const finalTotal = total - discount;

    order.status = 'completed';
    return {
      order: order.getInfo(),
      discount: discount,
      total: total,
      finalTotal: finalTotal
    };
  }
}

function main() {
  console.log('=== Integrated System Demonstration ===\n');
  console.log('Demonstrating SOLID and GRASP patterns together:\n');

  const validator = new OrderValidator();
  const discountCalculator = new DiscountCalculator();
  const orderService = new OrderService(validator, discountCalculator);

  const product1 = new Product('PROD-001', 'Notebook', 2500.00);
  const product2 = new Product('PROD-002', 'Mouse', 50.00);
  const product3 = new Product('PROD-003', 'Teclado', 150.00);

  console.log('Creating order for João Silva:');
  const order1 = orderService.createOrder('ORD-001', 'João Silva');
  order1.addItem(product1, 1);
  order1.addItem(product2, 2);
  order1.addItem(product3, 1);

  console.log('\nOrder details:');
  console.log(JSON.stringify(order1.getInfo(), null, 2));

  console.log('\nFinalizing order:');
  const result1 = orderService.finalizeOrder(order1);
  console.log(JSON.stringify(result1, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('\nCreating order for Maria Santos:');
  const order2 = orderService.createOrder('ORD-002', 'Maria Santos');
  order2.addItem(product1, 2);

  console.log('\nOrder details:');
  console.log(JSON.stringify(order2.getInfo(), null, 2));

  console.log('\nFinalizing order:');
  const result2 = orderService.finalizeOrder(order2);
  console.log(JSON.stringify(result2, null, 2));

  console.log('\n=== Patterns Summary ===');
  console.log('SOLID Patterns:');
  console.log('1. Single Responsibility: Each class has one responsibility');
  console.log('2. Open/Closed: DiscountCalculator can be extended without modifying Order');
  console.log('\nGRASP Pattern:');
  console.log('1. Information Expert: OrderItem calculates its own subtotal, Order calculates its own total');
}

main();
