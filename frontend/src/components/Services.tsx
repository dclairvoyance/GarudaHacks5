import { CheckIcon } from "@heroicons/react/20/solid";

const tiers = [
  {
    name: "Tasks Tracker",
    id: "task-tracker",
    href: "#",
    description: "Essential tools for task management and productivity.",
    features: [
      "Monthly task tracking",
      "Reminders",
      "Action plans with resources",
      "Feedback and reviews",
    ],
    mostPopular: false,
  },
  {
    name: "AI-Driven Consultation",
    id: "consultation",
    href: "#",
    description: "Get personalized consultation with AI-driven insights.",
    features: [
      "University recommendations",
      "Scholarship information",
      "Salary information",
      "Learning Path",
    ],
    mostPopular: true,
  },
  {
    name: "Match Mentoring",
    id: "match-mentoring",
    href: "#",
    description: "Connect with mentors for personal growth.",
    features: ["Unlimited discussions", "Career advice", "Education advice"],
    mostPopular: false,
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#FFF0C8] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-base font-semibold leading-7 text-[#0b7b71]">
          Our Services
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          The right plan for uplifting your journey
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        kata kata hari ini
      </p>
      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
              tierIdx === 0 ? "lg:rounded-r-none" : "",
              tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
              "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? "text-[#0b7b71]" : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p>

              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-[#0b7b71]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
