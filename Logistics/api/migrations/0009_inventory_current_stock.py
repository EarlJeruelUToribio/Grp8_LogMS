# Generated by Django 5.1.2 on 2024-11-20 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_inventory_daysbeforeexpiry_inventory_perishable'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='Current_Stock',
            field=models.IntegerField(default=0),
        ),
    ]
