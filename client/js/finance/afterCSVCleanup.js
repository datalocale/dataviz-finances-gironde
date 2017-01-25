/**
 * rows : array of objects.
 * Object keys are column names of 
 * https://www.datalocale.fr/dataset/comptes-administratifs-du-departement-de-la-gironde/resource/c32d35f0-3998-40c9-babe-b70af4576baa
 * 
 * This function should be the only one allowed to mutate the data acquired from the CSV file
 */
export default function(rows){
    rows.forEach(function(row){
        row["Montant"] = Number(row["Montant"]);
        
        if(row["Exercice"])
            row["Exercice"] = Number(row["Exercice"]);
        
        if(row["Année"])
            row["Exercice"] = Number(row["Année"]);
        
        row["Article"] = row["Article"].trim()
        row["Rubrique fonctionnelle"] = row["Rubrique fonctionnelle"].trim()
        row["Réel/Ordre id/Ordre diff"] = row["Réel/Ordre id/Ordre diff"].trim(); 

        Object.freeze(row);
    });

    return rows;
}