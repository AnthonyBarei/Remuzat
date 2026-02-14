import React from 'react';
import LegalLayout from './LegalLayout';

const PolitiqueConfidentialite: React.FC = () => (
    <LegalLayout title="Politique de confidentialité" lastUpdated="14 février 2026">
        <h2>1. Introduction</h2>
        <p>
            La présente politique de confidentialité décrit comment <strong>Rémuzat</strong> (ci-après « nous »)
            collecte, utilise et protège les informations personnelles des utilisateurs du Site.
            Nous nous engageons à respecter votre vie privée conformément au Règlement Général sur
            la Protection des Données (RGPD).
        </p>

        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes dans le cadre de l'utilisation du Site :</p>
        <ul>
            <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
            <li><strong>Données de réservation :</strong> dates de séjour, préférences</li>
            <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages consultées</li>
        </ul>

        <h2>3. Finalités du traitement</h2>
        <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
        <ul>
            <li>Gestion des réservations et des séjours</li>
            <li>Création et gestion de votre compte utilisateur</li>
            <li>Communication relative à vos réservations</li>
            <li>Amélioration de nos services et du Site</li>
        </ul>

        <h2>4. Base légale</h2>
        <p>
            Le traitement de vos données est fondé sur l'exécution du contrat de réservation
            et votre consentement pour les communications optionnelles.
        </p>

        <h2>5. Durée de conservation</h2>
        <p>
            Vos données personnelles sont conservées pendant la durée nécessaire à la réalisation
            des finalités pour lesquelles elles ont été collectées, et au maximum 3 ans après
            votre dernière activité sur le Site.
        </p>

        <h2>6. Partage des données</h2>
        <p>
            Vos données personnelles ne sont pas vendues, échangées ou louées à des tiers.
            Elles peuvent être partagées uniquement avec les prestataires techniques nécessaires
            au fonctionnement du Site (hébergeur, service email).
        </p>

        <h2>7. Sécurité</h2>
        <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
            protéger vos données personnelles contre tout accès non autorisé, perte, altération
            ou divulgation.
        </p>

        <h2>8. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
            <li><strong>Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées et en obtenir une copie</li>
            <li><strong>Droit de rectification :</strong> demander la correction de données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
        </ul>
        <p>
            Pour exercer ces droits, contactez-nous à :
            <a href="mailto:contact@anthonybarei.fr"> contact@anthonybarei.fr</a>
        </p>

        <h2>9. Cookies</h2>
        <p>
            Le Site utilise des cookies techniques nécessaires à son fonctionnement (authentification, session).
            Aucun cookie publicitaire ou de suivi n'est utilisé.
        </p>

        <h2>10. Modifications</h2>
        <p>
            Nous nous réservons le droit de modifier la présente politique à tout moment.
            Les modifications entrent en vigueur dès leur publication sur le Site.
        </p>
    </LegalLayout>
);

export default PolitiqueConfidentialite;
