from django.urls import path
from . import views

urlpatterns = [
    # Base Route

    path('', views.login_view, name='login'), 
    path('home', views.home_view, name='home-view'),

    path('', views.Sidebar_view, name='Sidebar'),
    path('AddProduct/', views.AddProduct_view, name='AddProduct'),

    path('ManageOrder/', views.ManageOrder_view, name='ManageOrder'),
    path('PlaceOrder/', views.PlaceOrder_view, name='PlacedOrder'),
    path('PlaceOrder/', views.PlaceOrder_view, name='PlaceOrder'),
    
    path('ManageProduct/', views.ManageProduct_view, name='ManageProducts'),
    path('edit_product/<int:pk>/', views.EditProduct_view, name='EditProduct'),

    path('KitchenDisplay/', views.KitchenDisplay_view, name='KitchenDisplay'),
    path('add-supplier/', views.AddSupplier_view, name='AddSupplier'),
    path('manage-supplier/', views.ManageSupplier_view, name='ManageSupplier'),
    path('edit-supplier/<int:pk>/', views.edit_supplier, name='edit_supplier'),
    path('ExpiryDates/', views.ExpiryDates_view, name='ExpiryDates'),
    

    path('add-material/', views.AddMaterial_view, name='AddMaterial'),
    path('manage-material/', views.ManageMaterial_view, name='ManageMaterial'),
    path('edit-material/<int:pk>/', views.edit_material, name='edit_material'),


    path('inventory/', views.InventoryListCreateView.as_view(), name='inventory-list'),
    path('inventory/<int:pk>/', views.InventoryDetailView.as_view(), name='inventory-detail'),

    path('suppliers/', views.SupplierListCreateView.as_view(), name='supplier-list'),
    path('suppliers/<int:pk>/', views.SupplierDetailView.as_view(), name='supplier-detail'),

    path('orders/', views.OrderListCreateView.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),

    path('productorders/', views.ProductOrdersListCreateView.as_view(), name='productorders-list'),
    path('productorders/<int:pk>/', views.ProductOrdersDetailView.as_view(), name='productorders-detail'),

    path('products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),

    path('ingredients/', views.IngredientListCreateView.as_view(), name='ingredient-list'),
    path('ingredients/<int:pk>/', views.IngredientDetailView.as_view(), name='ingredient-detail'),
    path('manage-waste/', views.ManageWaste_view, name='ManageWaste'),

]
