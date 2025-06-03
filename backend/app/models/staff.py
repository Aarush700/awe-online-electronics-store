from datetime import datetime

class Staff:
    def __init__(self, staffId, name, email, password, role='staff', created_at=None):
        self.staffId = staffId
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.created_at = created_at if created_at else datetime.now()