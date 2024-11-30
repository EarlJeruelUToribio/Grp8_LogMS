from django.shortcuts import render, redirect
from django.shortcuts import render, redirect, get_object_or_404  # Add get_object_or_404 here
from django.views.decorators.http import require_http_methods
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
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

    else:
        # Retrieve materials and suppliers from the database
        materials = Inventory.objects.all()
        suppliers = Supplier.objects.all()  # Fetch all suppliers

        # Create a dictionary to map materials to their suppliers
        material_suppliers = {}
        for material in materials:
            # Get suppliers associated with the current material
            material_suppliers[material.Inventory_ID] = list(material.supplier_set.values('Supplier_ID', 'SupplierName'))

        return render(request, 'PlacedOrder.html', {
            'materials': materials,
            'suppliers': suppliers,
            'material_suppliers': material_suppliers,
        })
    
def ManageOrder_view(request):
    orders = Order.objects.select_related('Items', 'Supplier').all()  # Ensure related data is fetched

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

    return render(request, 'ManageOrder.html', {'orders': orders})

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
        # Handle form submission
        product_name = request.POST.get('product-name')
        product_description = request.POST.get('product-description')
        product_category = request.POST.get('product-category')
        product_image = request.FILES.get('product-image')
        product_price = request.POST.get('product-price')
        material_ids = request.POST.getlist('material_name[]')
        material_units_of_measure = request.POST.getlist('material_unit_of_measure[]')
        material_quantities = request.POST.getlist('material_quantity[]')

        try:
            # Create and save the product
            product = Product(
                ProductName=product_name,
                ProductDescription=product_description,
                ProductCategory=product_category,
                ProductImage=product_image,
                PurchasePrice=product_price
            )
            product.save()

            # Associate materials with the product
            for i in range(len(material_ids)):
                material_id = material_ids[i]
                material_unit_of_measure = material_units_of_measure[i]
                material_quantity = material_quantities[i]

                # Get the material instance
                material = get_object_or_404(Inventory, pk=material_id)
                
                # Create Ingredient instance and save it
                ingredient = Ingredient(
                    IngredientName=material.ItemName,  # Assuming you want to store the name
                    ItemUnitMeasure=material_unit_of_measure,
                    MeasureCount=material_quantity,
                    Inventory_ID=material  # Set the foreign key
                )
                ingredient.save()

                # Add the ingredient to the product's ingredients
                product.Ingredients.add(ingredient)  # Use the ManyToManyField relationship

            messages.success(request, 'Product added successfully!')
            return redirect('ManageProduct')  # Redirect to ManageProduct after submission
        except Exception as e:
            messages.error(request, f'Error adding product: {str(e)}')

    # Fetch all materials (Inventory items) for the dropdown
    materials = Inventory.objects.all()
    materials_list = list(materials.values('Inventory_ID', 'ItemName', 'UnitOfMeasure'))  # Convert QuerySet to list of dicts
    return render(request, 'AddProduct.html', {'materials': materials_list})

def ManageProduct_view(request):
    products = Product.objects.all()  # Fetch all products
    return render(request, 'ManageProducts.html', {'products': products})

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
        supplier_name = request.POST.get('supplier-name')
        supplier_address = request.POST.get('supplier-address')
        supplier_email = request.POST.get('supplier-email')
        contact_number = request.POST.get('contact-number')
        payment_terms = request.POST.get('payment-terms')
        material_ids = request.POST.getlist('material_name[]')
        material_min_order_qtys = request.POST.getlist('material_min_order_qty[]')

        try:
            supplier = Supplier(
                SupplierName=supplier_name,
                SupplierDesc=supplier_address,
                SupplierNumber=supplier_email,
                PaymentTerms=payment_terms,
                ContactNumber=contact_number
            )
            supplier.save()

            # Associate materials with the supplier
            for i in range(len(material_ids)):
                material_id = material_ids[i]
                material_min_order_qty = material_min_order_qtys[i]

                material = get_object_or_404(Inventory, pk=material_id)
                supplier.Materials.add(material)

                # Save material details if necessary
                # Assuming you have a MaterialDetail model to save additional details
                material_detail = MaterialDetail(
                    Material=material,
                    MinOrderQty=material_min_order_qty
                )
                material_detail.save()

            messages.success(request, 'Supplier added successfully!')
            return redirect('ManageSupplier')  # Redirect to ManageSupplier after submission
        except Exception as e:
            messages.error(request, f'Error adding supplier: {str(e)}')

    # Fetch all materials (Inventory items) for the dropdown
    materials = Inventory.objects.all()
    materials_list = list(materials.values('Inventory_ID', 'ItemName', 'UnitOfMeasure'))  # Convert QuerySet to list of dicts
    return render(request, 'ManageSuppliers.html', {'materials': materials_list})

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

def AddResources_view(request):
    return render(request, 'AddResources.html')

def ManageResources_view(request):
    return render(request, 'ManageResources.html')
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