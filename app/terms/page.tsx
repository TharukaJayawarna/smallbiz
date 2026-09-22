import Link from "next/link";

export default function TermsPage() {
return ( <main className="min-h-screen bg-[#f7f7f5] text-gray-900">
{/* Header */} <header className="border-b border-gray-200 bg-white"> <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"> <Link
         href="/"
         className="flex items-center gap-3"
       > <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white"> <svg
             viewBox="0 0 24 24"
             fill="none"
             className="h-5 w-5"
           > <path
               d="M4 19V9.5L12 4L20 9.5V19"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             /> <path
               d="M8 19V13H16V19"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             /> </svg> </div>


        <span className="text-xl font-bold">
          SmallBiz
        </span>
      </Link>

      <Link
        href="/"
        className="text-sm font-medium text-gray-500 hover:text-black"
      >
        Back to home
      </Link>
    </div>
  </header>

  {/* Content */}
  <div className="mx-auto max-w-4xl px-6 py-16">
    <div className="mb-12">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Legal
      </p>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Terms & Conditions
      </h1>

      <p className="mt-4 text-sm text-gray-500">
        Last updated: September 20, 2026
      </p>
    </div>

    <div className="space-y-10 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">

      <section>
        <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>

        <p className="mt-3 leading-7 text-gray-600">
          By creating an account or using SmallBiz, you agree to these
          Terms & Conditions. If you do not agree with these terms,
          please do not use the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">2. The SmallBiz Service</h2>

        <p className="mt-3 leading-7 text-gray-600">
          SmallBiz provides online tools that help businesses create
          and manage digital stores, products, categories, orders,
          business information, and related functionality.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">3. User Accounts</h2>

        <p className="mt-3 leading-7 text-gray-600">
          You must provide accurate information when creating an
          account. You are responsible for maintaining the security of
          your login credentials and for activities performed through
          your account.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">4. Business Information</h2>

        <p className="mt-3 leading-7 text-gray-600">
          You are responsible for the accuracy of information displayed
          through your store, including business details, product
          descriptions, prices, images, availability, and contact
          information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">5. Acceptable Use</h2>

        <p className="mt-3 leading-7 text-gray-600">
          You agree not to use SmallBiz for unlawful activities,
          fraudulent transactions, unauthorized access, malicious
          activity, distribution of harmful content, or activities
          that interfere with the operation or security of the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">6. Customer and Order Data</h2>

        <p className="mt-3 leading-7 text-gray-600">
          Businesses are responsible for handling their customer and
          order information appropriately and for complying with
          applicable privacy, consumer-protection, tax, and other
          legal obligations relevant to their business.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">7. Intellectual Property</h2>

        <p className="mt-3 leading-7 text-gray-600">
          SmallBiz and its underlying software, branding, design,
          interfaces, and original materials may be protected by
          applicable intellectual property laws. Users retain ownership
          of content they independently provide, subject to the rights
          necessary for SmallBiz to operate the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">8. Service Availability</h2>

        <p className="mt-3 leading-7 text-gray-600">
          We aim to keep SmallBiz available and reliable, but we do not
          guarantee uninterrupted or error-free operation. Maintenance,
          updates, technical failures, or circumstances outside our
          control may temporarily affect availability.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">9. Account Suspension</h2>

        <p className="mt-3 leading-7 text-gray-600">
          An account may be restricted or suspended where reasonably
          necessary to protect the service, investigate abuse,
          address security concerns, comply with legal requirements,
          or enforce these terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">10. Limitation of Liability</h2>

        <p className="mt-3 leading-7 text-gray-600">
          To the extent permitted by applicable law, SmallBiz is not
          responsible for losses resulting from unauthorized access
          caused by a user&apos;s failure to protect account credentials,
          inaccurate business information, or misuse of the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">11. Changes to These Terms</h2>

        <p className="mt-3 leading-7 text-gray-600">
          We may update these Terms & Conditions from time to time.
          Updated terms will be published on this page with a revised
          effective date. Continued use of the service after an update
          may constitute acceptance of the revised terms where
          permitted by applicable law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">12. Contact</h2>

        <p className="mt-3 leading-7 text-gray-600">
          If you have questions regarding these Terms & Conditions,
          please contact the SmallBiz support team.
        </p>
      </section>
    </div>

    <div className="mt-8 text-center">
      <Link
        href="/"
        className="text-sm font-semibold text-gray-600 hover:text-black"
      >
        ← Return to SmallBiz
      </Link>
    </div>
  </div>
</main>


);
}
