import { Link } from 'react-router-dom';

const updated = 'September 15, 2026';

export default function DmcaPolicy() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-10 sm:mb-12">
        <p className="app-kicker uppercase tracking-widest mb-3">Legal</p>
        <h1 className="app-title mb-4 leading-tight">DMCA &amp; Copyright Policy</h1>
        <p className="app-muted">
          For the <strong className="font-semibold text-[var(--foreground)]">MastPlayer</strong>{' '}
          platform and related web services at{' '}
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
            1. Copyright Policy
          </h2>
          <p className="mb-3">
            MastPlayer respects the intellectual property rights of copyright owners and expects
            all users of the platform to do the same.
          </p>
          <p className="mb-3">
            MastPlayer provides technology that allows users to upload, store, stream, manage, and
            share digital content. Users are solely responsible for ensuring that they have the
            necessary ownership, licenses, permissions, or other legal rights to upload and share
            content through MastPlayer.
          </p>
          <p className="mb-3">
            Users must not upload, store, distribute, stream, or share copyrighted material without
            authorization from the applicable rights holder.
          </p>
          <p>
            MastPlayer may remove or disable access to content when we receive a valid copyright
            infringement complaint or otherwise determine that content violates our policies.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            2. User-Uploaded Content
          </h2>
          <p className="mb-3">
            Content available through MastPlayer may be uploaded or shared by users of the
            platform.
          </p>
          <p className="mb-3">
            MastPlayer does not claim ownership of content uploaded by users. Users retain their
            applicable ownership rights while granting MastPlayer the limited rights necessary to
            store, process, transmit, display, stream, and otherwise provide the requested
            services.
          </p>
          <p className="mb-3">
            Uploading content to MastPlayer does not transfer copyright ownership to MastPlayer.
          </p>
          <p>
            Users represent that they have the rights necessary to upload and distribute the
            content they submit.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            3. Copyright Infringement
          </h2>
          <p className="mb-3">
            The following content is not permitted unless the uploader has appropriate
            authorization:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Copyrighted movies, television programs, web series, music, videos, software, books,
              photographs, or other protected works uploaded without permission.
            </li>
            <li>Unauthorized copies or distributions of paid or licensed content.</li>
            <li>Content that violates another person&apos;s intellectual-property rights.</li>
            <li>
              Content primarily intended to facilitate unauthorized distribution of copyrighted
              works.
            </li>
          </ul>
          <p className="mt-3">
            MastPlayer reserves the right to remove or restrict access to such content.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            4. Filing a Copyright / DMCA Takedown Request
          </h2>
          <p className="mb-3">
            If you are a copyright owner or an authorized representative and believe content
            available through MastPlayer infringes your copyright, you may submit a copyright
            removal request.
          </p>
          <p className="mb-3">Your notice should contain:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong className="text-[var(--foreground)]">Copyrighted work:</strong> Identify or
              describe the copyrighted work you believe has been infringed.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Infringing material:</strong> Provide the
              exact MastPlayer URL(s) where the allegedly infringing material appears.
              <p className="mt-2 text-sm">
                Example:{' '}
                <code className="rounded bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 text-[var(--foreground)]">
                  https://mastplayer.in/v/xxxxxxxx
                </code>
              </p>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Contact information:</strong> Provide your
              full legal name, email address, telephone number, and company/organization name
              where applicable.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Good-faith statement:</strong> Include a
              statement that you have a good-faith belief that the disputed use is not authorized
              by the copyright owner, its agent, or applicable law.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Accuracy and authority statement:</strong>{' '}
              Confirm that the information in your notice is accurate and that you are the
              copyright owner or authorized to act on behalf of the copyright owner.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Signature:</strong> Provide your physical
              or electronic signature. A typed full legal name may be used as an electronic
              signature where legally appropriate.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            5. Where to Send a Copyright Complaint
          </h2>
          <p className="mb-3">Send copyright infringement requests to:</p>
          <ul className="list-none space-y-1 mb-3">
            <li>
              <strong className="text-[var(--foreground)]">Email:</strong>{' '}
              <a
                href="mailto:support@mastplayer.in"
                className="app-link underline underline-offset-2"
              >
                support@mastplayer.in
              </a>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Subject:</strong> Copyright / DMCA
              Takedown Request
            </li>
          </ul>
          <p>
            After receiving a sufficiently complete complaint, MastPlayer may investigate the
            reported material and remove or disable access when appropriate.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            6. Content Removal
          </h2>
          <p className="mb-3">After receiving a valid complaint, MastPlayer may:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Disable access to the reported content.</li>
            <li>Remove the content from MastPlayer.</li>
            <li>Notify the uploader where appropriate.</li>
            <li>Request additional information from the complainant.</li>
            <li>Record the violation against the uploader&apos;s account.</li>
            <li>Suspend or terminate accounts involved in repeated infringement.</li>
          </ul>
          <p className="mt-3 mb-3">
            Removal of content does not necessarily mean MastPlayer has determined that copyright
            infringement occurred. Content may be restricted while a complaint is reviewed.
          </p>
          <p>
            When content is disabled, associated public share links should stop working, and the
            underlying object should not remain publicly accessible through an unprotected
            storage URL.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            7. Counter-Notification
          </h2>
          <p className="mb-3">
            If your content was removed because of a copyright complaint and you believe the
            removal resulted from a mistake or misidentification, you may submit a
            counter-notification where applicable.
          </p>
          <p className="mb-3">
            Your counter-notification should include your contact information, identification of
            the removed material and its previous MastPlayer location, an explanation of why you
            believe the removal was a mistake or misidentification, the legally required
            statements applicable to a counter-notice, and your physical or electronic signature.
          </p>
          <ul className="list-none space-y-1 mb-3">
            <li>
              <strong className="text-[var(--foreground)]">Email:</strong>{' '}
              <a
                href="mailto:support@mastplayer.in"
                className="app-link underline underline-offset-2"
              >
                support@mastplayer.in
              </a>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Subject:</strong> DMCA
              Counter-Notification
            </li>
          </ul>
          <p>
            Counter-notifications can have legal consequences. Users should not submit false
            information.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            8. Repeat Infringer Policy
          </h2>
          <p className="mb-3">
            MastPlayer may suspend or permanently terminate accounts that repeatedly upload or
            distribute infringing material.
          </p>
          <p className="mb-3">Depending on the circumstances, enforcement may include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">First violation</strong> — content
              removed or restricted; user notified.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Repeated violations</strong> —
              additional content removal; account restrictions or suspension.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Serious / repeated infringement</strong>{' '}
              — account termination; associated content may be removed.
            </li>
          </ul>
          <p className="mt-3">
            MastPlayer reserves the right to take immediate action for serious or obvious abuse
            without waiting for multiple complaints.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            9. Original, Licensed and Permitted Content
          </h2>
          <p className="mb-3">
            Users may upload content they have the legal right to use, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Their own original content.</li>
            <li>Content for which they have received permission.</li>
            <li>Properly licensed material.</li>
            <li>Public-domain content.</li>
            <li>Content whose use is otherwise permitted by applicable law.</li>
          </ul>
          <p className="mt-3">
            Having access to a file or possessing a link to it does not necessarily mean that you
            have permission to redistribute it.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            10. Third-Party and Imported Links
          </h2>
          <p className="mb-3">
            MastPlayer may provide features that allow users to submit or import URLs from
            third-party services.
          </p>
          <p className="mb-3">
            Users remain responsible for ensuring that they have authorization to access, import,
            store, stream, or redistribute content obtained through those links.
          </p>
          <p className="mb-3">
            The availability of an import, remote-upload, link-conversion, or sharing feature does
            not grant the user copyright or redistribution rights.
          </p>
          <p>
            MastPlayer may reject, disable, or remove imported content when required by law, a
            valid rights-holder complaint, platform policy, or technical restrictions.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            11. No Proactive Ownership Determination
          </h2>
          <p>
            Because MastPlayer can contain user-generated content, MastPlayer generally cannot
            independently determine ownership of every uploaded file. However, MastPlayer may use
            automated or manual systems to detect abuse and may investigate content after
            receiving reports or when potential violations are identified.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            12. False or Misleading Copyright Claims
          </h2>
          <p>
            Copyright complaints and counter-notifications must be submitted in good faith.
            Knowingly submitting materially false information may result in rejection of the
            request, account restrictions, or potential legal consequences under applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            13. Cooperation With Rights Holders
          </h2>
          <p>
            MastPlayer may cooperate with copyright owners, authorized representatives, service
            providers, and lawful authorities when reasonably required to investigate copyright
            infringement or other unlawful activity. Information will be handled in accordance
            with MastPlayer&apos;s{' '}
            <Link to="/privacy" className="app-link underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            and applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            14. Content Access After Removal
          </h2>
          <p className="mb-3">
            When content is disabled following a copyright complaint, existing MastPlayer links
            associated with that content may stop functioning.
          </p>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] space-y-1 font-mono">
            <p>mastplayer.in/v/ABC123</p>
            <p className="app-muted">↓</p>
            <p>Copyright complaint accepted</p>
            <p className="app-muted">↓</p>
            <p>Video disabled</p>
            <p className="app-muted">↓</p>
            <p>&quot;This content is unavailable.&quot;</p>
          </div>
          <p className="mt-3">
            Removing a public or share link should also prevent the underlying object from
            remaining publicly accessible through an unprotected storage URL.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            15. User Responsibility
          </h2>
          <p className="mb-3">
            By using MastPlayer, users agree that they will not use the service to knowingly
            infringe copyrights or other intellectual-property rights.
          </p>
          <p>
            Users are responsible for the files they upload, import, store, stream, and share.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            16. Indian and International Copyright
          </h2>
          <p className="mb-3">
            MastPlayer intends to respond to valid copyright complaints under applicable copyright
            laws, including relevant Indian copyright requirements and, where applicable to the
            service or request, DMCA procedures.
          </p>
          <p>
            Copyright rules differ between jurisdictions. Rights holders and users should seek
            qualified legal advice when necessary.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] mb-3">
            17. Contact
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
              <strong className="text-[var(--foreground)]">Copyright email:</strong>{' '}
              <a
                href="mailto:support@mastplayer.in"
                className="app-link underline underline-offset-2"
              >
                support@mastplayer.in
              </a>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Subject:</strong> Copyright / DMCA
              Inquiry
            </li>
          </ul>
          <p>
            For general support, contact{' '}
            <a
              href="mailto:support@mastplayer.in"
              className="app-link underline underline-offset-2"
            >
              support@mastplayer.in
            </a>{' '}
            rather than the copyright mailbox.
          </p>
        </section>
      </div>

      {/* <p className="mt-12 pt-8 border-t border-[var(--border)] text-sm app-muted flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/" className="app-link font-medium">
          ← Back to Home
        </Link>
        <Link to="/privacy" className="app-link font-medium">
          Privacy Policy
        </Link>
      </p> */}
    </article>
  );
}
