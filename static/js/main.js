
// $("#dropzone_upload").dropzone({
//     url: "/upload_image/",
//     maxFiles: 10,
//     maxFilesize: 512,
//     acceptedFiles: ".jpg"
// });

// Global variables
var input_style = 0;
var input_category = 0;
var suitable_items = [];


// Test 
get_topic_bubble();
// get_word_cloud();


$(function() {
    jQuery(document).ready(function() {

        // Home slideshow section
        $("#home").backstretch([
            "static/images/home-slideshow1.jpg", 
            "static/images/home-slideshow2.jpg",
            "static/images/home-slideshow3.jpg"
        ], {duration: 2000, fade: 750});

        // Submit the query input
        $("#submit_button").click(function() {
            show_loading();
            remove_result();
            submit();
        });

        // Change the result view
        $("#list_button").click(function() {
            console.log("list");
            $("#result_div_left").show("slow"); //show
            $("#result_div_right").show("slow");
        });
        $("#network_button").click(function() {
            console.log("network");
            $("#result_div_left").fadeOut("slow"); //.hide
            $("#result_div_right").fadeOut("slow"); 
            drawNetwork();
        });

    });
})

// Append loading div when submit
function show_loading() {
    let loading = '<div class="loader" id="loading">Loading</div>';
    $("#result_div").append(loading);
}

// Remove loading div when get data
function hide_loading() {
    $("#loading").remove();
}

// Remove the original results
function remove_result() {
    d3.select("#result_div_left").selectAll("div").remove();
    d3.select("#result_div_right").selectAll("div").remove();
}

// When user click  submit button
function submit() {
    console.log("click submit!");

    // Recommendation Steps:
    // Step 1. Get user selected style from bubbles
    // function()... 

    // Step 2. Recognize user input image's category (eg. Top or Button, ...)
    get_image_category(); // return ["Top", 0]

}

function get_image_category() {
    $.ajax({
        url: "/get_image_category/", 
        data: {},
        method: "GET",
        success: function(response) {
            // response the category of user input image
            console.log("Category: ", response); // return ["Top", 0]

            input_category = response[1]; // category class

            // Step 3. Recognize the compatibility of input image and candidate image pairs
            get_compatibility(input_style, input_category); // return suitable items
        },
        error : function (jqXHR, exception) {
            error_response(jqXHR, exception);
        }
    })
}

function get_compatibility(input_style, input_category) {
    $.ajax({
        url: "/get_compatibility/",
        data: {
            input_style: input_style,
            input_category: input_category
        },
        //dataType: "json",
        method: "GET",
        success: function(response) {
            // response image path of compatible pairs
            console.log(response); // return ["../pairs/204622550-218170042.jpg", ...]

            // Step 4. Get the suitable item data from db
            get_items_data(response); // return json data of item information
        },
        error : function (jqXHR, exception) {
            error_response(jqXHR, exception);
        }
    })
}

function get_items_data(items) {
    hide_loading();
    // Get item's data from db
    for (let i = 0; i < items.length; i++) {
        let item_id = items[i].split("-")[1].split(".")[0]; // Split im path to get item id
        
        // Push item image path
        suitable_items.push({
            "im": "static/candidates/"+input_style.toString()+"/"+item_id+".jpg",
            "data": {},
        });

        // Get item data from db
        get_db_data(i, item_id);
    }
}

function get_db_data(index, item_id) {
    $.ajax({
        url: "/get_db_data/", 
        data: { 
            item_id: item_id  
        },
        dataType: "json",
        method: "GET",
        success: function(response) {
            suitable_items[index].data = response;

            // Step 5. Show result list on page
            append_result_html(index, suitable_items[index]);
        },
        error : function (jqXHR, exception) {
            error_response(jqXHR, exception);s
        }
    })
}

function append_result_html(index, item) {
    console.log(item.im);
    console.log(item.data);

    // content of the recommend item result
    let content =   '<div class="media wow fadeInUp" data-wow-delay="0.6s">'+
                        '<div class="media-object pull-left">'+
                            '<img src='+item.im+' class="img-responsive" alt="Food Menu">'+
                            '<span class="menu-price">♡ '+item.data.likes+'</span>'+
                        '</div>'+
                        '<div class="media-body">'+
                            '<h3 class="media-heading">'+item.data.title+'</h3>'+
                            '<p>'+item.data.description+'</p>'+
                        '</div>'+
                    '</div>';

    $(function() {
        jQuery(document).ready(function() {
            if (index % 2 == 0) $("#result_div_left").append(content);
            else $("#result_div_right").append(content);
        });
    })
}


function get_topic_bubble() {
    $.ajax({
        url: "/get_topic_bubble/", 
        data: {},
        //dataType: "json",
        method: "GET",
        success: function(response) {
            // console.log(response);
            drawTopicBubble(response);
        },
        error : function (jqXHR, exception) {
            error_response(jqXHR, exception);
        }
    });
}

// function get_word_cloud(topic) {
//     $.ajax({
//         url: "/get_word_cloud/", 
//         data: {},
//         //dataType: "json",
//         method: "GET",
//         success: function(response) {
//             // console.log(topic, response);
//             drawWordCloud(topic, response);
//         },
//         error : function (jqXHR, exception) {
//             error_response(jqXHR, exception);
//         }
//     });
// }

function error_response(jqXHR, exception) {
    console.log("error");
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connect.\n Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }
    console.log(msg);
}