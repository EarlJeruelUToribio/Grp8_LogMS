from django.urls import path
from . import views

urlpatterns = [
    # Base Route
    path('', views.Sidebar_view, name='home'),
    path('dashboard', views.Sidebar_view, name='home'),
    path('AddProduct/', views.AddProduct_view, name='AddProduct'),

    path('ManageOrder/', views.ManageOrder_view, name='ManageOrder'),
    path('PlaceOrder/', views.PlaceOrder_view, name='PlaceOrder'),
    path('api/order-counts/', views.order_counts_view, name='order-counts'),
    
    path('ManageProduct/', views.ManageProduct_view, name='ManageProducts'),
    path('edit_product/<int:pk>/', views.EditProduct_view, name='EditProduct'),

    path('KitchenDisplay/', views.KitchenDisplay_view, name='KitchenDisplay'),
    path('add-supplier/', views.AddSupplier_view, name='AddSupplier'),
    path('manage-supplier/', views.ManageSupplier_view, name='ManageSupplier'),
    path('edit-supplier/<int:pk>/', views.edit_supplier, name='edit_supplier'),
    
    path('expiry-dates/', views.ExpiryDates_view, name='ExpiryDates'),
    path('mark-as-expired/<int:item_id>/', views.mark_as_expired, name='mark_as_expired'),
    path('extend-expiration/<int:item_id>/', views.extend_expiration, name='extend_expiration'),

    path('ManageResources/', views.ManageResources_view, name='ManageResources'),
    path('AddResources/', views.AddResources_view, name='AddResources'),
    path('edit-resource/', views.edit_resource, name='edit_resource'),

    path('kitchen-resources/', views.KitchenResources_view, name='KitchenResources'),
    path('add-kitchen-resource/', views.AddKitchenResource_view, name='AddKitchenResource'),
    path('edit-kitchen-resource/<int:pk>/', views.edit_kitchen_resource, name='edit_kitchen_resource'),

    path('delete-material/<int:material_id>/', views.delete_material, name='delete_material'),
    path('add-material/', views.AddMaterial_view, name='AddMaterial'),
    path('manage-material/', views.ManageMaterial_view, name='ManageMaterial'),
    path('edit-material/<int:pk>/', views.edit_material, name='edit_material'),

    path('Maintenance/', views.Maintenance_view, name='Maintenance'),
    path('edit-maintenance-resource/', views.edit_maintenance_resource, name='edit_maintenance_resource'),

    path('add-category/', views.AddCategory_view, name='AddCategory'),
    path('ManageWasteRecords/', views.ManageWaste_view, name='ManageWaste'),  # Updated URL

    # API Endpoints for AJAX Requests
    path('api/materials/', views.get_materials_by_supplier, name='get-materials-by-supplier'),
    path('api/material/<int:material_id>/', views.get_material_details, name='get-material-details'),
    path('api/min-order-qty/', views.get_min_order_qty, name='get-min-order-qty'),

    path('inventory/', views.InventoryListCreateView.as_view(), name='inventory-list'),
    path('send-inventory-data/', views.send_inventory_data, name='send-inventory-data'),
    path('inventory/<int:pk>/', views.InventoryDetailView.as_view(), name='inventory-detail'),

    path('suppliers/', views.SupplierListCreateView.as_view(), name='supplier-list'),
    path('suppliers/<int:pk>/', views.SupplierDetailView.as_view(), name='supplier-detail'),

    path('orders/', views.OrderListCreateView.as_view(), name='order-list'),
    path('send-delivered-orders/', views.send_delivered_orders, name='send-delivered-orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),

    path('productorders/', views.ProductOrdersListCreateView.as_view(), name='productorders-list'),
    path('productorders/<int:pk>/', views.ProductOrdersDetailView.as_view(), name='productorders-detail'),

    path('products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('api/products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    path('ingredients/', views.IngredientListCreateView.as_view(), name='ingredient-list'),
    path('send-ingredients/', views.send_ingredients, name='send-ingredients'),
    path('ingredients/<int:pk>/', views.IngredientDetailView.as_view(), name='ingredient-detail'),
]
