from django.db import models

# Create your models here.
class Turno(models.Model):    
    placa = models.CharField(max_length=10)

class Registro(models.Model):
    adultos = models.IntegerField()
    niños = models.IntegerField()
    lugar = models.CharField(max_length=2)
    ventaTotal = models.FloatField(default=0)
    placa = models.CharField(max_length=10)

class Estacionamiento(models.Model):
    lugarOcupado = models.CharField(max_length=2)

