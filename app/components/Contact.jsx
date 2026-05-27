"use client";

import { useState } from "react";
import "./Contact.css";

export default function Contact() {
    const [formData, setFormData] = useState({
        nom: "",
        mail: "",
        message: "",
    });
    const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
                setFormData({ nom: "", mail: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <section className="contact">
            <div className="contact__container">

                {/* ── Formulaire ── */}
                <div className="contact__form-side">
                    <h1 className="contact__heading">
                        Une question ?<br />Contactez nous !
                    </h1>
                    <p className="contact__subtext">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>

                    <form className="contact__form" onSubmit={handleSubmit} noValidate>
                        <div className="contact__field">
                            <label htmlFor="nom" className="contact__label">Nom complet</label>
                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                className="contact__input"
                                placeholder="Tom Wybo"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="contact__field">
                            <label htmlFor="mail" className="contact__label">Mail</label>
                            <input
                                id="mail"
                                name="mail"
                                type="email"
                                className="contact__input"
                                placeholder="tom.wybo@gmail.com"
                                value={formData.mail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="contact__field">
                            <label htmlFor="message" className="contact__label">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                className="contact__textarea"
                                placeholder="Écris ton message..."
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="contact__btn"
                            disabled={status === "loading"}
                        >
                            {status === "loading" ? "Envoi en cours..." : "Envoyer"}
                        </button>

                        {status === "success" && (
                            <p className="contact__feedback contact__feedback--success">
                                Message envoyé avec succès !
                            </p>
                        )}
                        {status === "error" && (
                            <p className="contact__feedback contact__feedback--error">
                                Une erreur est survenue. Réessaie plus tard.
                            </p>
                        )}
                    </form>
                </div>

                {/* ── Image Cloudinary ── */}
                <div className="contact__map-side">
                    <img
                        className="contact__map"
                        src="https://res.cloudinary.com/dewstflqp/image/upload/v1778833151/Pull-Lover_minimalist-indie-comicsty__mmweeg.jpg"
                        alt="Pull Lover"
                    />
                </div>

            </div>
        </section>
    );
}