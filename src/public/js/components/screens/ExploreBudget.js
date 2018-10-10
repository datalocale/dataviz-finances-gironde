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

import {
    m52ToAggregated,
    hierarchicalAggregated
} from "../../../../shared/js/finance/memoized";
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
                `Le contexte financier dans lequel s’est déroulée l’exécution de ce troisième budget de la mandature a été marqué par l’accentuation de la contribution des collectivités locales à la réduction des déficits publics et par une modification des compétences résultant de la mise en œuvre des transferts de compétences avec la Région et Bordeaux Métropole issus des lois MAPTAM de 2014 et NOTRe de 2015.

Dans un contexte national où les contraintes financières se sont durcies, l’année 2017 confirme le dynamisme des dépenses de solidarité obligatoires et incompressibles et la difficulté d’accentuer encore la maitrise des dépenses de gestion courante.

Le Département voit également ses recettes de fonctionnement évoluer plus favorablement que prévu grâce aux droits de mutation recette conjoncturelle mais non pérenne liée au fort dynamisme de l’immobilier et à l’attraction du département.

Ainsi les résultats financiers de la Gironde pour cet exercice se traduisent par :

-	Une épargne brute qui s’améliore fortement
-	Une réduction importante du besoin de financement par l’emprunt`
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
                `Les chiffres étant issus du compte administratif, la différence entre le montant des recettes et le montant des dépenses représente l'excédent de l'exercice.`
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
                        videoURL:
                            screenWidth <= 1000 ? animationVideo : undefined
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
            corrections,
            currentYear,
            textsById,
            screenWidth
        } = state;
        const m52Instruction = docBudgByYear.get(currentYear);
        const aggregated =
            m52Instruction &&
            corrections &&
            m52ToAggregated(m52Instruction, corrections);
        const hierAgg = m52Instruction && hierarchicalAggregated(aggregated);

        let totalById = new ImmutableMap();
        if (hierAgg) {
            flattenTree(hierAgg).forEach(aggHierNode => {
                totalById = totalById.set(aggHierNode.id, aggHierNode.total);
            });
        }

        return {
            currentYear,
            totalById,
            m52Instruction,
            labelsById: textsById.map(texts => texts.label),
            // All of this is poorly hardcoded. TODO: code proper formulas based on what was transmitted by CD33
            constructionAmounts: m52Instruction
                ? {
                      DotationEtat: totalById.get("RF-5"),
                      FiscalitéDirecte: totalById.get("RF-1"),
                      FiscalitéIndirecte: sum(
                          ["RF-2", "RF-3", "RF-4"].map(i => totalById.get(i))
                      ),
                      RecettesDiverses:
                          totalById.get("RF") -
                          sum(
                              ["RF-1", "RF-2", "RF-3", "RF-4", "RF-5"].map(i =>
                                  totalById.get(i)
                              )
                          ),

                      Solidarité: totalById.get("DF-1"),
                      Interventions: totalById.get("DF-3"),
                      DépensesStructure:
                          totalById.get("DF") -
                          sum(["DF-1", "DF-3"].map(i => totalById.get(i))),

                      Emprunt: totalById.get("RI-EM"),
                      RIPropre: totalById.get("RI") - totalById.get("RI-EM"),

                      RemboursementEmprunt: totalById.get("DI-EM"),
                      Routes: totalById.get("DI-1-2"),
                      Colleges: totalById.get("DI-1-1"),
                      Amenagement:
                          totalById.get("DI-1-3") +
                          totalById.get("DI-1-4") +
                          totalById.get("DI-1-5"),
                      Subventions: totalById.get("DI-2")
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
