# Generated by Django 5.1.2 on 2024-10-17 17:36

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ItemName', models.CharField(max_length=255)),
                ('ItemDescription', models.TextField()),
                ('ItemCategory', models.CharField(max_length=100)),
                ('UnitOfMeasure', models.CharField(max_length=50)),
                ('PurchasePrice', models.DecimalField(decimal_places=2, max_digits=10)),
                ('ReorderLevel', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'api_inventory',
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('Order_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Items', models.CharField(max_length=255)),
                ('Quantity', models.IntegerField()),
                ('OrderStatus', models.CharField(max_length=50)),
                ('Created_At', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('Ingredient_ID', models.AutoField(primary_key=True, serialize=False)),
                ('IngredientName', models.CharField(max_length=255)),
                ('ItemUnitMeasure', models.CharField(max_length=50)),
                ('MeasureCount', models.IntegerField()),
                ('Created_At', models.DateTimeField(auto_now_add=True)),
                ('Inventory_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.inventory')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('Product_ID', models.AutoField(primary_key=True, serialize=False)),
                ('ProductName', models.CharField(max_length=255)),
                ('ProductDescription', models.TextField()),
                ('ProductCategory', models.CharField(max_length=100)),
                ('ProductImage', models.ImageField(upload_to='product_images/')),
                ('PurchasePrice', models.DecimalField(decimal_places=2, max_digits=10)),
                ('Created_At', models.DateTimeField(auto_now_add=True)),
                ('Ingredient_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='ProductOrders',
            fields=[
                ('ProductOrder_ID', models.AutoField(primary_key=True, serialize=False)),
                ('OrderStatus', models.CharField(max_length=50)),
                ('OrderNumber', models.CharField(max_length=50)),
                ('CustomerName', models.CharField(max_length=255)),
                ('TableNumber', models.CharField(max_length=10)),
                ('OrderPrice', models.DecimalField(decimal_places=2, max_digits=10)),
                ('EstimatedPrepTime', models.IntegerField()),
                ('Products_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.product')),
            ],
        ),
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('Supplier_ID', models.AutoField(primary_key=True, serialize=False)),
                ('SupplierName', models.CharField(max_length=255)),
                ('SupplierDesc', models.TextField()),
                ('SupplierNumber', models.CharField(max_length=15)),
                ('Status', models.CharField(max_length=50)),
                ('MinOrderQty', models.IntegerField(default=0)),
                ('PaymentTerms', models.CharField(max_length=100)),
                ('DeliveryTerms', models.CharField(max_length=100)),
                ('ContractStart', models.DateField(default=django.utils.timezone.now)),
                ('ContractEnd', models.DateField(blank=True, null=True)),
                ('Order_ID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.order')),
            ],
        ),
        migrations.AddField(
            model_name='inventory',
            name='Supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.supplier'),
        ),
    ]
