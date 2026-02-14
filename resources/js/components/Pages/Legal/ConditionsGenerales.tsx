import React from 'react';
import LegalLayout from './LegalLayout';

const ConditionsGenerales: React.FC = () => (
    <LegalLayout title="Conditions générales d'utilisation" lastUpdated="14 février 2026">
        <h2>1. Objet</h2>
        <p>
            Les présentes conditions générales d'utilisation (ci-après « CGU ») ont pour objet de définir
            les modalités et conditions d'utilisation du site <strong>Rémuzat</strong> (ci-après « le Site »),
            ainsi que les droits et obligations des utilisateurs.
        </p>

        <h2>2. Acceptation des CGU</h2>
        <p>
            L'accès et l'utilisation du Site impliquent l'acceptation pleine et entière des présentes CGU.
            Si vous n'acceptez pas ces conditions, vous êtes invité à ne pas utiliser le Site.
        </p>

        <h2>3. Inscription et compte utilisateur</h2>
        <h3>3.1 Création de compte</h3>
        <p>
            L'accès à certaines fonctionnalités du Site (notamment la réservation) nécessite la création
            d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes et à jour.
        </p>
        <h3>3.2 Validation du compte</h3>
        <p>
            Après inscription, votre compte peut être soumis à une validation par email et/ou par
            un administrateur. L'accès aux fonctionnalités de réservation n'est effectif qu'après
            validation complète du compte.
        </p>
        <h3>3.3 Sécurité du compte</h3>
        <p>
            L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.
            Toute activité réalisée depuis son compte est réputée effectuée par lui.
        </p>

        <h2>4. Réservations</h2>
        <h3>4.1 Processus de réservation</h3>
        <p>
            Les réservations effectuées via le Site sont soumises à validation par l'administrateur.
            Une réservation n'est confirmée qu'après approbation explicite.
        </p>
        <h3>4.2 Modification et annulation</h3>
        <p>
            L'utilisateur peut demander la modification ou l'annulation d'une réservation en contactant
            l'administrateur. Les conditions d'annulation peuvent varier selon la période de séjour
            et le délai avant la date d'arrivée.
        </p>

        <h2>5. Obligations de l'utilisateur</h2>
        <p>L'utilisateur s'engage à :</p>
        <ul>
            <li>Utiliser le Site conformément à sa destination</li>
            <li>Ne pas tenter d'accéder à des fonctionnalités non autorisées</li>
            <li>Respecter les droits de propriété intellectuelle de l'éditeur</li>
            <li>Ne pas utiliser le Site à des fins illicites ou frauduleuses</li>
            <li>Fournir des informations exactes lors de l'inscription et des réservations</li>
        </ul>

        <h2>6. Disponibilité du Site</h2>
        <p>
            L'éditeur s'efforce de maintenir le Site accessible 24h/24 et 7j/7. Toutefois, l'accès
            au Site peut être temporairement suspendu pour des raisons de maintenance, de mise à jour
            ou pour toute autre raison technique, sans préavis ni indemnité.
        </p>

        <h2>7. Responsabilité</h2>
        <p>
            L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant
            de l'utilisation ou de l'impossibilité d'utiliser le Site. Les informations présentées
            sur le Site sont fournies à titre indicatif et ne sauraient engager la responsabilité de l'éditeur.
        </p>

        <h2>8. Modification des CGU</h2>
        <p>
            L'éditeur se réserve le droit de modifier les présentes CGU à tout moment.
            Les modifications entrent en vigueur dès leur publication sur le Site.
            L'utilisation continue du Site après modification vaut acceptation des nouvelles CGU.
        </p>

        <h2>9. Droit applicable et juridiction</h2>
        <p>
            Les présentes CGU sont régies par le droit français. En cas de litige relatif
            à l'interprétation ou à l'exécution des présentes, les parties s'efforceront de
            trouver une solution amiable. À défaut, les tribunaux français seront seuls compétents.
        </p>

        <h2>10. Contact</h2>
        <p>
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter
            à l'adresse : <a href="mailto:contact@anthonybarei.fr">contact@anthonybarei.fr</a>
        </p>
    </LegalLayout>
);

export default ConditionsGenerales;
