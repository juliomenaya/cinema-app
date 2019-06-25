from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from .models import Turno, Estacionamiento, Registro
from django.core import serializers

def index(request):    
    if request.method == 'GET':          
        return render(request, 'cinema/index.html')
    if request.method == 'POST':        
        turno = Turno()
        turno.placa = request.POST['numeroPlaca'].upper()       
        turno.save()
        return HttpResponseRedirect('/cinema/')

def registro(request):
    try:        
        turno = Turno.objects.all()[0]        
    except:
        turno = None
    context = {
        'turno': turno
    }
    return render(request, 'cinema/registro.html', context)

def administracion(request):
    return render(request, 'cinema/administracion.html')


def compra(request):
    registro = Registro()

    registro.adultos = request.POST.get('boletosAdulto')
    registro.niños = request.POST.get('boletosNinio')
    registro.ventaTotal = request.POST.get('total')
    registro.placa = request.POST.get('placa')
    registro.lugar = request.POST.get('parking')

    # registro = Registro({
    #     adultos:  request.POST.get('boletosAdulto')
    #     niños: request.POST.get('boletosNinio')
    #     ventaTotal: = request.POST.get('total')
    #     placa: request.POST.get('placa')
    #     registro.lugar = request.POST.get('parking')
    # })

    registro.save()

    estacionamiento = Estacionamiento()
    estacionamiento.lugarOcupado = request.POST.get('parking')
    estacionamiento.save()

    Turno.objects.filter(placa=request.POST['placa']).delete()

    return render(request, 'cinema/registro.html')


def LugaresEstacionamientoOcupados(request):
    try:                
        lugaresOcupados = serializers.serialize('json', Estacionamiento.objects.all(), fields=('lugarOcupado'))
    except:
        lugaresOcupados = None        
    return HttpResponse(lugaresOcupados, content_type='application/json')

def Venta(request):
    datosVenta = serializers.serialize("json", Registro.objects.all(), fields=["ventaTotal", "placa"])
    return HttpResponse(datosVenta, content_type='application/json')
