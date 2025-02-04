import json
import requests
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect
from django.shortcuts import render, redirect, get_object_or_404  # Add get_object_or_404 here
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib import messages
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
from .models import ProductSoldRecord, IncomingOrder, Notification, Inventory, MaterialCategory, ProductCategory, Waste, Supplier, Order, ProductOrders, Product, Ingredient, Resource, KitchenResource
from .serializers import (
    InventorySerializer, 
    SupplierSerializer, 
    OrderSerializer, 
    ProductOrdersSerializer, 
    ProductSerializer, 
    IngredientSerializer
)

def home_view(request):
    return render(request, 'dashboard.html'),

def Sidebar_view(request):
    return render(request, 'sidebar.html')

#THIS IS FOR NOTIFICATIONS

def dashboard_view(request):
    notifications = Notification.objects.all().order_by('-created_at')  # Fetch all notifications

    # Check inventory levels and create notifications if needed
    check_inventory_levels()

    return render(request, 'dashboard.html', {'notifications': notifications})


def ManageCustomerOrder_view(request):
    return render(request, 'ManageCustomerOrder.html')

def check_inventory_levels():
    # Fetch all inventory items
    inventory_items = Inventory.objects.all()

    for item in inventory_items:
        if item.Current_Stock < item.ReorderLevel:
            # Create a notification message
            message = f"{item.ItemName} has reached its reorder level and requires restocking."

            # Check if the notification already exists
            if not Notification.objects.filter(message=message).exists():
                # Create a Notification object in the database
                Notification.objects.create(message=message)

def clear_notifications(request):
    if request.method == 'POST':
        Notification.objects.all().delete()  # This will delete all notifications
        messages.success(request, 'All notifications cleared.')
        return redirect('dashboard')  # Redirect to the dashboard or wherever appropriate

def mark_as_read(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    notification.is_read = True
    notification.save()
    return JsonResponse({'status': 'success'})

# THIS IS FOR DASHBOARD STUFF

def inventory_chart_view(request):
    # Get the top 10 items with the highest current stock
    inventory_items = Inventory.objects.order_by('-Current_Stock')[:10]
    
    # Prepare data for Chart.js
    item_names = [item.ItemName for item in inventory_items]
    current_stocks = [item.Current_Stock for item in inventory_items]

    context = {
        'item_names': item_names,
        'current_stocks': current_stocks,
    }
    return render(request, 'dashboard.html', context)

def highest_selling_product_view(request):
    # Aggregate product sales data
    sales_data = (
        ProductSoldRecord.objects
        .values('product__ProductName')  # Use related model field for product name
        .annotate(total_quantity=Sum('quantity'))
        .order_by('-total_quantity')[:10]  # Top 10 highest-selling products
    )
    
    labels = [item['product__ProductName'] for item in sales_data]
    data = [item['total_quantity'] for item in sales_data]

    return JsonResponse({
        'labels': labels,
        'data': data,
    })
# DASHBOARD


def ManageProduct_view(request):
    """
    API endpoint to return product data in JSON format.
    """
    products = Product.objects.all()
    product_list = [
        {
            "id": product.id,
            "ProductName": product.name,
            "ProductDescription": product.description,
            "ProductCategory": product.category.name,  # Replace with actual relation
            "PurchasePrice": product.price,
            "isAvailable": product.is_available,  # Adjust according to your model
        }
        for product in products
    ]
    return JsonResponse(product_list, safe=False)


# Order Management

def PlaceOrder_view(request):
    if request.method == 'POST':
        # Handle form submission
        material_id = request.POST.get('material')
        quantity = request.POST.get('quantity')
        supplier_name = request.POST.get('supplier-name')
        status = request.POST.get('status')
        checkout_method = request.POST.get('checkout_method')  # Get the checkout method

        # Retrieve the Inventory instance using the material_id
        material_instance = get_object_or_404(Inventory, Inventory_ID=material_id)

        # Process the order (e.g., save it to the database)
        order = Order.objects.create(
            Items=material_instance,  # Use the actual Inventory instance
            Quantity=quantity,
            OrderStatus=status,
            Supplier_id=supplier_name,  # Save the supplier ID
            CheckoutMethod=checkout_method  # Save the checkout method
        )

        # Create a notification
        message = "Order submitted successfully!"
        if request.user.is_authenticated:
            Notification.objects.create(user=request.user, message=message)
        else:
            Notification.objects.create(message=message)  # Create notification without user

        messages.success(request, message)
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
        new_status = request.POST.get('new_status').strip()  # Strip any leading/trailing spaces

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

def order_counts_view(request):
    placed_count = Order.objects.filter(OrderStatus='Placed').count()
    shipped_count = Order.objects.filter(OrderStatus='Shipped').count()
    completed_count = Order.objects.filter(OrderStatus='Completed').count()
    cancelled_count = Order.objects.filter(OrderStatus='Cancelled').count()

    return JsonResponse({
        'placed': placed_count,
        'shipped': shipped_count,
        'completed': completed_count,
        'cancelled': cancelled_count,
    })


@require_http_methods(["POST"])
def extend_expiration(request, item_id):
    try:
        inventory_item = get_object_or_404(Inventory, Inventory_ID=item_id)

        if inventory_item.Perishable and inventory_item.DaysBeforeExpiry is not None:
            # Calculate the new expiration date
            new_expiration_date = timezone.now() + timedelta(days=inventory_item.DaysBeforeExpiry)
            inventory_item.Created_At = timezone.now()  # Update created date to now
            inventory_item.Expired = False  # Mark as active
            inventory_item.save()

            return JsonResponse({
                'message': f"Expiration date updated to {new_expiration_date.strftime('%Y-%m-%d')}",
                'new_expiration_date': new_expiration_date.strftime('%Y-%m-%d')
            }, status=200)

        return JsonResponse({'error': 'Item is not perishable or does not have valid expiry data.'}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)






@csrf_exempt
def payment_record_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Log the received data for debugging
            print("Received payment record data:", data)

            # Process the data as needed (e.g., save it to the database)
            # For example, you might want to create a PaymentRecord model instance here

            return JsonResponse({
                'success': True,
                'message': 'Payment record saved successfully!',
                'data': data  # Return the data that was sent
            }, status=201)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Log the received data for debugging
            print("Received data for checkout session:", data)

            # Here you can process the data as needed, e.g., save it to the database
            # For now, we will just return a success response

            return JsonResponse({
                'success': True,
                'message': 'Checkout session created successfully!',
                'data': data  # Return the data that was sent for verification
            }, status=201)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)

def get_materials_by_supplier(request):
    supplier_id = request.GET.get('supplier_id')
    materials = Inventory.objects.filter(supplier__Supplier_ID=supplier_id).values('Inventory_ID', 'ItemName', 'PurchasePrice')
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

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

@csrf_exempt
def receive_order(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)

            # Extract necessary fields
            product_id = data.get('product_id')
            quantity = data.get('quantity')

            # Validate required fields
            if not product_id or not quantity:
                return JsonResponse({'success': False, 'error': 'Missing required fields.'}, status=400)

            # Ensure product exists
            product = get_object_or_404(Product, Product_ID=product_id)

            # Create Incoming Order
            new_order = IncomingOrder.objects.create(
                product=product,
                quantity=quantity
            )

            return JsonResponse({'success': True, 'message': 'Order received successfully!', 'order_id': new_order.order_id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)


# Material Management

@require_http_methods(["GET", "POST"])
def AddMaterial_view(request):
    if request.method == 'POST':
        try:
            # Handle form submission
            item_name = request.POST.get('item-name')
            item_description = request.POST.get('item-description')
            item_category_id = request.POST.get('item-category')
            unit_of_measure = request.POST.get('unit-of-measure')
            purchase_price = Decimal(request.POST.get('purchase-price'))
            reorder_level = int(request.POST.get('reorder-level'))
            perishable = request.POST.get('perishable') == 'true'
            days_before_expiry = request.POST.get('days-before-expiry') if perishable else None

            # Get the MaterialCategory instance
            item_category = get_object_or_404(MaterialCategory, Category_ID=item_category_id)

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
            print(f"Error: {str(e)}")  # Log the error to the console

    # If the request method is GET, redirect to ManageMaterial instead of rendering a non-existing template
    return redirect('ManageMaterial')

def increase_stock(item_id, amount):
    material = get_object_or_404(Inventory, pk=item_id)
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
    categories = MaterialCategory.objects.all()  # Fetch all categories

    # Calculate expiration date for each material
    for material in materials:
        if material.Perishable and material.DaysBeforeExpiry is not None:
            # Calculate expiration date
            expiration_date = material.Created_At + timedelta(days=material.DaysBeforeExpiry)
            material.expiration_date = expiration_date
        else:
            material.expiration_date = None

    return render(request, 'ManageMaterial.html', {'materials': materials, 'categories': categories})

import logging

logger = logging.getLogger(__name__)

@require_http_methods(["POST"])
def update_stock(request, item_id):
    try:
        data = json.loads(request.body)
        quantity = data.get('quantity')
        quantity = int(data.get('quantity'))

        logger.info(f"Received request to update stock for item ID: {item_id} with quantity: {quantity}")

        if quantity is None:
            logger.error("Quantity is required.")
            return JsonResponse({'success': False, 'error': 'Quantity is required.'}, status=400)

        # Get the inventory item and update the stock
        inventory_item = Inventory.objects.get(pk=item_id)
        logger.info(f"Current stock before update: {inventory_item.Current_Stock}")
        inventory_item.Current_Stock += int(quantity)
        inventory_item.save()
        logger.info(f"Current stock after update: {inventory_item.Current_Stock}")

        return JsonResponse({'success': True})

    except Inventory.DoesNotExist:
        logger.error(f"Inventory item with ID {item_id} does not exist.")
        return JsonResponse({'success': False, 'error': 'Inventory item not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error updating stock: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
@require_http_methods(["GET", "POST"])
def edit_material(request, pk):
    material = get_object_or_404(Inventory, pk=pk)
    if request.method == 'POST':
        material.ItemName = request.POST.get('item-name')
        material.ItemDescription = request.POST.get('item-description')
        
        # Get the item category ID from the POST data
        item_category_id = request.POST.get('item-category')
        
        # Retrieve the MaterialCategory instance
        item_category = get_object_or_404(MaterialCategory, Category_ID=item_category_id)
        
        # Assign the MaterialCategory instance to the ItemCategory field
        material.ItemCategory = item_category
        
        material.UnitOfMeasure = request.POST.get('unit-of-measure')
        material.PurchasePrice = Decimal(request.POST.get('purchase-price'))  # Ensure this is a Decimal
        material.ReorderLevel = int(request.POST.get('reorder-level'))  # Ensure this is an int
        material.Perishable = request.POST.get('perishable') == 'true'
        material.DaysBeforeExpiry = request.POST.get('days-before-expiry') if request.POST.get('perishable') == 'true' else None
        
        material.save()
        messages.success(request, 'Material updated successfully!')
        return redirect('ManageMaterial')  # Updated redirect to ManageMaterial
    
    return render(request, 'EditMaterial.html', {'material': material})

@require_http_methods(["DELETE"])
def delete_material(request, material_id):
    material = get_object_or_404(Inventory, Inventory_ID=material_id)
    material.delete()
    return JsonResponse({'message': 'Material deleted successfully.'}, status=204)

@require_http_methods(["POST"])
def update_material(request, pk):
    return redirect('ManageMaterial')

@require_http_methods(["POST"])
def AddMaterialCategory_view(request):
    try:
        # Parse the JSON data from the request body
        data = json.loads(request.body)
        category_name = data.get('categoryName')

        if not category_name:
            return JsonResponse({'success': False, 'error': 'Category name is required.'}, status=400)

        # Create and save the new material category
        category = MaterialCategory(CategoryName=category_name)
        category.save()

        return JsonResponse({
            'success': True,
            'category_id': category.Category_ID,
            'category_name': category.CategoryName
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON data.'}, status=400)
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error for debugging
        return JsonResponse({'success': False, 'error': 'An error occurred while adding the category.'}, status=500)


@require_http_methods(["POST"])
def update_expiry_view(request):
    try:
        perishable_items = Inventory.objects.filter(Perishable=True, Expired=False)
        expired_count = 0

        for item in perishable_items:
            if item.DaysBeforeExpiry is not None:
                expiration_date = item.Created_At + timedelta(days=item.DaysBeforeExpiry)
                if now() > expiration_date:
                    item.Expired = True
                    item.save()
                    expired_count += 1

        message = f"{expired_count} items marked as expired."
        return JsonResponse({"success": True, "message": message})

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})

# Product Management


@require_http_methods(["POST"])
def AddProductCategory_view(request):
    try:
        # Parse the JSON data from the request body
        data = json.loads(request.body)
        category_name = data.get('categoryName')

        if not category_name:
            return JsonResponse({'success': False, 'error': 'Category name is required.'}, status=400)

        # Create and save the new product category
        category = ProductCategory(CategoryName=category_name)
        category.save()

        return JsonResponse({
            'success': True,
            'category_id': category.Category_ID,
            'category_name': category.CategoryName
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON data.'}, status=400)
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error for debugging
        return JsonResponse({'success': False, 'error': 'An error occurred while adding the category.'}, status=500)

def AddProduct_view(request):
    if request.method == 'POST':
        product_name = request.POST.get('product-name')
        product_description = request.POST.get('product-description')
        product_category_id = request.POST.get('product-category')  # Get the category ID
        product_image = request.FILES.get('product-image')
        product_price = request.POST.get('product-price')
        material_ids = request.POST.getlist('material_name[]')
        material_quantities = request.POST.getlist('material_quantity[]')

        print(f"Received data: {product_name}, {product_description}, {product_category_id}, {product_price}, {material_ids}, {material_quantities}")

        try:
            # Retrieve the ProductCategory instance using the ID
            product_category = get_object_or_404(ProductCategory, pk=product_category_id)

            # Create and save the Product instance
            product = Product(
                ProductName=product_name,
                ProductDescription=product_description,
                ProductCategory=product_category,  # Assign the ProductCategory instance
                ProductImage=product_image,
                PurchasePrice=product_price
            )
            product.save()
            print(f"Product saved: {product}")

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
            print(f"Error: {str(e)}")  # Log the error
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid request method.'})

def ManageProduct_view(request):
    products = Product.objects.all()  # Fetch all products
    materials = Inventory.objects.all()  # Fetch all materials
    product_categories = ProductCategory.objects.all()  # Fetch all product categories
    return render(request, 'ManageProducts.html', {
        'products': products,
        'materials': materials,
        'product_categories': product_categories  # Pass product categories to the template
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
        
        # Return a JSON response instead of redirecting
        return JsonResponse({'success': True, 'message': 'Product updated successfully!'})
    
    # If the request method is not POST, return the product data for editing
    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=400)

@require_http_methods(["DELETE"])
def delete_product(request, product_id):
    product = get_object_or_404(Product, Product_ID=product_id)
    product.delete()
    return JsonResponse({'message': 'Product deleted successfully.'}, status=204)
        

@csrf_exempt
@require_http_methods(["POST"])
def toggle_product_availability(request, product_id):
    try:
        product = get_object_or_404(Product, pk=product_id)
        product.is_available = not product.is_available
        product.save()
        return JsonResponse({"success": True, "is_available": product.is_available})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


def KitchenDisplay_view(request):
    return render(request, 'KitchenDisplay.html')





# Supplier Management

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
    if request.method == 'POST':
        try:
            supplier = get_object_or_404(Supplier, pk=pk)
            supplier.SupplierName = request.POST.get('supplier-name')
            supplier.SupplierDesc = request.POST.get('supplier-address')
            supplier.SupplierNumber = request.POST.get('supplier-email')
            supplier.contact_number = request.POST.get('contact-number')
            supplier.PaymentTerms = request.POST.get('payment-terms')
            supplier.save()

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=400)


# Expiry

@require_http_methods(["POST"])
def mark_as_expired(request, item_id):
    inventory_item = get_object_or_404(Inventory, Inventory_ID=item_id)
    inventory_item.Expired = True  # Mark the item as expired
    inventory_item.save()
    return JsonResponse({'message': 'Item marked as expired.'}, status=200)

@require_http_methods(["POST"])
def extend_expiration(request, item_id):
    inventory_item = get_object_or_404(Inventory, Inventory_ID=item_id)
    
    if inventory_item.Perishable and inventory_item.DaysBeforeExpiry is not None:
        # Calculate the new expiration date
        new_expiration_date = inventory_item.Created_At + timedelta(days=inventory_item.DaysBeforeExpiry)
        inventory_item.Created_At = new_expiration_date  # Update the Created_At to the new expiration date
        inventory_item.Expired = False  # Mark as not expired
        inventory_item.save()
        
        return JsonResponse({'message': 'Expiration date extended.', 'new_expiration_date': new_expiration_date.strftime('%Y-%m-%d')}, status=200)
    
    return JsonResponse({'error': 'Item is not perishable or does not have a valid expiration.'}, status=400)

def ExpiryDates_view(request):
    perishable_items = Inventory.objects.filter(Perishable=True)  # Get all perishable items
    for item in perishable_items:
        if item.DaysBeforeExpiry and item.Created_At:
            # Calculate the actual expiration date
            item.expiration_date = item.Created_At + timedelta(days=item.DaysBeforeExpiry)
        else:
            item.expiration_date = None  # Set to None if not applicable
    return render(request, 'ExpiryDates.html', {'perishable_items': perishable_items})


# Loss and Waste

@require_http_methods(["POST"])
def AddWaste_view(request):
    try:
        # Retrieve data from the POST request
        ingredient_name = request.POST.get('ingredient-name')
        quantity_lost = request.POST.get('quantity-lost')  # Corrected from 'quantity-lsost'
        unit_of_measurement = request.POST.get('unit-of-measurement')
        cause_of_loss = request.POST.get('cause-of-loss')
        date_of_incident = request.POST.get('date-of-incident')
        action_taken = request.POST.get('action-taken')
        associated_costs = request.POST.get('associated-costs')  # New field

        # Log the received data for debugging
        print(f"Received data: {ingredient_name}, {quantity_lost}, {unit_of_measurement}, {cause_of_loss}, {date_of_incident}, {action_taken}, {associated_costs}")

        # Check if any required fields are missing
        if not all([ingredient_name, quantity_lost, unit_of_measurement, cause_of_loss, date_of_incident, action_taken, associated_costs]):
            return JsonResponse({'success': False, 'error': 'Missing required fields.'}, status=400)

        # Create a new Waste record
        new_waste_record = Waste.objects.create(
            IngredientName=ingredient_name,
            QuantityLost=quantity_lost,
            UnitOfMeasurement=unit_of_measurement,
            CauseOfLoss=cause_of_loss,
            DateOfIncident=date_of_incident,
            ActionTaken=action_taken,
            AssociatedCosts=associated_costs  # Include the associated costs
        )

        return JsonResponse({'success': True, 'waste_id': new_waste_record.Waste_ID})

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["GET"])
def ManageWaste_view(request):
    print("Request method:", request.method)  # Debugging line
    # Check if the request is an AJAX request
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        print("Fetching waste records for AJAX request")  # Debugging line
        waste_records = list(Waste.objects.all().values())
        print("Fetched waste records:", waste_records)  # Log the fetched records
        return JsonResponse({'waste_records': waste_records})
    else:
        print("Rendering HTML template")  # Debugging line
        return render(request, 'ManageWaste.html')  # Render the HTML template for non-AJAX requests


#Customer Order Management
@require_http_methods(["GET"])
def manage_customer_orders_view(request):
    incoming_orders = IncomingOrder.objects.select_related('product').all()
    context = {"incoming_orders": incoming_orders}
    return render(request, "ManageCustomerOrder.html", context)

@require_http_methods(["POST"])
def resolve_order_view(request, order_id):
    try:
        order = get_object_or_404(IncomingOrder, pk=order_id)
        for ingredient in order.product.Ingredients.all():
            inventory_item = get_object_or_404(Inventory, pk=ingredient.Inventory_ID.Inventory_ID)
            required_quantity = ingredient.MeasureCount * order.quantity
            if inventory_item.Current_Stock < required_quantity:
                return JsonResponse({"success": False, "error": f"Insufficient stock for {ingredient.IngredientName}"}, status=400)
            inventory_item.Current_Stock -= required_quantity
            inventory_item.save()

        # Record the resolved order in ProductSoldRecord
        ProductSoldRecord.objects.create(
            product=order.product,
            quantity=order.quantity,
            created_at=timezone.now()
        )

        order.delete()
        return JsonResponse({"success": True, "message": "Order resolved successfully."})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@require_http_methods(["POST"])
def resolve_all_orders_view(request):
    try:
        incoming_orders = IncomingOrder.objects.select_related('product').all()
        for order in incoming_orders:
            for ingredient in order.product.Ingredients.all():
                inventory_item = get_object_or_404(Inventory, pk=ingredient.Inventory_ID.Inventory_ID)
                required_quantity = ingredient.MeasureCount * order.quantity
                if inventory_item.Current_Stock < required_quantity:
                    return JsonResponse({"success": False, "error": f"Insufficient stock for {ingredient.IngredientName}"}, status=400)
                inventory_item.Current_Stock -= required_quantity
                inventory_item.save()

            # Record the resolved orders in ProductSoldRecord
            ProductSoldRecord.objects.create(
                product=order.product,
                quantity=order.quantity,
                created_at=timezone.now()
            )

            order.delete()
        return JsonResponse({"success": True, "message": "All orders resolved successfully."})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)



# Resources Management

def KitchenResources_view(request):
    kitchen_resources = KitchenResource.objects.all()  # Fetch all kitchen resources
    return render(request, 'KitchenResources.html', {'kitchen_resources': kitchen_resources})

@require_http_methods(["POST"])
def AddKitchenResource_view(request):
    if request.method == 'POST':
        try:
            # Get data from the request
            item_name = request.POST.get('resource-name')
            item_category = request.POST.get('resource-category')
            quantity = request.POST.get('quantity')
            specification = request.POST.get('specification')
            reorder_level = request.POST.get('reorder-level')

            # Create and save the KitchenResource instance
            kitchen_resource = KitchenResource(
                ItemName=item_name,
                ItemCategory=item_category,
                Current_Stock=quantity,
                ItemDescription=specification,
                ReorderLevel=reorder_level,
            )
            kitchen_resource.save()

            return JsonResponse({'message': 'Kitchen resource added successfully!'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)


@require_http_methods(["GET", "POST"])
def edit_kitchen_resource(request, pk):
    kitchen_resource = get_object_or_404(KitchenResource, KitchenResource_ID=pk)  # Use KitchenResource_ID here
    
    if request.method == 'POST':
        kitchen_resource.ItemName = request.POST.get('resource-name')
        kitchen_resource.ItemCategory = request.POST.get('resource-category')
        kitchen_resource.Current_Stock = request.POST.get('quantity')
        kitchen_resource.ReorderLevel = request.POST.get('reorder-level')
        kitchen_resource.save()
        
        messages.success(request, 'Kitchen resource updated successfully!')
        return redirect('KitchenResources')  # Redirect to the kitchen resources page

    # If the request method is GET, return the existing resource data as JSON
    return JsonResponse({
        'ItemName': kitchen_resource.ItemName,
        'ItemCategory': kitchen_resource.ItemCategory,
        'Current_Stock': kitchen_resource.Current_Stock,
        'ReorderLevel': kitchen_resource.ReorderLevel,
    })

def Maintenance_view(request):
    resources = Resource.objects.all()  # Fetch all resources
    kitchen_resources = KitchenResource.objects.all()  # Fetch all kitchen resources
    return render(request, 'Maintenance.html', {
        'resources': resources,
        'kitchen_resources': kitchen_resources,
    })

@require_http_methods(["POST"])
def edit_maintenance_resource(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        resource_id = data.get('resource_id')
        quantity = data.get('quantity')
        status = data.get('status')

        # Check if the resource is a KitchenResource or a Resource
        try:
            resource = Resource.objects.get(Resource_ID=resource_id)
            resource.QuantityToRepair = int(quantity)  # Store the quantity to repair
            resource.Status = status  # Store the status
            resource.save()
            return JsonResponse({'success': True})
        except Resource.DoesNotExist:
            # If not found in Resource, check in KitchenResource
            kitchen_resource = get_object_or_404(KitchenResource, KitchenResource_ID=resource_id)
            kitchen_resource.QuantityToRepair = int(quantity)  # Store the quantity to repair
            kitchen_resource.Status = status  # Store the status
            kitchen_resource.save()
            return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=400)

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

@require_http_methods(["POST"])
def edit_resource(request):
    if request.method == 'POST':
        # Get the resource ID and other fields from the POST request
        resource_id = request.POST.get('resource-id')  # This should be the Resource_ID
        resource_name = request.POST.get('resource-name')
        resource_category = request.POST.get('resource-category')
        quantity = request.POST.get('quantity')
        reorder_level = request.POST.get('reorder-level')

        # Use Resource_ID to fetch the resource
        resource = get_object_or_404(Resource, Resource_ID=resource_id)
        
        # Update the resource fields
        resource.ItemName = resource_name
        resource.ItemCategory = resource_category
        resource.Current_Stock = quantity
        resource.ReorderLevel = reorder_level
        
        # Save the updated resource
        resource.save()

        # Add a success message
        messages.success(request, 'Resource updated successfully!')
        
        # Redirect to the ManageResources page after updating
        return redirect('ManageResources')  

    # If the request method is not POST, return an error response
    return JsonResponse({'error': 'Invalid request method.'}, status=400)


@require_http_methods(["POST"])
def send_ingredients(request):
    if request.method == 'POST':
        try:
            # Assuming you are sending all ingredients or a specific list
            ingredients = Ingredient.objects.all()  # Fetch all ingredients or filter as needed
            
            # Prepare the data to send
            data_to_send = []
            for ingredient in ingredients:
                data_to_send.append({
                    'IngredientName': ingredient.IngredientName,
                    'ItemUnitMeasure': ingredient.ItemUnitMeasure,
                    'MeasureCount': ingredient.MeasureCount,
                    'Inventory_ID': ingredient.Inventory_ID.Inventory_ID,  # Assuming you want to send the Inventory ID
                })

            # Send the POST request to the external API
            response = requests.post('https://external-api-url.com/endpoint', json=data_to_send)

            # Check the response status
            if response.status_code == 200:
                return JsonResponse({'success': True, 'message': 'Ingredients sent successfully!'}, status=200)
            else:
                return JsonResponse({'success': False, 'message': 'Failed to send ingredients.', 'error': response.text}, status=response.status_code)

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)

@require_http_methods(["POST"])
def send_delivered_orders(request):
    if request.method == 'POST':
        try:
            # Fetch all delivered orders
            delivered_orders = Order.objects.filter(OrderStatus='Delivered').select_related('Items', 'Supplier')

            # Prepare the order data
            order_data = []
            for order in delivered_orders:
                order_data.append({
                    'Order_ID': order.Order_ID,
                    'ItemName': order.Items.ItemName,
                    'Quantity': order.Quantity,
                    'OrderStatus': order.OrderStatus,
                    'SupplierName': order.Supplier.SupplierName,
                    'Created_At': order.Created_At.strftime('%Y-%m-%d %H:%M:%S'),
                })

            # Send the POST request to the external API
            response = requests.post('https://external-api-url.com/orders', json=order_data)

            # Check the response status
            if response.status_code == 200:
                return JsonResponse({'success': True, 'message': 'Order data sent successfully!'}, status=200)
            else:
                return JsonResponse({'success': False, 'message': 'Failed to send order data.', 'error': response.text}, status=response.status_code)

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)

@require_http_methods(["POST"])
def send_inventory_data(request):
    if request.method == 'POST':
        try:
            # Fetch all inventory data
            inventory_data = Inventory.objects.all().values('Inventory_ID', 'ItemName', 'Current_Stock', 'PurchasePrice')

            # Send the POST request to the external API
            response = requests.post('https://external-api-url.com/inventory', json=list(inventory_data))

            # Check the response status
            if response.status_code == 200:
                return JsonResponse({'success': True, 'message': 'Inventory data sent successfully!'}, status=200)
            else:
                return JsonResponse({'success': False, 'message': 'Failed to send inventory data.', 'error': response.text}, status=response.status_code)

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)

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