var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');
var officegen = require('officegen');
var track = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ink Writer Exporter' });
});

/* GET URL INFO */
router.get('/processURL', function(req, response) {
    response.contentType('application/json');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    if(isValidInkWriterURL(query.url)){
        request(query.url + ".json", function (error, res, body) {
            if (!error && response.statusCode == 200 && body != "null") {
                  response.send(body);
            }else{
                response.send(400, { error: "URL did not return an Ink writer story" });
            }
          })
        
    }else{
        //error response
        response.send(400, { error: "URL does not match expressed ink writer URL" });
    }

});
var hash = {};
function processPart(docx,titular,section,stitch,pObj){
    if(titular != ""){
        if(hash[titular])
            return;
        hash[titular] = 1;
    }
    var info = null;
    var title = null;
    var link = [];
    var divert = null;
        var content = section.content;
        for(var i = 0; i < content.length; i++){
            if(info == null)
                info = content[0];
            if(content[i].linkPath)
                link.push({link:content[i].linkPath,option:content[i].option})
            if(content[i].pageLabel)
                title = content[i].pageLabel;
            if(content[i].divert)
                divert = content[i].divert
        }
    
    if(!pObj)
        pObj = docx.createP();
    
    pObj.options.align = 'center';
    if(titular != ""){
        pObj.addLineBreak ();
        pObj.addLineBreak ();
        pObj.addText("{{{"+titular+"}}}", { bold: true, underline: true } );
        pObj.addLineBreak ();
    }

    if(info){
        pObj.addText(info);
        pObj.addLineBreak ();
        pObj.addLineBreak ();
    }
    if(link.length > 0){
        for(var i = 0; i < link.length; i++){
            pObj.addText(link[i].option + " - GO TO : <<<" + link[i].link + ">>>")
            pObj.addLineBreak ();
            pObj.addLineBreak ();
        }
    }
    
 
    
    if(divert){
        processPart(docx,"",stitch[divert],stitch,pObj)
    }else{
        for(var i = 0; i < link.length; i++){
           processPart(docx,link[i].link,stitch[link[i].link],stitch,null)

        }
    }
}
router.get('/downloadWord', function(req,res){
    
    
    var text_ready = "This is a content of a txt file."
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var key = query.key;
    
    request("https://writer.inklestudios.com/stories/"+ key + ".json", function (error, callResponse, body) {
        if (!error && callResponse.statusCode == 200 && body != "null") {
            var docx = officegen ( 'docx' );
            var datum = JSON.parse(body);
            var initial = datum.data.initial;
            var first = datum.data.stitches[initial];
            processPart(docx,initial,first,datum.data.stitches);
            
            /*for(var stitch in datum.data.stitches){
                var currStitch = datum.data.stitches[stitch];
                if(stitch != initial){
                    console.log(stitch+"\n")
                    processPart(docx,currStitch)
                }
            }*/
            /*var pObj = docx.createP ();
            pObj.options.align = 'center'; 
            pObj.addText ( 'Simple' );
 
            pObj.addText ( ' with color', { color: '000088' } );
 
            pObj.addText ( ' and back color.', { color: '00ffff', back: '000088' } );
 
            pObj.addText ( 'Bold + underline', { bold: true, underline: true } );
 
            pObj.addText ( 'Fonts face only.', { font_face: 'Arial' } );
 
            pObj.addText ( ' Fonts face and size.', { font_face: 'Arial', font_size: 40 } );
            
            */
             
            res.writeHead ( 200, {
            				"Content-Type": "aapplication/vnd.openxmlformats-officedocument.wordprocessingml.document",
            				'Content-disposition': 'attachment; filename='+key+'.docx'
            				});
                            
                            
            docx.on ( 'error', function ( err ) {
            	res.send(400, { error: "Failed to create document" });
            });

            docx.generate ( res );
            
            
           
        }else{
            res.send(400, { error: "URL did not return an Ink writer story" });
        }
      })
      
      

    return; // <- Don't forget to return here !!
    
});

function isValidInkWriterURL(url){
    var matches = url.match(/http:\/\/writer\.inklestudios\.com\/stories\/[a-zA-Z]+$/)
    if(matches == null)
        return false;
    
    return true;
}
module.exports = router;
