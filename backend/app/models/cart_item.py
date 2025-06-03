from datetime import datetime

class CartItem:
    def __init__(self, cartItemId, userId, productId, quantity, addedAt=None):
        self.cartItemId = cartItemId
        self.userId = userId
        self.productId = productId
        self.quantity = quantity
        self.addedAt = addedAt if addedAt else datetime.now()