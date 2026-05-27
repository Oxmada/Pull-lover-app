"use client";

import "./LifeStyleSection.css";

export default function LifeStyleSection() {
    return (
        <section className="lifestyle-section">
            <div className="lifestyle-inner">

                <div className="lifestyle-band">

                    {/* Texte à gauche */}
                    <div className="lifestyle-band-text">
                        <h2 className="lifestyle-title">Soyez vous-même&nbsp;!</h2>
                        <p className="lifestyle-subtitle">
                            Ego vero sic intellego. Patres conscripti, nos hoc tempore in
                            provinciis decernendis perpetuae pacis habere oportere rationem.
                        </p>
                    </div>

                    {/* Image unique à droite */}
                    <div className="lifestyle-band-img">
                        <img
                            src="https://res.cloudinary.com/dewstflqp/image/upload/v1778675682/pull-lover_femme_marche_sable_ayvfis.jpg"
                            alt="Femme marchant sur la plage"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
}