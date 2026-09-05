import { Link } from 'react-router-dom';

const updated = 'August 26, 2026';

export default function PrivacyPolicy() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-10 sm:mb-12">
        <p className="app-kicker uppercase tracking-widest mb-3">Legal</p>
        <h1 className="app-title mb-4 leading-tight">Privacy Policy</h1>
        <p className="app-muted">
          For the <strong className="font-semibold text-[var(--foreground)]">Mast Player</strong>{' '}
          mobile app and related web services at{' '}
          <a href="https://mastplayer.in" className="app-link underline underline-offset-2">
            mastplayer.in
          </a>
          .
        </p>
        <p className="mt-2 text-sm app-muted">Last updated: {updated}</p>
      </header>

      <div className="space-y-8 app-muted leading-relaxed">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            1. Overview
          </h2>
          <p>
            Mast Player is a video player that lets you browse and play videos stored on your
            device, and open shared video links from mastplayer.in. This policy explains what
            information we collect, how we use it, and your choices.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            2. Information we collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">Account details.</strong> When you register,
              we store your name, email address, and a hashed password so you can log in and
              manage your uploads.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Local media (on your device only).</strong> When
              you use the Local library in the app, we may request permission to access videos on
              your phone so you can browse folders and play them. Those files stay on your
              device; we do not upload your local library to our servers unless you separately
              upload a file while signed in.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Shared videos you upload.</strong> After you
              sign in and upload a video via our website, we store the file (and related metadata
              such as title, duration, thumbnail, owner account, and a share token) on our cloud
              storage so the share link can work. Your library lists only videos you uploaded.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Technical data.</strong> When you open a share
              link or use the API, our servers may receive standard request data (for example IP
              address, device/browser type, and timestamps) needed to deliver the service and
              keep it secure.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Public watch links.</strong> Anyone with a share
              link can watch that video without creating an account. Viewing a public link does
              not grant access to your private library.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            3. How we use information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To show and play videos you choose (local or shared).</li>
            <li>To create and serve shareable links for videos you upload.</li>
            <li>To operate, maintain, and improve the app and website.</li>
            <li>To protect against abuse, fraud, and technical issues.</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information. We do not use your local video library for
            advertising.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            4. Permissions
          </h2>
          <p className="mb-3">
            Depending on your platform, Mast Player may ask for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">Photos / media / storage</strong> — to list and
              play videos stored on your device.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Internet</strong> — to load shared videos and
              related metadata from our servers.
            </li>
          </ul>
          <p className="mt-3">
            You can deny or revoke permissions in your device settings. Without media access,
            local browsing will be limited; without internet, shared links will not load.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            5. Sharing &amp; third parties
          </h2>
          <p>
            Shared uploads are processed and stored using our hosting and cloud storage
            providers (for example API hosting and object storage) solely to provide the service.
            We do not share your data with third parties for their own marketing. Links you share
            with others will allow those people to view the uploaded video.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            6. Data retention
          </h2>
          <p>
            Local videos remain on your device under your control. Uploaded shared videos and
            their metadata are kept until you delete them through the website (where available)
            or until we remove them as part of service maintenance or abuse prevention.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            7. Children
          </h2>
          <p>
            Mast Player is not directed at children under 13. We do not knowingly collect personal
            information from children. If you believe a child has provided data through our
            services, contact us and we will take appropriate steps.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            8. Your choices
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Revoke media or related permissions in system settings.</li>
            <li>Stop using shared links or uninstall the app at any time.</li>
            <li>Delete uploaded videos from the Videos section on the website when available.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            9. Changes
          </h2>
          <p>
            We may update this Privacy Policy from time to time. The “Last updated” date at the
            top will change when we do. Continued use of Mast Player or mastplayer.in after an
            update means you accept the revised policy.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            10. Contact
          </h2>
          <p>
            Questions about this policy or Mast Player privacy practices:{' '}
            <a
              href="mailto:support@mastplayer.in"
              className="app-link underline underline-offset-2"
            >
              support@mastplayer.in
            </a>
            .
          </p>
        </section>
      </div>

      <p className="mt-12 pt-8 border-t border-[var(--border)] text-sm app-muted">
        <Link to="/" className="app-link font-medium">
          ← Back to Home
        </Link>
      </p>
    </article>
  );
}
