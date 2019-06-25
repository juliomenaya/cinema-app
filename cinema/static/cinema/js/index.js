$("#btnRegPlaca").on("click", function(e) {
    e.preventDefault()    
    $.ajax({
        url: "/cinema/",
        method: "POST",
        data: {
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
            'numeroPlaca': $("#numeroPlaca").val()
        }
    }).done(function() {
        $('.alert-success').fadeIn("slow")
        $("#numeroPlaca").focus().select()
        $('.alert-success').fadeOut(3000)
    })
})