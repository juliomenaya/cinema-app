from django.urls import path
from . import views

app_name = 'cinema'

urlpatterns = [
    path('', views.index, name='index'),
    path('registro/', views.registro, name='registro'),
    path('administracion/', views.administracion, name='administracion'),
    
    
    path('compra/', views.compra, name='compra'),
    path('estacionamiento/', views.LugaresEstacionamientoOcupados, name='estacionamiento'),
    path('ventaTotal/', views.Venta, name='venta')
]

