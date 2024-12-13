from django.db import models
from django.utils import timezone

class Inventory(models.Model):
    Inventory_ID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=255)
    ItemDescription = models.TextField()
    ItemCategory = models.CharField(max_length=100)
    UnitOfMeasure = models.CharField(max_length=50)
    PurchasePrice = models.DecimalField(max_digits=10, decimal_places=2)
    ReorderLevel = models.IntegerField()
    Created_At = models.DateTimeField(auto_now_add=True)
    Perishable = models.BooleanField(default=False)
    DaysBeforeExpiry = models.IntegerField(null=True, blank=True)
    Current_Stock = models.IntegerField(default=0)
    Expired = models.BooleanField(default=False)

    class Meta:
        db_table = 'api_inventory'

    def __str__(self):
        return self.ItemName

#for Customer Resources
class Resource(models.Model):
    Resource_ID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=255)
    ItemDescription = models.TextField(blank=True, null=True)
    ItemCategory = models.CharField(max_length=100)
    Current_Stock = models.IntegerField(default=0)
    ReorderLevel = models.IntegerField(default=0)
    Created_At = models.DateTimeField(auto_now_add=True)

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

    class Meta:
        db_table = 'kitchen_resources'  # Name of the table in the database

    def __str__(self):
        return self.ItemName

# Supplier Model
class Supplier(models.Model):
    Supplier_ID = models.AutoField(primary_key=True)
    SupplierName = models.CharField(max_length=255)
    SupplierDesc = models.TextField(blank=True, null=True)
    SupplierNumber = models.CharField(max_length=15, blank=True, null=True)
    contact_number = models.CharField(max_length=15)
    Status = models.CharField(max_length=50, default='Active')
    MinOrderQty = models.IntegerField(default=0)
    PaymentTerms = models.CharField(max_length=100, blank=True, null=True)
    DeliveryTerms = models.CharField(max_length=100, blank=True, null=True)
    Materials = models.ManyToManyField('Inventory', blank=True)

    def __str__(self):
        return self.SupplierName

# Order Model
class Order(models.Model):
    Order_ID = models.AutoField(primary_key=True)
    Items = models.ForeignKey(Inventory, on_delete=models.CASCADE)  # ForeignKey to Inventory
    Quantity = models.IntegerField()
    OrderStatus = models.CharField(max_length=50)
    Supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)  # ForeignKey to Supplier
    Created_At = models.DateTimeField(auto_now_add=True)

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

# Product Model
class Product(models.Model):
    Product_ID = models.AutoField(primary_key=True)
    ProductName = models.CharField(max_length=255)
    ProductDescription = models.TextField()
    ProductCategory = models.CharField(max_length=100)
    ProductImage = models.ImageField(upload_to='product_images/')
    PurchasePrice = models.DecimalField(max_digits=10, decimal_places=2)
    Ingredients = models.ManyToManyField('Ingredient', blank=True)  # Changed to ManyToManyField
    Created_At = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ProductName

# Ingredient Model
class Ingredient(models.Model):
    Ingredient_ID = models.AutoField(primary_key=True)
    IngredientName = models.CharField(max_length=255)
    ItemUnitMeasure = models.CharField(max_length=50)
    MeasureCount = models.IntegerField()
    Inventory_ID = models.ForeignKey('Inventory', on_delete=models.CASCADE)
    Created_At = models.DateTimeField(auto_now_add=True)
