from datetime import datetime

class Order:
    def __init__(self, orderId, userId, total, shipping, payment, status='pending', timestamp=None):
        self.orderId = orderId
        self.userId = userId
        self.total = float(total)
        self.shipping = shipping
        self.payment = payment
        self.status = status.lower()
        self.timestamp = timestamp if timestamp else datetime.now()