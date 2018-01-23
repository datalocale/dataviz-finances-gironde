
/**
 * rows : array of objects.
 * Object keys are column names of 
 * https://datacat.datalocale.fr/file/1242019/raw/cedi_2015_CA.csv
 * 
 * This function should be the only one allowed to mutate the data acquired from the CSV file
 */
export function cleanup(rows){
    rows = rows.filter(r => r['Type nomenclature'] === 'M52');

    rows.forEach(function(row){
        row["Montant"] = Number(row["Montant"]);
        
        // Gironde convention
        if(row["Exercice"])
            row["Exercice"] = Number(row["Exercice"]);
        
        // Haut-De-Seine convention
        if(row["Année"])
            row["Exercice"] = Number(row["Année"]);
        
        row["Article"] = row["Article"].trim();
        row["Rubrique fonctionnelle"] = row["Rubrique fonctionnelle"].trim();
        row["Réel/Ordre id/Ordre diff"] = row["Réel/Ordre id/Ordre diff"].trim(); 

        Object.freeze(row);
    });

    return rows;
}
