from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Allow null values
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Notification: {self.message}'

class MaterialCategory(models.Model):
    Category_ID = models.AutoField(primary_key=True)
    CategoryName = models.CharField(max_length=100)

    class Meta:
        db_table = 'material_categories'  # Updated table name

    def __str__(self):
        return self.CategoryName

class Inventory(models.Model):
    Inventory_ID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=255)
    ItemDescription = models.TextField()
    ItemCategory = models.ForeignKey(MaterialCategory, on_delete=models.CASCADE)  # Change this line
    UnitOfMeasure = models.CharField(max_length=50)
    PurchasePrice = models.DecimalField(max_digits=10, decimal_places=2)
    ReorderLevel = models.IntegerField()
    Created_At = models.DateTimeField(auto_now_add=True)
    Perishable = models.BooleanField(default=False)
    DaysBeforeExpiry = models.IntegerField(null=True, blank=True)
    Current_Stock = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    Expired = models.BooleanField(default=False)

    class Meta:
        db_table = 'api_inventory'

    def __str__(self):
        return self.ItemName

    class Meta:
        db_table = 'api_inventory'

    def __str__(self):
        return self.ItemName
    
    def is_expired(self):
        if self.Perishable and self.DaysBeforeExpiry is not None:
            expiration_date = self.Created_At + timedelta(days=self.DaysBeforeExpiry)
            return timezone.now() > expiration_date
        return False

#for Customer Resources
class Resource(models.Model):
    Resource_ID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=255)
    ItemDescription = models.TextField(blank=True, null=True)
    ItemCategory = models.CharField(max_length=100)
    Current_Stock = models.IntegerField(default=0)
    ReorderLevel = models.IntegerField(default=0)
    Created_At = models.DateTimeField(auto_now_add=True)
    QuantityToRepair = models.IntegerField(default=0)  # New field for quantity to repair
    Status = models.CharField(max_length=50, default='In Use')  # New field for status

    class Meta:
        db_table = 'resources'  # Name of the table in the database

    def __str__(self):
        return self.ItemName
    
# Kitchen Resources
class KitchenResource(models.Model):
    KitchenResource_ID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=255)
    ItemDescription = models.TextField(blank=True, null=True)
    ItemCategory = models.CharField(max_length=100)
    Current_Stock = models.IntegerField(default=0)
    ReorderLevel = models.IntegerField(default=0)
    Created_At = models.DateTimeField(auto_now_add=True)
    QuantityToRepair = models.IntegerField(default=0)  # New field for quantity to repair
    Status = models.CharField(max_length=50, default='In Use')  # New field for status

    class Meta:
        db_table = 'kitchen_resources'  # Name of the table in the database

    def __str__(self):
        return self.ItemName

# Supplier Model
class Supplier(models.Model):
    Supplier_ID = models.AutoField(primary_key=True)
    SupplierName = models.CharField(max_length=255)
    SupplierDesc = models.TextField(blank=True, null=True)
    SupplierNumber = models.CharField(max_length=255, blank=True, null=True)
    contact_number = models.CharField(max_length=11)
    Status = models.CharField(max_length=50, default='Active')
    MinOrderQty = models.IntegerField(default=0)
    PaymentTerms = models.CharField(max_length=100, blank=True, null=True)
    DeliveryTerms = models.CharField(max_length=100, blank=True, null=True)
    Materials = models.ManyToManyField('Inventory', blank=True)

    def __str__(self):
        return self.SupplierName

class Order(models.Model):
    Order_ID = models.AutoField(primary_key=True)
    Items = models.ForeignKey(Inventory, on_delete=models.CASCADE)  # ForeignKey to Inventory
    Quantity = models.IntegerField()
    OrderStatus = models.CharField(max_length=50)
    Supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)  # ForeignKey to Supplier
    Created_At = models.DateTimeField(auto_now_add=True)
    CheckoutMethod = models.CharField(max_length=50, choices=[
        ('cash_on_delivery', 'Cash-On-Delivery'),
        ('gcash', 'Gcash'),
        ('paymaya', 'PayMaya'),
        ('credit_card', 'Debit/Credit Card'),
    ], default='cash_on_delivery')  # Default value can be set as needed

# ProductCategory Model    
class ProductCategory(models.Model):
    Category_ID = models.AutoField(primary_key=True)
    CategoryName = models.CharField(max_length=100)

    class Meta:
        db_table = 'product_categories'

    def __str__(self):
        return self.CategoryName

class Product(models.Model):
    Product_ID = models.AutoField(primary_key=True)
    ProductName = models.CharField(max_length=255)
    ProductDescription = models.TextField()
    ProductCategory = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    ProductImage = models.ImageField(upload_to='product_images/')
    PurchasePrice = models.DecimalField(max_digits=10, decimal_places=2)
    Ingredients = models.ManyToManyField('Ingredient', blank=True)
    Created_At = models.DateTimeField(auto_now_add=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.ProductName

    
# ProductOrders Model
class ProductOrders(models.Model):
    ProductOrder_ID = models.AutoField(primary_key=True)
    OrderStatus = models.CharField(max_length=50)
    OrderNumber = models.CharField(max_length=50)
    CustomerName = models.CharField(max_length=255)
    TableNumber = models.CharField(max_length=10)
    Products_ID = models.ForeignKey('Product', on_delete=models.CASCADE)
    OrderPrice = models.DecimalField(max_digits=10, decimal_places=2)
    EstimatedPrepTime = models.IntegerField()

class Ingredient(models.Model):
    Ingredient_ID = models.AutoField(primary_key=True)
    IngredientName = models.CharField(max_length=255)
    ItemUnitMeasure = models.CharField(max_length=50)
    MeasureCount = models.DecimalField(max_digits=10, decimal_places=2)  # Ensure this is a DecimalField for precision
    Inventory_ID = models.ForeignKey(Inventory, models.DO_NOTHING, db_column='Inventory_ID')
    Created_At = models.DateTimeField(auto_now_add=True)


# Incoming Order
class IncomingOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Incoming Order - {self.product.ProductName} ({self.quantity})"

# Waste Model
class Waste(models.Model):
    Waste_ID = models.AutoField(primary_key=True)
    IngredientName = models.CharField(max_length=255)
    Type = models.CharField(max_length=50)  # Perishable or Non-Perishable
    QuantityLost = models.DecimalField(max_digits=10, decimal_places=2)
    UnitOfMeasurement = models.CharField(max_length=50)
    CauseOfLoss = models.TextField()
    DateOfIncident = models.DateTimeField()
    AssociatedCosts = models.DecimalField(max_digits=10, decimal_places=2)
    ActionTaken = models.TextField()

    class Meta:
        db_table = 'waste_records'

    def __str__(self):
        return self.IngredientName
    

#Dashboard Models
class ProductSoldRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.ProductName} - {self.quantity} sold"
