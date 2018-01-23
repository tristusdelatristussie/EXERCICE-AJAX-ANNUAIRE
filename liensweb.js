/* 
ActivitÃ© 2
*/

// Liste des liens Web Ã  afficher. Un lien est dÃ©fini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publiÃ©)
var listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodÃ©fense numÃ©rique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    },
    {
        titre: "L'encyclopÃ©die en ligne Wikipedia",
        url: "http://Wikipedia.org",
        auteur: "annie.zette"
    }
];

// CrÃ©e et renvoie un Ã©lÃ©ment DOM affichant les donnÃ©es d'un lien
// Le paramÃ¨tre lien est un objet JS reprÃ©sentant un lien
function creerElementLien(lien) {
    var titreElt = document.createElement("a");
    titreElt.href = lien.url;
    titreElt.style.color = "#428bca";
    titreElt.style.textDecoration = "none";
    titreElt.style.marginRight = "5px";
    titreElt.appendChild(document.createTextNode(lien.titre));

    var urlElt = document.createElement("span");
    urlElt.appendChild(document.createTextNode(lien.url));

    // Cette ligne contient le titre et l'URL du lien
    var ligneTitreElt = document.createElement("h4");
    ligneTitreElt.style.margin = "0px";
    ligneTitreElt.appendChild(titreElt);
    ligneTitreElt.appendChild(urlElt);

    // Cette ligne contient l'auteur
    var ligneDetailsElt = document.createElement("span");
    ligneDetailsElt.appendChild(document.createTextNode("AjoutÃ© par " + lien.auteur));

    var divLienElt = document.createElement("div");
    divLienElt.classList.add("lien");
    divLienElt.appendChild(ligneTitreElt);
    divLienElt.appendChild(ligneDetailsElt);

    return divLienElt;
}

var contenuElt = document.getElementById("contenu");
// Parcours de la liste des liens et ajout d'un Ã©lÃ©ment au DOM pour chaque lien
listeLiens.forEach(function (lien) {
    var lienElt = creerElementLien(lien);
    contenuElt.appendChild(lienElt);
});


//Affiche tous les liens dÃ©jÃ  enregistrÃ©s
window.addEventListener("load", function(){
    ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", function(reponse){
        //Transforme la reponse en tableau d'objets Javascript
        var liens = JSON.parse(reponse);
        //Affiche chaque lien dÃ©jÃ  enregistrÃ©
        liens.forEach(function(lien){
            var lienElt = creerElementLien(lien);
            contenuElt.insertBefore(lienElt, contenuElt.firstChild);
        });
    });
});
// CrÃ©e et renvoie un Ã©lÃ©ment DOM de type input
function creerElementInput(placeholder, taille) {
    var inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.setAttribute("size", taille);
    inputElt.setAttribute("required", "true");
    return inputElt;
}

var ajouterLienElt = document.getElementById("ajoutLien");
// GÃ¨re l'ajout d'un nouveau lien
ajouterLienElt.addEventListener("click", function () {
    var auteurElt = creerElementInput("Entrez votre nom", 20);
    var titreElt = creerElementInput("Entrez le titre du lien", 40);
    var urlElt = creerElementInput("Entrez l'URL du lien", 40);

    var ajoutElt = document.createElement("input");
    ajoutElt.type = "submit";
    ajoutElt.value = "Ajouter";

    var formAjoutElt = document.createElement("form");
    formAjoutElt.appendChild(auteurElt);
    formAjoutElt.appendChild(titreElt);
    formAjoutElt.appendChild(urlElt);
    formAjoutElt.appendChild(ajoutElt);

    var p = document.querySelector("p");
    // Remplace le bouton d'ajout par le formulaire d'ajout
    p.replaceChild(formAjoutElt, ajouterLienElt);

    // Ajoute le nouveau lien
    formAjoutElt.addEventListener("submit", function (e) {
        e.preventDefault(); // Annule la publication du formulaire
        
        var url = urlElt.value;
        // Si l'URL ne commence ni par "http://" ni par "https://"
        if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
            // On la prÃ©fixe par "http://"
            url = "http://" + url;
        }

        // CrÃ©ation de l'objet contenant les donnÃ©es du nouveau lien
        var lien = {
            titre: titreElt.value,
            url: url,
            auteur: auteurElt.value
        };
        
        //Envoi du lien au serveur
        var etat = ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", lien, function(reponse){
            var lienElt = creerElementLien(lien);
            // Ajoute le nouveau lien en haut de la liste
            contenuElt.insertBefore(lienElt, contenuElt.firstChild);
        },true);
        
        // Remplace le formulaire d'ajout par le bouton d'ajout
        p.replaceChild(ajouterLienElt, formAjoutElt);

        // CrÃ©ation du message d'information si l'jaout de donnÃ©e au serveur a rÃ©ussi
        if(etat){
           var infoElt = document.createElement("div");
           infoElt.classList.add("info");
           infoElt.textContent = "Le lien \"" + lien.titre + "\" a bien Ã©tÃ© ajoutÃ©.";
           p.insertBefore(infoElt, ajouterLienElt);
           // Suppresion du message aprÃ¨s 2 secondes
           setTimeout(function () {
             p.removeChild(infoElt);
           }, 2000); 
        }
    });
});
