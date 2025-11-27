class Payment {
  constructor(amount, method) {
    this.amount = amount;
    this.method = method;
    this.status = 'pending';
    this.processedAt = null;
  }

  process() {
    this.status = 'processing';
    return this;
  }

  complete() {
    this.status = 'completed';
    this.processedAt = new Date().toISOString();
    return this;
  }

  getPaymentInfo() {
    return {
      amount: this.amount,
      method: this.method,
      status: this.status,
      processedAt: this.processedAt
    };
  }
}

class CreditCardPayment extends Payment {
  constructor(amount, cardNumber, cardHolder) {
    super(amount, 'credit_card');
    this.cardNumber = cardNumber;
    this.cardHolder = cardHolder;
  }

  process() {
    super.process();
    return this;
  }

  complete() {
    super.complete();
    return this;
  }

  getPaymentInfo() {
    const info = super.getPaymentInfo();
    return {
      ...info,
      cardHolder: this.cardHolder,
      cardNumber: this.maskCardNumber()
    };
  }

  maskCardNumber() {
    const last4 = this.cardNumber.slice(-4);
    return `****-****-****-${last4}`;
  }
}

class PixPayment extends Payment {
  constructor(amount, pixKey) {
    super(amount, 'pix');
    this.pixKey = pixKey;
  }

  process() {
    super.process();
    return this;
  }

  complete() {
    super.complete();
    return this;
  }

  getPaymentInfo() {
    const info = super.getPaymentInfo();
    return {
      ...info,
      pixKey: this.pixKey
    };
  }
}

class PaymentProcessor {
  constructor() {
    this.payments = [];
  }

  processPayment(payment) {
    payment.process();
    payment.complete();
    this.payments.push(payment);
    return payment;
  }

  getPaymentHistory() {
    return this.payments.map(p => p.getPaymentInfo());
  }

  getTotalProcessed() {
    return this.payments.reduce((total, p) => total + p.amount, 0);
  }
}

function main() {
  console.log('=== GRASP Pattern Demonstration ===\n');
  console.log('Pattern: Information Expert');
  console.log('Each class is responsible for the information it knows best:\n');
  console.log('- Payment: knows its own status and processing logic');
  console.log('- CreditCardPayment: knows how to mask card numbers');
  console.log('- PixPayment: knows its PIX key information');
  console.log('- PaymentProcessor: knows payment history and totals\n');

  const processor = new PaymentProcessor();

  const creditPayment = new CreditCardPayment(
    250.00,
    '1234567890123456',
    'João Silva'
  );

  const pixPayment = new PixPayment(
    100.00,
    'joao.silva@email.com'
  );

  console.log('Processing credit card payment:');
  processor.processPayment(creditPayment);
  console.log(JSON.stringify(creditPayment.getPaymentInfo(), null, 2));

  console.log('\nProcessing PIX payment:');
  processor.processPayment(pixPayment);
  console.log(JSON.stringify(pixPayment.getPaymentInfo(), null, 2));

  console.log('\nPayment History:');
  const history = processor.getPaymentHistory();
  history.forEach((payment, index) => {
    console.log(`Payment ${index + 1}:`, JSON.stringify(payment, null, 2));
  });

  console.log(`\nTotal processed: R$ ${processor.getTotalProcessed().toFixed(2)}`);
}

main();
