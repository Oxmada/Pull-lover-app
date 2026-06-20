import { Eyebrow } from "./ui/Tag";
import "./ProcessSection.css";

const STEPS = [
    {
        num: "01",
        title: "Le produit est commandé",
        desc: "Choisissez votre article parmi notre collection et passez commande facilement depuis notre boutique en ligne.",
        icon: "/icons/process-01.svg",
    },
    {
        num: "02",
        title: "Fabrication du produit",
        desc: "Chaque pièce est confectionnée avec soin par nos artisans, en utilisant des matières de qualité sélectionnées avec attention.",
        icon: "/icons/process-02.svg",
    },
    {
        num: "03",
        title: "Préparation de la commande",
        desc: "Votre commande est soigneusement vérifiée, pliée et emballée dans un packaging éco-responsable avant expédition.",
        icon: "/icons/process-03.svg",
    },
    {
        num: "04",
        title: "Expédition de la commande",
        desc: "Votre colis est remis au transporteur et vous recevez un suivi en temps réel jusqu'à sa livraison chez vous.",
        icon: "/icons/process-04.svg",
    },
];

export default function ProcessSection() {
    return (
        <section className="process-section">
            <div className="process-inner">

                {/* En-tête */}
                <div className="process-header">
                    <Eyebrow>Notre processus</Eyebrow>
                    <h2 className="process-title">Comment ça fonctionne ?</h2>
                    <p className="process-subtitle">
                        De la commande à la livraison, nous prenons soin de chaque étape pour vous offrir une expérience unique et sans souci.
                    </p>
                </div>

                {/* Cartes */}
                <div className="process-grid">
                    {STEPS.map(({ num, title, desc, icon }) => (
                        <div className="process-card" key={title}>
                            <div className="process-card-top">
                                <span className="process-step-num">{num}</span>
                                <div className="process-card-icon">
                                    <img src={icon} alt="" aria-hidden="true" width={80} height={80} />
                                </div>
                            </div>
                            <div className="process-card-body">
                                <h3 className="process-card-title">{title}</h3>
                                <p className="process-card-desc">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}