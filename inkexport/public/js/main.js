function isValidInkWriterURL(url){
    var matches = url.match(/http:\/\/writer\.inklestudios\.com\/stories\/[a-zA-Z]+$/)
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
function processPart(docx,section,stitches){
    var info = null;
    var title = null;
    var link = [];
    
        var content = section.content;
        for(var i = 0; i < content.length; i++){
            if(info == null)
                info = content[0];
            if(content[i].linkPath)
                link.push({link:content[i].linkPath,option:content[i].option})
            if(content[i].pageLabel)
                title = content[i].pageLabel;
        }
    
    /*
    var pObj = docx.createP();
    
    pObj.options.align = 'center';
    pObj.addText(title);
    pObj.addLineBreak ();
    //pObj.addLineBreak ();
    //pObj.addLineBreak ();
    pObj.addText(info);
    //pObj.addLineBreak ();
    pObj.addLineBreak ();
    for(var i = 0; i < link.length; i++){
        pObj.addText(link[i].option + " - GO TO : " + link[i].link)
        //pObj.addLineBreak ();
        //pObj.addLineBreak ();
    }
        */
        var dave = 'das'
}

var currentStoryID = null;
$(document).ready(function(){
    
    $("#wordDownload").on("click",function(evt){
        evt.preventDefault();
        window.location.href = "/processURL"
    });
    
    $("#btnProcessURL").on("click",function(evt){
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
            processPart(docx,first,datum.data.stitches);
            
            for(var stitch in datum.data.stitches){
                var currStitch = datum.data.stitches[stitch];
                if(stitch != initial){
                    console.log(stitch+"\n")
                    processPart(docx,currStitch)
                }
            }
            
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
        
    })
})