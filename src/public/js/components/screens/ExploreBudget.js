import { Map as ImmutableMap } from "immutable";

import React from "react";
import { connect } from "react-redux";

import { sum } from "d3-array";

import {
    RF,
    RI,
    DF,
    DI,
    EXPENDITURES,
    REVENUE
} from "../../../../shared/js/finance/constants";


import { aggregatedDocumentBudgetaireNodeTotal } from '../../../../shared/js/finance/AggregationDataStructures.js'
import { flattenTree } from "../../../../shared/js/finance/visitHierarchical.js";

import PageTitle from "../../../../shared/js/components/gironde.fr/PageTitle";
import SecundaryTitle from "../../../../shared/js/components/gironde.fr/SecundaryTitle";
import DownloadSection from "../../../../shared/js/components/gironde.fr/DownloadSection";
import PrimaryCallToAction from "../../../../shared/js/components/gironde.fr/PrimaryCallToAction";

import Markdown from "../../../../shared/js/components/Markdown";
import MoneyAmount from "../../../../shared/js/components/MoneyAmount";

import { urls, ANIMATION_VIDEO } from "../../constants/resources";

import M52ByFonction from "../M52ByFonction";
import BudgetConstructionAnimation from "../BudgetConstructionAnimation";

const MAX_HEIGHT = 30;

export function TotalBudget({
    currentYear,
    totalById,
    m52Instruction,
    planDeCompte,
    labelsById,
    urls: {
        expenditures: expURL,
        revenue: revURL,
        rf,
        ri,
        df,
        di,
        byFonction,
        animationVideo
    },
    constructionAmounts,
    screenWidth
}) {
    const expenditures = totalById.get(EXPENDITURES);
    const revenue = totalById.get(REVENUE);

    const max = Math.max(expenditures, revenue);

    const expHeight = MAX_HEIGHT * (expenditures / max) + "em";
    const revHeight = MAX_HEIGHT * (revenue / max) + "em";

    const rfHeight = 100 * (totalById.get(RF) / revenue) + "%";
    const riHeight = 100 * (totalById.get(RI) / revenue) + "%";
    const diHeight = 100 * (totalById.get(DI) / expenditures) + "%";
    const dfHeight = 100 * (totalById.get(DF) / expenditures) + "%";

    return React.createElement(
        "article",
        { className: "explore-budget" },
        React.createElement(PageTitle, {
            text: `Exploration des comptes ${currentYear}`
        }),
        React.createElement(
            "section",
            {},
            React.createElement(
                Markdown,
                {},
                `L’année 2019 s’est inscrite dans un environnement financier contraint à la fois par la limitation de l’évolution des dépenses de fonctionnement à un maximum de 1.2% conformément à l’arrêté du Préfet en date du 17 septembre 2018 pris dans le cadre de l’article 29 de la loi de programmation des finances publiques 2018 2022 appelé aussi « Pacte de Cahors », mais également par la rigidité des dépenses sociales sous compensées par l’Etat et le renforcement de la péréquation.  
				  
				C’est donc dans ce contexte de mise sous contrainte de l’autonomie de gestion des collectivités locales et du renforcement des solidarités, que le Département de la Gironde a exécuté son budget 2019 qui traduit la permanence des engagements pris en début de mandat, à savoir :  
				  
				Une évolution des dépenses d’investissement afin d’atteindre le milliard d’euros en fin de mandature  
				Une épargne supérieure à 100M€  
				Un endettement limité  
				Des dépenses de fonctionnement maitrisées  `
            )
        ),

        React.createElement(
            "section",
            {},
            React.createElement(SecundaryTitle, {
                text: "Les grandes masses budgétaires du compte administratif"
            }),
            React.createElement(
                "div",
                { className: "viz" },
                React.createElement(
                    "div",
                    { className: "revenue" },
                    React.createElement(
                        "a",
                        { href: revURL },
                        React.createElement("h1", {}, "Recettes")
                    ),
                    React.createElement(
                        "div",
                        {},
                        React.createElement(
                            "div",
                            {
                                className: "areas",
                                style: { height: revHeight }
                            },
                            React.createElement(
                                "a",
                                {
                                    className: "rf",
                                    href: rf,
                                    style: { height: rfHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "Recettes de fonctionnement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(RF)
                                })
                            ),
                            React.createElement(
                                "a",
                                {
                                    className: "ri",
                                    href: ri,
                                    style: { height: riHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "Recettes d'investissement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(RI)
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "texts" },
                            React.createElement(MoneyAmount, {
                                amount: revenue
                            }),
                            React.createElement(PrimaryCallToAction, {
                                text: `Les recettes`,
                                href: revURL
                            })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "expenditures" },
                    React.createElement(
                        "a",
                        { href: expURL },
                        React.createElement("h1", {}, "Dépenses")
                    ),
                    React.createElement(
                        "div",
                        {},
                        React.createElement(
                            "div",
                            {
                                className: "areas",
                                style: { height: expHeight }
                            },
                            React.createElement(
                                "a",
                                {
                                    className: "df",
                                    href: df,
                                    style: { height: dfHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "Dépenses de fonctionnement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(DF)
                                })
                            ),
                            React.createElement(
                                "a",
                                {
                                    className: "di",
                                    href: di,
                                    style: { height: diHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "Dépenses d'investissement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(DI)
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "texts" },
                            React.createElement(MoneyAmount, {
                                amount: expenditures
                            }),
                            React.createElement(PrimaryCallToAction, {
                                text: `Les dépenses`,
                                href: expURL
                            })
                        )
                    )
                )
            ),
            React.createElement(
                Markdown,
                {},
                `Les chiffres étant issus du compte administratif, la différence entre le montant des recettes et le montant des dépenses représente l'excédent ou le déficit de l'exercice.`
            )
        ),
        React.createElement(
            "section",
            {},
            React.createElement(SecundaryTitle, {
                text: `Comprendre la construction d'un budget`
            }),
            React.createElement(
                Markdown,
                {},
                `Le budget prévoit la répartition des recettes et des dépenses sur un exercice. Il est composé de la section de fonctionnement et d’investissement. Contrairement à l’Etat, les Départements, ont l’obligation d’adopter un budget à l’équilibre. Toutefois, le compte administratif peut présenter sur l'exercice un résultat excédentaire ou déficitaire.`
            ),
            React.createElement(
                Markdown,
                {},
                `Dans un contexte particulièrement contraint, la préservation de nos équilibres financiers constitue un défi stimulant. Alors comment s’établit notre budget ?`
            ),
            React.createElement(
                BudgetConstructionAnimation,
                Object.assign(
                    {
                        videoURL: screenWidth <= 1000 ? animationVideo : undefined
                    },
                    constructionAmounts
                )
            )
        ),
        React.createElement(
            "section",
            { className: "m52" },
            React.createElement(SecundaryTitle, {
                text: "Les comptes par fonction (norme M52)"
            }),
            m52Instruction
                ? React.createElement(M52ByFonction, {
                    m52Instruction,
                    planDeCompte,
                    urlByFonction: byFonction,
                    labelsById,
                    screenWidth
                })
                : undefined,
            React.createElement(DownloadSection, {
                title: `Données brutes sur datalocale.fr`,
                items: [
                    {
                        text:
                            "Comptes administratifs du Département de la Gironde au format XML TOTEM",
                        url:
                            "https://www.datalocale.fr/dataset/comptes-administratifs-budget-principal-donnees-budgetaires-du-departement-de-la-gironde"
                    }
                ]
            })
        )
    );
}

export default connect(
    state => {
        const {
            docBudgByYear,
            aggregationByYear,
            planDeCompteByYear,
            currentYear,
            textsById,
            screenWidth
        } = state;

        const m52Instruction = docBudgByYear.get(currentYear);
        const aggregated = aggregationByYear.get(currentYear);
        const planDeCompte = planDeCompteByYear.get(currentYear)

        let totalById = new ImmutableMap();
        if (aggregated) {
            flattenTree(aggregated).forEach(aggNode => {
                totalById = totalById.set(aggNode.id, aggregatedDocumentBudgetaireNodeTotal(aggNode));
            });
        }

        return {
            currentYear,
            totalById,
            m52Instruction,
            planDeCompte,
            labelsById: textsById.map(texts => texts.label),
            // All of this is poorly hardcoded. TODO: code proper formulas based on what was transmitted by CD33
            constructionAmounts: aggregated ?
                {
                    DotationEtat: totalById.get("RF.5"),
                    FiscalitéDirecte: totalById.get("RF.1"),
                    FiscalitéIndirecte: sum(
                        ["RF.2", "RF.3", "RF.4"].map(i => totalById.get(i))
                    ),
                    RecettesDiverses:
                        totalById.get("RF") -
                        sum(
                            ["RF.1", "RF.2", "RF.3", "RF.4", "RF.5"].map(i =>
                                totalById.get(i)
                            )
                        ),

                    Solidarité: totalById.get("DF.1"),
                    Interventions: totalById.get("DF.3"),
                    DépensesStructure:
                        totalById.get("DF") -
                        sum(["DF.1", "DF.3"].map(i => totalById.get(i))),

                    Emprunt: totalById.get("RI.EM"),
                    RIPropre: totalById.get("RI") - totalById.get("RI.EM"),

                    RemboursementEmprunt: totalById.get("DI.EM"),
                    Routes: totalById.get("DI.1.2"),
                    Colleges: totalById.get("DI.1.1"),
                    Amenagement:
                        totalById.get("DI.1.3") +
                        totalById.get("DI.1.4") +
                        totalById.get("DI.1.5"),
                    Subventions: totalById.get("DI.2")
                }
                : undefined,
            urls: {
                expenditures: "#!/finance-details/" + EXPENDITURES,
                revenue: "#!/finance-details/" + REVENUE,
                rf: "#!/finance-details/" + RF,
                ri: "#!/finance-details/" + RI,
                df: "#!/finance-details/" + DF,
                di: "#!/finance-details/" + DI,
                byFonction: {
                    "M52-DF-0": `#!/finance-details/M52-DF-0`,
                    "M52-DF-1": `#!/finance-details/M52-DF-1`,
                    "M52-DF-2": `#!/finance-details/M52-DF-2`,
                    "M52-DF-3": `#!/finance-details/M52-DF-3`,
                    "M52-DF-4": `#!/finance-details/M52-DF-4`,
                    "M52-DF-5": `#!/finance-details/M52-DF-5`,
                    "M52-DF-6": `#!/finance-details/M52-DF-6`,
                    "M52-DF-7": `#!/finance-details/M52-DF-7`,
                    "M52-DF-8": `#!/finance-details/M52-DF-8`,
                    "M52-DF-9": `#!/finance-details/M52-DF-9`,
                    "M52-DI-0": `#!/finance-details/M52-DI-0`,
                    "M52-DI-1": `#!/finance-details/M52-DI-1`,
                    "M52-DI-2": `#!/finance-details/M52-DI-2`,
                    "M52-DI-3": `#!/finance-details/M52-DI-3`,
                    "M52-DI-4": `#!/finance-details/M52-DI-4`,
                    "M52-DI-5": `#!/finance-details/M52-DI-5`,
                    "M52-DI-6": `#!/finance-details/M52-DI-6`,
                    "M52-DI-7": `#!/finance-details/M52-DI-7`,
                    "M52-DI-8": `#!/finance-details/M52-DI-8`,
                    "M52-DI-9": `#!/finance-details/M52-DI-9`
                },
                animationVideo: urls[ANIMATION_VIDEO]
            },
            screenWidth
        };
    },
    () => ({})
)(TotalBudget);
