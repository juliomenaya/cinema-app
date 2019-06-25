document.getElementById("btnCorte").addEventListener("click", Corte)

function Corte() {
    $.ajax({
        url: '/cinema/ventaTotal/',
        success: ListaCorte,
        fail: function(e) {
            console.error(e)
        }
    })
}

function ListaCorte(datos) {   
    var ul = document.createElement('ul')
    var dineroTotal = 0
    for (var i in datos) {
        var li = document.createElement('li')
        li.appendChild(document.createTextNode(`$${datos[i].fields.ventaTotal} del auto con placa ${datos[i].fields.placa}`))
        dineroTotal += datos[i].fields.ventaTotal
        ul.appendChild(li)        
    }

    var liDineroTotal = document.createElement('li')
    liDineroTotal.appendChild(document.createTextNode(`Venta Total: $${dineroTotal}`))
    ul.appendChild(liDineroTotal)

    var container = document.getElementById("corte-container")    
    container.appendChild(ul)

    var button = document.getElementById('btnCorte')
    button.parentNode.removeChild(button)

}