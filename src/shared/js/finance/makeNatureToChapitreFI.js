export default function(plansDeCompte){
    const dataByExer = new Map();

    for(const pc of plansDeCompte){
        const exer = Number(pc.getElementsByTagName('Nomenclature')[0].getAttribute('Exer'))

        const chapitreCodeByNatureR = new Map()
        const chapitreCodeByNatureD = new Map()

        const FIByChapitreCode = new Map()

        Array.from(pc.getElementsByTagName('Compte')).forEach(c => {
            const code = c.getAttribute('Code');

            if(!chapitreCodeByNatureR.has(code))
                chapitreCodeByNatureR.set(code, c.getAttribute('RR'))
            
            if(!chapitreCodeByNatureD.has(code))
                chapitreCodeByNatureD.set(code, c.getAttribute('DR'))
        })
        Array.from(pc.getElementsByTagName('Chapitre')).map(c => {
            const code = c.getAttribute('Code');
            
            if(!FIByChapitreCode.has(code))
                FIByChapitreCode.set(code, c.getAttribute('Section'))
        })

        dataByExer.set(exer, {
            chapitreCodeByNatureR,
            chapitreCodeByNatureD,
            FIByChapitreCode
        })
    }

    const exers = Array.from(dataByExer.keys())
    const minExer = Math.min(...exers);

    return function(exer, RD, nature){
        if(exer < minExer)
            exer = minExer;

        const { chapitreCodeByNatureR, chapitreCodeByNatureD, FIByChapitreCode } = dataByExer.get(exer);
        const chapitreCodeByNature = RD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
        const chapitreCode = chapitreCodeByNature.get(nature);

        if(!chapitreCode)
            console.warn('No chapitreCode for', RD, nature);

        const FI = FIByChapitreCode.get(chapitreCode)

        if(!FI)
            console.warn('No FI (section) for', RD, nature, chapitreCode);

        return {
            FI,
            Chapitre: chapitreCode
        }
    }

}