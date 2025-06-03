class OrderItem:
    def __init__(self, orderItemId, orderId, productId, quantity, price):
        self.orderItemId = orderItemId
        self.orderId = orderId
        self.productId = productId
        self.quantity = quantity
        self.price = float(price)