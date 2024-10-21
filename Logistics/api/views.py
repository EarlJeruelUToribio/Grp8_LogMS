from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django.contrib import messages
from rest_framework import generics
from .models import Inventory, Supplier, Order, ProductOrders, Product, Ingredient
from .serializers import (
    InventorySerializer, 
    SupplierSerializer, 
    OrderSerializer, 
    ProductOrdersSerializer, 
    ProductSerializer, 
    IngredientSerializer
)

def home_view(request):
    return render(request, 'index.html'),

def Sidebar_view(request):
    return render(request, 'Sidebar.html')

def PlaceOrder_view(request):
    return render(request, 'PlacedOrder.html')

def ManageOrder_view(request):
    return render(request, 'ManageOrder.html')

@require_http_methods(["GET", "POST"])
def AddMaterial_view(request):
    if request.method == 'POST':
        try:
            inventory = Inventory(
                ItemName=request.POST.get('item-name'),
                ItemDescription=request.POST.get('item-description'),
                ItemCategory=request.POST.get('item-category'),
                UnitOfMeasure=request.POST.get('unit-of-measure'),
                PurchasePrice=request.POST.get('purchase-price'),
                ReorderLevel=request.POST.get('reorder-level')
            )
            inventory.save()
            messages.success(request, 'Material added successfully!')
            return redirect('AddMaterial')
        except Exception as e:
            messages.error(request, f'Error adding material: {str(e)}')
    
    return render(request, 'AddMaterial.html')

def ManageMaterial_view(request):
    materials = Inventory.objects.all()
    print(f"Number of materials: {materials.count()}")  # Debug print
    for material in materials:
        print(f"Material: {material.ItemName}")  # Debug print
    return render(request, 'ManageMaterial.html', {'materials': materials})

def edit_material(request, pk):
    material = get_object_or_404(Inventory, pk=pk)
    if request.method == 'POST':
        material.ItemName = request.POST.get('item-name')
        material.ItemDescription = request.POST.get('item-description')
        material.ItemCategory = request.POST.get('item-category')
        material.UnitOfMeasure = request.POST.get('unit-of-measure')
        material.PurchasePrice = request.POST.get('purchase-price')
        material.ReorderLevel = request.POST.get('reorder-level')
        material.save()
        messages.success(request, 'Material updated successfully!')
        return redirect('ManageMaterial')
    return render(request, 'EditMaterial.html', {'material': material})

@require_http_methods(["POST"])
def update_material(request, pk):
    return redirect('ManageMaterial')

def AddProduct_view(request):
    return render(request, 'AddProduct.html')

def ManageProduct_view(request):
    return render(request, 'ManageProducts.html')

def KitchenDisplay_view(request):
    return render(request, 'KitchenDisplay.html')

def AddSupplier_view(request):
    return render(request, 'AddSupplier.html')
def ManageSupplier_view(request):
    return render(request, 'ManageSupplier.html')

def ExpiryDates_view(request):
    return render(request, 'ExpiryDates.html')

def ManageWaste_view(request):
    return render(request, 'ManageWaste.html')
#Inventory Views
class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

# Order Views
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

# ProductOrders Views
class ProductOrdersListCreateView(generics.ListCreateAPIView):
    queryset = ProductOrders.objects.all()
    serializer_class = ProductOrdersSerializer

class ProductOrdersDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductOrders.objects.all()
    serializer_class = ProductOrdersSerializer

# Product Views
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# Ingredient Views
class IngredientListCreateView(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

class IngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
