class Product:
    def __init__(self, productId, title, price, categoryId, image, description=None, rating=0.0, discount_percentage=0.0, original_price=0.0):
        self.productId = productId
        self.title = title
        self.price = float(price)
        self.categoryId = categoryId
        self.image = image
        self.description = description if description else "No description available."
        self.rating = float(rating)
        self.discount_percentage = float(discount_percentage)
        self.original_price = float(original_price)