import Link from "next/link";

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>

      <p className="mt-4 text-sm text-gray-500">
        Last updated: September 20, 2026
      </p>
    </div>

    <div className="space-y-10 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">

      <section>
        <h2 className="text-xl font-bold">1. Introduction</h2>

        <p className="mt-3 leading-7 text-gray-600">
          SmallBiz provides tools that allow businesses to create and
          manage an online store, products, categories, orders, and
          customer communication. This Privacy Policy explains how we
          collect, use, store, and protect information when you use our
          services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">2. Information We Collect</h2>

        <p className="mt-3 leading-7 text-gray-600">
          Depending on how you use SmallBiz, we may collect information
          such as your name, email address, business name, WhatsApp
          contact number, account credentials, product information,
          store information, and information related to orders or
          customer interactions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">3. How We Use Information</h2>

        <p className="mt-3 leading-7 text-gray-600">
          We use collected information to create and maintain accounts,
          provide store-management functionality, process requests,
          improve our services, communicate with users, maintain
          security, and troubleshoot technical issues.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">4. Account Security</h2>

        <p className="mt-3 leading-7 text-gray-600">
          You are responsible for keeping your account credentials
          confidential. We use reasonable technical and organizational
          measures to protect account information, but no internet-based
          service can guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">5. Business and Customer Data</h2>

        <p className="mt-3 leading-7 text-gray-600">
          Information entered into your store may include product,
          pricing, inventory, order, and customer-related information.
          You are responsible for ensuring that information you upload
          or process through SmallBiz is collected and used lawfully.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">6. Cookies and Similar Technologies</h2>

        <p className="mt-3 leading-7 text-gray-600">
          SmallBiz may use cookies, authentication tokens, or similar
          technologies to maintain sessions, remember preferences,
          protect accounts, and provide essential functionality.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">7. Information Sharing</h2>

        <p className="mt-3 leading-7 text-gray-600">
          We do not sell personal information as part of the normal
          operation of the service. Information may be shared with
          service providers when reasonably necessary to operate,
          maintain, secure, or improve SmallBiz, or when required by
          applicable law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">8. Data Retention</h2>

        <p className="mt-3 leading-7 text-gray-600">
          We retain information for as long as reasonably necessary to
          provide the service, maintain business records, resolve
          disputes, enforce agreements, and comply with applicable
          legal requirements.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">9. Your Choices</h2>

        <p className="mt-3 leading-7 text-gray-600">
          Depending on the information and applicable law, you may
          request access to, correction of, or deletion of certain
          personal information associated with your account.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">10. Changes to This Policy</h2>

        <p className="mt-3 leading-7 text-gray-600">
          We may update this Privacy Policy from time to time. When
          changes are made, the updated version will be published on
          this page together with the revised date.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">11. Contact</h2>

        <p className="mt-3 leading-7 text-gray-600">
          If you have questions about this Privacy Policy or how
          information is handled, please contact the SmallBiz support
          team.
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
