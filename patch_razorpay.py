import re

with open('apps/api/src/modules/payments/razorpay.service.ts', 'r') as f:
    content = f.read()

old_create = '''  async createOrder(amountRupees: number, receipt: string): Promise<RazorpayOrderResult> {
    const amountPaise = Math.round(amountRupees * 100);
    const order = await this.client.orders.create({
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      receipt,
      payment_capture: true,
    });

    return {
      orderId: order.id,
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      keyId: this.keyId,
    };
  }'''

new_create = '''  async createOrder(amountRupees: number, receipt: string): Promise<RazorpayOrderResult> {
    const amountPaise = Math.round(amountRupees * 100);
    
    // DEMO MODE BYPASS: If using the dummy key, don't actually hit the Razorpay API!
    if (this.keyId === 'rzp_test_dummy' || !this.keyId) {
      return {
        orderId: `order_dummy_${Date.now()}`,
        amount: amountPaise,
        currency: RAZORPAY_CURRENCY,
        keyId: 'rzp_test_dummy',
      };
    }

    const order = await this.client.orders.create({
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      receipt,
      payment_capture: true,
    });

    return {
      orderId: order.id,
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      keyId: this.keyId,
    };
  }'''

content = content.replace(old_create, new_create)

with open('apps/api/src/modules/payments/razorpay.service.ts', 'w') as f:
    f.write(content)

