$(function () {
    getOrders()

    function getOrders() {
        var shipped = $('#Shipped').prop('checked') ? "1/" : "0/";
        var overdue = $('#Overdue').prop('checked') ? "1/" : "0/";
        var close = $('#Close').prop('checked') ? "1/" : "0/";
        var other = $('#Others').prop('checked') ? "1/" : "0/";
        var filters = "/filter/" + shipped+overdue+close+other;
        var dateSelected = $("#Date").val().split("-");
        var afterDate = dateSelected[0] ? "afterdate/" + dateSelected[0] + "/" + dateSelected[1] + "/" + dateSelected[2] : "";
        $.getJSON({
            url: "../../api/order" + filters + afterDate,
            success: function (response, textStatus, jqXhr) {
                //console.log(response);
                $('#order_rows').html("");
                for (var i = 0; i < response.length; i++) {
                    var oDate = new Date(response[i].orderDate.split("T")[0]);
                    var rDate = new Date(response[i].requiredDate.split("T")[0]);
                    var css = response[i].shippedDate ? " class=\"text-success\"" :
                        ((rDate - Date.now()) / 1000 / 60 / 60 / 24 < 7 && (rDate - Date.now()) / 1000 / 60 / 60 / 24 >=-1 ? " class=\"text-warning\"" :
                            (Date.now() > rDate ? " class=\"text-danger\"" : ""));
                    var row = "<tr"+ css + ">"
                        + "<td>" + response[i].orderId + "</td>"
                        + "<td>" + response[i].customer.companyName + "</td>"
                        + "<td>" + response[i].employee.firstName + " " + response[i].employee.lastName + "</td>"
                        + "<td>" + (oDate.getMonth()+1) + "/" + (oDate.getDate()+1) + "/" + oDate.getFullYear() + "</td>"
                        + "<td>" + (rDate.getMonth()+1) + "/" + (rDate.getDate()+1) + "/" + rDate.getFullYear() + "</td>"
                        + "<td>"
                        + response[i].shipAddress + " "
                        + response[i].shipCity + " "
                        + response[i].shipRegion + " "
                        + response[i].shipPostalCode + " "
                        + response[i].shipCountry
                        + "</td>"
                        + "</tr>";
                    $('#order_rows').append(row);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + textStatus, errorThrown);
            }
        });
    }
    $("#Shipped").on("change", function(){
        getOrders();
    });
    $("#Overdue").on("change", function () {
        getOrders();
    });
    $("#Close").on("change", function () {
        getOrders();
    });
    $("#Others").on("change", function () {
        getOrders();
    });
    $("#Date").on("change", function () {
        getOrders();
    });
    $("#Clear").on('click', function () {
        $("#Date").val("");
        getOrders();
    });
});