const PRECIO_BOLETO_NINIO = 51
const PRECIO_BOLETO_ADULTO = 73
const MAX_BOLETOS = 8


$("#precioBoletoNinio").text("$" + PRECIO_BOLETO_NINIO)
$("#precioBoletoAdulto").text("$" + PRECIO_BOLETO_ADULTO)

var lugarSeleccionado

var lugaresSeleccionados = []

// Registra los lugares de estacionamiento que ya han sido seleccionados
$(window).on('load', lugaresDisponibles)

// ELECCION DE LUGAR PARA ESTACIONARSE
$("#parking").on("click", (e) => {
    if($(e.target).is("i")) {
        var nuevoLugar = e.target.id
        if (lugaresSeleccionados.indexOf(nuevoLugar) == -1) {
            if (lugarSeleccionado != null && nuevoLugar != lugarSeleccionado) {
                $(`#${lugarSeleccionado}`).css("color", "")
                $(`#${nuevoLugar}`).css("color", "green")
                lugarSeleccionado = nuevoLugar
            } else {
                $(`#${nuevoLugar}`).css("color", "green")
                lugarSeleccionado = nuevoLugar
            }
        }
    }    
})

// AGREGA BOLETOS DE NIÑO A LA COMPRA
$("#btnAgregaBoletoNinio").on("click", function(e) {    
    e.preventDefault()
    var boletos = parseInt($("#boletosNinio").text()) + 1

    if (puedeAgregarBoletos()) {
        $("#boletosNinio").text(boletos)
        var subtotal = boletos * PRECIO_BOLETO_NINIO
        $("#subtotalBoletosNinio").text("$" + subtotal)
        calculaTotal()
    }else {
        $('.alert-warning').fadeIn("slow")
        $('.alert-warning').fadeOut(3000)
    } 
})

// QUITA BOLETOS DE NIÑO A LA COMPRA
$("#btnRestaBoletoNinio").on("click", function(e) {    
    e.preventDefault()
    var resta = parseInt($("#boletosNinio").text()) - 1    
    var boletos = resta > 0 ? resta : 0
    $("#boletosNinio").text(boletos)
    $("#subtotalBoletosNinio").text("$" + boletos * PRECIO_BOLETO_NINIO)
    calculaTotal()
})

// AGREGA BOLETOS DE ADULTO A LA COMPRA
$("#btnRestaBoletoAdulto").on("click", function(e) {    
    e.preventDefault()
    var resta = parseInt($("#boletosAdulto").text()) - 1
    var boletos = resta > 0 ? resta : 0
    $("#boletosAdulto").text(boletos)
    $("#subtotalBoletosAdulto").text("$" + boletos * PRECIO_BOLETO_ADULTO) 
    calculaTotal()
})

// QUITA BOLETOS DE NIÑO A LA COMPRA
$("#btnAgregaBoletoAdulto").on("click", function(e) {    
    e.preventDefault()
    var boletos = parseInt($("#boletosAdulto").text()) + 1

    if (puedeAgregarBoletos()) {
        $("#boletosAdulto").text(boletos)
        $("#subtotalBoletosAdulto").text("$" + parseInt(boletos * PRECIO_BOLETO_ADULTO))
        var total = (boletos * PRECIO_BOLETO_ADULTO) + (parseInt($("#subtotalBoletosNinio").text().split("$")[1]))
        $("#total").text("$" + total)
        calculaTotal()
    } else {
        $('.alert-warning').fadeIn("slow")        
        $('.alert-warning').fadeOut(3000)
    }    
})

$("#btnListo").on("click", function(e) {
    if (formularioValido()) {
        $.ajax({
            url: "/cinema/compra/",
            data: {
                'boletosNinio': $("#boletosNinio").text(),
                'boletosAdulto': $("#boletosAdulto").text(),
                'parking': lugarSeleccionado,
                'total': $("#total").text().split("$")[1],
                'placa': $("input[name=placa]").val(),
                'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
            },
            method: "POST",
            success: function() {
                location.reload()
            },
            fail: function(e) {
                console.error(e)
            }
        })
    } else {
        alert('Verifique que haya sido seleccionado un lugar de estacionamiento y que se hayan indicado la cantidad de boletos que desea comprar')
    }

})

function formularioValido() {
    var total = parseInt($("#total").text().split("$")[1])
    
    if (total == 0 || lugarSeleccionado == null)
        return false
        
    return true
}

function datosFaltantes() {
    var total = parseInt($("#total").text().split("$")[1])

    // if (total == 0)

}

function puedeAgregarBoletos() {
    var boletos = parseInt($("#boletosNinio").text()) + parseInt($("#boletosAdulto").text())    
    return boletos < MAX_BOLETOS;
}

function calculaTotal() {
    var subtotalNinio = parseInt($("#subtotalBoletosNinio").text().split("$")[1])
    var subtotalAdulto = parseInt($("#subtotalBoletosAdulto").text().split("$")[1])    
    var total = subtotalNinio + subtotalAdulto
    $("#total").text("$" + total)
}

function lugaresDisponibles() {
    $.ajax({
        url: "/cinema/estacionamiento",
        success: function(lugaresOcupados) {

            if (lugaresOcupados.length == 25) {
                alert('Ya no hay lugares de estacionamiento, será redirigido a la página de administración')
                window.location.replace('http://localhost:8000/cinema/administracion/')
            }

            lugaresSeleccionados = []
            
            // SE AGREGAN LOS LUGARES QUE YA HAYAN SIDO ELEGIDOS AL ARREGLO QUE ES UTILIZADO PARA DEMOSTRARSELO AL USUARIO
            for (var i in lugaresOcupados) {
                 lugaresSeleccionados.push(lugaresOcupados[i].fields.lugarOcupado)
            }

            // LOS LUGARES QUE YA ESTAN OCUPADOS SON COLOREADOS DE CAFE
            $("#parking tr td i").each((key, value) => {                
                if (lugaresSeleccionados.indexOf(value.id) != -1) {
                    $(`#${value.id}`).css("color", "brown")
                }
            })
        },
        fail: function(error) {
            console.error(error)
        }
    })    
}