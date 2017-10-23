export const COMPTE_ADMINISTRATIF = 'COMPTE_ADMINISTRATIF';

export const INSERTION_PICTO = "INSERTION_PICTO";
export const COLLEGE_PICTO = "COLLEGE_PICTO";
export const ENFANCE_PICTO = "ENFANCE_PICTO";
export const ENVIRONNEMENT_AMENAGEMENT_PICTO = "ENVIRONNEMENT_AMENAGEMENT_PICTO";
export const HANDICAPES_PICTO = "HANDICAPES_PICTO";
export const PATRIMOINE_PICTO = "PATRIMOINE_PICTO";
export const ROUTES_PICTO = "ROUTES_PICTO";
export const SOUTIEN_COMMUNES_PICTO = "SOUTIEN_COMMUNES_PICTO";
export const PERSONNES_AGEES_PICTO = "PERSONNES_AGEES_PICTO";
export const BONHOMME_PICTO = "BONHOMME_PICTO";

export const AGGREGATED_ATEMPORAL = "AGGREGATED_ATEMPORAL";
export const AGGREGATED_TEMPORAL = "AGGREGATED_TEMPORAL";
export const M52_FONCTION_ATEMPORAL = "M52_FONCTION_ATEMPORAL";
export const M52_FONCTION_TEMPORAL = "M52_FONCTION_TEMPORAL";

const env = process.env.NODE_ENV;

const GIRONDE_FR_DRUPAL_MEDIA_ID = "1938";

const prodYearToVariablePart = {
    2016: '0',
    2015: '1',
    2014: '2',
    2013: '3',
    2012: '4',
    // 2017: '???'
};

export const urls = {
    [COMPTE_ADMINISTRATIF]: {
        "production": (year => `/media/${GIRONDE_FR_DRUPAL_MEDIA_ID}/field_dataviz_files/${prodYearToVariablePart[year]}`),
        "demo": (year => `../data/finances/cedi_${year}_CA.csv`),
        get development(){return this.demo}
    }[env],
    [INSERTION_PICTO]: {
        "production": `/media/${GIRONDE_FR_DRUPAL_MEDIA_ID}/field_dataviz_files/8`,
        "demo": 'https://cdn.rawgit.com/datalocale/pictoGironde/master/Insertion.svg',
        get development(){return this.demo}
    }[env],
    [AGGREGATED_ATEMPORAL]: {
        "production": `/media/${GIRONDE_FR_DRUPAL_MEDIA_ID}/field_dataviz_files/18`,
        "demo": `../data/texts/aggregated-atemporal.csv`,
        get development(){return this.demo}
    }[env],
    [AGGREGATED_TEMPORAL]: {
        "production": `/media/${GIRONDE_FR_DRUPAL_MEDIA_ID}/field_dataviz_files/19`,
        "demo": `../data/texts/aggregated-temporal.csv`,
        get development(){return this.demo}
    }[env]
}

/*
/media/1938/field_dataviz_files/8 Insertion.svg
/media/1938/field_dataviz_files/9 Colleges.svg
/media/1938/field_dataviz_files/10 Enfance.svg
/media/1938/field_dataviz_files/11 EnvironnementAmenagement.svg
/media/1938/field_dataviz_files/12 Handicapes.svg
/media/1938/field_dataviz_files/13 Patrimoine.svg
/media/1938/field_dataviz_files/14 routes.svg
/media/1938/field_dataviz_files/15 SoutienCommunes.svg
/media/1938/field_dataviz_files/16 Personnesagees.svg
/media/1938/field_dataviz_files/17 bonhomme.svg

*/
