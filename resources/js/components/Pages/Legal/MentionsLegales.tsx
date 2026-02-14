import React from 'react';
import LegalLayout from './LegalLayout';

const MentionsLegales: React.FC = () => (
    <LegalLayout title="Mentions légales" lastUpdated="14 février 2026">
        <h2>1. Éditeur du site</h2>
        <p>
            Le site <strong>Rémuzat</strong> (ci-après « le Site ») est édité par :
        </p>
        <ul>
            <li><strong>Nom :</strong> Anthony Barei</li>
            <li><strong>Email :</strong> <a href="mailto:contact@anthonybarei.fr">contact@anthonybarei.fr</a></li>
            <li><strong>Site web :</strong> <a href="https://anthonybarei.fr" target="_blank" rel="noopener noreferrer">anthonybarei.fr</a></li>
        </ul>

        <h2>2. Hébergement</h2>
        <p>
            Le Site est hébergé par un prestataire d'hébergement web dont les coordonnées
            sont disponibles sur demande à l'adresse email ci-dessus.
        </p>

        <h2>3. Propriété intellectuelle</h2>
        <p>
            L'ensemble du contenu du Site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.)
            est la propriété exclusive de l'éditeur, sauf mention contraire. Toute reproduction, représentation,
            modification, publication, adaptation de tout ou partie des éléments du Site, quel que soit le moyen
            ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l'éditeur.
        </p>

        <h2>4. Limitation de responsabilité</h2>
        <p>
            L'éditeur ne pourra être tenu responsable des dommages directs et indirects causés au matériel
            de l'utilisateur lors de l'accès au Site. L'éditeur décline toute responsabilité quant à
            l'utilisation qui pourrait être faite des informations et contenus présents sur le Site.
        </p>

        <h2>5. Liens hypertextes</h2>
        <p>
            Le Site peut contenir des liens hypertextes vers d'autres sites. L'éditeur n'exerce aucun contrôle
            sur le contenu de ces sites tiers et n'assume aucune responsabilité quant à leur contenu.
        </p>

        <h2>6. Droit applicable</h2>
        <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige,
            les tribunaux français seront seuls compétents.
        </p>

        <h2>7. Contact</h2>
        <p>
            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter
            à l'adresse : <a href="mailto:contact@anthonybarei.fr">contact@anthonybarei.fr</a>
        </p>
    </LegalLayout>
);

export default MentionsLegales;
