var results;                 //Results from Eventful API
var userProfile = {          //User Profile information saved in this object
    name: '',
    email: '',
    phone: '',
    interests: ''
};

var tableJSON=[];           //User selections as JSON Object
var tableData=[];           //Data into HTML table as a JSON Object
// var tableStr;               //Data from HTML table as a JSON string (no longer used)
var eventsTable;

//User input dates are processed here
$( function() {
    var dateFormat = "mm/dd/yy",
        from = $( "#from" )
            .datepicker({
                defaultDate: "+0d",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on( "change", function() {
                to.datepicker( "option", "minDate", getDate( this ) );
            }),
        to = $( "#to" ).datepicker({
            defaultDate: "+0d",
            changeMonth: true,
            numberOfMonths: 1
        })
            .on( "change", function() {
                from.datepicker( "option", "maxDate", getDate( this ) );
            });

    function getDate( element ) {
        var date;
        try {
            date = $.datepicker.parseDate( dateFormat, element.value );
        } catch( error ) {
            date = null;
        }

        return date;
    }
} );


//Take user input and send to Eventful API
function getEvents(callback) {

    // Get and sanitize user input
    // note: Eventful does not use time; ignored.
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var name = $("#name-input").val().trim();
    var email = $("#email-input").val().trim();
    var phone = $("#phone-input").val().trim();
    var interests = $('#interests-input').val();
    var location = $("#location-input").val().trim();
    var fromDate = $("#from").val();
    var toDate = $("#to").val();

    // save user input into a User Profile object
    userProfile.name = name;
    userProfile.email = email.toLowerCase();
    userProfile.phone = phone.replace(phoneRegex, "($1) $2-$3"); //format (###) ###-####
    userProfile.interests = interests;

    // Initialize the Eventful parameters object
    var oArgs = {
        app_key: "X9DPGH6rTnsfrTpX",
        q: interests,
        where: location,
        date: `${moment(new Date(fromDate)).format("YYYYMMDD00")}-${moment(new Date(toDate)).format("YYYYMMDD00")}`,
        page_size: 50,
        sort_order: "popularity",
    };

    // Request events and process them through callback
    EVDB.API.call("/events/search", oArgs, function(oData) {
        results = oData;
        callback();
    });
}


function showEvents() {
    //Process block of results, one result at a time, into a JSON object of event data
    results.events.event.forEach(function(result){

        // A lot of the data returned is invalid; ignore the whole result
        if (result.postal_code == null) {result.postal_code = ' '}

        if ((result.title == null) ||
            (result.image == null) ||
            (result.image.medium == null) ||
            (result.description == null) ||
            (result.venue_name == null) ||
            (result.venue_address == null)) { }
        else {
            tableData.push({
                "checkBox": ` `,
                "dateTime": `${moment(result.start_time).format("dddd, MMMM D YYYY, h:mm:ss a")}`,
                "event": `${result.title}`,
                "poster": `<img src="${result.image.medium.url}">`,
                "description": `${result.description.substring(0, 500)}`,
                "venue": `${result.venue_name}`,
                "venueAddress": `${result.venue_address}`,
                "cityStateZip": `${result.city_name}  ${result.region_name}  ${result.postal_code}`
            })
        }
    });


    //Process JSON object of event data into the HTML table
    eventsTable = $('#events-table').dataTable( {
        data: tableData,
        columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        } ],
        columns: [
            { "data": "checkBox" },
            { "data": "dateTime" },
            { "data": "event" },
            { "data": "poster" },
            { "data": "description" },
            { "data": "venue" },
            { "data": "venueAddress" },
            { "data": "cityStateZip" },
        ],
        pagingType: 'full_numbers',
        lengthMenu: [10, 20, 50, 100],
        pageLength: 10,
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]],
        responsive: {
            breakpoints: [
                { name: 'desktop', width: Infinity },
                { name: 'tablet',  width: 1024 },
                { name: 'fablet',  width: 768 },
                { name: 'phone',   width: 480 }
            ]
        },
        dom: 'frtip',
        retrieve: true,
    } );

    $('#your-itinerary').show();  // unhide the table

    //Note: Already have JSON data in tableJSON
    // eventsToJSON();
}


//Capture HTML table in to JSON object (no longer used)
// function eventsToJSON() {
//     var tableObj = $('#events-table').tableToJSON();
//
//     tableStr = JSON.stringify(tableObj);
// }


//
$(document).ready(function () {

    $('#user-feedback').hide();  // hide the user msg
    $('#your-itinerary').hide();  // hide the table
    $('#your-results').hide();


    // Process user info: to API and display in table
    $("#plan-my-date").on("click", function (event) {
        // prevent form from trying to submit/refresh the page
        event.preventDefault();

        getEvents(showEvents);
    });

    $("#getUserButton").on("click", function(event) {
        event.preventDefault();

        var email = $("#userEmail").val().trim().toLowerCase();
        getUserEmail(email);
        $('#your-results').show();
    });

    //Reset form and hide table
    $("#reset-my-plan").on("click", function (event) {
        // prevent form from trying to submit/refresh the page
        event.preventDefault();
        $('#name-input').val('');
        $('#email-input').val('');
        $('#phone-input').val('');
        $('#location-input').val('');
        $('#interests-input').val('');
        $('#from').val('');
        $('#to').val('');
        $('#from-time').val('');
        $('#to-time').val('');
        $('#userEmail').val('');
        $('#table').empty();
        $('#your-itinerary').hide();
        $('#your-results').hide();

        // $('#container form').get(0).reset();

    });

    // Turn table data into cards
    $('#btToggleDisplay').on('click', function () {
        $("#events-table").toggleClass('cards')
        $("#events-table thead").toggle()
    })


    // Form Validation
    $.validate({
        modules : 'toggleDisabled',
        form : '#main',
        borderColorOnError : '#FFF',
        addValidClassOnAll : true,
        // disabledFormFilter : 'form.toggle-disabled',
        showErrorDialogs : true,
    });

    $.validate({
        modules : 'toggleDisabled',
        form : '#get-results',
        borderColorOnError : '#FFF',
        addValidClassOnAll : true,
        // disabledFormFilter : 'form.toggle-disabled',
        showErrorDialogs : true,
    });


    // Create a JSON object of 'selected' event information
    $("#save-selections").on("click", function () {
            if ( $.fn.dataTable.isDataTable( '#events-table' ) ) {
                eventsTable = $('#events-table').DataTable();

                if (eventsTable.rows( { selected: true } ).count() == 0) {
                    $('#user-feedback').show();  // show the user msg
                }
                else{
                    $('#user-feedback').hide();  // hide the user msg

                    var selectedRows = eventsTable.rows( { selected: true } ).data().toArray();
                    selectedRows.forEach(function(sR){
                        delete sR.checkBox;
                    });

                    tableJSON.push(selectedRows);

                    // save user in firebase
                    addUser(userProfile);

                    // save user's events
                    addItinerary(userProfile,tableJSON);

                    $('#your-itinerary').hide();  // hide the table
                    $('#name-input').val('');
                    $('#email-input').val('');
                    $('#phone-input').val('');
                    $('#location-input').val('');
                    $('#interests-input').val('');
                    $('#from').val('');
                    $('#to').val('');
                    $('#from-time').val('');
                    $('#to-time').val('');
                    $('#userEmail').val('');
                }
            }
    });


    // Clock face input processing
    var input = $('#from-time').clockpicker({
        placement: 'bottom',
        align: 'left',
        autoclose: true,
        'default': 'now'
    });

    var input = $('#to-time').clockpicker({
        placement: 'bottom',
        align: 'left',
        autoclose: true,
        'default': 'now'
    });

});

