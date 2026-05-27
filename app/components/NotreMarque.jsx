"use client";

import "./NotreMarque.css";

export default function NotreMarque() {
    return (
        <section className="notre-marque">
            <div className="notre-marque__container">
                {/* Bloc texte */}
                <div className="notre-marque__content">
                    <h2 className="notre-marque__heading">
                        Pull lover, une marque, une histoire
                    </h2>

                    <div className="notre-marque__rich-text">
                        <p>
                            In the highlands of Madagascar, death arrives like quiet rain. Each ceremony tells a
                            story deeper than words. We understand that remembrance is not about ending, but
                            continuing. Our work bridges grief and healing, transforming pain into meaningful
                            connection. We do not simply manage loss. We celebrate the profound journey of
                            human experience.
                        </p>
                        <p>
                            In the highlands of Madagascar, death arrives like quiet rain. Each ceremony tells a
                            story deeper than words. We understand that remembrance is not about ending, but
                            continuing. Our work bridges grief and healing, transforming pain into meaningful
                            connection. We do not simply manage loss. We celebrate the profound journey of
                            human experience.
                        </p>
                        <p>
                            In the highlands of Madagascar, death arrives like quiet rain. Each ceremony tells a
                            story deeper than words. We understand that remembrance is not about ending, but
                            continuing. Our work bridges grief and healing, transforming pain into meaningful
                            connection. We do not simply manage loss. We celebrate the profound journey of
                            human experience.
                        </p>
                    </div>
                </div>

                {/* Bloc vidéo */}
                <div className="notre-marque__video-wrapper">
                    <video
                        className="notre-marque__video"
                        controls
                        preload="metadata"
                    >
                        <source
                            src="https://res.cloudinary.com/dewstflqp/video/upload/v1778740605/vid%C3%A9o_de_pr%C3%A9sentation_Ultramaille_jtpbab.mp4"
                            type="video/mp4"
                        />
                        Votre navigateur ne supporte pas la lecture vidéo.
                    </video>

                    {/* Bouton play superposé (masqué quand la vidéo est lancée via JS) */}
                    <button
                        className="notre-marque__play-btn"
                        aria-label="Lire la vidéo"
                        onClick={(e) => {
                            const video = e.currentTarget
                                .closest(".notre-marque__video-wrapper")
                                .querySelector("video");
                            video.play();
                            e.currentTarget.style.display = "none";
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 64 64"
                            fill="white"
                            width="56"
                            height="56"
                            aria-hidden="true"
                        >
                            <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.45)" />
                            <polygon points="26,20 48,32 26,44" fill="white" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}