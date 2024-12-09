import json
import requests
from django.shortcuts import render, redirect
from django.shortcuts import render, redirect, get_object_or_404  # Add get_object_or_404 here
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import Inventory, Supplier, Order, ProductOrders, Product, Ingredient, Resource
from .serializers import (
    InventorySerializer, 
    SupplierSerializer, 
    OrderSerializer, 
    ProductOrdersSerializer, 
    ProductSerializer, 
    IngredientSerializer
)

def login_view(request):
    return render(request, 'Login.html')

def home_view(request):
    return render(request, 'index.html'),

def Sidebar_view(request):
    return render(request, 'Sidebar.html')

def PlaceOrder_view(request):
    if request.method == 'POST':
        # Handle form submission
        material_id = request.POST.get('material')
        quantity = request.POST.get('quantity')
        supplier_name = request.POST.get('supplier-name')
        status = request.POST.get('status')

        # Retrieve the Inventory instance using the material_id
        material_instance = get_object_or_404(Inventory, Inventory_ID=material_id)

        # Process the order (e.g., save it to the database)
        Order.objects.create(
            Items=material_instance,  # Use the actual Inventory instance
            Quantity=quantity,
            OrderStatus=status,
            Supplier_id=supplier_name  # Save the supplier ID
        )

        messages.success(request, 'Order submitted successfully!')
        return redirect('ManageOrder')  # Redirect to ManageOrder after submission

    # If not a POST request, return the modal with materials and suppliers
    materials = Inventory.objects.all()
    suppliers = Supplier.objects.all()  # Fetch all suppliers

    return render(request, 'ManageOrder.html', {
        'materials': materials,
        'suppliers': suppliers,
        'orders': Order.objects.select_related('Items', 'Supplier').all()  # Fetch orders for the manage order view
    })
    
def ManageOrder_view(request):
    orders = Order.objects.select_related('Items', 'Supplier').all()  # Ensure related data is fetched
    materials = Inventory.objects.all()  # Fetch all materials
    suppliers = Supplier.objects.all()  # Fetch all suppliers

    if request.method == 'POST':
        # Handle status update
        order_id = request.POST.get('order_id')
        new_status = request.POST.get('new_status')

        try:
            order = Order.objects.get(Order_ID=order_id)
            order.OrderStatus = new_status
            order.save()
            messages.success(request, f'Order status updated to {new_status}.')
        except Order.DoesNotExist:
            messages.error(request, 'Order not found.')

    return render(request, 'ManageOrder.html', {
        'orders': orders,
        'materials': materials,
        'suppliers': suppliers,
    })

def get_materials_by_supplier(request):
    supplier_id = request.GET.get('supplier_id')
    materials = Inventory.objects.filter(Suppliers__Supplier_ID=supplier_id).values('Inventory_ID', 'ItemName', 'PurchasePrice')
    return JsonResponse(list(materials), safe=False)

def get_material_details(request, material_id):
    material = get_object_or_404(Inventory, pk=material_id)
    return JsonResponse({'PurchasePrice': material.PurchasePrice})

def get_min_order_qty(request):
    supplier_id = request.GET.get('supplier_id')
    material_id = request.GET.get('material_id')
    # Assuming you have a way to get the minimum order quantity for the supplier and material
    min_order_qty = ...  # Logic to determine minimum order quantity
    return JsonResponse({'minOrderQty': min_order_qty})


@require_http_methods(["GET", "POST"])
def AddMaterial_view(request):
    if request.method == 'POST':
        try:
            # Handle form submission
            item_name = request.POST.get('item-name')
            item_description = request.POST.get('item-description')
            item_category = request.POST.get('item-category')
            unit_of_measure = request.POST.get('unit-of-measure')
            purchase_price = request.POST.get('purchase-price')
            reorder_level = request.POST.get('reorder-level')
            perishable = request.POST.get('perishable') == 'true'
            days_before_expiry = request.POST.get('days-before-expiry') if perishable else None

            # Create and save the Inventory instance
            inventory = Inventory(
                ItemName=item_name,
                ItemDescription=item_description,
                ItemCategory=item_category,
                UnitOfMeasure=unit_of_measure,
                PurchasePrice=purchase_price,
                ReorderLevel=reorder_level,
                Perishable=perishable,
                DaysBeforeExpiry=days_before_expiry,
                Current_Stock=0  # Default to 0 for new items
            )
            inventory.save()

            messages.success(request, 'Material added successfully!')
            return redirect('ManageMaterial')  # Redirect to ManageMaterial after submission
        except Exception as e:
            messages.error(request, f'Error adding material: {str(e)}')

    # If the request method is GET, redirect to ManageMaterial instead of rendering a non-existing template
    return redirect('ManageMaterial')

def increase_stock(material_id, amount):
    material = get_object_or_404(Inventory, pk=material_id)
    material.Current_Stock += amount
    material.save()

def decrease_stock(material_id, amount):
    material = get_object_or_404(Inventory, pk=material_id)
    if material.Current_Stock - amount >= 0:
        material.Current_Stock -= amount
        material.save()
    else:
        raise ValueError("Stock cannot go below zero")

def ManageMaterial_view(request):
    materials = Inventory.objects.all()
    
    # Calculate expiration date for each material
    for material in materials:
        if material.Perishable and material.DaysBeforeExpiry is not None:
            # Calculate expiration date
            expiration_date = material.Created_At + timedelta(days=material.DaysBeforeExpiry)
            material.expiration_date = expiration_date
        else:
            material.expiration_date = None
    
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
        material.Perishable = request.POST.get('perishable') == 'true'
        material.DaysBeforeExpiry = request.POST.get('days-before-expiry') if request.POST.get('perishable') == 'true' else None
        material.save()
        messages.success(request, ' Material updated successfully!')
        return redirect('ManageMaterials')
    
    return render(request, 'EditMaterial.html', {'material': material})

@require_http_methods(["POST"])
def update_material(request, pk):
    return redirect('ManageMaterial')

def AddProduct_view(request):
    if request.method == 'POST':
        product_name = request.POST.get('product-name')
        product_description = request.POST.get('product-description')
        product_category = request.POST.get('product-category')
        product_image = request.FILES.get('product-image')
        product_price = request.POST.get('product-price')
        material_ids = request.POST.getlist('material_name[]')
        material_quantities = request.POST.getlist('material_quantity[]')

        try:
            # Create and save the Product instance
            product = Product(
                ProductName=product_name,
                ProductDescription=product_description,
                ProductCategory=product_category,
                ProductImage=product_image,
                PurchasePrice=product_price
            )
            product.save()

            # Check that the length of material_ids and material_quantities match
            for i in range(len(material_ids)):
                if i < len(material_quantities):  # Prevent index out of range
                    material_id = material_ids[i]
                    material_quantity = material_quantities[i]

                    # Get the material instance
                    material = get_object_or_404(Inventory, pk=material_id)

                    # Create and save the Ingredient instance
                    ingredient = Ingredient(
                        IngredientName=material.ItemName,  # Correctly set the name
                        ItemUnitMeasure=material.UnitOfMeasure,  # Set the unit of measure
                        MeasureCount=material_quantity,  # Set the quantity
                        Inventory_ID=material  # Pass the actual Inventory instance
                    )
                    ingredient.save()
                    product.Ingredients.add(ingredient)

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid request method.'})

def ManageProduct_view(request):
    products = Product.objects.all()  # Fetch all products
    materials = Inventory.objects.all()  # Fetch all materials
    return render(request, 'ManageProducts.html', {
        'products': products,
        'materials': materials  # Pass materials to the template
    })

def EditProduct_view(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        product.ProductName = request.POST.get('product-name')
        product.ProductDescription = request.POST.get('product-description')
        product.ProductCategory = request.POST.get('product-category')
        product.ProductImage = request.FILES.get('product-image') if request.FILES.get('product-image') else product.ProductImage
        product.PurchasePrice = request.POST.get('product-price')
        product.save()
        messages.success(request, 'Product updated successfully!')
        return redirect('ManageProduct')
    return render(request, 'EditProduct.html', {'product': product})

def KitchenDisplay_view(request):
    return render(request, 'KitchenDisplay.html')

def AddSupplier_view(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)

            supplier_name = data.get('supplier-name')
            supplier_address = data.get('supplier-address')
            supplier_email = data.get('supplier-email')
            contact_number = data.get('contact-number')  # Ensure this matches your model
            payment_terms = data.get('payment-terms')
            material_ids = data.get('material_name[]')
            material_min_order_qtys = data.get('material_min_order_qty[]')

            # Create and save the supplier instance
            supplier = Supplier(
                SupplierName=supplier_name,
                SupplierDesc=supplier_address,
                SupplierNumber=supplier_email,
                PaymentTerms=payment_terms,
                contact_number=contact_number,  # Correct field name
            )
            supplier.save()

            # Associate materials with the supplier
            for i in range(len(material_ids)):
                material_id = int(material_ids[i])  # Ensure this is an integer
                material_min_order_qty = material_min_order_qtys[i]

                material = get_object_or_404(Inventory, pk=material_id)
                supplier.Materials.add(material)

            # Return a success response with the new supplier ID
            return JsonResponse({'success': True, 'supplier_id': supplier.Supplier_ID})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    # If the request method is not POST, redirect to ManageSupplier
    return redirect('ManageSupplier')

def ManageSupplier_view(request):
    suppliers = Supplier.objects.all()
    materials = Inventory.objects.all().values('Inventory_ID', 'ItemName', 'UnitOfMeasure')  # Using values() to get a list of dicts

    return render(request, 'ManageSuppliers.html', {
        'suppliers': suppliers,
        'materials': list(materials)  # Convert to list
    })

def edit_supplier(request, pk):
    supplier = get_object_or_404(Supplier, pk=pk)
    if request.method == 'POST':
        supplier.SupplierName = request.POST.get('supplier-name')
        supplier.SupplierDesc = request.POST .get('supplier-address')
        supplier.SupplierNumber = request.POST.get('supplier-email')
        supplier.PaymentTerms = request.POST.get('payment-terms')
        supplier.MinOrderQty = request.POST.get('min-order-qty')
        supplier.Status = request.POST.get('status')
        supplier.save()
        messages.success(request, 'Supplier updated successfully!')
        return redirect('ManageSupplier')
    return render(request, 'EditSupplier.html', {'supplier': supplier})

def ExpiryDates_view(request):
    return render(request, 'ExpiryDates.html')

def ManageWaste_view(request):
    return render(request, 'ManageWaste.html')

def KitchenResources_view(request):
    return render(request, 'KitchenResources.html')

def Maintenance_view(request):
    return render(request, 'Maintenance.html')

def ManageResources_view(request):
    resources = Resource.objects.all()  # Fetch all resources
    return render(request, 'ManageResources.html', {'resources': resources})

@require_http_methods(["POST"])
def AddResources_view(request):
    if request.method == 'POST':
        try:
            # Get data from the request
            resource_name = request.POST.get('resource-name')
            resource_category = request.POST.get('resource-category')
            quantity = request.POST.get('quantity')
            specification = request.POST.get('specification')
            reorder_level = request.POST.get('reorder-level')

            # Create and save the Resource instance
            resource = Resource(
                ItemName=resource_name,
                ItemCategory=resource_category,
                Current_Stock=quantity,
                ItemDescription=specification,
                ReorderLevel=reorder_level,
            )
            resource.save()

            return JsonResponse({'message': 'Resource added successfully!'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

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