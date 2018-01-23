// ExÃ©cute un appel AJAX GET
// Prend en paramÃ¨tres l'URL cible et la fonction callback appelÃ©e en cas de succÃ¨s
function ajaxGet(url, callback){
   var req = new XMLHttpRequest();

req.open("GET", url);
req.addEventListener("load",function(){
    
    if((req.status >= 200) && (req.status < 400))
        {
            callback(req.responseText);
        }else{
            console.log(req.status + " " + req.statusText + " " + url);
        }
    
});
req.addEventListener("error",function(){
    console.log("Erreur rÃ©seau " + url);
});
req.send(null); 
}

// ExÃ©cute un appel AJAX POST
// Prend en paramÃ¨tres l'URL cible, la donnÃ©e Ã  envoyer et la fonction callback appelÃ©e en cas de succÃ¨s
function ajaxPost(url, data, callback,isJson) {
    var etat = true; // Variable retournÃ©e en cas d'ajout de donnÃ©es dans le serveur
    var req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la rÃ©ponse de la requÃªte
            callback(req.responseText);
        } else {
            etat = false;
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur rÃ©seau avec l'URL " + url);
    });
    if(isJson){
        req.setRequestHeader("Content-Type","application/json");
        data = JSON.stringify(data);
    }
    req.send(data);
    return etat;
}
