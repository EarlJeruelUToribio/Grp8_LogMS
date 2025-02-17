from celery import shared_task
from django.core.management import call_command
from .models import Inventory, Notification

@shared_task
def update_expired_items_task():
    call_command('update_expired_items')

@shared_task
def check_inventory_levels():
    inventory_items = Inventory.objects.all()
    notifications = []

    for item in inventory_items:
        if item.Current_Stock < item.ReorderLevel:
            message = f"{item.ItemName} has reached its reorder level and requires restocking."
            notifications.append(message)
            Notification.objects.create(message=message)

    return notifications