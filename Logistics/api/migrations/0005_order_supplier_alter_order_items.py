# Generated by Django 5.1.2 on 2024-10-18 11:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_created_at_inventory_created_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='Supplier',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.supplier'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='Items',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.inventory'),
        ),
    ]
