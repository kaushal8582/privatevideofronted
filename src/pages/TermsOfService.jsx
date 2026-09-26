import { Link } from 'react-router-dom';

const updated = 'September 26, 2026';
const SUPPORT_EMAIL = 'support@mastplayer.in';
const COPYRIGHT_EMAIL = 'support@mastplayer.in';

export default function TermsOfService() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-10 sm:mb-12">
        <p className="app-kicker uppercase tracking-widest mb-3">Legal</p>
        <h1 className="app-title mb-4 leading-tight">Terms of Service</h1>
        <p className="app-muted">
          For <strong className="font-semibold text-[var(--foreground)]">MastPlayer</strong> —
          including our website, Creator Studio, mobile application, Telegram bots, and related
          services (collectively, the &quot;Services&quot;).
        </p>
        <p className="mt-2 text-sm app-muted">Last updated: {updated}</p>
      </header>

      <div className="space-y-8 app-muted leading-relaxed">
        <section>
          <p>
            Welcome to MastPlayer. By accessing or using the MastPlayer website, mobile
            application, Telegram bot, or related services (&quot;Services&quot;), you agree to
            these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            1. Use of Services
          </h2>
          <p className="mb-3">
            MastPlayer provides tools that may allow users to upload, store, watch, manage and
            share videos, create shareable links, use supported link-conversion features, connect
            Telegram groups/channels, automatically publish supported content to Telegram, and
            access monetization features.
          </p>
          <p>
            You agree to use MastPlayer only for lawful purposes and in accordance with these
            Terms.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            2. User Accounts
          </h2>
          <p className="mb-3">
            You are responsible for maintaining the security of your MastPlayer account and login
            credentials.
          </p>
          <p className="mb-3">
            You are responsible for activity performed through your account.
          </p>
          <p>
            You must not create or use accounts for fraud, abuse, impersonation, monetization
            manipulation, or to bypass account restrictions.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            3. User Content
          </h2>
          <p className="mb-3">You retain ownership of content you upload to MastPlayer.</p>
          <p className="mb-3">
            By uploading content, you give MastPlayer permission to host, store, process, stream
            and display that content as necessary to provide the Services.
          </p>
          <p className="mb-3">
            You are solely responsible for your uploaded or shared content.
          </p>
          <p className="mb-3">
            You must have the necessary ownership, permission, license, or legal rights to upload,
            share or monetize any content through MastPlayer.
          </p>
          <p>MastPlayer does not claim ownership of your User Content.</p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            4. Prohibited Content &amp; Activities
          </h2>
          <p className="mb-3">
            You may not use MastPlayer to upload, share, distribute or promote:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Copyrighted content you do not have permission to use</li>
            <li>Illegal content</li>
            <li>Fraudulent, deceptive or scam content</li>
            <li>Malware, phishing or malicious files</li>
            <li>Content violating another person&apos;s privacy or rights</li>
            <li>Child sexual abuse material or sexual exploitation of minors</li>
            <li>Content prohibited by applicable law</li>
          </ul>
          <p>
            You must not attack, exploit, disrupt, scrape abusively, bypass security controls, or
            misuse MastPlayer systems.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            5. Shareable Links
          </h2>
          <p className="mb-3">MastPlayer may allow users to create shareable links.</p>
          <p className="mb-3">
            Anyone who receives a public/shareable link may be able to access the associated
            content.
          </p>
          <p>
            You are responsible for deciding where and with whom you share your links.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            6. MastPlayer Link Converter
          </h2>
          <p className="mb-3">
            MastPlayer may provide a Link Converter that converts or associates supported
            MastPlayer links with a user&apos;s MastPlayer account or supported earning features.
          </p>
          <p className="mb-3">
            The Link Converter does not transfer ownership or copyright of content.
          </p>
          <p>
            Users must not use this feature for fraud, impersonation, copyright infringement,
            deceptive links, or earnings manipulation.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            7. Telegram Integration
          </h2>
          <p className="mb-3">
            MastPlayer may allow users to connect supported Telegram groups or channels and
            automatically publish supported content to those Telegram destinations.
          </p>
          <p className="mb-3">
            You must have permission to manage and publish content to any Telegram group or
            channel you connect.
          </p>
          <p>
            MastPlayer is not responsible for Telegram outages, API restrictions, account
            restrictions, or changes made by Telegram.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            8. Advertisements
          </h2>
          <p className="mb-3">
            MastPlayer may display third-party advertisements on its website, applications,
            videos, pages or shared links.
          </p>
          <p className="mb-3">
            MastPlayer is not responsible for third-party advertisements, products or services.
          </p>
          <p>
            Your dealings with advertisers or third-party services are between you and those
            third parties.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            9. Earnings &amp; Monetization
          </h2>
          <p className="mb-3">
            MastPlayer may provide eligible users with earning opportunities through advertising,
            OG Earn, views, links or other monetization programs.
          </p>
          <p className="mb-3">
            MastPlayer <strong className="text-[var(--foreground)]">does not</strong> guarantee
            any specific income, CPM, views, advertisements or earnings.
          </p>
          <p className="mb-3">
            Earnings may depend on factors such as legitimate traffic, viewer location, advertiser
            demand, ad availability and market conditions.
          </p>
          <p>
            Dashboard earnings may be estimated and may be adjusted before final payment.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            10. Invalid Traffic &amp; Fraud
          </h2>
          <p className="mb-3">The following activities are prohibited:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Bot or automated views</li>
            <li>Fake clicks or impressions</li>
            <li>Artificial traffic</li>
            <li>Repeated activity intended to increase earnings</li>
            <li>Manipulating location using VPNs/proxies for earning purposes</li>
            <li>Multiple accounts used to bypass restrictions</li>
            <li>Any attempt to manipulate MastPlayer earnings</li>
          </ul>
          <p>
            MastPlayer may remove invalid earnings, hold withdrawals, restrict monetization,
            suspend accounts or terminate accounts when fraudulent or invalid activity is
            detected.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            11. Payments &amp; Withdrawals
          </h2>
          <p className="mb-3">
            Users may request withdrawals when they meet the applicable eligibility and minimum
            payout requirements shown by MastPlayer.
          </p>
          <p className="mb-3">
            Withdrawal requests may be reviewed for fraud, invalid traffic and policy violations.
          </p>
          <p className="mb-3">
            MastPlayer may temporarily hold or delay payments while investigating suspicious
            activity.
          </p>
          <p>
            Users are responsible for providing correct payment information and handling
            applicable taxes unless otherwise required by law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            12. Copyright
          </h2>
          <p className="mb-3">MastPlayer respects intellectual property rights.</p>
          <p className="mb-3">
            Do not upload, share or monetize copyrighted material unless you have permission or
            another lawful right to do so.
          </p>
          <p className="mb-3">
            MastPlayer may remove or disable content after receiving a valid copyright complaint.
          </p>
          <p className="mb-3">
            Repeat copyright infringement may result in account suspension or termination.
          </p>
          <p>
            Copyright complaints should be submitted according to the MastPlayer{' '}
            <Link to="/dmca" className="app-link underline underline-offset-2">
              Copyright / DMCA Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            13. Content Removal
          </h2>
          <p className="mb-3">MastPlayer may remove or restrict content that:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Violates these Terms</li>
            <li>Violates applicable law</li>
            <li>Infringes copyright or other rights</li>
            <li>Is connected to fraud or abuse</li>
            <li>Creates security risks</li>
            <li>Is subject to valid legal or governmental requests</li>
          </ul>
          <p>
            MastPlayer is not required to manually review every piece of content uploaded by
            users.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            14. Child Safety
          </h2>
          <p className="mb-3">
            MastPlayer has zero tolerance for child sexual abuse material (CSAM) or sexual
            exploitation of minors.
          </p>
          <p>
            Such content may be immediately removed, associated accounts may be terminated, and
            information may be reported to appropriate authorities when required by law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            15. Account Suspension or Termination
          </h2>
          <p className="mb-3">
            MastPlayer may suspend, restrict or terminate accounts that violate these Terms,
            engage in fraud, abuse the Services, infringe third-party rights or violate
            applicable law.
          </p>
          <p>
            Serious fraud, security threats, illegal activity or child-safety violations may
            result in immediate termination.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            16. Service Availability
          </h2>
          <p className="mb-3">
            MastPlayer does not guarantee uninterrupted or error-free service.
          </p>
          <p className="mb-3">
            Features may occasionally be unavailable because of maintenance, technical problems,
            third-party services or other circumstances.
          </p>
          <p className="mb-3">
            MastPlayer may add, modify or discontinue features when necessary.
          </p>
          <p>Users should maintain their own backups of important content.</p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            17. Limitation of Liability
          </h2>
          <p className="mb-3">
            To the fullest extent permitted by applicable law, MastPlayer is provided &quot;AS
            IS&quot; and &quot;AS AVAILABLE.&quot;
          </p>
          <p>
            MastPlayer is not responsible for indirect or consequential losses resulting from use
            of the Services, third-party services, service interruptions, unauthorized sharing by
            users, or loss of data, except where liability cannot legally be excluded.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            18. Privacy
          </h2>
          <p className="mb-3">
            Use of personal information is governed by the MastPlayer{' '}
            <Link to="/privacy" className="app-link underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            By using MastPlayer, you acknowledge that you have reviewed the applicable Privacy
            Policy.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            19. Changes to Terms
          </h2>
          <p className="mb-3">
            MastPlayer may update these Terms to reflect changes to its Services, monetization
            programs, security requirements, third-party integrations or applicable laws.
          </p>
          <p>
            Continued use of MastPlayer after updated Terms become effective constitutes
            acceptance of the revised Terms, subject to applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            20. Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of India, subject to any mandatory rights
            provided under applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            21. Contact
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">Website:</strong>{' '}
              <a
                href="https://mastplayer.com"
                className="app-link underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                https://mastplayer.com
              </a>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Support:</strong>{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="app-link underline underline-offset-2"
              >
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Copyright / DMCA:</strong>{' '}
              <a
                href={`mailto:${COPYRIGHT_EMAIL}?subject=Copyright%20%2F%20DMCA`}
                className="app-link underline underline-offset-2"
              >
                {COPYRIGHT_EMAIL}
              </a>{' '}
              (
              <Link to="/dmca" className="app-link underline underline-offset-2">
                DMCA policy
              </Link>
              )
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            22. Acceptance
          </h2>
          <p className="mb-3">
            By creating an account or accessing or using MastPlayer, you acknowledge that you have
            read, understood and agreed to these Terms of Service.
          </p>
          <p>If you do not agree with these Terms, please do not use MastPlayer.</p>
        </section>

        <p className="text-sm pt-2">© 2026 MastPlayer. All rights reserved.</p>
      </div>

      <p className="mt-12 pt-8 border-t border-[var(--border)] text-sm app-muted flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/" className="app-link font-medium">
          ← Back to Home
        </Link>
        <Link to="/privacy" className="app-link font-medium">
          Privacy Policy
        </Link>
        <Link to="/dmca" className="app-link font-medium">
          DMCA / Copyright
        </Link>
      </p>
    </article>
  );
}
