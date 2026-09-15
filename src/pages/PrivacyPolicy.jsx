import { Link } from 'react-router-dom';

const updated = 'September 15, 2026';

export default function PrivacyPolicy() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-10 sm:mb-12">
        <p className="app-kicker uppercase tracking-widest mb-3">Legal</p>
        <h1 className="app-title mb-4 leading-tight">Privacy Policy</h1>
        <p className="app-muted">
          For <strong className="font-semibold text-[var(--foreground)]">MastPlayer</strong>{' '}
          (&quot;MastPlayer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) — including our
          website at{' '}
          <a href="https://mastplayer.in" className="app-link underline underline-offset-2">
            mastplayer.in
          </a>
          , Creator Studio, APIs, and the Mast Player Android app (collectively, the
          &quot;Services&quot;).
        </p>
        <p className="mt-2 text-sm app-muted">Last updated: {updated}</p>
      </header>

      <div className="space-y-8 app-muted leading-relaxed">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            1. Introduction
          </h2>
          <p className="mb-3">
            This Privacy Policy explains how MastPlayer collects, uses, stores, shares, and
            protects information when you use the Services.
          </p>
          <p className="mb-3">
            MastPlayer provides tools that may allow users to browse videos stored on their
            device, upload and store videos, create share links, stream shared videos in the
            mobile app, manage a Creator Studio account, connect optional integrations (such as
            Telegram), and use related monetization features where available.
          </p>
          <p>
            By using MastPlayer, you acknowledge the practices described in this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            2. Information We Collect
          </h2>

          <h3 className="text-lg font-semibold text-[var(--foreground)] mt-4 mb-2">
            A. Account information
          </h3>
          <p className="mb-3">
            When you create or use a MastPlayer account, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Name / display name</li>
            <li>Email address</li>
            <li>Profile avatar (including when provided by Google Sign-In)</li>
            <li>Account identifiers and sign-in provider (email and/or Google)</li>
            <li>Hashed password (for email accounts — never stored as plain text)</li>
            <li>Optional social links you add to your profile</li>
            <li>Account preferences (for example, whether downloads are allowed for your videos)</li>
            <li>Referral codes you use or share, where applicable</li>
          </ul>
          <p className="mb-3">
            If you sign in with Google, we receive the Google account identifiers and profile
            details needed to authenticate you (such as Google subject ID, name, email, and
            profile picture), subject to your Google account settings.
          </p>

          <h3 className="text-lg font-semibold text-[var(--foreground)] mt-4 mb-2">
            B. User-uploaded content
          </h3>
          <p className="mb-3">
            When you upload or manage content through Creator Studio, we may process:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Video files and thumbnails</li>
            <li>Original file names, titles, categories, MIME type, size, and duration</li>
            <li>Share tokens and public share URLs</li>
            <li>Upload / processing status and storage keys</li>
            <li>View and payable-view counters associated with your uploads</li>
          </ul>
          <p className="mb-3">
            You retain applicable ownership rights in your content. Uploading content does not
            transfer copyright ownership to MastPlayer. See our{' '}
            <Link to="/dmca" className="app-link underline underline-offset-2">
              DMCA &amp; Copyright Policy
            </Link>{' '}
            for rights-holder procedures.
          </p>

          <h3 className="text-lg font-semibold text-[var(--foreground)] mt-4 mb-2">
            C. Local media on your device
          </h3>
          <p className="mb-3">
            The Android app may request permission to access videos or folders on your device so
            you can browse and play local media, save downloads, or use optional features such as
            WhatsApp Status Saver (which relies on a folder you explicitly select). Those local
            files stay on your device unless you separately upload them while signed in.
          </p>

          <h3 className="text-lg font-semibold text-[var(--foreground)] mt-4 mb-2">
            D. Information collected automatically
          </h3>
          <p className="mb-3">When you use MastPlayer, we may automatically process:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>
              Technical request data needed to operate the service (for example IP address at the
              network/server layer for delivery, security, and rate limiting)
            </li>
            <li>Browser or app User-Agent (limited length) on certain analytics events</li>
            <li>App version, platform (web/app), pages or screens involved in tracked events</li>
            <li>
              A MastPlayer-generated device identifier in the app used for view uniqueness and
              abuse prevention (stored on the device; not a hardware serial number)
            </li>
            <li>Video view / watch-progress heartbeats for shared videos played in the app</li>
            <li>
              Product analytics events such as link opens, play starts, store redirects, and ad
              lifecycle events
            </li>
            <li>Crash or performance signals available through the operating system or hosting
              platform (we do not currently operate a separate third-party crash SDK such as
              Firebase Crashlytics or Sentry)
            </li>
          </ul>
          <p>
            We do not currently store per-viewer country, city, referrer URL, or precise GPS
            location as fields in our application analytics database.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            3. Approximate Location
          </h2>
          <p className="mb-3">
            Network providers or infrastructure may see your IP address when you connect to
            MastPlayer. We may use IP-level information at the infrastructure layer for security,
            fraud prevention, rate limiting, and service reliability.
          </p>
          <p>
            Unless a MastPlayer feature specifically requests location permission and this policy
            is updated, MastPlayer does not collect precise GPS location from your device.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            4. How We Use Information
          </h2>
          <p className="mb-3">We may use collected information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create and manage accounts and authenticate users</li>
            <li>Upload, store, process, stream, and share videos</li>
            <li>Generate and resolve public share links</li>
            <li>Provide downloads in the app when a creator allows them</li>
            <li>Show Creator Studio dashboards, balances, and history</li>
            <li>Operate referrals, OG Earn remapping, and payout requests</li>
            <li>Provide optional Telegram publish integrations</li>
            <li>Display and measure advertisements in the mobile app</li>
            <li>Detect abuse, fraud, duplicate views, and policy violations</li>
            <li>Diagnose errors, improve performance, and develop features</li>
            <li>Send important service, security, and account-related notices</li>
            <li>Comply with law and enforce our policies</li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            5. Video Views and Analytics
          </h2>
          <p className="mb-3">
            For shared videos opened in the Mast Player app, we may record view sessions tied to
            your account&apos;s uploads, including watched seconds and whether a view counted for
            creator statistics or payout eligibility. Web watch pages primarily help users open
            the video in the app or install the app; counted playback analytics are designed
            around the mobile app experience.
          </p>
          <p className="mb-3">
            Creators may see aggregate statistics such as view counts. Analytics are not presented
            as identifying a specific individual viewer in Creator Studio.
          </p>
          <p>
            Separately, our website may use Vercel Analytics, and both web and app may send
            limited first-party funnel events (for example link open or ad events) to MastPlayer
            servers.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            6. Advertising
          </h2>
          <p className="mb-3">
            The Mast Player Android app may display advertisements through Google AdMob (and
            related Google Mobile Ads technologies). Depending on device settings, region, and
            Google&apos;s services, these technologies may process advertising identifiers, device
            information, IP address, app interactions, ad impressions/clicks, diagnostics, and
            similar data to deliver and measure ads.
          </p>
          <p className="mb-3">
            Advertising partners process information under their own privacy policies. You can
            manage certain advertising preferences in your device and Google settings.
          </p>
          <p>
            We do not sell your personal information. Local videos that remain only on your device
            are not uploaded for advertising targeting.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            7. Cookies and Similar Technologies
          </h2>
          <p className="mb-3">
            Our website and app may use browser storage, local storage, session storage, SDKs, and
            similar technologies for authentication, preferences, security, analytics, and
            advertising.
          </p>
          <p className="mb-3">Examples on the website today include:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Authentication token stored in local storage after login</li>
            <li>Theme preference in local storage</li>
            <li>Temporary referral codes in session storage during registration</li>
          </ul>
          <p>
            Third-party scripts that load on our pages (for example Google Identity Services or
            Vercel Analytics) may use their own cookies or similar technologies subject to their
            policies and applicable law.
          </p>
        </section>


        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            8. Public Sharing
          </h2>
          <p className="mb-3">
            MastPlayer allows creators to generate share links, for example:
          </p>
          <p className="mb-3">
            <code className="rounded bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 text-[var(--foreground)]">
              https://mastplayer.in/v/xxxxxxxx
            </code>
          </p>
          <p className="mb-3">
            Anyone with a public share link may be able to open the watch page and, through the
            app, access the associated video. Public responses may also include limited creator
            profile details you chose to publish (such as display name, avatar, social links, and
            download permission).
          </p>
          <p>
            MastPlayer cannot control how another person redistributes a link after receiving it.
            Do not upload or share confidential, sensitive, or unauthorized copyrighted material.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            9. Telegram and Other Integrations
          </h2>
          <p className="mb-3">
            If you connect Telegram through Creator Studio, we may store information needed for
            that integration, such as destination chat IDs, titles, usernames/types, member
            counts, bot permission status, publish settings, and publication history for videos
            you choose to post.
          </p>
          <p>
            We do not require or store your Telegram password for normal bot-based connections.
            Third-party services have their own privacy policies and terms.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            10. OG Earn, Referrals, and Payouts
          </h2>
          <p className="mb-3">
            Where enabled, MastPlayer may let you remap an existing MastPlayer share link (OG
            Earn), refer other users, and request payouts from available balances.
          </p>
          <p className="mb-3">
            For payouts, you may provide payment details such as UPI ID, account holder name, or
            bank account details. We store those details (and snapshots on payout requests) to
            process payments manually and keep records.
          </p>
          <p>
            Features that accept MastPlayer share tokens do not by themselves grant copyright or
            redistribution rights in the underlying media.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            11. How We Share Information
          </h2>
          <p className="mb-3">MastPlayer does not sell your personal information.</p>
          <p className="mb-3">We may share or disclose information in limited circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">Service providers</strong> — cloud
              storage, databases, hosting, analytics, advertising, authentication, and similar
              vendors needed to run MastPlayer.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">At your direction</strong> — for example
              when you create a public share link or publish to a connected Telegram destination.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Legal requirements</strong> — where
              required by applicable law, legal process, or lawful request.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Safety and security</strong> — to
              investigate fraud, abuse, security incidents, or policy violations.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Business transfers</strong> —
              information may transfer as part of a merger, acquisition, financing, or sale of
              assets, subject to applicable law.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            12. Content Moderation and Automated Processing
          </h2>
          <p>
            MastPlayer may use automated and manual systems to identify abuse, fraud, security
            threats, policy violations, and reported copyright infringement. Content or accounts
            may be restricted when flagged by our systems, reported by users or rights holders,
            or required by law. See our{' '}
            <Link to="/dmca" className="app-link underline underline-offset-2">
              DMCA &amp; Copyright Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            13. Data Retention
          </h2>
          <p className="mb-3">
            We retain personal information only as long as reasonably necessary to provide the
            Services, maintain security, resolve disputes, comply with legal obligations, and
            enforce our agreements.
          </p>
          <p>
            When content or an account is deleted, some information may remain temporarily in
            backups, logs, fraud-prevention systems, or legal records where required or permitted
            by law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            14. Account and Data Deletion
          </h2>
          <p className="mb-3">You can:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Delete individual uploaded videos from Creator Studio (which also removes related
              cloud objects where applicable)</li>
            <li>Disconnect Telegram destinations</li>
            <li>Update or remove profile fields and social links</li>
            <li>Delete locally downloaded files from the app on your device</li>
            <li>Revoke device media permissions or uninstall the app</li>
          </ul>
          <p>
            To request deletion of your MastPlayer account and associated personal information,
            contact{' '}
            <a
              href="mailto:support@mastplayer.in"
              className="app-link underline underline-offset-2"
            >
              support@mastplayer.in
            </a>
            . We will process reasonable requests subject to legal and security retention needs.
            (An in-app self-serve account-deletion control may be added in a future update.)
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            15. Data Security
          </h2>
          <p className="mb-3">
            MastPlayer uses reasonable technical and organizational measures intended to protect
            information, which may include HTTPS/TLS, password hashing, access controls,
            authentication tokens, restricted database access, and secure cloud infrastructure.
          </p>
          <p>No Internet service or storage system can guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            16. Children&apos;s Privacy
          </h2>
          <p className="mb-3">
            MastPlayer is not directed at children under 13, and Creator Studio content categories
            may include adult material. The Services are intended for users who meet the minimum
            age required by applicable law to use online services and adult content where
            relevant.
          </p>
          <p>
            We do not knowingly collect personal information from children in violation of
            applicable law. If you believe a child has provided personal information
            inappropriately, contact us so we can investigate and take appropriate action.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            17. International Processing
          </h2>
          <p>
            MastPlayer&apos;s infrastructure and service providers may process or store
            information in India or other countries. Information may therefore be processed
            outside your country of residence. Where required, we will take appropriate measures
            regarding international transfers.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            18. Your Privacy Rights
          </h2>
          <p className="mb-3">
            Depending on your location and applicable law, you may have rights to access, correct,
            or request deletion of personal information, withdraw certain consent, object to or
            restrict certain processing, manage advertising choices, or opt out of marketing
            communications.
          </p>
          <p>
            Submit requests to{' '}
            <a
              href="mailto:support@mastplayer.in"
              className="app-link underline underline-offset-2"
            >
              support@mastplayer.in
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            19. Third-Party Links
          </h2>
          <p>
            MastPlayer may contain links to third-party websites, apps, advertisements, or
            stores. We do not control third-party privacy practices. Review their policies before
            providing personal information to them.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            20. Copyright and Legal Requests
          </h2>
          <p>
            Information relating to reported content may be processed to investigate copyright
            complaints, legal requests, or policy violations. For copyright matters, see our{' '}
            <Link to="/dmca" className="app-link underline underline-offset-2">
              DMCA &amp; Copyright Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            21. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy when our products, technology, business practices,
            or legal obligations change. Material changes may be noticed through the website, app,
            email, or other appropriate means. The &quot;Last updated&quot; date above shows the
            most recent revision.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            22. Contact Us
          </h2>
          <ul className="list-none space-y-1 mb-3">
            <li>
              <strong className="text-[var(--foreground)]">Website:</strong>{' '}
              <a
                href="https://mastplayer.in"
                className="app-link underline underline-offset-2"
              >
                https://mastplayer.in
              </a>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Email:</strong>{' '}
              <a
                href="mailto:support@mastplayer.in"
                className="app-link underline underline-offset-2"
              >
                support@mastplayer.in
              </a>
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-12 pt-8 border-t border-[var(--border)] text-sm app-muted flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/" className="app-link font-medium">
          ← Back to Home
        </Link>
        <Link to="/dmca" className="app-link font-medium">
          DMCA / Copyright
        </Link>
      </p>
    </article>
  );
}
