from django.core.management.base import BaseCommand
from api.models import Inventory
from django.utils import timezone

class Command(BaseCommand):
    help = 'Update expired items in the inventory'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        items = Inventory.objects.all()
        for item in items:
            if item.is_expired():
                item.Expired = True
                item.save()
                self.stdout.write(self.style.SUCCESS(f'Updated {item.ItemName} to expired.'))
        self.stdout.write(self.style.SUCCESS('Finished updating expired items.'))