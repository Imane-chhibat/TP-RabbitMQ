class Film {
    constructor(id_film,titre,duree,lienTelechargement,date_projection){
        this.id_film=id_film;
        this.titre=titre;
        this.duree=duree;
        this.lienTelechargement=lienTelechargement;
        this.date_projection=date_projection;
    }
}

module.exports=Film;