# Generated by Django 5.1.2 on 2024-10-17 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_supplier_deliveryterms_alter_supplier_order_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='inventory',
            old_name='created_at',
            new_name='Created_At',
        ),
        migrations.RemoveField(
            model_name='inventory',
            name='Supplier',
        ),
        migrations.RemoveField(
            model_name='inventory',
            name='id',
        ),
        migrations.AddField(
            model_name='inventory',
            name='Inventory_ID',
            field=models.AutoField(default=2, primary_key=True, serialize=False),
            preserve_default=False,
        ),
    ]
