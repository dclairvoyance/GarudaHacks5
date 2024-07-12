import React from "react";
import { useSpring, animated } from "react-spring";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  function Number({ n }) {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 200,
      config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
  }
  return (
    <div className="flex items-center space-x-4">
      <div className="text-green-500">{icon}</div>
      <div>
        <p className="text-xl font-semibold"><Number n={value}></Number></p>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
  );
};

const BusinessStats: React.FC = () => {

  return (
    <div className="w-full bg-gray-50 px-16">
      <div className="flex flex-col mx-auto md:flex-row items-center justify-between py-12 px-4 md:px-0">
        <div className="mb-8 md:mb-0 md:mr-8">
          <h2 className="text-3xl font-bold mb-4">
            Your <span style={{ color: "#0b7b71" }}>friend</span> in accessing
            educational opportunities
          </h2>
          <p className="text-gray-500">
            We provide consultations, resources, and progress tracking to give
            you the exposure and boost you need to succeed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <StatsCard
            title="Consultations"
            value={2245341}
            icon={<span className="text-4xl">👥</span>}
          />
          <StatsCard
            title="Scholarships Earned"
            value={46328}
            icon={<span className="text-4xl">🎓</span>}
          />
          <StatsCard
            title="Progress Trackers"
            value={828867}
            icon={<span className="text-4xl">📈</span>}
          />
          <StatsCard
            title="Resources Provided"
            value={1926436}
            icon={<span className="text-4xl">📚</span>}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessStats;
