function isValidInkWriterURL(url){
    var matches = url.match(/http:\/\/writer\.inklestudios\.com\/stories\/[a-zA-Z0-9]+$/)
    if(matches == null)
        return false;
    
    return true;
}
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function startProcess(){
    enteredURL = $("#inputURL").val();
    if(isValidInkWriterURL(enteredURL)){
        var title = null;
        var initial = null;
         //run process
        $.ajax({
            type: 'GET',
            url: '/processURL?url='+enteredURL,
            contentType: 'application/json; charset=utf-8',
            success: function(datum){
                
                var initial = datum.data.initial;
        var first = datum.data.stitches[initial];
        var docx = null;
         
        
                var str = JSON.stringify(datum, undefined, 2);
                $("#procOutputLeft").append("<pre><code>"+str+"</code></pre>")
                $("#procOutput").show();
                
                title = datum.title;
                initial = datum.data.initial;
                currentStoryID = datum.url_key;
                $("#lblTitle").html(title);
                $("#lblInitial").html(initial);
                
            },
            error: function(){alert('didn\'t work')}
        });
        return;
    }else{
       //invalid, alert the authorities 
        alert("Bad URL")
    }
}

var currentStoryID = null;
$(document).ready(function(){
    
    $("#wordDownload").on("click",function(evt){
        evt.preventDefault();
        window.location.href = "/downloadWord?key="+currentStoryID
    });
    
    $("#inputURL").keypress(function(e) {
        e.preventDefault();
        if(e.which == 13) {
            startProcess();
        }
    });
    
    
    $("#btnProcessURL").on("click",function(evt){
        startProcess();
        
    })
})